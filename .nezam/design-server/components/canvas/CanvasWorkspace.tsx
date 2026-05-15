'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useSessionStore } from '@/lib/store/session.store'
import { Plus, Trash2, Pencil, Eraser, MousePointer, Image as ImageIcon, Type, AlignLeft, AlignCenter, AlignRight, AlignVerticalJustifyStart, AlignVerticalJustifyCenter, AlignVerticalJustifyEnd, Globe, Smartphone, Database, Server, FileText } from 'lucide-react'

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
  const { sitemap, lang } = useSessionStore()
  const t = (en: string, ar: string) => (lang === 'ar' ? ar : en)

  const [nodes, setNodes] = useState<Node[]>([
    { id: '1', title: 'Home', type: 'page', x: 100, y: 100 },
    { id: '2', title: 'About', type: 'page', x: 300, y: 200 },
  ])
  const [paths, setPaths] = useState<Path[]>([])
  const [currentPath, setCurrentPath] = useState<Path | null>(null)
  const [tool, setTool] = useState<'select' | 'pen' | 'eraser' | 'text'>('select')
  const [isDrawing, setIsDrawing] = useState(false)
  const [isDraggingNode, setIsDraggingNode] = useState<string | null>(null)
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [connections, setConnections] = useState<Connection[]>([])
  
  const [contextMenu, setContextMenu] = useState<{ x: number, y: number, visible: boolean, nodeId: string } | null>(null)
  const [selectedNodeIds, setSelectedNodeIds] = useState<string[]>([])
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isSpacePressed, setIsSpacePressed] = useState(false)
  const [isPanning, setIsPanning] = useState(false)
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 })

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
    const handleCloseMenu = () => setContextMenu(null)
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
      const avgMiddle = selectedNodes.reduce((acc, n) => acc + n.y + 30, 0) / selectedNodes.length
      setNodes(nodes.map((n) => selectedNodeIds.includes(n.id) ? { ...n, y: avgMiddle - 30 } : n))
    }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (tool === 'text' && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left - pan.x
      const y = e.clientY - rect.top - pan.y
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
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
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
      const x = e.clientX - rect.left - pan.x
      const y = e.clientY - rect.top - pan.y
      setCurrentPath({
        ...currentPath,
        points: [...currentPath.points, { x, y }],
      })
    }
    
    if (isDraggingNode && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left - pan.x
      const y = e.clientY - rect.top - pan.y
      
      const draggedNode = nodes.find((n) => n.id === isDraggingNode)
      if (draggedNode) {
        const dx = (x - 50) - draggedNode.x
        const dy = (y - 25) - draggedNode.y
        
        setNodes(
          nodes.map((n) => {
            if (n.id === isDraggingNode) {
              return { ...n, x: x - 50, y: y - 25 }
            }
            if (draggedNode.type === 'group' && draggedNode.childNodeIds?.includes(n.id)) {
              return { ...n, x: n.x + dx, y: n.y + dy }
            }
            return n
          })
        )
      }
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
  }

  const addNode = (type: 'page' | 'application' | 'service' | 'group', subType?: string) => {
    setNodes([
      ...nodes,
      {
        id: Math.random().toString(36).substring(2, 9),
        title: subType ? `${subType.charAt(0).toUpperCase() + subType.slice(1)}` : `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
        type,
        subType,
        x: 200,
        y: 200,
      },
    ])
  }

  return (
    <div className="p-6 space-y-6 text-ds-text-primary h-full flex flex-col">
      <div className="flex justify-between items-center bg-ds-surface backdrop-blur-md border border-ds-border p-3 rounded-2xl shadow-2xl shrink-0">
        <div className="flex items-center gap-2">
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
          <div className="relative group">
            <button className="px-3 py-1.5 bg-ds-primary text-white rounded-lg text-xs font-medium hover:bg-[#e04c00] transition-colors flex items-center gap-1">
              <Plus size={14} /> {t('App', 'تطبيق')}
            </button>
            <div className={`absolute start-0 mt-1 w-32 bg-ds-surface border border-ds-border rounded-lg shadow-xl hidden group-hover:block z-50 ${lang === 'ar' ? 'end-0 start-auto' : 'start-0'}`}>
              <button onClick={() => addNode('application', 'web')} className={`w-full ${lang === 'ar' ? 'text-end' : 'text-start'} px-3 py-2 text-xs text-ds-text-muted hover:text-ds-text-primary hover:bg-ds-primary/20`}>{t('Web App', 'تطبيق ويب')}</button>
              <button onClick={() => addNode('application', 'mobile')} className={`w-full ${lang === 'ar' ? 'text-end' : 'text-start'} px-3 py-2 text-xs text-ds-text-muted hover:text-ds-text-primary hover:bg-ds-primary/20`}>{t('Mobile App', 'تطبيق موبايل')}</button>
            </div>
          </div>

          {/* Add Service Dropdown */}
          <div className="relative group">
            <button className="px-3 py-1.5 bg-ds-primary text-white rounded-lg text-xs font-medium hover:bg-[#e04c00] transition-colors flex items-center gap-1">
              <Plus size={14} /> {t('Service', 'خدمة')}
            </button>
            <div className={`absolute start-0 mt-1 w-40 bg-ds-surface border border-ds-border rounded-lg shadow-xl hidden group-hover:block z-50 max-h-48 overflow-auto ${lang === 'ar' ? 'end-0 start-auto' : 'start-0'}`}>
              {['database', 'cache', 'storage', 'cdn', 'mail', 'CRM', 'AI LLM', 'automation', 'ai agent'].map((srv) => (
                <button key={srv} onClick={() => addNode('service', srv)} className={`w-full ${lang === 'ar' ? 'text-end' : 'text-start'} px-3 py-2 text-xs text-ds-text-muted hover:text-ds-text-primary hover:bg-ds-primary/20`}>{srv.charAt(0).toUpperCase() + srv.slice(1)}</button>
              ))}
            </div>
          </div>

          {/* Create Page Button */}
          <button
            onClick={() => addNode('page')}
            className="px-3 py-1.5 bg-[#27a644] text-white rounded-lg text-xs font-medium hover:bg-[#208a37] transition-colors flex items-center gap-1"
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
            className="px-3 py-1.5 bg-ds-primary text-white rounded-lg text-xs font-medium hover:bg-[#e04c00] transition-colors flex items-center gap-1"
          >
            <Plus size={14} /> Group
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

      <div className="flex-1 flex gap-6 min-h-0">
        <div
          ref={canvasRef}
          className={`flex-1 bg-ds-background border border-ds-border rounded-2xl relative overflow-hidden ${tool === 'pen' ? 'cursor-crosshair' : 'cursor-default'}`}
          style={{
            backgroundImage: 'radial-gradient(rgba(138, 143, 152, 0.2) 1.5px, transparent 1.5px)',
            backgroundSize: '20px 20px',
          }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          className="absolute inset-0"
          style={{ transform: `translate(${pan.x}px, ${pan.y}px)` }}
        >
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {/* Draw lines for groups */}
          {nodes.filter((n) => n.type === 'group' && n.childNodeIds).flatMap((group) => 
            group.childNodeIds!.map((childId) => {
              const child = nodes.find((n) => n.id === childId)
              if (!child) return null
              return (
                <line
                  key={`${group.id}-${child.id}`}
                  x1={group.x + 64}
                  y1={group.y + 25}
                  x2={child.x + 64}
                  y2={child.y + 25}
                  stroke="var(--ds-primary)"
                  strokeWidth={1}
                  strokeDasharray="4,4"
                />
              )
            })
          )}

          {/* Draw connections */}
          {connections.map((conn) => {
            const fromNode = nodes.find((n) => n.id === conn.fromId)
            const toNode = nodes.find((n) => n.id === conn.toId)
            if (!fromNode || !toNode) return null

            const x1 = fromNode.x + 64
            const y1 = fromNode.y + 25
            const x2 = toNode.x + 64
            const y2 = toNode.y + 25

            return (
              <g key={conn.id}>
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={conn.type === 'out' ? '#27a644' : conn.type === 'in' ? '#7c3aed' : '#FF5701'}
                  strokeWidth={2}
                  strokeDasharray="5,5"
                >
                  {conn.type !== 'both' && (
                    <animate
                      attributeName="stroke-dashoffset"
                      from="0"
                      to={conn.type === 'out' ? '-10' : '10'}
                      dur="1s"
                      repeatCount="indefinite"
                    />
                  )}
                </line>
                {/* Direction indicators */}
                {conn.type === 'out' && <circle cx={x2} cy={y2} r={4} fill="#27a644" />}
                {conn.type === 'in' && <circle cx={x1} cy={y1} r={4} fill="#7c3aed" />}
                {conn.type === 'both' && (
                  <>
                    <circle cx={x1} cy={y1} r={4} fill="var(--ds-primary)" />
                    <circle cx={x2} cy={y2} r={4} fill="var(--ds-primary)" />
                  </>
                )}
              </g>
            )
          })}
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
            className={`absolute ${node.isText ? 'p-1' : 'w-32 bg-ds-surface/80 backdrop-blur-md border border-ds-border p-3 rounded-xl shadow-lg'} cursor-pointer transition-shadow hover:shadow-2xl ${
              isDraggingNode === node.id ? 'border-ds-primary shadow-[#FF5701]/20' : ''
            }`}
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
            {node.isText ? (
              <div className="text-sm text-ds-text-primary font-medium">{node.title}</div>
            ) : (
              <div className="flex items-start gap-2">
                <div className="mt-0.5 text-ds-primary">
                  {node.type === 'page' && <FileText size={14} />}
                  {node.type === 'application' && (node.subType === 'mobile' ? <Smartphone size={14} /> : <Globe size={14} />)}
                  {node.type === 'service' && (node.subType === 'database' ? <Database size={14} /> : <Server size={14} />)}
                  {node.type === 'group' && <Plus size={14} />}
                </div>
                <div>
                  <div className="text-xs font-semibold text-ds-text-primary mb-1">{node.title}</div>
                  <div className="text-[10px] text-ds-text-muted">
                    {node.subType ? node.subType.charAt(0).toUpperCase() + node.subType.slice(1) : node.type.charAt(0).toUpperCase() + node.type.slice(1)}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
          </div>
        </div>

        {/* Side Panel */}
        {selectedNodeId && (() => {
          const selectedNode = nodes.find((n) => n.id === selectedNodeId)
          if (!selectedNode) return null
          
          return (
            <div className="w-80 bg-ds-surface border border-ds-border p-4 rounded-2xl shadow-2xl flex flex-col gap-4 overflow-auto">
              <div className="flex justify-between items-center border-b border-ds-border pb-2">
                <div>
                  <h3 className="font-semibold text-ds-text-primary">{selectedNode.title}</h3>
                  <p className="text-[10px] text-ds-text-muted">{selectedNode.type.toUpperCase()}</p>
                </div>
                <button onClick={() => setSelectedNodeId(null)} className="text-ds-text-muted hover:text-ds-text-primary">✕</button>
              </div>

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
                    className="text-[10px] text-ds-primary hover:text-[#e04e00]"
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
                    className="text-[10px] text-ds-primary hover:text-[#e04e00]"
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
                    className="flex-1 bg-white/[0.03] border border-ds-border rounded-lg px-2 py-1 text-xs text-ds-text-primary focus:outline-none focus:border-[#7c3aed]/50"
                  >
                    <option value="">{t('Select Target...', 'اختر الهدف...')}</option>
                    {nodes.filter((n) => n.id !== selectedNodeId).map((n) => (
                      <option key={n.id} value={n.id}>{n.title}</option>
                    ))}
                  </select>
                  <select
                    id="new-connection-type"
                    className="w-20 bg-white/[0.03] border border-ds-border rounded-lg px-2 py-1 text-xs text-ds-text-primary focus:outline-none focus:border-[#7c3aed]/50"
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
                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${c.type === 'out' ? 'bg-[#27a644]/20 text-[#27a644]' : c.type === 'in' ? 'bg-[#7c3aed]/20 text-[#7c3aed]' : 'bg-ds-primary/20 text-ds-primary'}`}>
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
          className="absolute bg-ds-surface border border-ds-border rounded-lg shadow-2xl z-50 py-1 w-40"
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
              className="w-full text-start px-3 py-1.5 text-xs text-ds-text-primary hover:bg-[#7c3aed]/20 transition-colors"
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
