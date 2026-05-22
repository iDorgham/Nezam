'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabase/client'
import { useAuth } from '../../../lib/auth/context'

interface FloorItem {
  id: string
  number: string
  description?: string
  capacity: number
  minSpend: number
  soldAmount: number
  x: number
  y: number
  type: 'square' | 'circle' | 'rectangle' | 'stage' | 'bar' | 'custom' | 'text' | 'line' | 'guide_shape'
  width: number
  height: number
  color?: string
  svgString?: string
  // Text properties
  fontSize?: number
  textAlign?: 'left' | 'center' | 'right'
  fontWeight?: 'normal' | 'bold'
  isHeader?: boolean
  // Corner Radius
  radiusTL?: number
  radiusTR?: number
  radiusBL?: number
  radiusBR?: number
  // Grouping
  groupId?: string
  // Lock
  isLocked?: boolean
}

interface Floor {
  id: string
  name: string
  items: FloorItem[]
}

const initialFloors: Floor[] = [
  {
    id: '1',
    name: 'Main Floor',
    items: [
      { id: '1', number: 'VIP 1', capacity: 6, minSpend: 10000, soldAmount: 12000, x: 100, y: 100, type: 'square', width: 80, height: 80, color: '#1DB954', radiusTL: 4, radiusTR: 4, radiusBL: 4, radiusBR: 4 },
      { id: '2', number: 'T 1', capacity: 4, minSpend: 5000, soldAmount: 0, x: 250, y: 100, type: 'circle', width: 80, height: 80 },
      { id: '3', number: 'Main Stage', capacity: 0, minSpend: 0, soldAmount: 0, x: 300, y: 400, type: 'stage', width: 200, height: 100, color: '#4A154B' },
      { id: '4', number: 'Welcome to Club', capacity: 0, minSpend: 0, soldAmount: 0, x: 300, y: 20, type: 'text', width: 300, height: 40, isHeader: true, fontSize: 24, textAlign: 'center' },
      { id: '5', number: 'Wall', capacity: 0, minSpend: 0, soldAmount: 0, x: 50, y: 50, type: 'line', width: 4, height: 500, color: '#555555' }
    ]
  }
]

export default function FloorPlanEditor() {
  const { user, role, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && (!user || (role !== 'manager' && role !== 'owner'))) {
      router.push('/login')
    }
  }, [user, role, loading, router])

  // Undo/Redo State
  const [history, setHistory] = useState<Floor[][]>([initialFloors])
  const [historyIndex, setHistoryIndex] = useState(0)
  
  const floors = history[historyIndex]
  const [activeFloorId, setActiveFloorId] = useState<string>('1')
  
  // Multi-select state
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  
  // Clipboard
  const [clipboard, setClipboard] = useState<FloorItem[]>([])
  
  // Active Tool state
  const [activeTool, setActiveTool] = useState<'select' | 'hand' | 'text' | 'shape' | 'line'>('select')
  
  // UI State for Corner Radius Lock
  const [radiusLocked, setRadiusLocked] = useState(true)
  
  // Infinity Space (Panning & Zooming) State
  const [isSpacePressed, setIsSpacePressed] = useState(false)
  const [panX, setPanX] = useState(0)
  const [panY, setPanY] = useState(0)
  const [zoom, setZoom] = useState(1)
  const [isPanning, setIsPanning] = useState(false)
  
  // Custom Context Menu State
  const [contextMenu, setContextMenu] = useState<{ visible: boolean; x: number; y: number; itemId?: string }>({
    visible: false,
    x: 0,
    y: 0
  })
  
  // Dragging state for items
  const [dragging, setDragging] = useState(false)
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 })
  const canvasRef = useRef<HTMLDivElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)

  // Active Tab state
  const [activeTab, setActiveTab] = useState<'components' | 'properties' | 'settings' | 'layers'>('components')

  if (loading) {
    return <div style={{ color: 'var(--text-low)', textAlign: 'center', padding: '2rem', backgroundColor: '#121212', height: '100vh' }}>Loading session...</div>
  }

  if (!user || (role !== 'manager' && role !== 'owner')) {
    return <div style={{ color: '#ff4b4b', textAlign: 'center', padding: '2rem', backgroundColor: '#121212', height: '100vh' }}>Unauthorized. Redirecting to login...</div>
  }

  const currentFloor = floors.find(f => f.id === activeFloorId) || floors[0]

  // Keyboard listeners for shortcuts and panning
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return
      
      // Space Panning
      if (e.code === 'Space') {
        setIsSpacePressed(true)
        e.preventDefault()
      }

      // Grouping: Cmd+G
      if ((e.metaKey || e.ctrlKey) && e.key === 'g' && !e.shiftKey) {
        e.preventDefault()
        groupSelected()
      }

      // Ungrouping: Cmd+Shift+G
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'g') {
        e.preventDefault()
        ungroupSelected()
      }

      // Undo: Cmd+Z
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        undo()
      }

      // Redo: Cmd+Shift+Z or Cmd+Y
      if (((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'z') || ((e.metaKey || e.ctrlKey) && e.key === 'y')) {
        e.preventDefault()
        redo()
      }

      // Copy: Cmd+C
      if ((e.metaKey || e.ctrlKey) && e.key === 'c') {
        e.preventDefault()
        copySelected()
      }

      // Paste: Cmd+V
      if ((e.metaKey || e.ctrlKey) && e.key === 'v') {
        e.preventDefault()
        pasteSelected()
      }

      // Delete: Backspace or Delete
      if (e.key === 'Backspace' || e.key === 'Delete') {
        if (selectedIds.length > 0) {
          e.preventDefault()
          deleteSelected()
        }
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setIsSpacePressed(false)
        setIsPanning(false)
      }
    }

    const handleClickOutside = () => {
      setContextMenu({ ...contextMenu, visible: false })
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    window.addEventListener('click', handleClickOutside)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      window.removeEventListener('click', handleClickOutside)
    }
  }, [contextMenu, selectedIds, currentFloor, clipboard])

  const updateFloorsState = (newFloors: Floor[]) => {
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(newFloors)
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1)
      setSelectedIds([])
    }
  }

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1)
      setSelectedIds([])
    }
  }

  const addFloor = () => {
    const newFloor: Floor = {
      id: Math.random().toString(),
      name: `New Floor ${floors.length + 1}`,
      items: []
    }
    updateFloorsState([...floors, newFloor])
    setActiveFloorId(newFloor.id)
  }

  const deleteFloor = (id: string) => {
    if (floors.length === 1) {
      alert("You must have at least one floor!")
      return
    }
    if (confirm(`Are you sure you want to delete "${currentFloor.name}"?`)) {
      const updatedFloors = floors.filter(f => f.id !== id)
      updateFloorsState(updatedFloors)
      setActiveFloorId(updatedFloors[0].id)
      setSelectedIds([])
    }
  }

  const updateFloor = (id: string, updates: Partial<Floor>) => {
    const newFloors = floors.map(f => f.id === id ? { ...f, ...updates } : f)
    updateFloorsState(newFloors)
  }

  const addItem = (type: FloorItem['type'], customProps: Partial<FloorItem> = {}) => {
    const newItem: FloorItem = {
      id: Math.random().toString(),
      number: type === 'text' ? 'New Text' : type === 'line' ? 'Line Guide' : type === 'guide_shape' ? 'Area Guide' : type === 'stage' || type === 'bar' ? type.toUpperCase() : `T ${currentFloor.items.length + 1}`,
      capacity: type === 'stage' || type === 'bar' || type === 'text' || type === 'line' || type === 'guide_shape' ? 0 : 4,
      minSpend: type === 'stage' || type === 'bar' || type === 'text' || type === 'line' || type === 'guide_shape' ? 0 : 5000,
      soldAmount: 0,
      x: Math.round((-panX + 200) / 20) * 20,
      y: Math.round((-panY + 200) / 20) * 20,
      type: type,
      width: type === 'stage' ? 200 : type === 'rectangle' ? 120 : type === 'text' ? 200 : type === 'line' ? 100 : type === 'guide_shape' ? 100 : 80,
      height: type === 'bar' ? 40 : type === 'text' ? 40 : type === 'line' ? 4 : type === 'guide_shape' ? 100 : 80,
      color: type === 'stage' ? '#4A154B' : type === 'bar' ? '#E01E5A' : type === 'text' ? 'transparent' : type === 'line' ? '#888888' : type === 'guide_shape' ? '#333333' : undefined,
      radiusTL: 4,
      radiusTR: 4,
      radiusBL: 4,
      radiusBR: 4,
      ...customProps
    }
    
    updateFloor(activeFloorId, { items: [...currentFloor.items, newItem] })
    setSelectedIds([newItem.id])
    setActiveTab('properties')
  }

  const updateItem = (itemId: string, updates: Partial<FloorItem>) => {
    const updatedItems = currentFloor.items.map(t => t.id === itemId ? { ...t, ...updates } : t)
    updateFloor(activeFloorId, { items: updatedItems })
  }

  const updateRadius = (itemId: string, corner: 'TL' | 'TR' | 'BL' | 'BR', value: number) => {
    const item = currentFloor.items.find(t => t.id === itemId)
    if (!item) return

    let updates: Partial<FloorItem> = {}
    if (radiusLocked) {
      updates = { radiusTL: value, radiusTR: value, radiusBL: value, radiusBR: value }
    } else {
      updates[`radius${corner}`] = value
    }
    updateItem(itemId, updates)
  }

  const handleMouseDown = (e: React.MouseEvent, item?: FloorItem) => {
    setLastMousePos({ x: e.clientX, y: e.clientY })

    if (isSpacePressed || activeTool === 'hand') {
      setIsPanning(true)
      return
    }

    if (!item || activeTool !== 'select') return
    
    // Prevent dragging if item is locked
    if (item.isLocked) {
      setSelectedIds([item.id]) // Still allow selection
      setActiveTab('properties')
      return
    }
    
    setDragging(true)

    const isMultiSelect = e.shiftKey || e.metaKey || e.ctrlKey
    let newSelectedIds = [...selectedIds]

    // Handle Group Selection
    let idsToSelect = [item.id]
    if (item.groupId) {
      idsToSelect = currentFloor.items.filter(i => i.groupId === item.groupId).map(i => i.id)
    }

    if (isMultiSelect) {
      const allSelected = idsToSelect.every(id => selectedIds.includes(id))
      if (allSelected) {
        newSelectedIds = selectedIds.filter(id => !idsToSelect.includes(id))
      } else {
        newSelectedIds = [...new Set([...selectedIds, ...idsToSelect])]
      }
    } else {
      if (!selectedIds.includes(item.id)) {
        newSelectedIds = idsToSelect
      }
    }
    
    setSelectedIds(newSelectedIds)
    setActiveTab('properties')
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    const deltaX = (e.clientX - lastMousePos.x) / zoom
    const deltaY = (e.clientY - lastMousePos.y) / zoom
    setLastMousePos({ x: e.clientX, y: e.clientY })

    if (isPanning) {
      setPanX(panX + deltaX * zoom)
      setPanY(panY + deltaY * zoom)
      return
    }

    if (!dragging || selectedIds.length === 0 || !canvasRef.current || activeTool !== 'select') return

    const updatedItems = currentFloor.items.map(item => {
      if (selectedIds.includes(item.id) && !item.isLocked) {
        let newX = item.x + deltaX
        let newY = item.y + deltaY

        return { ...item, x: newX, y: newY }
      }
      return item
    })

    const newFloors = floors.map(f => f.id === activeFloorId ? { ...f, items: updatedItems } : f)
    updateFloorsState(newFloors)
  }

  const handleMouseUp = () => {
    setDragging(false)
    setIsPanning(false)
  }

  useEffect(() => {
    async function loadLayout() {
      try {
        const { data: venues } = await supabase
          .from('venues')
          .select('layout_config')
          .eq('name', 'The Club')
          .limit(1)
          
        const config = venues?.[0]?.layout_config
        if (config && (config as any).floors) {
          updateFloorsState((config as any).floors)
          setActiveFloorId((config as any).floors[0]?.id || 'floor1')
        }
      } catch (error) {
        console.error('Error loading layout:', error)
      }
    }
    loadLayout()
  }, [])

  const handleSave = async () => {
    try {
      const { data: venues } = await supabase
        .from('venues')
        .select('id')
        .eq('name', 'The Club')
        .limit(1)
        
      let venueId = venues?.[0]?.id
      
      if (!venueId) {
        const { data: newVenue } = await supabase
          .from('venues')
          .insert({ name: 'The Club', location: 'Main Street' })
          .select()
          .single()
        venueId = newVenue?.id
      }
      
      if (!venueId) {
        alert('Failed to find or create venue')
        return
      }
      
      // 1. Save Layout Config
      const { error } = await supabase
        .from('venues')
        .update({ layout_config: { floors } })
        .eq('id', venueId)
        
      if (error) throw error
      
      // 2. Sync tables to 'tables' table
      const allItems = floors.flatMap(f => f.items)
      const tableItems = allItems.filter(item => 
        item.type === 'square' || item.type === 'circle' || item.type === 'rectangle'
      )
      
      const { data: existingTables } = await supabase
        .from('tables')
        .select('*')
        .eq('venue_id', venueId)
        
      const existingTableMap = new Map(existingTables?.map(t => [t.table_number, t]))
      
      for (const item of tableItems) {
        const existing = existingTableMap.get(item.number)
        
        if (existing) {
          // Update existing table
          await supabase
            .from('tables')
            .update({
              capacity: item.capacity || 4,
              min_spend: item.minSpend || 0
            })
            .eq('id', existing.id)
        } else {
          // Insert new table
          await supabase
            .from('tables')
            .insert({
              venue_id: venueId,
              table_number: item.number,
              capacity: item.capacity || 4,
              min_spend: item.minSpend || 0,
              status: 'available'
            })
        }
      }
      
      alert('Floor plan and tables synced successfully to Supabase!')
    } catch (error: any) {
      alert('Error saving floor plan: ' + error.message)
    }
  }

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (isSpacePressed || activeTool === 'hand') return
    
    if (activeTool !== 'select' && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect()
      const x = Math.round(((e.clientX - rect.left) - panX) / zoom / 20) * 20
      const y = Math.round(((e.clientY - rect.top) - panY) / zoom / 20) * 20
      
      if (activeTool === 'text') {
        addItem('text', { x, y, number: 'Paragraph Text', fontSize: 16, textAlign: 'left' })
      } else if (activeTool === 'shape') {
        addItem('guide_shape', { x, y, number: 'Area Guide' })
      } else if (activeTool === 'line') {
        addItem('line', { x, y, width: 100, height: 4, number: 'Line Guide' })
      }
      setActiveTool('select')
    }
  }

  const handleZoom = (type: 'in' | 'out') => {
    setZoom(prev => {
      const newZoom = type === 'in' ? prev + 0.1 : prev - 0.1
      return Math.max(0.2, Math.min(newZoom, 2))
    })
  }

  const copySelected = () => {
    const selected = currentFloor.items.filter(item => selectedIds.includes(item.id))
    setClipboard(selected.map(item => ({ ...item, id: Math.random().toString() })))
  }

  const pasteSelected = () => {
    if (clipboard.length === 0) return
    const pasted = clipboard.map(item => ({ ...item, id: Math.random().toString(), x: item.x + 20, y: item.y + 20 }))
    updateFloor(activeFloorId, { items: [...currentFloor.items, ...pasted] })
    setSelectedIds(pasted.map(p => p.id))
    setClipboard(pasted)
  }

  const duplicateSelected = () => {
    copySelected()
    setTimeout(() => pasteSelected(), 0)
  }

  const deleteSelected = () => {
    const newFloors = floors.map(f => f.id === activeFloorId ? { ...f, items: currentFloor.items.filter(t => !selectedIds.includes(t.id)) } : f)
    updateFloorsState(newFloors)
    setSelectedIds([])
  }

  const groupSelected = () => {
    if (selectedIds.length < 2) return
    const newGroupId = `group_${Math.random().toString(36).substr(2, 9)}`
    
    const updatedItems = currentFloor.items.map(item => {
      if (selectedIds.includes(item.id)) {
        return { ...item, groupId: newGroupId }
      }
      return item
    })
    
    updateFloor(activeFloorId, { items: updatedItems })
  }

  const ungroupSelected = () => {
    if (selectedIds.length === 0) return
    
    const updatedItems = currentFloor.items.map(item => {
      if (selectedIds.includes(item.id)) {
        return { ...item, groupId: undefined }
      }
      return item
    })
    
    updateFloor(activeFloorId, { items: updatedItems })
  }

  const toggleLockSelected = () => {
    if (selectedIds.length === 0) return
    
    const anyUnlocked = currentFloor.items.some(item => selectedIds.includes(item.id) && !item.isLocked)
    
    const updatedItems = currentFloor.items.map(item => {
      if (selectedIds.includes(item.id)) {
        return { ...item, isLocked: anyUnlocked } // Lock all if any are unlocked, else unlock all
      }
      return item
    })
    
    updateFloor(activeFloorId, { items: updatedItems })
  }

  // Alignment Logic
  const alignSelected = (alignment: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => {
    if (selectedIds.length < 2) return
    const selectedItems = currentFloor.items.filter(item => selectedIds.includes(item.id))
    
    let targetVal = 0
    const minX = Math.min(...selectedItems.map(i => i.x))
    const maxX = Math.max(...selectedItems.map(i => i.x + i.width))
    const minY = Math.min(...selectedItems.map(i => i.y))
    const maxY = Math.max(...selectedItems.map(i => i.y + i.height))
    
    const centerBoundingX = minX + (maxX - minX) / 2
    const centerBoundingY = minY + (maxY - minY) / 2

    const updatedItems = currentFloor.items.map(item => {
      if (selectedIds.includes(item.id) && !item.isLocked) {
        let updates = { ...item }
        switch(alignment) {
          case 'left': updates.x = minX; break
          case 'center': updates.x = centerBoundingX - item.width / 2; break
          case 'right': updates.x = maxX - item.width; break
          case 'top': updates.y = minY; break
          case 'middle': updates.y = centerBoundingY - item.height / 2; break
          case 'bottom': updates.y = maxY - item.height; break
        }
        // Snap to grid
        updates.x = Math.round(updates.x / 20) * 20
        updates.y = Math.round(updates.y / 20) * 20
        return updates
      }
      return item
    })
    
    updateFloor(activeFloorId, { items: updatedItems })
  }

  const handleContextMenu = (e: React.MouseEvent, itemId?: string) => {
    e.preventDefault()
    
    if (itemId) {
      if (!selectedIds.includes(itemId)) {
        setSelectedIds([itemId])
      }
    }
    
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      itemId
    })
  }

  const currentItem = currentFloor.items.find(t => t.id === selectedIds[0])

  const getComponentIcon = (type: FloorItem['type'], color = 'currentColor') => {
    switch (type) {
      case 'square':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
            <rect x="6" y="6" width="12" height="12" rx="2" fill="rgba(255,255,255,0.05)"/>
            <circle cx="12" cy="3" r="1.5" fill={color}/>
            <circle cx="12" cy="21" r="1.5" fill={color}/>
            <circle cx="3" cy="12" r="1.5" fill={color}/>
            <circle cx="21" cy="12" r="1.5" fill={color}/>
          </svg>
        )
      case 'circle':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
            <circle cx="12" cy="12" r="6" fill="rgba(255,255,255,0.05)"/>
            <circle cx="12" cy="3" r="1.5" fill={color}/>
            <circle cx="12" cy="21" r="1.5" fill={color}/>
            <circle cx="3.5" cy="12" r="1.5" fill={color}/>
            <circle cx="20.5" cy="12" r="1.5" fill={color}/>
          </svg>
        )
      case 'rectangle':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
            <rect x="4" y="7" width="16" height="10" rx="2" fill="rgba(255,255,255,0.05)"/>
            <circle cx="8" cy="4" r="1.5" fill={color}/>
            <circle cx="16" cy="4" r="1.5" fill={color}/>
            <circle cx="8" cy="20" r="1.5" fill={color}/>
            <circle cx="16" cy="20" r="1.5" fill={color}/>
          </svg>
        )
      case 'stage':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
            <path d="M2 17 L5 7 H19 L22 17 Z" fill="rgba(255,255,255,0.05)"/>
            <path d="M4 4 L6 7" strokeWidth="1.5"/>
            <path d="M20 4 L18 7" strokeWidth="1.5"/>
            <circle cx="12" cy="11" r="1.5" fill={color}/>
          </svg>
        )
      case 'bar':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
            <path d="M3 5 H21 V8 H3 Z" fill="rgba(255,255,255,0.1)"/>
            <path d="M3 8 H21 L19 19 H5 Z" fill="rgba(255,255,255,0.05)"/>
            <circle cx="7" cy="13" r="1" fill={color}/>
            <circle cx="12" cy="13" r="1" fill={color}/>
            <circle cx="17" cy="13" r="1" fill={color}/>
          </svg>
        )
      case 'text':
        return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M4 7V4h16v3M12 4v16M9 20h6"/></svg>
      case 'line':
        return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><line x1="5" y1="19" x2="19" y2="5"/></svg>
      case 'guide_shape':
        return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeDasharray="4 4"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
      default:
        return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
    }
  }

  return (
    <div style={{ 
      color: 'var(--text-high)',
      backgroundColor: 'var(--background)',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}
    className="animate-fadeIn"
    >
      {/* Modern Top Bar */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        backgroundColor: 'rgba(18, 18, 18, 0.75)', 
        backdropFilter: 'blur(20px)',
        padding: '0.5rem 1.5rem', 
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        zIndex: 10,
        height: '56px'
      }}>
        {/* Left Side: Zoom Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-medium)', fontWeight: 'bold' }}>{Math.round(zoom * 100)}%</span>
          <div style={{ width: '1px', height: '20px', backgroundColor: 'var(--surface-elevated)' }} />
        </div>

        {/* Center: Design Tools */}
        <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
          <ToolButton active={activeTool === 'select'} onClick={() => setActiveTool('select')} title="Select Tool (V)">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/><path d="M13 13l6 6"/></svg>
          </ToolButton>
          <ToolButton active={activeTool === 'hand'} onClick={() => setActiveTool('hand')} title="Hand Tool (H)">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v5m-4 0V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v7m-4 0V8a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v10a7 7 0 0 0 7 7h3a7 7 0 0 0 7-7v-7"/></svg>
          </ToolButton>
          
          <div style={{ width: '1px', height: '16px', backgroundColor: 'var(--surface-elevated)', margin: '0 0.25rem' }} />

          <ToolButton active={activeTool === 'text'} onClick={() => setActiveTool('text')} title="Text Tool (T)">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 7V4h16v3M12 4v16M9 20h6"/></svg>
          </ToolButton>
          <ToolButton active={activeTool === 'shape'} onClick={() => setActiveTool('shape')} title="Guide Area Tool (S)">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
          </ToolButton>
          <ToolButton active={activeTool === 'line'} onClick={() => setActiveTool('line')} title="Line Guide Tool (L)">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="19" x2="19" y2="5"/></svg>
          </ToolButton>
          
          <div style={{ width: '1px', height: '16px', backgroundColor: 'var(--surface-elevated)', margin: '0 0.25rem' }} />
          
          <ToolButton onClick={copySelected} title="Copy (Cmd+C)">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
          </ToolButton>
          <ToolButton onClick={pasteSelected} title="Paste (Cmd+V)">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/></svg>
          </ToolButton>
          
          <div style={{ width: '1px', height: '16px', backgroundColor: 'var(--surface-elevated)', margin: '0 0.25rem' }} />
          
          <ToolButton onClick={undo} title="Undo (Cmd+Z)">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 14L4 9l5-5"/><path d="M4 9h11a5 5 0 0 1 5 5v1"/></svg>
          </ToolButton>
          <ToolButton onClick={redo} title="Redo (Cmd+Shift+Z)">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 14l5-5-5-5"/><path d="M20 9H9a5 5 0 0 0-5 5v1"/></svg>
          </ToolButton>

          <div style={{ width: '1px', height: '16px', backgroundColor: 'var(--surface-elevated)', margin: '0 0.25rem' }} />

          <ToolButton onClick={() => handleZoom('in')} title="Zoom In">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
          </ToolButton>
          <ToolButton onClick={() => handleZoom('out')} title="Zoom Out">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
          </ToolButton>
          
          <div style={{ width: '1px', height: '16px', backgroundColor: 'var(--surface-elevated)', margin: '0 0.25rem' }} />

          {/* Group/Ungroup Tools */}
          <ToolButton onClick={groupSelected} title="Group (Cmd+G)" active={selectedIds.length >= 2}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
          </ToolButton>
          
          <div style={{ width: '1px', height: '16px', backgroundColor: 'var(--surface-elevated)', margin: '0 0.25rem' }} />

          {/* Alignment Tools (Visible when 2+ items selected) */}
          <div style={{ display: 'flex', gap: '0.1rem', opacity: selectedIds.length >= 2 ? 1 : 0.3, pointerEvents: selectedIds.length >= 2 ? 'auto' : 'none' }}>
            <ToolButton onClick={() => alignSelected('left')} title="Align Left">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="3" x2="3" y2="21"/><rect x="7" y="5" width="12" height="4" rx="1"/><rect x="7" y="15" width="8" height="4" rx="1"/></svg>
            </ToolButton>
            <ToolButton onClick={() => alignSelected('center')} title="Align Horizontal Center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="3" x2="12" y2="21"/><rect x="5" y="6" width="14" height="3" rx="1"/><rect x="7" y="15" width="10" height="3" rx="1"/></svg>
            </ToolButton>
            <ToolButton onClick={() => alignSelected('right')} title="Align Right">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="21" y1="3" x2="21" y2="21"/><rect x="5" y="5" width="12" height="4" rx="1"/><rect x="9" y="15" width="8" height="4" rx="1"/></svg>
            </ToolButton>
            <ToolButton onClick={() => alignSelected('top')} title="Align Top">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="3" x2="21" y2="3"/><rect x="5" y="7" width="4" height="12" rx="1"/><rect x="15" y="7" width="4" height="8" rx="1"/></svg>
            </ToolButton>
            <ToolButton onClick={() => alignSelected('middle')} title="Align Vertical Center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"/><rect x="6" y="5" width="3" height="14" rx="1"/><rect x="15" y="7" width="3" height="10" rx="1"/></svg>
            </ToolButton>
            <ToolButton onClick={() => alignSelected('bottom')} title="Align Bottom">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="21" x2="21" y2="21"/><rect x="5" y="5" width="4" height="12" rx="1"/><rect x="15" y="9" width="4" height="8" rx="1"/></svg>
            </ToolButton>
          </div>
        </div>

        {/* Right Side: Floor Selector & Save/Publish */}
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <select 
            value={activeFloorId} 
            onChange={(e) => {
              setActiveFloorId(e.target.value)
              setSelectedIds([])
            }}
            style={{ 
              backgroundColor: 'var(--surface-elevated)', 
              color: 'var(--text-high)', 
              border: '1px solid var(--surface-elevated)', 
              padding: '0.3rem 0.5rem', 
              borderRadius: '4px',
              fontSize: '0.8rem',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            {floors.map(floor => (
              <option key={floor.id} value={floor.id}>{floor.name}</option>
            ))}
          </select>

          <div style={{ width: '1px', height: '16px', backgroundColor: 'var(--surface-elevated)', margin: '0 0.25rem' }} />

          <ToolButton onClick={handleSave} title="Save">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
          </ToolButton>
          <ToolButton onClick={() => alert('Floor plan published successfully!')} title="Publish">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
          </ToolButton>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ display: 'flex', flex: 1, position: 'relative' }}>
        
        {/* Left Mini-Sidebar (UI/UX Expert addition) */}
        <div style={{ 
          width: '50px', 
          backgroundColor: 'var(--surface)', 
          borderRight: '1px solid var(--surface-elevated)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1rem 0',
          zIndex: 5
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <ToolButton onClick={() => {}} active><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg></ToolButton>
            <ToolButton onClick={() => {}}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg></ToolButton>
          </div>
          
          {/* User Avatar */}
          <div style={{ 
            width: '32px', 
            height: '32px', 
            borderRadius: '50%', 
            backgroundColor: 'var(--primary)', 
            color: 'var(--background)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            fontSize: '0.8rem',
            cursor: 'pointer',
            boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
          }}
          title="User Profile"
          >
            JD
          </div>
        </div>
        
        {/* Viewport Area for Infinity Space */}
        <div 
          ref={viewportRef}
          style={{ 
            flex: 1, 
            position: 'relative', 
            overflow: 'hidden', 
            backgroundColor: '#141414'
          }}
          onMouseDown={(e) => handleMouseDown(e)}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onContextMenu={(e) => handleContextMenu(e)}
        >
          {/* Rulers */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '20px', backgroundColor: 'var(--surface)', borderBottom: '1px solid var(--surface-elevated)', zIndex: 4, fontSize: '0.65rem', display: 'flex', alignItems: 'center', paddingLeft: '20px', color: 'var(--text-low)', overflow: 'hidden' }}>
            {[...Array(50)].map((_, i) => {
              const val = Math.round((i * 100 - panX) / zoom)
              return <span key={i} style={{ width: `${100 * zoom}px`, flexShrink: 0, textAlign: 'left', paddingLeft: '2px', borderLeft: '1px solid var(--surface-elevated)', height: '100%', display: 'flex', alignItems: 'center' }}>{val}</span>
            })}
          </div>
          <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '20px', backgroundColor: 'var(--surface)', borderRight: '1px solid var(--surface-elevated)', zIndex: 4, fontSize: '0.65rem', display: 'flex', flexDirection: 'column', paddingTop: '20px', color: 'var(--text-low)', overflow: 'hidden' }}>
            {[...Array(50)].map((_, i) => {
              const val = Math.round((i * 100 - panY) / zoom)
              return <span key={i} style={{ height: `${100 * zoom}px`, flexShrink: 0, paddingTop: '2px', borderTop: '1px solid var(--surface-elevated)', paddingLeft: '2px' }}>{val}</span>
            })}
          </div>

          {/* Infinite Canvas */}
          <div 
            ref={canvasRef}
            onClick={handleCanvasClick}
            style={{ 
              width: '5000px', 
              height: '5000px', 
              backgroundColor: 'var(--surface)', 
              position: 'absolute',
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
              backgroundSize: `${20 * zoom}px ${20 * zoom}px`,
              cursor: isSpacePressed || activeTool === 'hand' ? 'grab' : (activeTool === 'text' ? 'text' : activeTool === 'shape' || activeTool === 'line' ? 'crosshair' : 'default'),
              
              transform: `translate(${panX}px, ${panY}px) scale(${zoom})`,
              transformOrigin: '0 0',
              transition: dragging || isPanning ? 'none' : 'transform 0.1s ease'
            }}
          >
            {currentFloor.items.map((item) => (
              <div 
                key={item.id}
                onMouseDown={(e) => {
                  e.stopPropagation()
                  handleMouseDown(e, item)
                }}
                onContextMenu={(e) => handleContextMenu(e, item.id)}
                style={{
                  position: 'absolute',
                  left: `${item.x}px`,
                  top: `${item.y}px`,
                  width: `${item.width}px`,
                  height: `${item.height}px`,
                  backgroundColor: item.color ? item.color : (selectedIds.includes(item.id) ? 'var(--primary)' : 'var(--surface-elevated)'),
                  color: selectedIds.includes(item.id) || (item.color && item.type !== 'text') ? 'var(--background)' : 'var(--text-high)',
                  
                  borderTopLeftRadius: item.radiusTL !== undefined ? `${item.radiusTL}px` : (item.type === 'circle' ? '50%' : '4px'),
                  borderTopRightRadius: item.radiusTR !== undefined ? `${item.radiusTR}px` : (item.type === 'circle' ? '50%' : '4px'),
                  borderBottomLeftRadius: item.radiusBL !== undefined ? `${item.radiusBL}px` : (item.type === 'circle' ? '50%' : '4px'),
                  borderBottomRightRadius: item.radiusBR !== undefined ? `${item.radiusBR}px` : (item.type === 'circle' ? '50%' : '4px'),
                  
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: item.type === 'text' ? (item.textAlign === 'center' ? 'center' : item.textAlign === 'right' ? 'flex-end' : 'flex-start') : 'center',
                  justifyContent: 'center',
                  cursor: isSpacePressed || activeTool === 'hand' ? 'grab' : (dragging ? 'grabbing' : (activeTool === 'select' ? (item.isLocked ? 'not-allowed' : 'grab') : 'default')),
                  border: selectedIds.includes(item.id) ? '2px solid var(--primary)' : (item.groupId ? '1px dashed var(--text-medium)' : (item.type === 'text' || item.type === 'line' ? 'none' : '1px solid rgba(255,255,255,0.05)')),
                  fontSize: item.fontSize ? `${item.fontSize}px` : '0.8rem',
                  fontWeight: item.fontWeight === 'bold' || item.isHeader ? 'bold' : 'normal',
                  userSelect: 'none',
                  boxShadow: item.type === 'text' || item.type === 'line' ? 'none' : '0 10px 25px rgba(0,0,0,0.4)',
                  transition: dragging || isPanning ? 'none' : 'all 0.1s ease',
                  opacity: selectedIds.length > 0 && !selectedIds.includes(item.id) ? 0.4 : 1,
                  padding: item.type === 'text' ? '0.5rem' : '0',
                  zIndex: item.type === 'line' || item.type === 'guide_shape' ? 1 : 2
                }}
              >
                {/* Lock Indicator */}
                {item.isLocked && (
                  <div style={{ position: 'absolute', top: '5px', right: '5px', color: 'var(--text-low)' }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  </div>
                )}

                {item.type === 'custom' && item.svgString ? (
                  <div dangerouslySetInnerHTML={{ __html: item.svgString }} style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }} />
                ) : item.type === 'text' ? (
                  <div style={{ color: item.color || 'var(--text-high)', width: '100%', textAlign: item.textAlign }}>{item.number}</div>
                ) : item.type === 'line' ? (
                  null
                ) : (
                  <>
                    <div style={{ fontWeight: 'bold' }}>{item.number}</div>
                    {item.type !== 'stage' && item.type !== 'bar' && item.type !== 'guide_shape' && (
                      <div style={{ fontSize: '0.6rem', opacity: 0.8, textAlign: 'center', marginTop: '4px' }}>
                        {item.minSpend} EGP
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel */}
        <div style={{ 
          width: '320px', // Slightly wider for better spacing
          backgroundColor: 'var(--surface)', 
          borderLeft: '1px solid var(--surface-elevated)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          height: '100%',
          zIndex: 5
        }}>
          {/* Tabs Header */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--surface-elevated)', backgroundColor: 'var(--background)' }}>
            <TabButton active={activeTab === 'components'} onClick={() => setActiveTab('components')}>Build</TabButton>
            <TabButton active={activeTab === 'properties'} onClick={() => setActiveTab('properties')}>Props</TabButton>
            <TabButton active={activeTab === 'settings'} onClick={() => setActiveTab('settings')}>Floor</TabButton>
            <TabButton active={activeTab === 'layers'} onClick={() => setActiveTab('layers')}>Layers</TabButton>
          </div>

          {/* Tab Content */}
          <div style={{ padding: '1.5rem', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Components Tab */}
            {activeTab === 'components' && (
              <div>
                <h3 style={sectionTitleStyle}>Components</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <PaletteItem label="Square Table" icon={getComponentIcon('square')} onClick={() => addItem('square')} />
                  <PaletteItem label="Round Table" icon={getComponentIcon('circle')} onClick={() => addItem('circle')} />
                  <PaletteItem label="Long Table" icon={getComponentIcon('rectangle')} onClick={() => addItem('rectangle')} />
                  <PaletteItem label="Stage" icon={getComponentIcon('stage')} onClick={() => addItem('stage')} />
                  <PaletteItem label="Bar Counter" icon={getComponentIcon('bar')} onClick={() => addItem('bar')} />
                  <PaletteItem label="Custom SVG" icon={getComponentIcon('custom')} onClick={() => addItem('custom')} />
                </div>
              </div>
            )}

            {/* Properties Tab */}
            {activeTab === 'properties' && (
              <div>
                <h3 style={sectionTitleStyle}>Component Settings</h3>
                {currentItem ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    
                    {currentItem.isLocked && (
                      <div style={{ fontSize: '0.75rem', color: '#ffcc00', backgroundColor: 'rgba(255,204,0,0.1)', padding: '0.6rem', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                        <span>This item is locked. Unlock to move.</span>
                      </div>
                    )}

                    {currentItem.groupId && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-low)', backgroundColor: 'var(--surface-elevated)', padding: '0.6rem', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>Linked to Group: {currentItem.groupId.split('_')[1]}</span>
                        <button onClick={ungroupSelected} style={{ background: 'none', border: 'none', color: '#ff4b4b', cursor: 'pointer', fontSize: '0.75rem' }}>Ungroup</button>
                      </div>
                    )}

                    <div style={controlGroupStyle}>
                      <label style={labelStyle}>Type</label>
                      <select 
                        value={currentItem.type} 
                        onChange={(e) => updateItem(currentItem.id, { type: e.target.value as FloorItem['type'] })}
                        style={inputStyle}
                        disabled={currentItem.isLocked}
                      >
                        <option value="square">Square Table</option>
                        <option value="circle">Round Table</option>
                        <option value="rectangle">Long Table</option>
                        <option value="stage">Stage</option>
                        <option value="bar">Bar Counter</option>
                        <option value="text">Text</option>
                        <option value="line">Line Guide</option>
                        <option value="guide_shape">Area Guide</option>
                        <option value="custom">Custom SVG</option>
                      </select>
                    </div>

                    <div style={controlGroupStyle}>
                      <label style={labelStyle}>Label / Name</label>
                      <input type="text" value={currentItem.number} onChange={(e) => updateItem(currentItem.id, { number: e.target.value })} style={inputStyle} disabled={currentItem.isLocked} />
                    </div>
                    
                    {currentItem.type === 'text' && (
                      <>
                        <div style={controlGroupStyle}>
                          <label style={labelStyle}>Font Size</label>
                          <input type="number" value={currentItem.fontSize || 16} onChange={(e) => updateItem(currentItem.id, { fontSize: parseInt(e.target.value) })} style={inputStyle} disabled={currentItem.isLocked} />
                        </div>
                        <div style={controlGroupStyle}>
                          <label style={labelStyle}>Alignment</label>
                          <select value={currentItem.textAlign || 'left'} onChange={(e) => updateItem(currentItem.id, { textAlign: e.target.value as any })} style={inputStyle} disabled={currentItem.isLocked}>
                            <option value="left">Left</option>
                            <option value="center">Center</option>
                            <option value="right">Right</option>
                          </select>
                        </div>
                      </>
                    )}

                    {currentItem.type !== 'circle' && currentItem.type !== 'line' && (
                      <div style={controlGroupStyle}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                          <label style={labelStyle}>Corner Radius</label>
                          <button 
                            onClick={() => setRadiusLocked(!radiusLocked)} 
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: radiusLocked ? 'var(--primary)' : 'var(--text-low)', display: 'flex', alignItems: 'center' }}
                            title={radiusLocked ? "Unlock Corners" : "Lock Corners"}
                            disabled={currentItem.isLocked}
                          >
                            {radiusLocked ? 
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg> : 
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>
                            }
                          </button>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                          <div>
                            <input type="number" value={currentItem.radiusTL || 0} onChange={(e) => updateRadius(currentItem.id, 'TL', parseInt(e.target.value) || 0)} style={{ ...inputStyle, textAlign: 'center' }} placeholder="TL" disabled={currentItem.isLocked} />
                          </div>
                          <div>
                            <input type="number" value={currentItem.radiusTR || 0} onChange={(e) => updateRadius(currentItem.id, 'TR', parseInt(e.target.value) || 0)} style={{ ...inputStyle, textAlign: 'center' }} placeholder="TR" disabled={currentItem.isLocked} />
                          </div>
                          <div>
                            <input type="number" value={currentItem.radiusBL || 0} onChange={(e) => updateRadius(currentItem.id, 'BL', parseInt(e.target.value) || 0)} style={{ ...inputStyle, textAlign: 'center' }} placeholder="BL" disabled={currentItem.isLocked} />
                          </div>
                          <div>
                            <input type="number" value={currentItem.radiusBR || 0} onChange={(e) => updateRadius(currentItem.id, 'BR', parseInt(e.target.value) || 0)} style={{ ...inputStyle, textAlign: 'center' }} placeholder="BR" disabled={currentItem.isLocked} />
                          </div>
                        </div>
                      </div>
                    )}

                    <div style={controlGroupStyle}>
                      <label style={labelStyle}>Description</label>
                      <input type="text" value={currentItem.description || ''} onChange={(e) => updateItem(currentItem.id, { description: e.target.value })} style={inputStyle} placeholder="Add notes..." disabled={currentItem.isLocked} />
                    </div>

                    <div style={controlGroupStyle}>
                      <label style={labelStyle}>Color</label>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <input type="color" value={currentItem.color || '#282828'} onChange={(e) => updateItem(currentItem.id, { color: e.target.value })} style={{ width: '36px', height: '36px', padding: '0', border: '1px solid var(--surface-elevated)', borderRadius: '4px', cursor: 'pointer', backgroundColor: 'transparent' }} disabled={currentItem.isLocked} />
                        <input type="text" value={currentItem.color || '#282828'} onChange={(e) => updateItem(currentItem.id, { color: e.target.value })} style={inputStyle} disabled={currentItem.isLocked} />
                      </div>
                    </div>

                    {(currentItem.type !== 'stage' && currentItem.type !== 'bar' && currentItem.type !== 'text' && currentItem.type !== 'line' && currentItem.type !== 'guide_shape') && (
                      <>
                        <div style={controlGroupStyle}>
                          <label style={labelStyle}>Min Price (EGP)</label>
                          <input type="number" value={isNaN(currentItem.minSpend) ? '' : currentItem.minSpend} onChange={(e) => updateItem(currentItem.id, { minSpend: parseInt(e.target.value) })} style={inputStyle} disabled={currentItem.isLocked} />
                        </div>
                      </>
                    )}

                    <div style={controlGroupStyle}>
                      <label style={labelStyle}>Dimensions (W x H)</label>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-low)' }}>W</span>
                          <input type="number" value={isNaN(currentItem.width) ? '' : currentItem.width} onChange={(e) => updateItem(currentItem.id, { width: parseInt(e.target.value) })} style={inputStyle} disabled={currentItem.isLocked} />
                        </div>
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-low)' }}>H</span>
                          <input type="number" value={isNaN(currentItem.height) ? '' : currentItem.height} onChange={(e) => updateItem(currentItem.id, { height: parseInt(e.target.value) })} style={inputStyle} disabled={currentItem.isLocked} />
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                      <button 
                        onClick={toggleLockSelected}
                        style={{
                          flex: 1,
                          backgroundColor: currentItem.isLocked ? 'rgba(255,204,0,0.1)' : 'var(--surface-elevated)',
                          color: currentItem.isLocked ? '#ffcc00' : 'var(--text-high)',
                          border: '1px solid',
                          borderColor: currentItem.isLocked ? 'rgba(255,204,0,0.2)' : 'transparent',
                          padding: '0.6rem',
                          borderRadius: '4px',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          fontSize: '0.85rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.5rem',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                        {currentItem.isLocked ? 'Unlock' : 'Lock'}
                      </button>

                      <button 
                        onClick={deleteSelected}
                        style={{
                          flex: 1,
                          backgroundColor: 'rgba(255, 75, 75, 0.1)',
                          color: '#ff4b4b',
                          border: '1px solid rgba(255, 75, 75, 0.2)',
                          padding: '0.6rem',
                          borderRadius: '4px',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          fontSize: '0.85rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.5rem',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 75, 75, 0.2)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 75, 75, 0.1)'}
                        disabled={currentItem.isLocked}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                        Delete
                      </button>
                    </div>
                  </div>
                ) : (
                  <p style={{ color: 'var(--text-low)', fontSize: '0.8rem', textAlign: 'center', marginTop: '2rem' }}>Select item(s) to edit.<br/>Hold Cmd/Shift to multi-select.</p>
                )}
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div>
                <h3 style={sectionTitleStyle}>Floor Settings</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={controlGroupStyle}>
                    <label style={labelStyle}>Floor Name</label>
                    <input type="text" value={currentFloor.name} onChange={(e) => updateFloor(activeFloorId, { name: e.target.value })} style={inputStyle} />
                  </div>
                  
                  <button
                    onClick={addFloor}
                    style={{
                      backgroundColor: 'var(--primary)',
                      color: 'var(--background)',
                      border: 'none',
                      padding: '0.6rem',
                      borderRadius: '4px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      fontSize: '0.85rem'
                    }}
                  >
                    + Add New Floor
                  </button>

                  <button
                    onClick={() => deleteFloor(activeFloorId)}
                    style={{
                      backgroundColor: 'transparent',
                      color: '#ff4b4b',
                      border: '1px solid rgba(255, 75, 75, 0.2)',
                      padding: '0.6rem',
                      borderRadius: '4px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      fontSize: '0.85rem'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 75, 75, 0.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    Delete Current Floor
                  </button>
                </div>
              </div>
            )}

            {/* Layers Tab */}
            {activeTab === 'layers' && (
              <div>
                <h3 style={sectionTitleStyle}>Layers</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {currentFloor.items.map((item, index) => (
                    <div 
                      key={item.id}
                      onClick={() => setSelectedIds([item.id])}
                      style={{
                        padding: '0.6rem 0.75rem',
                        backgroundColor: selectedIds.includes(item.id) ? 'rgba(var(--primary-rgb), 0.1)' : 'transparent',
                        color: selectedIds.includes(item.id) ? 'var(--primary)' : 'var(--text-high)',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '0.8rem',
                        border: '1px solid transparent',
                        borderColor: selectedIds.includes(item.id) ? 'rgba(var(--primary-rgb), 0.2)' : 'transparent',
                        transition: 'all 0.15s ease'
                      }}
                      onMouseEnter={(e) => { if (!selectedIds.includes(item.id)) e.currentTarget.style.backgroundColor = 'var(--surface-elevated)' }}
                      onMouseLeave={(e) => { if (!selectedIds.includes(item.id)) e.currentTarget.style.backgroundColor = 'transparent' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ color: selectedIds.includes(item.id) ? 'var(--primary)' : 'var(--text-low)', display: 'flex', alignItems: 'center' }}>
                          {getComponentIcon(item.type)}
                        </span>
                        <span style={{ fontWeight: selectedIds.includes(item.id) ? 'bold' : 'normal' }}>{item.number}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {item.isLocked && (
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                        )}
                        <span style={{ color: 'var(--text-low)', fontSize: '0.75rem' }}>#{index + 1}</span>
                      </div>
                    </div>
                  )).reverse()}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Custom Context Menu */}
      {contextMenu.visible && (
        <div style={{
          position: 'fixed',
          top: `${contextMenu.y}px`,
          left: `${contextMenu.x}px`,
          backgroundColor: 'var(--surface)',
          border: '1px solid var(--surface-elevated)',
          borderRadius: '6px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
          zIndex: 1000,
          width: '160px',
          padding: '0.25rem'
        }}>
          {contextMenu.itemId ? (
            <>
              <ContextMenuItem onClick={duplicateSelected}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                Duplicate
              </ContextMenuItem>
              <ContextMenuItem onClick={copySelected}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                Copy
              </ContextMenuItem>
              <div style={{ height: '1px', backgroundColor: 'var(--surface-elevated)', margin: '0.25rem 0' }} />
              <ContextMenuItem onClick={toggleLockSelected}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                {currentFloor.items.find(i => i.id === contextMenu.itemId)?.isLocked ? 'Unlock' : 'Lock'}
              </ContextMenuItem>
              <div style={{ height: '1px', backgroundColor: 'var(--surface-elevated)', margin: '0.25rem 0' }} />
              <ContextMenuItem onClick={groupSelected}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
                Group (Cmd+G)
              </ContextMenuItem>
              <ContextMenuItem onClick={ungroupSelected}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="2 2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
                Ungroup
              </ContextMenuItem>
              <div style={{ height: '1px', backgroundColor: 'var(--surface-elevated)', margin: '0.25rem 0' }} />
              <ContextMenuItem onClick={deleteSelected} style={{ color: '#ff4b4b' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                Delete
              </ContextMenuItem>
            </>
          ) : (
            <>
              <ContextMenuItem onClick={pasteSelected} disabled={clipboard.length === 0}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/></svg>
                Paste
              </ContextMenuItem>
              <div style={{ height: '1px', backgroundColor: 'var(--surface-elevated)', margin: '0.25rem 0' }} />
              <ContextMenuItem onClick={() => addItem('square')}>+ Add Table</ContextMenuItem>
              <ContextMenuItem onClick={() => addItem('text')}>+ Add Text</ContextMenuItem>
            </>
          )}
        </div>
      )}
    </div>
  )
}

function TabButton({ children, active, onClick }: { children: React.ReactNode, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      style={{
        flex: 1,
        padding: '0.75rem 0.25rem',
        backgroundColor: active ? 'var(--surface)' : 'transparent',
        color: active ? 'var(--primary)' : 'var(--text-low)',
        border: 'none',
        borderBottom: active ? '2px solid var(--primary)' : 'none',
        fontWeight: 'bold',
        cursor: 'pointer',
        fontSize: '0.8rem',
        transition: 'all 0.15s ease'
      }}
    >
      {children}
    </button>
  )
}

function PaletteItem({ label, icon, onClick }: { label: string, icon: React.ReactNode, onClick: () => void }) {
  return (
    <div 
      onClick={onClick}
      style={{
        padding: '1rem', // Increased padding
        backgroundColor: 'var(--surface-elevated)',
        borderRadius: '6px',
        cursor: 'pointer',
        textAlign: 'center',
        fontSize: '0.75rem',
        fontWeight: 'bold',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.75rem', // Increased gap
        border: '1px solid transparent',
        transition: 'all 0.15s ease'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = 'var(--surface)';
        e.currentTarget.style.borderColor = 'var(--surface-elevated)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'var(--surface-elevated)';
        e.currentTarget.style.borderColor = 'transparent';
      }}
    >
      <div style={{ color: 'var(--text-medium)', transform: 'scale(1.2)' }}>{icon}</div> {/* Scaled up icons */}
      <div style={{ color: 'var(--text-high)' }}>{label}</div>
    </div>
  )
}

function ToolButton({ children, active, onClick, title }: { children: React.ReactNode, active?: boolean, onClick: () => void, title?: string }) {
  const [hovered, setHovered] = useState(false)
  
  return (
    <button 
      onClick={onClick}
      title={title}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '0.35rem',
        backgroundColor: active 
          ? 'rgba(29, 185, 84, 0.2)' 
          : hovered ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
        color: active ? '#1DB954' : 'var(--text-high)',
        border: active ? '1px solid rgba(29, 185, 84, 0.3)' : '1px solid transparent',
        borderRadius: '6px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        width: '32px',
        height: '32px',
        boxShadow: active ? '0 0 10px rgba(29, 185, 84, 0.15)' : 'none'
      }}
    >
      {children}
    </button>
  )
}

function ContextMenuItem({ children, onClick, style, disabled }: { children: React.ReactNode, onClick: () => void, style?: React.CSSProperties, disabled?: boolean }) {
  return (
    <div 
      onClick={disabled ? undefined : onClick}
      style={{
        padding: '0.5rem 0.75rem', // Increased padding
        fontSize: '0.8rem',
        cursor: disabled ? 'not-allowed' : 'pointer',
        borderRadius: '4px',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        opacity: disabled ? 0.4 : 1,
        transition: 'all 0.15s ease',
        ...style
      }}
      onMouseEnter={(e) => { if (!disabled) e.currentTarget.style.backgroundColor = 'var(--surface-elevated)' }}
      onMouseLeave={(e) => { if (!disabled) e.currentTarget.style.backgroundColor = 'transparent' }}
    >
      {children}
    </div>
  )
}

const sectionTitleStyle = {
  fontSize: '0.85rem',
  fontWeight: 'bold',
  marginBottom: '1.25rem', // Increased margin
  color: 'var(--text-high)',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.05rem',
  opacity: 0.8
}

const controlGroupStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem' // Increased gap
}

const labelStyle = {
  color: 'var(--text-medium)',
  fontSize: '0.75rem',
  fontWeight: '500'
}

const inputStyle = {
  backgroundColor: 'var(--surface-elevated)',
  border: '1px solid transparent',
  color: 'var(--text-high)',
  padding: '0.6rem', // Increased padding
  borderRadius: '4px',
  fontSize: '0.85rem',
  width: '100%',
  outline: 'none',
  transition: 'all 0.15s ease'
}
