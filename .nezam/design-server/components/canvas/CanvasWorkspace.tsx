import React, { useState, useRef, useEffect } from 'react'
import { useSessionStore } from '@/lib/store/session.store'
import { Plus, Trash2, Pencil, Eraser, MousePointer, Image as ImageIcon, Type, AlignLeft, AlignCenter, AlignRight, AlignVerticalJustifyStart, AlignVerticalJustifyCenter, AlignVerticalJustifyEnd, Globe, Smartphone, Database, Server, FileText, Images, Zap, Lock, Mail, Layers, Cpu, Bot } from 'lucide-react'
import type { DesignAsset } from '@/lib/assets'

interface Node {
  id: string
  title: string
  type: 'page' | 'application' | 'service' | 'group'
  subType?: string
  x: number
  y: number
  notes?: string[]
  attachments?: string[]
  direction?: 'vertical' | 'horizontal'
  childNodeIds?: string[]
  color?: string
  locked?: boolean
  isText?: boolean
}

interface Path {
  id: string
  points: { x: number; y: number }[]
  color: string
  width: number
}

interface Connection {
  id: string
  fromId: string
  toId: string
  type: 'in' | 'out' | 'both'
}

export default function CanvasWorkspace() {
  const { lang, openAssetManager, setSelectedPageId, openTab } = useSessionStore()
  const t = (en: string, ar: string) => (lang === 'ar' ? ar : en)

  const [nodes, setNodes] = useState<Node[]>([
    { id: '1', title: 'Home Page', type: 'page', x: 80, y: 150 },
    { id: '2', title: 'Dashboard', type: 'page', x: 300, y: 150 },
    { id: '3', title: 'Checkout', type: 'page', x: 520, y: 150 },
    { id: '4', title: 'Mobile Client', type: 'application', subType: 'mobile', x: 80, y: 320 },
    { id: '5', title: 'Auth Service', type: 'service', subType: 'auth', x: 300, y: 320 },
    { id: '6', title: 'API Gateway', type: 'application', subType: 'web', x: 300, y: 490 },
    { id: '7', title: 'Neon Postgres', type: 'service', subType: 'database', x: 520, y: 490 },
    { id: '8', title: 'Redis Cache', type: 'service', subType: 'cache', x: 740, y: 320 },
    { id: '9', title: 'Gemini LLM', type: 'service', subType: 'ai llm', x: 520, y: 320 },
    { id: '10', title: 'Cloudflare CDN', type: 'service', subType: 'cdn', x: 740, y: 150 },
  ])
  const [paths, setPaths] = useState<Path[]>([])
  const [currentPath, setCurrentPath] = useState<Path | null>(null)
  const [tool, setTool] = useState<'select' | 'pen' | 'eraser' | 'text'>('select')
  const [isDrawing, setIsDrawing] = useState(false)
  const [isDraggingNode, setIsDraggingNode] = useState<string | null>(null)
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [connections, setConnections] = useState<Connection[]>([
    { id: 'c1', fromId: '1', toId: '10', type: 'both' },
    { id: 'c2', fromId: '2', toId: '6', type: 'both' },
    { id: 'c3', fromId: '3', toId: '6', type: 'out' },
    { id: 'c4', fromId: '4', toId: '6', type: 'both' },
    { id: 'c5', fromId: '6', toId: '5', type: 'both' },
    { id: 'c6', fromId: '6', toId: '7', type: 'both' },
    { id: 'c7', fromId: '6', toId: '8', type: 'both' },
    { id: 'c8', fromId: '6', toId: '9', type: 'both' },
  ])
  
  const [contextMenu, setContextMenu] = useState<{ x: number, y: number, visible: boolean, nodeId: string } | null>(null)
  const [selectedNodeIds, setSelectedNodeIds] = useState<string[]>([])
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [scale, setScale] = useState(1)
  const [isSpacePressed, setIsSpacePressed] = useState(false)
  const [isPanning, setIsPanning] = useState(false)
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 })
  const [openMenu, setOpenMenu] = useState<'app' | 'service' | null>(null)
  const [draggingSocket, setDraggingSocket] = useState<{ fromNodeId: string, fromPos: { x: number, y: number }, currentPos: { x: number, y: number } } | null>(null)

  const getSubtypeColor = (type: string, subType?: string) => {
    if (type === 'page') return '#06b6d4' // Cyan
    if (type === 'application') return '#6366f1' // Indigo
    if (type === 'group') return '#a855f7' // Purple
    
    switch (subType?.toLowerCase()) {
      case 'database': return '#10b981' // Emerald
      case 'cache': return '#f59e0b' // Amber
      case 'storage': return '#84cc16' // Lime
      case 'cdn': return '#ec4899' // Pink
      case 'mail': return '#f43f5e' // Rose
      case 'crm': return '#06b6d4' // Cyan
      case 'ai llm':
      case 'ai agent': return '#a855f7' // Purple
      case 'automation': return '#eab308' // Yellow
      case 'auth': return '#ef4444' // Red
      default: return '#3b82f6' // Blue
    }
  }

  const getSubtypeIcon = (type: string, subType?: string) => {
    if (type === 'page') return <FileText className="w-4 h-4 text-cyan-400" />
    if (type === 'group') return <Plus className="w-4 h-4 text-purple-400" />
    if (type === 'application') {
      if (subType === 'mobile') return <Smartphone className="w-4 h-4 text-indigo-400" />
      return <Globe className="w-4 h-4 text-indigo-400" />
    }
    
    switch (subType?.toLowerCase()) {
      case 'database': return <Database className="w-4 h-4 text-emerald-400" />
      case 'cache': return <Zap className="w-4 h-4 text-amber-400" />
      case 'storage': return <Server className="w-4 h-4 text-lime-400" />
      case 'cdn': return <Layers className="w-4 h-4 text-pink-400" />
      case 'mail': return <Mail className="w-4 h-4 text-rose-400" />
      case 'crm': return <Images className="w-4 h-4 text-cyan-400" />
      case 'ai llm': return <Cpu className="w-4 h-4 text-purple-400" />
      case 'ai agent': return <Bot className="w-4 h-4 text-violet-400" />
      case 'automation': return <Cpu className="w-4 h-4 text-yellow-400" />
      case 'auth': return <Lock className="w-4 h-4 text-red-400" />
      default: return <Server className="w-4 h-4 text-blue-400" />
    }
  }

  const canvasRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setIsSpacePressed(true)
        e.preventDefault()
      }
    }
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setIsSpacePressed(false)
        setIsPanning(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  useEffect(() => {
    const handleCloseMenu = () => {
      setOpenMenu(null)
      setContextMenu(null)
    }
    window.addEventListener('click', handleCloseMenu)
    return () => window.removeEventListener('click', handleCloseMenu)
  }, [])

  const alignNodes = (type: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => {
    const selectedNodes = nodes.filter((n) => selectedNodeIds.includes(n.id))
    if (selectedNodes.length === 0) return

    if (type === 'left') {
      const minX = Math.min(...selectedNodes.map((n) => n.x))
      setNodes(nodes.map((n) => selectedNodeIds.includes(n.id) ? { ...n, x: minX } : n))
    } else if (type === 'right') {
      const maxX = Math.max(...selectedNodes.map((n) => n.x))
      setNodes(nodes.map((n) => selectedNodeIds.includes(n.id) ? { ...n, x: maxX } : n))
    } else if (type === 'center') {
      const avgCenter = selectedNodes.reduce((acc, n) => acc + n.x + 64, 0) / selectedNodes.length
      setNodes(nodes.map((n) => selectedNodeIds.includes(n.id) ? { ...n, x: avgCenter - 64 } : n))
    } else if (type === 'top') {
      const minY = Math.min(...selectedNodes.map((n) => n.y))
      setNodes(nodes.map((n) => selectedNodeIds.includes(n.id) ? { ...n, y: minY } : n))
    } else if (type === 'bottom') {
      const maxY = Math.max(...selectedNodes.map((n) => n.y))
      setNodes(nodes.map((n) => selectedNodeIds.includes(n.id) ? { ...n, y: maxY } : n))
    } else if (type === 'middle') {
      const avgMiddle = selectedNodes.reduce((acc, n) => acc + n.y + 35, 0) / selectedNodes.length
      setNodes(nodes.map((n) => selectedNodeIds.includes(n.id) ? { ...n, y: avgMiddle - 35 } : n))
    }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && isSpacePressed)) {
      e.preventDefault()
      setIsPanning(true)
      setLastMousePos({ x: e.clientX, y: e.clientY })
      return
    }

    if (tool === 'text' && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect()
      const x = (e.clientX - rect.left - pan.x) / scale
      const y = (e.clientY - rect.top - pan.y) / scale
      setNodes([
        ...nodes,
        {
          id: Math.random().toString(36).substring(2, 9),
          title: 'New Text',
          type: 'page',
          isText: true,
          x,
          y,
        }
      ])
      setTool('select')
      return
    }
    if (tool === 'pen' && canvasRef.current) {
      setIsDrawing(true)
      const rect = canvasRef.current.getBoundingClientRect()
      const x = (e.clientX - rect.left - pan.x) / scale
      const y = (e.clientY - rect.top - pan.y) / scale
      setCurrentPath({
        id: Math.random().toString(36).substring(2, 9),
        points: [{ x, y }],
        color: '#ff007f', // Neon pink
        width: 2,
      })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      const dx = e.clientX - lastMousePos.x
      const dy = e.clientY - lastMousePos.y
      setPan({ x: pan.x + dx, y: pan.y + dy })
      setLastMousePos({ x: e.clientX, y: e.clientY })
      return
    }

    if (isDrawing && currentPath && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect()
      const x = (e.clientX - rect.left - pan.x) / scale
      const y = (e.clientY - rect.top - pan.y) / scale
      setCurrentPath({
        ...currentPath,
        points: [...currentPath.points, { x, y }],
      })
    }
    
    if (isDraggingNode && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect()
      const x = (e.clientX - rect.left - pan.x) / scale
      const y = (e.clientY - rect.top - pan.y) / scale
      
      const draggedNode = nodes.find((n) => n.id === isDraggingNode)
      if (draggedNode) {
        const dx = (x - 64) - draggedNode.x
        const dy = (y - 35) - draggedNode.y
        
        setNodes(
          nodes.map((n) => {
            if (n.id === isDraggingNode) {
              return { ...n, x: x - 64, y: y - 35 }
            }
            if (draggedNode.type === 'group' && draggedNode.childNodeIds?.includes(n.id)) {
              return { ...n, x: n.x + dx, y: n.y + dy }
            }
            return n
          })
        )
      }
    }

    if (draggingSocket && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect()
      const x = (e.clientX - rect.left - pan.x) / scale
      const y = (e.clientY - rect.top - pan.y) / scale
      setDraggingSocket({
        ...draggingSocket,
        currentPos: { x, y }
      })
    }
  }

  const handleMouseUp = () => {
    setIsPanning(false)
    if (isDrawing && currentPath) {
      setPaths([...paths, currentPath])
      setCurrentPath(null)
      setIsDrawing(false)
    }
    setIsDraggingNode(null)
    setDraggingSocket(null)
  }

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault()
    const zoomFactor = 1.08
    let newScale = scale
    if (e.deltaY < 0) {
      newScale = Math.min(scale * zoomFactor, 2.5)
    } else {
      newScale = Math.max(scale / zoomFactor, 0.4)
    }

    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect()
      const mouseX = e.clientX - rect.left
      const mouseY = e.clientY - rect.top
      
      const newPanX = mouseX - (mouseX - pan.x) * (newScale / scale)
      const newPanY = mouseY - (mouseY - pan.y) * (newScale / scale)
      
      setPan({ x: newPanX, y: newPanY })
      setScale(newScale)
    }
  }

  const startSocketDrag = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation()
    e.preventDefault()
    const node = nodes.find(n => n.id === nodeId)
    if (!node) return
    setDraggingSocket({
      fromNodeId: nodeId,
      fromPos: { x: node.x + 128, y: node.y + 35 },
      currentPos: { x: node.x + 128, y: node.y + 35 }
    })
  }

  const completeSocketDrag = (e: React.MouseEvent, targetNodeId: string) => {
    e.stopPropagation()
    if (draggingSocket && draggingSocket.fromNodeId !== targetNodeId) {
      setConnections([
        ...connections,
        {
          id: Math.random().toString(36).substring(2, 9),
          fromId: draggingSocket.fromNodeId,
          toId: targetNodeId,
          type: 'out'
        }
      ])
    }
    setDraggingSocket(null)
  }

  const addNode = (type: 'page' | 'application' | 'service' | 'group', subType?: string) => {
    let spawnX = 200
    let spawnY = 200
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect()
      spawnX = (rect.width / 2 - pan.x) / scale - 64
      spawnY = (rect.height / 2 - pan.y) / scale - 35
    }
    setNodes([
      ...nodes,
      {
        id: Math.random().toString(36).substring(2, 9),
        title: subType ? `${subType.charAt(0).toUpperCase() + subType.slice(1)}` : `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
        type,
        subType,
        x: spawnX,
        y: spawnY,
      },
    ])
  }

  const attachAssetToNode = (nodeId: string, asset: DesignAsset) => {
    setNodes((currentNodes) =>
      currentNodes.map((node) => {
        if (node.id !== nodeId) return node
        const attachments = Array.from(new Set([...(node.attachments || []), asset.name]))
        return { ...node, attachments }
      }),
    )
  }

  const handleCanvasDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()

    const rawAsset = event.dataTransfer.getData('application/x-nezam-asset')
    if (!rawAsset || !canvasRef.current) return

    const asset = JSON.parse(rawAsset) as DesignAsset
    const rect = canvasRef.current.getBoundingClientRect()
    const x = (event.clientX - rect.left - pan.x) / scale
    const y = (event.clientY - rect.top - pan.y) / scale

    setNodes((currentNodes) => [
      ...currentNodes,
      {
        id: Math.random().toString(36).substring(2, 9),
        title: asset.name,
        type: 'page',
        subType: asset.type,
        attachments: [asset.name],
        x: x - 64,
        y: y - 35,
      },
    ])
  }

  const getSimulatedLatency = (subType?: string) => {
    switch (subType?.toLowerCase()) {
      case 'cache': return '2ms'
      case 'database': return '15ms'
      case 'auth': return '45ms'
      case 'cdn': return '8ms'
      case 'ai llm':
      case 'ai agent': return '240ms'
      case 'mail': return '85ms'
      default: return '25ms'
    }
  }

  return (
    <div className="p-6 space-y-6 text-ds-text-primary h-full flex flex-col relative overflow-visible">
      <div className="flex justify-between items-center bg-ds-surface backdrop-blur-md border border-ds-border p-3 rounded-2xl shadow-2xl shrink-0 overflow-visible z-[100]">
        <div className="flex flex-wrap items-center gap-2 overflow-visible">
          <button
            onClick={() => setTool('select')}
            className={`p-2 rounded-lg transition-colors ${tool === 'select' ? 'bg-ds-primary/20 text-ds-primary' : 'text-ds-text-muted hover:text-ds-text-primary hover:bg-ds-background'}`}
            title="Select Tool"
          >
            <MousePointer size={18} />
          </button>
          <button
            onClick={() => setTool('pen')}
            className={`p-2 rounded-lg transition-colors ${tool === 'pen' ? 'bg-ds-primary/20 text-ds-primary' : 'text-ds-text-muted hover:text-ds-text-primary hover:bg-ds-background'}`}
            title="Pen Tool"
          >
            <Pencil size={18} />
          </button>
          <button
            onClick={() => setTool('eraser')}
            className={`p-2 rounded-lg transition-colors ${tool === 'eraser' ? 'bg-ds-primary/20 text-ds-primary' : 'text-ds-text-muted hover:text-ds-text-primary hover:bg-ds-background'}`}
            title="Eraser Tool"
          >
            <Eraser size={18} />
          </button>
          <button
            onClick={() => setTool('text')}
            className={`p-2 rounded-lg transition-colors ${tool === 'text' ? 'bg-ds-primary/20 text-ds-primary' : 'text-ds-text-muted hover:text-ds-text-primary hover:bg-ds-background'}`}
            title="Text Tool"
          >
            <Type size={18} />
          </button>
          <div className="w-px h-6 bg-ds-border mx-1"></div>
          {/* Add App Dropdown */}
          <div className="relative">
            <button
              onClick={(e) => { e.stopPropagation(); setOpenMenu((current) => current === 'app' ? null : 'app') }}
              className="px-3 py-1.5 bg-ds-primary text-white rounded-lg text-xs font-medium hover:bg-ds-primary-hover transition-colors flex items-center gap-1"
            >
              <Plus size={14} /> {t('App', 'تطبيق')}
            </button>
            <div className={`${openMenu === 'app' ? 'block' : 'hidden'} absolute start-0 mt-2 w-32 bg-ds-surface border border-ds-border rounded-lg shadow-xl z-[120] ${lang === 'ar' ? 'end-0 start-auto' : 'start-0'}`}>
              <button onClick={() => addNode('application', 'web')} className={`w-full ${lang === 'ar' ? 'text-end' : 'text-start'} px-3 py-2 text-xs text-ds-text-muted hover:text-ds-text-primary hover:bg-ds-primary/20`}>{t('Web App', 'تطبيق ويب')}</button>
              <button onClick={() => addNode('application', 'mobile')} className={`w-full ${lang === 'ar' ? 'text-end' : 'text-start'} px-3 py-2 text-xs text-ds-text-muted hover:text-ds-text-primary hover:bg-ds-primary/20`}>{t('Mobile App', 'تطبيق موبايل')}</button>
            </div>
          </div>

          {/* Add Service Dropdown */}
          <div className="relative">
            <button
              onClick={(e) => { e.stopPropagation(); setOpenMenu((current) => current === 'service' ? null : 'service') }}
              className="px-3 py-1.5 bg-ds-primary text-white rounded-lg text-xs font-medium hover:bg-ds-primary-hover transition-colors flex items-center gap-1"
            >
              <Plus size={14} /> {t('Service', 'خدمة')}
            </button>
            <div className={`${openMenu === 'service' ? 'block' : 'hidden'} absolute start-0 mt-2 w-48 bg-ds-surface border border-ds-border rounded-lg shadow-xl z-[120] max-h-64 overflow-auto ${lang === 'ar' ? 'end-0 start-auto' : 'start-0'}`}>
              <button onClick={() => addNode('service', 'database')} className={`w-full ${lang === 'ar' ? 'text-end' : 'text-start'} px-3 py-2 text-xs text-ds-text-muted hover:text-ds-text-primary hover:bg-ds-primary/20 flex items-center gap-2`}><Database size={12} className="text-emerald-400" /> Neon Database</button>
              <button onClick={() => addNode('service', 'auth')} className={`w-full ${lang === 'ar' ? 'text-end' : 'text-start'} px-3 py-2 text-xs text-ds-text-muted hover:text-ds-text-primary hover:bg-ds-primary/20 flex items-center gap-2`}><Lock size={12} className="text-red-400" /> Better Auth</button>
              <button onClick={() => addNode('service', 'cache')} className={`w-full ${lang === 'ar' ? 'text-end' : 'text-start'} px-3 py-2 text-xs text-ds-text-muted hover:text-ds-text-primary hover:bg-ds-primary/20 flex items-center gap-2`}><Zap size={12} className="text-amber-400" /> Redis Cache</button>
              <button onClick={() => addNode('service', 'cdn')} className={`w-full ${lang === 'ar' ? 'text-end' : 'text-start'} px-3 py-2 text-xs text-ds-text-muted hover:text-ds-text-primary hover:bg-ds-primary/20 flex items-center gap-2`}><Layers size={12} className="text-pink-400" /> Cloudflare Workers</button>
              <button onClick={() => addNode('service', 'ai llm')} className={`w-full ${lang === 'ar' ? 'text-end' : 'text-start'} px-3 py-2 text-xs text-ds-text-muted hover:text-ds-text-primary hover:bg-ds-primary/20 flex items-center gap-2`}><Cpu size={12} className="text-purple-400" /> Gemini LLM</button>
              <button onClick={() => addNode('service', 'mail')} className={`w-full ${lang === 'ar' ? 'text-end' : 'text-start'} px-3 py-2 text-xs text-ds-text-muted hover:text-ds-text-primary hover:bg-ds-primary/20 flex items-center gap-2`}><Mail size={12} className="text-rose-400" /> Resend Mail</button>
              <button onClick={() => addNode('service', 'ai agent')} className={`w-full ${lang === 'ar' ? 'text-end' : 'text-start'} px-3 py-2 text-xs text-ds-text-muted hover:text-ds-text-primary hover:bg-ds-primary/20 flex items-center gap-2`}><Bot size={12} className="text-violet-400" /> AI Agent</button>
            </div>
          </div>

          {/* Create Page Button */}
          <button
            onClick={() => addNode('page')}
            className="px-3 py-1.5 bg-ds-success text-white rounded-lg text-xs font-medium hover:bg-ds-success/90 transition-colors flex items-center gap-1"
          >
            <Plus size={14} /> Create Page
          </button>

          {/* Create Group Button */}
          <button
            onClick={() => {
              if (selectedNodeIds.length > 0) {
                const minX = Math.min(...nodes.filter((n) => selectedNodeIds.includes(n.id)).map((n) => n.x))
                const minY = Math.min(...nodes.filter((n) => selectedNodeIds.includes(n.id)).map((n) => n.y))
                const groupId = Math.random().toString(36).substring(2, 9)
                setNodes([
                  ...nodes,
                  {
                    id: groupId,
                    title: 'New Group',
                    type: 'group',
                    x: minX - 20,
                    y: minY - 20,
                    childNodeIds: selectedNodeIds,
                  }
                ])
                setSelectedNodeIds([]) // Clear selection
              } else {
                addNode('group')
              }
            }}
            className="px-3 py-1.5 bg-ds-primary text-white rounded-lg text-xs font-medium hover:bg-ds-primary-hover transition-colors flex items-center gap-1"
          >
            <Plus size={14} /> Group
          </button>

          <button
            onClick={openAssetManager}
            className="px-3 py-1.5 bg-ds-surface-elevated text-ds-text-primary rounded-lg text-xs font-medium border border-ds-border hover:bg-ds-surface-hover transition-colors flex items-center gap-1"
          >
            <Images size={14} /> {t('Assets', 'الأصول')}
          </button>

          {/* Alignment Tools */}
          {selectedNodeIds.length > 1 && (
            <div className="flex items-center gap-1 bg-ds-surface border border-ds-border p-1 rounded-lg">
              <button onClick={() => alignNodes('left')} className="p-1.5 text-ds-text-muted hover:text-ds-text-primary hover:bg-ds-background rounded" title="Align Left">
                <AlignLeft size={16} />
              </button>
              <button onClick={() => alignNodes('center')} className="p-1.5 text-ds-text-muted hover:text-ds-text-primary hover:bg-ds-background rounded" title="Align Center">
                <AlignCenter size={16} />
              </button>
              <button onClick={() => alignNodes('right')} className="p-1.5 text-ds-text-muted hover:text-ds-text-primary hover:bg-ds-background rounded" title="Align Right">
                <AlignRight size={16} />
              </button>
              <div className="w-px h-4 bg-ds-border mx-0.5"></div>
              <button onClick={() => alignNodes('top')} className="p-1.5 text-ds-text-muted hover:text-ds-text-primary hover:bg-ds-background rounded" title="Align Top">
                <AlignVerticalJustifyStart size={16} />
              </button>
              <button onClick={() => alignNodes('middle')} className="p-1.5 text-ds-text-muted hover:text-ds-text-primary hover:bg-ds-background rounded" title="Align Middle">
                <AlignVerticalJustifyCenter size={16} />
              </button>
              <button onClick={() => alignNodes('bottom')} className="p-1.5 text-ds-text-muted hover:text-ds-text-primary hover:bg-ds-background rounded" title="Align Bottom">
                <AlignVerticalJustifyEnd size={16} />
              </button>
            </div>
          )}
        </div>
        <div>
          <span className="text-xs text-ds-text-muted">Canvas Mode</span>
        </div>
      </div>

      <div className="flex-1 flex gap-6 min-h-0 relative overflow-visible">
        <div
          ref={canvasRef}
          className={`flex-1 bg-ds-background border border-ds-border rounded-2xl relative overflow-hidden select-none transition-shadow ${
            isSpacePressed ? (isPanning ? 'cursor-grabbing' : 'cursor-grab') : (tool === 'pen' ? 'cursor-crosshair' : 'cursor-default')
          }`}
          style={{
            backgroundImage: 'radial-gradient(rgba(138, 143, 152, 0.15) 1.5px, transparent 1.5px)',
            backgroundSize: `${20 * scale}px ${20 * scale}px`,
            backgroundPosition: `${pan.x}px ${pan.y}px`
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
          onDragOver={(event) => event.preventDefault()}
          onDrop={handleCanvasDrop}
        >
          <div
            className="absolute inset-0"
            style={{ 
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`, 
              transformOrigin: '0 0' 
            }}
          >
            <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
              <defs>
                <linearGradient id="wire-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
                <filter id="wire-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Draw lines for groups */}
              {nodes.filter((n) => n.type === 'group' && n.childNodeIds).flatMap((group) => 
                group.childNodeIds!.map((childId) => {
                  const child = nodes.find((n) => n.id === childId)
                  if (!child) return null
                  return (
                    <line
                      key={`${group.id}-${child.id}`}
                      x1={group.x + 64}
                      y1={group.y + 35}
                      x2={child.x + 64}
                      y2={child.y + 35}
                      stroke="var(--ds-primary)"
                      strokeWidth={1}
                      strokeDasharray="4,4"
                      className="opacity-40"
                    />
                  )
                })
              )}

              {/* Draw connections */}
              {connections.map((conn) => {
                const fromNode = nodes.find((n) => n.id === conn.fromId)
                const toNode = nodes.find((n) => n.id === conn.toId)
                if (!fromNode || !toNode) return null

                // Inputs on the left, Outputs on the right
                const x1 = fromNode.x + 128
                const y1 = fromNode.y + 35
                const x2 = toNode.x
                const y2 = toNode.y + 35

                const dx = x2 - x1
                const dy = y2 - y1
                const cx1 = x1 + dx * 0.4
                const cy1 = y1
                const cx2 = x1 + dx * 0.6
                const cy2 = y2
                const d = `M ${x1} ${y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2}`

                const color = getSubtypeColor(fromNode.type, fromNode.subType)
                const latency = getSimulatedLatency(toNode.subType)

                // Middle point of Bezier curve to render simulated latency pill
                const mx = 0.125 * x1 + 0.375 * cx1 + 0.375 * cx2 + 0.125 * x2
                const my = 0.125 * y1 + 0.375 * cy1 + 0.375 * cy2 + 0.125 * y2

                return (
                  <g key={conn.id}>
                    {/* Glowing background path */}
                    <path
                      d={d}
                      fill="none"
                      stroke={color}
                      strokeWidth={4}
                      className="opacity-15 blur-[1px]"
                      filter="url(#wire-glow)"
                    />
                    {/* Thin animated path */}
                    <path
                      d={d}
                      fill="none"
                      stroke="url(#wire-gradient)"
                      strokeWidth={1.5}
                      strokeDasharray="6,4"
                      className="opacity-75"
                    >
                      <animate
                        attributeName="stroke-dashoffset"
                        values={conn.type === 'in' ? '0;20' : '20;0'}
                        dur="1.5s"
                        repeatCount="indefinite"
                      />
                    </path>
                    {/* Direction dot pulses */}
                    <circle r={3.5} fill={color} className="shadow-lg">
                      <animateMotion
                        dur="3s"
                        repeatCount="indefinite"
                        path={d}
                        calcMode="linear"
                        keyPoints={conn.type === 'in' ? '1;0' : '0;1'}
                        keyTimes="0;1"
                      />
                    </circle>
                    {/* Simulated Latency Pill */}
                    <foreignObject x={mx - 24} y={my - 8} width={48} height={16} className="overflow-visible pointer-events-auto">
                      <div className="bg-ds-surface/90 border border-ds-border/60 text-[8px] font-mono px-1 rounded-full text-center flex items-center justify-center text-ds-text-muted select-none shadow-md backdrop-blur-sm scale-90 hover:scale-110 transition-transform">
                        {latency}
                      </div>
                    </foreignObject>
                  </g>
                )
              })}
              
              {/* Dynamic Dragging Connection Wire */}
              {draggingSocket && (() => {
                const { fromPos, currentPos } = draggingSocket
                const dx = currentPos.x - fromPos.x
                const dy = currentPos.y - fromPos.y
                const cx1 = fromPos.x + dx * 0.4
                const cy1 = fromPos.y
                const cx2 = fromPos.x + dx * 0.6
                const cy2 = currentPos.y
                const d = `M ${fromPos.x} ${fromPos.y} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${currentPos.x} ${currentPos.y}`
                return (
                  <path
                    d={d}
                    fill="none"
                    stroke="var(--ds-primary)"
                    strokeWidth={2}
                    strokeDasharray="4,4"
                    className="opacity-75 animate-pulse"
                  />
                )
              })()}

              {paths.map((path) => (
                <path
                  key={path.id}
                  d={`M ${path.points.map((p) => `${p.x},${p.y}`).join(' L ')}`}
                  fill="none"
                  stroke={path.color}
                  strokeWidth={path.width}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ))}
              {currentPath && (
                <path
                  d={`M ${currentPath.points.map((p) => `${p.x},${p.y}`).join(' L ')}`}
                  fill="none"
                  stroke={currentPath.color}
                  strokeWidth={currentPath.width}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}
            </svg>

            {nodes.map((node) => (
              <div
                key={node.id}
                style={{ left: node.x, top: node.y, backgroundColor: node.color }}
                className={`absolute ${node.isText ? 'p-1' : 'w-32 bg-ds-surface/90 backdrop-blur-md border border-ds-border p-3 rounded-xl shadow-lg'} cursor-pointer transition-all hover:shadow-2xl hover:border-ds-primary/60 group`}
                onDoubleClick={(e) => {
                  if (node.type === 'page') {
                    e.stopPropagation()
                    setSelectedPageId(node.id)
                    openTab({ id: 'page-builder', title: t('Page Builder', 'منشئ الصفحات'), type: 'page-builder' })
                  }
                }}
                onMouseDown={(e) => {
                  if (tool === 'select' && !node.locked) {
                    e.stopPropagation()
                    setIsDraggingNode(node.id)
                    
                    if (e.shiftKey) {
                      setSelectedNodeIds((prev) => 
                        prev.includes(node.id) ? prev.filter((id) => id !== node.id) : [...prev, node.id]
                      )
                    } else {
                      setSelectedNodeIds([node.id])
                      setSelectedNodeId(node.id)
                    }
                  }
                }}
                onContextMenu={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setContextMenu({ x: e.clientX, y: e.clientY, visible: true, nodeId: node.id })
                }}
              >
                {/* Input Socket (Left Dot) */}
                {node.type !== 'group' && !node.isText && (
                  <div
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1.5 w-3 h-3 bg-cyan-400 border-2 border-ds-background rounded-full hover:scale-125 hover:bg-cyan-300 transition-all shadow-[0_0_8px_rgba(34,211,238,0.6)] cursor-crosshair z-20 opacity-0 group-hover:opacity-100"
                    onMouseUp={(e) => completeSocketDrag(e, node.id)}
                    title="Input Socket"
                  />
                )}

                {/* Output Socket (Right Dot) */}
                {node.type !== 'group' && !node.isText && (
                  <div
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1.5 w-3 h-3 bg-indigo-500 border-2 border-ds-background rounded-full hover:scale-125 hover:bg-indigo-400 transition-all shadow-[0_0_8px_rgba(99,102,241,0.6)] cursor-crosshair z-20 opacity-0 group-hover:opacity-100"
                    onMouseDown={(e) => startSocketDrag(e, node.id)}
                    title="Drag to Connect"
                  />
                )}

                {node.isText ? (
                  <div className="text-sm text-ds-text-primary font-medium">{node.title}</div>
                ) : (
                  <div className="flex items-start gap-2 select-none">
                    <div className="mt-0.5 text-ds-primary">
                      {getSubtypeIcon(node.type, node.subType)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[11px] font-semibold text-ds-text-primary mb-0.5 truncate">{node.title}</div>
                      <div className="text-[9px] text-ds-text-muted capitalize">
                        {node.subType ? node.subType : node.type}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Floating Zoom and Pan Controls */}
          <div className="absolute bottom-4 right-4 bg-ds-surface/90 border border-ds-border px-3 py-1.5 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-medium text-ds-text-primary select-none backdrop-blur-md z-[100]">
            <button
              onClick={() => setScale(s => Math.max(s - 0.1, 0.4))}
              className="p-1 hover:bg-white/10 rounded transition-colors text-ds-text-muted hover:text-ds-text-primary"
            >
              -
            </button>
            <span className="min-w-[40px] text-center font-mono">{Math.round(scale * 100)}%</span>
            <button
              onClick={() => setScale(s => Math.min(s + 0.1, 2.5))}
              className="p-1 hover:bg-white/10 rounded transition-colors text-ds-text-muted hover:text-ds-text-primary"
            >
              +
            </button>
            <div className="w-px h-3 bg-ds-border" />
            <button
              onClick={() => { setScale(1); setPan({ x: 0, y: 0 }); }}
              className="px-1.5 py-0.5 hover:bg-white/10 rounded transition-colors text-[10px] text-ds-text-muted hover:text-ds-text-primary"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Side Panel */}
        {selectedNodeId && (() => {
          const selectedNode = nodes.find((n) => n.id === selectedNodeId)
          if (!selectedNode) return null
          
          return (
            <div className="w-80 bg-ds-surface border border-ds-border p-4 rounded-2xl shadow-2xl flex flex-col gap-4 overflow-auto shrink-0 z-50">
              <div className="flex justify-between items-center border-b border-ds-border pb-2">
                <div>
                  <h3 className="font-semibold text-ds-text-primary truncate max-w-[180px]">{selectedNode.title}</h3>
                  <p className="text-[10px] text-ds-text-muted">{selectedNode.type.toUpperCase()}</p>
                </div>
                <button onClick={() => setSelectedNodeId(null)} className="text-ds-text-muted hover:text-ds-text-primary">✕</button>
              </div>

              <button
                onClick={openAssetManager}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-ds-border bg-ds-background px-3 py-2 text-xs font-medium text-ds-text-primary transition-colors hover:bg-ds-surface-hover"
              >
                <ImageIcon size={14} />
                <span>{t('Open Asset Manager', 'افتح مدير الملفات')}</span>
              </button>

              <div
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                  event.preventDefault()
                  const rawAsset = event.dataTransfer.getData('application/x-nezam-asset')
                  if (!rawAsset || !selectedNodeId) return
                  const asset = JSON.parse(rawAsset) as DesignAsset
                  attachAssetToNode(selectedNodeId, asset)
                }}
                className="rounded-xl border border-dashed border-ds-border bg-ds-background px-3 py-3"
              >
                <div className="flex items-center gap-2 text-xs font-medium text-ds-text-primary">
                  <ImageIcon size={14} className="text-ds-primary" />
                  <span>{t('Drop assets here for this element', 'اسحب الأصل هنا للعنصر ده')}</span>
                </div>
                <p className="mt-1 text-[11px] text-ds-text-muted">
                  {t('You can also drag assets directly onto the canvas to create a new asset card.', 'تقدر كمان تسحب الأصل على الكانفاس مباشرة عشان تعمل كارت جديد ليه.')}
                </p>
              </div>

              {!!selectedNode.attachments?.length && (
                <div className="space-y-2">
                  <label className="text-xs text-ds-text-muted">{t('Attached Assets', 'الأصول المربوطة')}</label>
                  <div className="flex flex-wrap gap-2">
                    {selectedNode.attachments.map((attachment) => (
                      <span key={attachment} className="rounded-full bg-ds-primary/10 px-2.5 py-1 text-[11px] text-ds-primary">
                        {attachment}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Settings */}
              <div className="space-y-2">
                <label className="text-xs text-ds-text-muted">{t('Page Scroll Direction', 'اتجاه اسكرول الصفحة')}</label>
                <select
                  value={selectedNode.direction || 'vertical'}
                  onChange={(e) => {
                    setNodes(nodes.map((n) => n.id === selectedNodeId ? { ...n, direction: e.target.value as 'vertical' | 'horizontal' } : n))
                  }}
                  className="w-full bg-ds-background border border-ds-border rounded-lg px-3 py-1.5 text-xs text-ds-text-primary focus:outline-none focus:border-ds-primary/50"
                >
                  <option value="vertical">{t('Vertical Scroll', 'اسكرول رأسي')}</option>
                  <option value="horizontal">{t('Horizontal Scroll', 'اسكرول أفقي')}</option>
                </select>
              </div>

              {/* Item Color */}
              <div className="space-y-2">
                <label className="text-xs text-ds-text-muted">{t('Item Color', 'لون العنصر')}</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={selectedNode.color || '#121420'}
                    onChange={(e) => {
                      setNodes(nodes.map((n) => n.id === selectedNodeId ? { ...n, color: e.target.value } : n))
                    }}
                    className="w-8 h-8 bg-ds-background border border-ds-border rounded-lg cursor-pointer"
                  />
                  <input
                    type="text"
                    value={selectedNode.color || '#121420'}
                    onChange={(e) => {
                      setNodes(nodes.map((n) => n.id === selectedNodeId ? { ...n, color: e.target.value } : n))
                    }}
                    className="flex-1 bg-ds-background border border-ds-border rounded-lg px-3 py-1.5 text-xs text-ds-text-primary focus:outline-none focus:border-ds-primary/50"
                  />
                </div>
              </div>

              {/* Child Nodes (Only for Group) */}
              {selectedNode.type === 'group' && (
                <div className="space-y-2">
                  <label className="text-xs text-ds-text-muted">{t('Child Nodes', 'العناصر الفرعية')}</label>
                  <div className="space-y-1 max-h-32 overflow-auto">
                    {nodes.filter((n) => n.id !== selectedNodeId && n.type !== 'group').map((node) => (
                      <label key={node.id} className="flex items-center gap-2 text-xs text-ds-text-primary">
                        <input
                          type="checkbox"
                          checked={(selectedNode.childNodeIds || []).includes(node.id)}
                          onChange={(e) => {
                            const checked = e.target.checked
                            setNodes(nodes.map((n) => 
                              n.id === selectedNodeId 
                                ? { ...n, childNodeIds: checked ? [...(n.childNodeIds || []), node.id] : (n.childNodeIds || []).filter((id) => id !== node.id) } 
                                : n
                            ))
                          }}
                          className="rounded border-ds-border bg-ds-background text-ds-primary"
                        />
                        {node.title}
                      </label>
                    ))}
                    {nodes.filter((n) => n.id !== selectedNodeId && n.type !== 'group').length === 0 && (
                      <div className="text-xs text-ds-text-muted text-center py-2">{t('No nodes available to group.', 'مفيش عناصر ينفع تتجمع.')}</div>
                    )}
                  </div>
                </div>
              )}

              {/* Notes */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs text-ds-text-muted">{t('Notes', 'ملاحظات')}</label>
                  <button
                    onClick={() => {
                      const note = prompt(t('Enter note:', 'اكتب ملاحظة:'))
                      if (note) {
                        setNodes(nodes.map((n) => n.id === selectedNodeId ? { ...n, notes: [...(n.notes || []), note] } : n))
                      }
                    }}
                    className="text-[10px] text-ds-primary hover:text-ds-primary-hover"
                  >
                    + {t('Add Note', 'إضافة ملاحظة')}
                  </button>
                </div>
                <div className="space-y-1 max-h-32 overflow-auto">
                  {(selectedNode.notes || []).map((note, idx) => (
                    <div key={idx} className="text-xs text-ds-text-primary bg-ds-background p-2 rounded-lg border border-ds-border">
                      {note}
                    </div>
                  ))}
                  {(selectedNode.notes || []).length === 0 && (
                    <div className="text-xs text-ds-text-muted text-center py-2">{t('No notes yet.', 'مفيش ملاحظات لسه.')}</div>
                  )}
                </div>
              </div>

              {/* Attachments */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs text-ds-text-muted">{t('Attachments', 'المرفقات')}</label>
                  <button
                    onClick={() => {
                      const url = prompt(t('Enter URL or file name:', 'اكتب رابط أو اسم الملف:'))
                      if (url) {
                        setNodes(nodes.map((n) => n.id === selectedNodeId ? { ...n, attachments: [...(n.attachments || []), url] } : n))
                      }
                    }}
                    className="text-[10px] text-ds-primary hover:text-ds-primary-hover"
                  >
                    + {t('Add', 'إضافة')}
                  </button>
                </div>
                <div className="space-y-1 max-h-32 overflow-auto">
                  {(selectedNode.attachments || []).map((att, idx) => (
                    <div key={idx} className="text-xs text-ds-text-primary bg-ds-background p-2 rounded-lg border border-ds-border flex items-center gap-2">
                      <ImageIcon size={12} className="text-ds-text-muted" />
                      <span className="truncate flex-1">{att}</span>
                    </div>
                  ))}
                  {(selectedNode.attachments || []).length === 0 && (
                    <div className="text-xs text-ds-text-muted text-center py-2">{t('No attachments yet.', 'مفيش مرفقات لسه.')}</div>
                  )}
                </div>
              </div>

              {/* Connections */}
              <div className="space-y-2">
                <label className="text-xs text-ds-text-muted">{t('Connections', 'التوصيلات')}</label>
                <div className="flex gap-2">
                  <select
                    id="new-connection-target"
                    className="flex-1 bg-white/[0.03] border border-ds-border rounded-lg px-2 py-1 text-xs text-ds-text-primary focus:outline-none focus:border-ds-primary/50"
                  >
                    <option value="">{t('Select Target...', 'اختر الهدف...')}</option>
                    {nodes.filter((n) => n.id !== selectedNodeId).map((n) => (
                      <option key={n.id} value={n.id}>{n.title}</option>
                    ))}
                  </select>
                  <select
                    id="new-connection-type"
                    className="w-20 bg-white/[0.03] border border-ds-border rounded-lg px-2 py-1 text-xs text-ds-text-primary focus:outline-none focus:border-ds-primary/50"
                  >
                    <option value="out">{t('Out', 'خارج')}</option>
                    <option value="in">{t('In', 'داخل')}</option>
                    <option value="both">{t('Both', 'الاثنين')}</option>
                  </select>
                  <button
                    onClick={() => {
                      const targetSelect = document.getElementById('new-connection-target') as HTMLSelectElement
                      const typeSelect = document.getElementById('new-connection-type') as HTMLSelectElement
                      const targetId = targetSelect.value
                      const type = typeSelect.value as 'in' | 'out' | 'both'
                      if (targetId) {
                        setConnections([...connections, {
                          id: Math.random().toString(36).substring(2, 9),
                          fromId: selectedNodeId,
                          toId: targetId,
                          type
                        }])
                      }
                    }}
                    className="px-2 py-1 bg-ds-primary text-white rounded-lg text-xs font-medium hover:bg-ds-primary/90 transition-colors"
                  >
                    {t('Add', 'إضافة')}
                  </button>
                </div>
                <div className="space-y-1 max-h-32 overflow-auto mt-2">
                  {connections.filter((c) => c.fromId === selectedNodeId || c.toId === selectedNodeId).map((c) => {
                    const isFrom = c.fromId === selectedNodeId
                    const otherId = isFrom ? c.toId : c.fromId
                    const otherNode = nodes.find((n) => n.id === otherId)
                    return (
                      <div key={c.id} className="text-xs text-ds-text-primary bg-white/[0.02] p-2 rounded-lg border border-ds-border flex justify-between items-center">
                        <span>{otherNode?.title || otherId}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${c.type === 'out' ? 'bg-ds-success/20 text-ds-success' : c.type === 'in' ? 'bg-ds-primary-subtle text-ds-primary' : 'bg-ds-primary/20 text-ds-primary'}`}>
                          {c.type.toUpperCase()}
                        </span>
                      </div>
                    )
                  })}
                  {connections.filter((c) => c.fromId === selectedNodeId || c.toId === selectedNodeId).length === 0 && (
                    <div className="text-xs text-ds-text-muted text-center py-2">{t('No connections yet.', 'مفيش توصيلات لسه.')}</div>
                  )}
                </div>
              </div>
            </div>
          )
        })()}
      </div>

      {contextMenu && contextMenu.visible && (
        <div 
          className="absolute bg-ds-surface border border-ds-border rounded-lg shadow-2xl z-[200] py-1 w-40"
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onClick={(e) => e.stopPropagation()}
        >
          <button 
            onClick={() => {
              const newName = prompt(t('Enter new name:', 'اكتب الاسم الجديد:'))
              if (newName) {
                setNodes(nodes.map((n) => n.id === contextMenu.nodeId ? { ...n, title: newName } : n))
              }
              setContextMenu(null)
            }}
            className={`w-full ${lang === 'ar' ? 'text-end' : 'text-start'} px-3 py-1.5 text-xs text-ds-text-primary hover:bg-ds-primary/20 transition-colors`}
          >
            {t('Rename', 'تغيير الاسم')}
          </button>
          <button 
            onClick={() => {
              setNodes(nodes.map((n) => n.id === contextMenu.nodeId ? { ...n, locked: !n.locked } : n))
              setContextMenu(null)
            }}
            className={`w-full ${lang === 'ar' ? 'text-end' : 'text-start'} px-3 py-1.5 text-xs text-ds-text-primary hover:bg-ds-primary/20 transition-colors`}
          >
            {nodes.find((n) => n.id === contextMenu.nodeId)?.locked ? t('Unlock', 'فك القفل') : t('Lock', 'قفل')}
          </button>
          {nodes.find((n) => n.id === contextMenu.nodeId)?.type === 'group' && (
            <button 
              onClick={() => {
                setNodes(nodes.filter((n) => n.id !== contextMenu.nodeId))
                setContextMenu(null)
              }}
              className="w-full text-start px-3 py-1.5 text-xs text-ds-text-primary hover:bg-ds-primary-subtle transition-colors"
            >
              Ungroup
            </button>
          )}
          <button 
            onClick={() => {
              setNodes(nodes.filter((n) => n.id !== contextMenu.nodeId))
              setConnections(connections.filter((c) => c.fromId !== contextMenu.nodeId && c.toId !== contextMenu.nodeId))
              setContextMenu(null)
            }}
            className="w-full text-start px-3 py-1.5 text-xs text-red-500 hover:bg-red-500/10 transition-colors"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  )
}
