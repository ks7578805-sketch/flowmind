import { useState, useRef, useCallback, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';

// Visual config per node type
const NODE_STYLES = {
  center:    { bg: '#1a0505', border: '#e53e3e', glow: 'rgba(229,62,62,0.8)', w: 220, h: 110 },
  branch:    { bg: '#0d1117', border: '#ff6b00', glow: 'rgba(255,107,0,0.6)', w: 180, h: 70 },
  leaf:      { bg: '#0d0d0d', border: '#6b7280', glow: 'rgba(107,114,128,0.4)', w: 160, h: 60 },
  highlight: { bg: '#1a0a0a', border: '#e53e3e', glow: 'rgba(229,62,62,0.7)', w: 180, h: 70 },
  title:     { bg: '#0d0d20', border: '#6366f1', glow: 'rgba(99,102,241,0.6)', w: 200, h: 50 },
  text:      { bg: '#0a0a0a', border: '#52525b', glow: 'rgba(82,82,91,0.4)', w: 200, h: 70 },
  block:     { bg: '#0a100a', border: '#22c55e', glow: 'rgba(34,197,94,0.5)', w: 200, h: 90 },
  image:     { bg: '#0a0a1a', border: '#3b82f6', glow: 'rgba(59,130,246,0.6)', w: 200, h: 130 },
  icon:      { bg: '#1a0a1a', border: '#a855f7', glow: 'rgba(168,85,247,0.6)', w: 80,  h: 80 },
  audio:     { bg: '#0a1a0a', border: '#10b981', glow: 'rgba(16,185,129,0.5)', w: 200, h: 60 },
  video:     { bg: '#1a0a00', border: '#f97316', glow: 'rgba(249,115,22,0.6)', w: 220, h: 130 },
  ai_text:   { bg: '#0d0a1a', border: '#8b5cf6', glow: 'rgba(139,92,246,0.7)', w: 200, h: 70 },
};

function getStyle(node) {
  const base = NODE_STYLES[node.element_type] || NODE_STYLES[node.type] || NODE_STYLES.leaf;
  if (node.custom_color) {
    return { ...base, border: node.custom_color, glow: node.custom_color + '99' };
  }
  return base;
}

function NodeContent({ node, style }) {
  const type = node.element_type || node.type;
  const w = style.w;
  const h = style.h;
  const px = 12;
  const x = node.x - w / 2 + px;
  const cy = node.y;

  if (type === 'image') {
    return (
      <g>
        <rect x={node.x - w/2 + 8} y={node.y - h/2 + 8} width={w - 16} height={h - 32} rx={6} fill="#1a2a3a" stroke="#3b82f6" strokeWidth={1} opacity={0.7} />
        <text x={node.x} y={node.y - 4} textAnchor="middle" fontSize={18} fill="#3b82f6" opacity={0.7}>🖼️</text>
        <foreignObject x={x} y={node.y + h/2 - 26} width={w - px*2} height={20}>
          <div xmlns="http://www.w3.org/1999/xhtml" style={{ fontFamily: 'Inter', fontSize: 9, color: '#3b82f6', textAlign: 'center', userSelect: 'none' }}>Clique para adicionar imagem</div>
        </foreignObject>
      </g>
    );
  }
  if (type === 'video') {
    return (
      <g>
        <rect x={node.x - w/2 + 8} y={node.y - h/2 + 8} width={w - 16} height={h - 32} rx={6} fill="#1a0e00" stroke="#f97316" strokeWidth={1} opacity={0.7} />
        <text x={node.x} y={node.y - 4} textAnchor="middle" fontSize={20} fill="#f97316" opacity={0.8}>▶️</text>
        <foreignObject x={x} y={node.y + h/2 - 26} width={w - px*2} height={20}>
          <div xmlns="http://www.w3.org/1999/xhtml" style={{ fontFamily: 'Inter', fontSize: 9, color: '#f97316', textAlign: 'center', userSelect: 'none' }}>Clique para adicionar vídeo</div>
        </foreignObject>
      </g>
    );
  }
  if (type === 'audio') {
    return (
      <g>
        <text x={node.x - w/2 + 22} y={cy + 5} fontSize={14} fill="#10b981">🎵</text>
        <foreignObject x={node.x - w/2 + 40} y={cy - 15} width={w - 50} height={30}>
          <div xmlns="http://www.w3.org/1999/xhtml" style={{ fontFamily: 'Inter', fontSize: 10, color: '#10b981', fontWeight: 600, userSelect: 'none' }}>{node.title || 'Áudio'}</div>
        </foreignObject>
      </g>
    );
  }
  if (type === 'icon') {
    return (
      <text x={node.x} y={cy + 6} textAnchor="middle" fontSize={28} fill={style.border} opacity={0.9}>{node.icon || '⭐'}</text>
    );
  }
  if (type === 'title') {
    return (
      <foreignObject x={x} y={cy - h/2 + 8} width={w - px*2} height={h - 16}>
        <div xmlns="http://www.w3.org/1999/xhtml" style={{ fontFamily: 'Inter', fontSize: 14, fontWeight: 900, color: '#fff', letterSpacing: '0.02em', userSelect: 'none', lineHeight: 1.2 }}>{node.title || 'Título'}</div>
      </foreignObject>
    );
  }
  if (type === 'block') {
    return (
      <g>
        <rect x={node.x - w/2 + 8} y={node.y - h/2 + 8} width={3} height={h - 16} rx={1.5} fill="#22c55e" />
        <foreignObject x={x + 8} y={cy - h/2 + 10} width={w - px*2 - 12} height={h - 20}>
          <div xmlns="http://www.w3.org/1999/xhtml" style={{ fontFamily: 'Inter', fontSize: 10, color: '#d1fae5', userSelect: 'none', lineHeight: 1.4 }}>
            <div style={{ fontWeight: 700, marginBottom: 2 }}>{node.title || 'Bloco'}</div>
            {node.description && <div style={{ opacity: 0.7 }}>{node.description}</div>}
          </div>
        </foreignObject>
      </g>
    );
  }
  if (type === 'text' || type === 'ai_text') {
    return (
      <foreignObject x={x} y={cy - h/2 + 8} width={w - px*2} height={h - 16}>
        <div xmlns="http://www.w3.org/1999/xhtml" style={{ fontFamily: 'Inter', userSelect: 'none', lineHeight: 1.4 }}>
          {type === 'ai_text' && <div style={{ fontSize: 8, color: '#8b5cf6', fontWeight: 600, marginBottom: 2 }}>✨ IA</div>}
          <div style={{ fontSize: 10, color: '#e2e8f0' }}>{node.title || 'Texto'}</div>
          {node.description && <div style={{ fontSize: 9, color: '#888', marginTop: 2 }}>{node.description}</div>}
        </div>
      </foreignObject>
    );
  }

  // Default: center / branch / leaf / highlight
  const isCenter = node.type === 'center';
  return (
    <g>
      {node.icon && <text x={node.x - w/2 + 18} y={cy + 5} fontSize={12} fill={style.border} opacity={0.8}>{node.icon}</text>}
      <foreignObject x={node.icon ? x + 14 : x} y={cy - h/2 + 8} width={w - px*2 - (node.icon ? 14 : 0)} height={isCenter ? 60 : 38}>
        <div xmlns="http://www.w3.org/1999/xhtml" style={{ fontFamily: 'Inter', fontSize: isCenter ? 11 : 10, fontWeight: 700, color: '#fff', wordBreak: 'break-word', userSelect: 'none', lineHeight: 1.2, textAlign: isCenter ? 'center' : 'left' }}>
          {node.title}
        </div>
      </foreignObject>
      {node.description && (
        <foreignObject x={x} y={cy + (isCenter ? -12 : 14)} width={w - px*2} height={28}>
          <div xmlns="http://www.w3.org/1999/xhtml" style={{ fontFamily: 'Inter', fontSize: 9, color: '#888', userSelect: 'none', lineHeight: 1.3 }}>{node.description}</div>
        </foreignObject>
      )}
    </g>
  );
}

function Node3D({ node, isSelected, isConnecting, onMouseDown, onClick }) {
  const style = getStyle(node);
  const { w, h } = style;
  const depth = 6; // 3D depth offset

  return (
    <g onMouseDown={onMouseDown} onClick={onClick} style={{ cursor: 'grab' }}>
      {/* 3D shadow/depth layer */}
      <rect
        x={node.x - w/2 + depth} y={node.y - h/2 + depth}
        width={w} height={h} rx={10}
        fill="rgba(0,0,0,0.6)"
      />
      {/* Side face right */}
      <path
        d={`M ${node.x + w/2} ${node.y - h/2} L ${node.x + w/2 + depth} ${node.y - h/2 + depth} L ${node.x + w/2 + depth} ${node.y + h/2 + depth} L ${node.x + w/2} ${node.y + h/2} Z`}
        fill={style.border} opacity={0.15}
      />
      {/* Side face bottom */}
      <path
        d={`M ${node.x - w/2} ${node.y + h/2} L ${node.x - w/2 + depth} ${node.y + h/2 + depth} L ${node.x + w/2 + depth} ${node.y + h/2 + depth} L ${node.x + w/2} ${node.y + h/2} Z`}
        fill={style.border} opacity={0.1}
      />

      {/* Outer glow halo */}
      <rect
        x={node.x - w/2 - 5} y={node.y - h/2 - 5}
        width={w + 10} height={h + 10} rx={14}
        fill="none" stroke={style.border}
        strokeWidth={isSelected ? 3 : 1.5}
        opacity={isSelected ? 0.9 : isConnecting ? 0.6 : 0.3}
        style={{ filter: `blur(${isSelected ? 10 : 5}px)` }}
      />

      {/* Main face */}
      <rect
        x={node.x - w/2} y={node.y - h/2}
        width={w} height={h} rx={10}
        fill={style.bg}
        stroke={style.border}
        strokeWidth={isSelected ? 2.5 : 1.5}
        style={{
          filter: isSelected
            ? `drop-shadow(0 0 18px ${style.glow}) drop-shadow(0 0 6px ${style.border})`
            : `drop-shadow(0 0 8px ${style.glow})`
        }}
      />

      {/* Top highlight shimmer */}
      <rect
        x={node.x - w/2 + 4} y={node.y - h/2 + 2}
        width={w - 8} height={3} rx={2}
        fill="white" opacity={0.06}
      />

      {/* Inner content */}
      <NodeContent node={node} style={style} />

      {/* Connect indicator ring when connecting mode */}
      {isConnecting && (
        <circle cx={node.x} cy={node.y} r={Math.max(w, h) / 2 + 8}
          fill="none" stroke="#22c55e" strokeWidth={2} strokeDasharray="6 4" opacity={0.7}
          style={{ filter: 'drop-shadow(0 0 6px #22c55e)' }}
        />
      )}
    </g>
  );
}

function ConnectionLine({ from, to, conn, isSelected, onClick }) {
  if (!from || !to) return null;

  const fromStyle = getStyle(from);
  const toStyle = getStyle(to);

  const x1 = from.x + (to.x >= from.x ? fromStyle.w/2 : -fromStyle.w/2);
  const y1 = from.y;
  const x2 = to.x + (to.x >= from.x ? -toStyle.w/2 : toStyle.w/2);
  const y2 = to.y;
  const mx = (x1 + x2) / 2;
  const path = `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`;

  const color = conn?.custom_color || (from.custom_color || (from.type === 'center' ? '#e53e3e' : '#ff6b00'));

  const midX = (x1 + 3*mx/2 + x2) / 3.5;
  const midY = (y1 + y2) / 2;

  return (
    <g onClick={onClick} style={{ cursor: 'pointer' }}>
      {/* Invisible wider hit area */}
      <path d={path} fill="none" stroke="transparent" strokeWidth={16} />

      {/* Glow */}
      <path d={path} fill="none" stroke={color} strokeWidth={6} opacity={0.12} strokeLinecap="round" />
      {/* Main line */}
      <path d={path} fill="none" stroke={color} strokeWidth={isSelected ? 3 : 2}
        opacity={isSelected ? 1 : 0.8} strokeLinecap="round"
        style={{ filter: `drop-shadow(0 0 6px ${color}90)` }} />
      {/* Flow dash */}
      <path d={path} fill="none" stroke="white" strokeWidth={1} opacity={0.3}
        strokeDasharray="8 8" className="flow-line" strokeLinecap="round" />
      {/* Arrow head */}
      <circle cx={x2} cy={y2} r={4} fill={color} opacity={0.95}
        style={{ filter: `drop-shadow(0 0 4px ${color})` }} />

      {/* Delete button at midpoint when selected */}
      {isSelected && (
        <g>
          <circle cx={midX} cy={midY} r={12} fill="#1a1a1a" stroke="#e53e3e" strokeWidth={1.5}
            style={{ filter: 'drop-shadow(0 0 8px rgba(229,62,62,0.6))' }} />
          <text x={midX} y={midY + 4} textAnchor="middle" fontSize={12} fill="#e53e3e">🗑</text>
        </g>
      )}
    </g>
  );
}

export default function MapCanvas({
  nodes, connections, onSelectNode, selectedNodeId, onDropNode, onNodeMove,
  onAddConnection, onDeleteConnection, svgRef: externalSvgRef
}) {
  const [expandedIds, setExpandedIds] = useState(new Set(['root']));
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState(null);
  const [draggingNodeId, setDraggingNodeId] = useState(null);
  const [dragNodeOffset, setDragNodeOffset] = useState(null);
  const [connectingFromId, setConnectingFromId] = useState(null); // manual connection mode
  const [selectedConnIdx, setSelectedConnIdx] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const svgRef = useRef(null);
  const containerRef = useRef(null);

  // expose svgRef to parent for export
  useEffect(() => {
    if (externalSvgRef) externalSvgRef.current = svgRef.current;
  }, [externalSvgRef]);

  // ESC to cancel connecting
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') { setConnectingFromId(null); setSelectedConnIdx(null); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    setExpandedIds(new Set(nodes.map(n => n.id)));
  }, [nodes.length]);

  const screenToCanvas = useCallback((clientX, clientY) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return { x: 500, y: 350 };
    return {
      x: (clientX - rect.left - transform.x) / transform.scale,
      y: (clientY - rect.top - transform.y) / transform.scale,
    };
  }, [transform]);

  const findNodeAtPos = useCallback((canvasX, canvasY) => {
    for (let i = nodes.length - 1; i >= 0; i--) {
      const node = nodes[i];
      const style = getStyle(node);
      const { w, h } = style;
      if (canvasX >= node.x - w/2 && canvasX <= node.x + w/2 &&
          canvasY >= node.y - h/2 && canvasY <= node.y + h/2) {
        return node;
      }
    }
    return null;
  }, [nodes]);

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY * -0.001;
    setTransform(prev => ({ ...prev, scale: Math.max(0.3, Math.min(2.5, prev.scale + delta)) }));
  };

  const handleMouseDown = (e) => {
    // Ignore right-click
    if (e.button !== 0) return;

    const pos = screenToCanvas(e.clientX, e.clientY);
    const node = findNodeAtPos(pos.x, pos.y);

    if (node) {
      if (connectingFromId) {
        // Complete the connection
        if (connectingFromId !== node.id) {
          onAddConnection?.(connectingFromId, node.id);
        }
        setConnectingFromId(null);
        return;
      }
      setDraggingNodeId(node.id);
      setDragNodeOffset({ dx: pos.x - node.x, dy: pos.y - node.y });
      e.stopPropagation();
      return;
    }

    // Clicked empty space
    if (connectingFromId) {
      setConnectingFromId(null);
      return;
    }
    setSelectedConnIdx(null);
    setIsPanning(true);
    setPanStart({ x: e.clientX - transform.x, y: e.clientY - transform.y });
  };

  const handleMouseMove = (e) => {
    const pos = screenToCanvas(e.clientX, e.clientY);
    setMousePos(pos);
    if (draggingNodeId) {
      onNodeMove?.(draggingNodeId, pos.x - dragNodeOffset.dx, pos.y - dragNodeOffset.dy);
      return;
    }
    if (isPanning && panStart) {
      setTransform(prev => ({ ...prev, x: e.clientX - panStart.x, y: e.clientY - panStart.y }));
    }
  };

  const handleMouseUp = () => {
    setDraggingNodeId(null);
    setDragNodeOffset(null);
    setIsPanning(false);
    setPanStart(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('elementType');
    if (!type) return;
    const pos = screenToCanvas(e.clientX, e.clientY);
    onDropNode?.(type, pos.x, pos.y);
  };

  const handleDragOver = (e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'copy'; };

  const nodeMap = Object.fromEntries(nodes.map(n => [n.id, n]));
  const visibleNodes = nodes.filter(n => expandedIds.has(n.id));

  return (
    <div
      ref={containerRef}
      className="w-full h-full bg-[#080808] relative overflow-hidden"
      style={{ cursor: connectingFromId ? 'crosshair' : draggingNodeId ? 'grabbing' : isPanning ? 'grabbing' : 'default' }}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      {/* Grid */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.1 }}>
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#333" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      <svg
        ref={svgRef}
        className="w-full h-full"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ userSelect: 'none' }}
      >
        <rect width="100%" height="100%" fill="transparent" />
        <g transform={`translate(${transform.x}, ${transform.y}) scale(${transform.scale})`}>
          {/* Connections */}
          {connections.map((conn, i) => (
            <ConnectionLine
              key={i}
              from={nodeMap[conn.from]}
              to={nodeMap[conn.to]}
              conn={conn}
              isSelected={selectedConnIdx === i}
              onClick={(e) => {
                e.stopPropagation();
                if (selectedConnIdx === i) {
                  // Delete on second click
                  onDeleteConnection?.(i);
                  setSelectedConnIdx(null);
                } else {
                  setSelectedConnIdx(i);
                }
              }}
            />
          ))}

          {/* Live connection line while connecting */}
          {connectingFromId && nodeMap[connectingFromId] && (
            <line
              x1={nodeMap[connectingFromId].x}
              y1={nodeMap[connectingFromId].y}
              x2={mousePos.x}
              y2={mousePos.y}
              stroke="#22c55e"
              strokeWidth={2}
              strokeDasharray="6 4"
              opacity={0.8}
              style={{ filter: 'drop-shadow(0 0 4px #22c55e)' }}
            />
          )}

          {/* Nodes */}
          {visibleNodes.map(node => (
            <Node3D
              key={node.id}
              node={node}
              isSelected={selectedNodeId === node.id}
              isConnecting={connectingFromId !== null && connectingFromId !== node.id}
              onMouseDown={(e) => {
                e.stopPropagation();
                const pos = screenToCanvas(e.clientX, e.clientY);
                if (connectingFromId) {
                  if (connectingFromId !== node.id) onAddConnection?.(connectingFromId, node.id);
                  setConnectingFromId(null);
                } else {
                  setDraggingNodeId(node.id);
                  setDragNodeOffset({ dx: pos.x - node.x, dy: pos.y - node.y });
                }
              }}
              onClick={(e) => {
                e.stopPropagation();
                if (!draggingNodeId) {
                  onSelectNode(node);
                  setSelectedConnIdx(null);
                }
              }}
            />
          ))}
        </g>
      </svg>

      {/* Connect mode banner */}
      {connectingFromId && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-green-900/90 border border-green-500/50 rounded-lg px-4 py-2 text-xs text-green-300 flex items-center gap-2 pointer-events-none">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          Clique em outro bloco para conectar • ESC para cancelar
        </div>
      )}

      {/* Selected connection hint */}
      {selectedConnIdx !== null && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-red-900/90 border border-red-500/50 rounded-lg px-4 py-2 text-xs text-red-300 flex items-center gap-2">
          <Trash2 className="w-3 h-3" />
          Clique na linha novamente para deletar
          <button onClick={() => setSelectedConnIdx(null)} className="ml-2 text-white/50 hover:text-white">✕</button>
        </div>
      )}

      {/* Zoom controls */}
      <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-black/70 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-muted-foreground">
        <button onClick={() => setTransform(p => ({ ...p, scale: Math.max(0.3, p.scale - 0.1) }))} className="hover:text-white">−</button>
        <span>{Math.round(transform.scale * 100)}%</span>
        <button onClick={() => setTransform(p => ({ ...p, scale: Math.min(2.5, p.scale + 0.1) }))} className="hover:text-white">+</button>
        <button onClick={() => setTransform({ x: 0, y: 0, scale: 1 })} className="hover:text-white ml-1">↺</button>
      </div>

      {/* Connect mode button */}
      <div className="absolute bottom-4 right-4">
        {selectedNodeId && !connectingFromId && (
          <button
            onClick={() => setConnectingFromId(selectedNodeId)}
            className="flex items-center gap-2 px-3 py-1.5 bg-green-900/80 border border-green-500/50 rounded-lg text-xs text-green-300 hover:bg-green-900 transition-colors"
          >
            <Plus className="w-3 h-3" />
            Conectar a outro bloco
          </button>
        )}
        {connectingFromId && (
          <button
            onClick={() => setConnectingFromId(null)}
            className="flex items-center gap-2 px-3 py-1.5 bg-red-900/80 border border-red-500/50 rounded-lg text-xs text-red-300 hover:bg-red-900 transition-colors"
          >
            ✕ Cancelar conexão
          </button>
        )}
      </div>

      {nodes.length <= 1 && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/80 border border-primary/30 rounded-lg px-4 py-2 text-xs text-white/70 flex items-center gap-2 pointer-events-none">
          <Plus className="w-3 h-3 text-primary" />
          Arraste elementos do painel esquerdo para o canvas
        </div>
      )}
    </div>
  );
}