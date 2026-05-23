import { useState, useRef, useCallback, useEffect } from 'react';
import { Plus, Type, Image, Heading1, AlignLeft, Volume2, Video, Star } from 'lucide-react';

// Visual config per node type
const NODE_STYLES = {
  center: { bg: '#1a0505', border: '#e53e3e', glow: 'rgba(229,62,62,0.6)', w: 220, h: 110 },
  branch: { bg: '#0d1117', border: '#ff6b00', glow: 'rgba(255,107,0,0.4)', w: 180, h: 70 },
  leaf:   { bg: '#0d0d0d', border: '#4a4a4a', glow: 'rgba(74,74,74,0.3)', w: 160, h: 60 },
  highlight: { bg: '#1a0a0a', border: '#e53e3e', glow: 'rgba(229,62,62,0.5)', w: 180, h: 70 },
  // element types
  title:   { bg: '#0d0d20', border: '#6366f1', glow: 'rgba(99,102,241,0.4)', w: 200, h: 50 },
  text:    { bg: '#0a0a0a', border: '#3f3f46', glow: 'rgba(63,63,70,0.3)', w: 200, h: 70 },
  block:   { bg: '#0a100a', border: '#22c55e', glow: 'rgba(34,197,94,0.3)', w: 200, h: 90 },
  image:   { bg: '#0a0a1a', border: '#3b82f6', glow: 'rgba(59,130,246,0.4)', w: 200, h: 130 },
  icon:    { bg: '#1a0a1a', border: '#a855f7', glow: 'rgba(168,85,247,0.4)', w: 80,  h: 80 },
  audio:   { bg: '#0a1a0a', border: '#10b981', glow: 'rgba(16,185,129,0.3)', w: 200, h: 60 },
  video:   { bg: '#1a0a00', border: '#f97316', glow: 'rgba(249,115,22,0.4)', w: 220, h: 130 },
  ai_text: { bg: '#0d0a1a', border: '#8b5cf6', glow: 'rgba(139,92,246,0.5)', w: 200, h: 70 },
};

function getStyle(node) {
  return NODE_STYLES[node.element_type] || NODE_STYLES[node.type] || NODE_STYLES.leaf;
}

// Renders the inner content of a node based on its element_type
function NodeContent({ node, style }) {
  const type = node.element_type || node.type;
  const w = style.w;
  const h = style.h;
  const px = 10;
  const x = node.x - w / 2 + px;
  const cy = node.y;

  if (type === 'image') {
    return (
      <g>
        {/* image placeholder box */}
        <rect x={node.x - w/2 + 8} y={node.y - h/2 + 8} width={w - 16} height={h - 32}
          rx={6} fill="#1a2a3a" stroke="#3b82f6" strokeWidth={1} opacity={0.7} />
        {/* mountain icon */}
        <text x={node.x} y={node.y - 4} textAnchor="middle" fontSize={18} fill="#3b82f6" opacity={0.7}>🖼️</text>
        <foreignObject x={x} y={node.y + h/2 - 26} width={w - px*2} height={20}>
          <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 9, color: '#3b82f6', textAlign: 'center', userSelect: 'none' }}>
            Clique para adicionar imagem
          </div>
        </foreignObject>
      </g>
    );
  }

  if (type === 'video') {
    return (
      <g>
        <rect x={node.x - w/2 + 8} y={node.y - h/2 + 8} width={w - 16} height={h - 32}
          rx={6} fill="#1a0e00" stroke="#f97316" strokeWidth={1} opacity={0.7} />
        <text x={node.x} y={node.y - 4} textAnchor="middle" fontSize={20} fill="#f97316" opacity={0.8}>▶️</text>
        <foreignObject x={x} y={node.y + h/2 - 26} width={w - px*2} height={20}>
          <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 9, color: '#f97316', textAlign: 'center', userSelect: 'none' }}>
            Clique para adicionar vídeo
          </div>
        </foreignObject>
      </g>
    );
  }

  if (type === 'audio') {
    return (
      <g>
        <text x={node.x - w/2 + 22} y={cy + 5} fontSize={14} fill="#10b981">🎵</text>
        <foreignObject x={node.x - w/2 + 40} y={cy - 15} width={w - 50} height={30}>
          <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, color: '#10b981', fontWeight: 600, userSelect: 'none' }}>
            {node.title || 'Áudio'}
          </div>
        </foreignObject>
        {/* waveform decoration */}
        {[0,4,8,12,16,20,24,28,32].map((offset, i) => {
          const barH = [6,10,14,8,16,12,6,10,8][i];
          return <rect key={i} x={node.x - w/2 + 40 + offset} y={cy + 8 - barH/2} width={2} height={barH}
            rx={1} fill="#10b981" opacity={0.5} />;
        })}
      </g>
    );
  }

  if (type === 'icon') {
    return (
      <g>
        <text x={node.x} y={cy + 6} textAnchor="middle" fontSize={28} fill={style.border} opacity={0.9}>
          {node.icon || '⭐'}
        </text>
      </g>
    );
  }

  if (type === 'title') {
    return (
      <foreignObject x={x} y={cy - h/2 + 8} width={w - px*2} height={h - 16}>
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, fontWeight: 900, color: '#fff', letterSpacing: '0.02em', userSelect: 'none', lineHeight: 1.2 }}>
          {node.title || 'Título'}
        </div>
      </foreignObject>
    );
  }

  if (type === 'block') {
    return (
      <g>
        <rect x={node.x - w/2 + 8} y={node.y - h/2 + 8} width={3} height={h - 16} rx={1.5} fill="#22c55e" />
        <foreignObject x={x + 8} y={cy - h/2 + 10} width={w - px*2 - 12} height={h - 20}>
          <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, color: '#d1fae5', userSelect: 'none', lineHeight: 1.4 }}>
            <div style={{ fontWeight: 700, fontSize: 10, marginBottom: 2 }}>{node.title || 'Bloco'}</div>
            {node.description && <div style={{ opacity: 0.7 }}>{node.description}</div>}
          </div>
        </foreignObject>
      </g>
    );
  }

  if (type === 'text' || type === 'ai_text') {
    return (
      <foreignObject x={x} y={cy - h/2 + 8} width={w - px*2} height={h - 16}>
        <div style={{ fontFamily: 'Inter, sans-serif', userSelect: 'none', lineHeight: 1.4 }}>
          {type === 'ai_text' && (
            <div style={{ fontSize: 8, color: '#8b5cf6', fontWeight: 600, marginBottom: 2 }}>✨ IA</div>
          )}
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
      {node.icon && (
        <text x={node.x - w/2 + 18} y={cy + 5} fontSize={12} fill={style.border} opacity={0.8}>{node.icon}</text>
      )}
      <foreignObject x={node.icon ? x + 14 : x} y={cy - h/2 + 8} width={w - px*2 - (node.icon ? 14 : 0)} height={isCenter ? 60 : 38}>
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: isCenter ? 11 : 10, fontWeight: 700, color: '#fff',
          wordBreak: 'break-word', userSelect: 'none', lineHeight: 1.2, textAlign: isCenter ? 'center' : 'left' }}>
          {node.title}
        </div>
      </foreignObject>
      {node.description && (
        <foreignObject x={x} y={cy + (isCenter ? -12 : 14)} width={w - px*2} height={28}>
          <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 9, color: '#888', userSelect: 'none', lineHeight: 1.3 }}>
            {node.description}
          </div>
        </foreignObject>
      )}
    </g>
  );
}

function NodeComponent({ node, connections, expandedIds, onExpand, onSelect, selectedId }) {
  const style = getStyle(node);
  const { w, h } = style;
  const isSelected = selectedId === node.id;

  const childConnections = connections.filter(c => c.from === node.id);
  const hasHiddenChildren = childConnections.some(c => !expandedIds.has(c.to));

  return (
    <g>
      {/* Glow halo */}
      <rect
        x={node.x - w/2 - 4} y={node.y - h/2 - 4}
        width={w + 8} height={h + 8} rx={14}
        fill="none" stroke={style.border}
        strokeWidth={isSelected ? 2 : 1}
        opacity={isSelected ? 0.7 : 0.25}
        style={{ filter: `blur(${isSelected ? 8 : 4}px)` }}
      />

      {/* Main rect */}
      <rect
        x={node.x - w/2} y={node.y - h/2}
        width={w} height={h} rx={8}
        fill={style.bg} stroke={style.border}
        strokeWidth={isSelected ? 2 : 1}
        style={{ filter: isSelected ? `drop-shadow(0 0 12px ${style.glow})` : `drop-shadow(0 0 4px ${style.glow})` }}
        className="node-expanded"
      />

      {/* Inner content based on element type */}
      <NodeContent node={node} style={style} />

      {/* Invisible hit area — covers entire node for reliable drag + click */}
      <rect
        x={node.x - w/2} y={node.y - h/2}
        width={w} height={h} rx={8}
        fill="transparent"
        style={{ cursor: 'grab' }}
        onClick={() => onSelect(node)}
        data-nodeid={node.id}
      />

      {/* Expand button */}
      {hasHiddenChildren && (
        <g style={{ cursor: 'pointer' }} onClick={e => { e.stopPropagation(); onExpand(node.id); }}>
          <circle cx={node.x + w/2 + 12} cy={node.y} r={10} fill="#e53e3e" opacity={0.9}
            style={{ filter: 'drop-shadow(0 0 8px rgba(229,62,62,0.8))' }} />
          <text x={node.x + w/2 + 12} y={node.y + 4} textAnchor="middle" fontSize={12} fill="white" style={{ fontWeight: 'bold' }}>+</text>
        </g>
      )}
    </g>
  );
}

function ConnectionLine({ from, to, expandedIds }) {
  if (!from || !to || !expandedIds.has(to.id)) return null;

  const fromStyle = getStyle(from);
  const toStyle = getStyle(to);

  const x1 = from.x + (to.x > from.x ? fromStyle.w/2 : -fromStyle.w/2);
  const y1 = from.y;
  const x2 = to.x + (to.x > from.x ? -toStyle.w/2 : toStyle.w/2);
  const y2 = to.y;
  const mx = (x1 + x2) / 2;
  const path = `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`;

  const color = from.type === 'center' ? '#e53e3e' : '#ff6b00';

  return (
    <g>
      <path d={path} fill="none" stroke={color} strokeWidth={4} opacity={0.15} strokeLinecap="round" />
      <path d={path} fill="none" stroke={color} strokeWidth={from.type === 'center' ? 2 : 1.5}
        opacity={0.7} strokeLinecap="round"
        style={{ filter: `drop-shadow(0 0 4px ${color}80)` }} />
      <path d={path} fill="none" stroke="white" strokeWidth={1} opacity={0.25}
        strokeDasharray="6 6" className="flow-line" strokeLinecap="round" />
      <circle cx={x2} cy={y2} r={3} fill={color} opacity={0.9} />
    </g>
  );
}

export default function MapCanvas({ nodes, connections, onSelectNode, selectedNodeId, onDropNode, onNodeMove }) {
  const [expandedIds, setExpandedIds] = useState(new Set(['root']));
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState(null);
  const [draggingNodeId, setDraggingNodeId] = useState(null);
  const [dragNodeOffset, setDragNodeOffset] = useState(null);
  const svgRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    setExpandedIds(new Set(nodes.map(n => n.id)));
  }, [nodes.length]);

  const visibleNodes = nodes.filter(n => expandedIds.has(n.id));

  const handleExpand = useCallback((nodeId) => {
    const hidden = connections.filter(c => c.from === nodeId && !expandedIds.has(c.to)).map(c => c.to);
    if (hidden.length > 0) setExpandedIds(prev => new Set([...prev, hidden[0]]));
  }, [connections, expandedIds]);

  const screenToCanvas = (clientX, clientY) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return { x: 500, y: 350 };
    return {
      x: (clientX - rect.left - transform.x) / transform.scale,
      y: (clientY - rect.top - transform.y) / transform.scale,
    };
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY * -0.001;
    setTransform(prev => ({ ...prev, scale: Math.max(0.3, Math.min(2.5, prev.scale + delta)) }));
  };

  const findNodeAtPos = (canvasX, canvasY) => {
    // Search in reverse so top-rendered nodes (last in array) are hit first
    for (let i = nodes.length - 1; i >= 0; i--) {
      const node = nodes[i];
      const style = getStyle(node);
      const { w, h } = style;
      if (
        canvasX >= node.x - w / 2 &&
        canvasX <= node.x + w / 2 &&
        canvasY >= node.y - h / 2 &&
        canvasY <= node.y + h / 2
      ) {
        return node;
      }
    }
    return null;
  };

  const handleMouseDown = (e) => {
    const pos = screenToCanvas(e.clientX, e.clientY);
    const node = findNodeAtPos(pos.x, pos.y);
    if (node) {
      setDraggingNodeId(node.id);
      setDragNodeOffset({ dx: pos.x - node.x, dy: pos.y - node.y });
      e.stopPropagation();
      return;
    }
    // Pan if clicking on empty canvas
    setIsPanning(true);
    setPanStart({ x: e.clientX - transform.x, y: e.clientY - transform.y });
  };

  const handleMouseMove = (e) => {
    if (draggingNodeId) {
      const pos = screenToCanvas(e.clientX, e.clientY);
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

  return (
    <div
      ref={containerRef}
      className="w-full h-full bg-[#080808] relative overflow-hidden"
      style={{ cursor: draggingNodeId ? 'grabbing' : isPanning ? 'grabbing' : 'default' }}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      {/* Grid */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.12 }}>
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#333" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      <svg ref={svgRef} className="w-full h-full"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ userSelect: 'none' }}
      >
        <rect width="100%" height="100%" fill="transparent" />
        <g transform={`translate(${transform.x}, ${transform.y}) scale(${transform.scale})`}>
          {connections.map((conn, i) => (
            <ConnectionLine key={i} from={nodeMap[conn.from]} to={nodeMap[conn.to]} expandedIds={expandedIds} />
          ))}
          {visibleNodes.map(node => (
            <NodeComponent key={node.id} node={node} connections={connections}
              expandedIds={expandedIds} onExpand={handleExpand}
              onSelect={onSelectNode} selectedId={selectedNodeId} />
          ))}
        </g>
      </svg>

      {/* Zoom controls */}
      <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-black/60 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-muted-foreground">
        <button onClick={() => setTransform(p => ({ ...p, scale: Math.max(0.3, p.scale - 0.1) }))} className="hover:text-white">−</button>
        <span>{Math.round(transform.scale * 100)}%</span>
        <button onClick={() => setTransform(p => ({ ...p, scale: Math.min(2.5, p.scale + 0.1) }))} className="hover:text-white">+</button>
        <button onClick={() => setTransform({ x: 0, y: 0, scale: 1 })} className="hover:text-white ml-1">↺</button>
      </div>

      {/* Hint */}
      {nodes.length <= 1 && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/80 border border-primary/30 rounded-lg px-4 py-2 text-xs text-white/70 flex items-center gap-2 pointer-events-none">
          <Plus className="w-3 h-3 text-primary" />
          Arraste elementos do painel esquerdo para o canvas
        </div>
      )}
    </div>
  );
}