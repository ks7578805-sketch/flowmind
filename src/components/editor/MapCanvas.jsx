import { useState, useRef, useCallback, useEffect } from 'react';

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

// Node with hover connect handle (+) on the right edge
function Node3D({ node, isSelected, isConnectingMode, onMouseDown, onClick, onStartConnect }) {
  const [hovered, setHovered] = useState(false);
  const style = getStyle(node);
  const { w, h } = style;
  const depth = 10;

  return (
    <g
      onMouseDown={onMouseDown}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ cursor: isConnectingMode ? 'crosshair' : 'grab' }}
    >
      {/* Deep shadow */}
      <rect
        x={node.x - w/2 + depth + 2} y={node.y - h/2 + depth + 2}
        width={w} height={h} rx={10}
        fill="rgba(0,0,0,0.85)"
        style={{ filter: 'blur(4px)' }}
      />
      {/* 3D shadow layer */}
      <rect
        x={node.x - w/2 + depth} y={node.y - h/2 + depth}
        width={w} height={h} rx={10}
        fill="rgba(0,0,0,0.7)"
      />
      {/* Side face right */}
      <path
        d={`M ${node.x + w/2} ${node.y - h/2 + 6} L ${node.x + w/2 + depth} ${node.y - h/2 + depth + 2} L ${node.x + w/2 + depth} ${node.y + h/2 + depth} L ${node.x + w/2} ${node.y + h/2} Z`}
        fill={style.border} opacity={0.25}
      />
      {/* Side face bottom */}
      <path
        d={`M ${node.x - w/2 + 6} ${node.y + h/2} L ${node.x - w/2 + depth + 2} ${node.y + h/2 + depth} L ${node.x + w/2 + depth} ${node.y + h/2 + depth} L ${node.x + w/2} ${node.y + h/2} Z`}
        fill={style.border} opacity={0.15}
      />
      {/* Side face top (lighter) */}
      <path
        d={`M ${node.x - w/2} ${node.y - h/2} L ${node.x - w/2 + depth} ${node.y - h/2 + depth} L ${node.x + w/2 + depth} ${node.y - h/2 + depth} L ${node.x + w/2} ${node.y - h/2} Z`}
        fill="white" opacity={0.05}
      />

      {/* Outer glow halo */}
      <rect
        x={node.x - w/2 - 6} y={node.y - h/2 - 6}
        width={w + 12} height={h + 12} rx={15}
        fill="none" stroke={style.border}
        strokeWidth={isSelected ? 3 : hovered ? 2 : 1.5}
        opacity={isSelected ? 1 : hovered ? 0.6 : 0.25}
        style={{ filter: `blur(${isSelected ? 12 : hovered ? 8 : 4}px)` }}
      />

      {/* Main face */}
      <rect
        x={node.x - w/2} y={node.y - h/2}
        width={w} height={h} rx={10}
        fill={style.bg}
        stroke={style.border}
        strokeWidth={isSelected ? 2.5 : hovered ? 2 : 1.5}
        style={{
          filter: isSelected
            ? `drop-shadow(0 0 20px ${style.glow}) drop-shadow(0 0 8px ${style.border})`
            : hovered
              ? `drop-shadow(0 0 12px ${style.glow})`
              : `drop-shadow(0 0 6px ${style.glow}50)`
        }}
      />

      {/* Inner gradient overlay */}
      <rect
        x={node.x - w/2 + 1} y={node.y - h/2 + 1}
        width={w - 2} height={h/2 - 1} rx={9}
        fill="url(#nodeGradTop)" opacity={0.15}
      />

      {/* Top highlight shimmer */}
      <rect
        x={node.x - w/2 + 6} y={node.y - h/2 + 3}
        width={w * 0.6} height={2} rx={1}
        fill="white" opacity={0.12}
      />
      {/* Secondary shimmer */}
      <rect
        x={node.x - w/2 + 6} y={node.y - h/2 + 7}
        width={w * 0.3} height={1} rx={0.5}
        fill="white" opacity={0.06}
      />

      {/* Inner content */}
      <NodeContent node={node} style={style} />

      {/* Connect indicator ring in connecting mode */}
      {isConnectingMode && (
        <rect
          x={node.x - w/2 - 4} y={node.y - h/2 - 4}
          width={w + 8} height={h + 8} rx={13}
          fill="none" stroke="#22c55e" strokeWidth={2} strokeDasharray="6 4" opacity={0.8}
          style={{ filter: 'drop-shadow(0 0 6px #22c55e)' }}
        />
      )}

      {/* Hover connect handle (+) on right edge */}
      {hovered && !isConnectingMode && (
        <g
          onClick={(e) => { e.stopPropagation(); onStartConnect(node.id); }}
          style={{ cursor: 'crosshair' }}
        >
          <circle
            cx={node.x + w/2 + 10} cy={node.y}
            r={10}
            fill="#22c55e"
            style={{ filter: 'drop-shadow(0 0 6px #22c55e)' }}
          />
          <text x={node.x + w/2 + 10} y={node.y + 4} textAnchor="middle" fontSize={13} fill="white" fontWeight="bold">+</text>
        </g>
      )}
    </g>
  );
}

function ConnectionLine({ from, to, conn, isSelected, onSelect, onDelete }) {
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

  // True midpoint on bezier curve
  const midX = (x1 + 2*mx + x2) / 4;
  const midY = (y1 + y2) / 2;

  return (
    <g style={{ cursor: 'pointer' }}>
      {/* Invisible wider hit area */}
      <path d={path} fill="none" stroke="transparent" strokeWidth={20}
        onClick={(e) => { e.stopPropagation(); onSelect(); }} />

      {/* Glow */}
      <path d={path} fill="none" stroke={color} strokeWidth={8} opacity={0.1} strokeLinecap="round" />
      {/* Main line */}
      <path d={path} fill="none" stroke={color} strokeWidth={isSelected ? 3 : 2}
        opacity={isSelected ? 1 : 0.8} strokeLinecap="round"
        onClick={(e) => { e.stopPropagation(); onSelect(); }}
        style={{ filter: `drop-shadow(0 0 6px ${color}90)` }} />
      {/* Flow dash */}
      <path d={path} fill="none" stroke="white" strokeWidth={1} opacity={0.25}
        strokeDasharray="8 8" className="flow-line" strokeLinecap="round" />
      {/* Arrow head */}
      <circle cx={x2} cy={y2} r={4} fill={color} opacity={0.95}
        style={{ filter: `drop-shadow(0 0 4px ${color})` }} />

      {/* Delete button — visible when selected, CLICKABLE */}
      {isSelected && (
        <g
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          style={{ cursor: 'pointer' }}
        >
          {/* Larger invisible hit area for the trash icon */}
          <circle cx={midX} cy={midY} r={20} fill="transparent" />
          <circle cx={midX} cy={midY} r={14} fill="#1a0808" stroke="#e53e3e" strokeWidth={2}
            style={{ filter: 'drop-shadow(0 0 10px rgba(229,62,62,0.8))' }} />
          <text x={midX} y={midY + 5} textAnchor="middle" fontSize={14} fill="#e53e3e">🗑</text>
        </g>
      )}
    </g>
  );
}

export default function MapCanvas({
  nodes, connections, onSelectNode, selectedNodeId, onDropNode, onNodeMove,
  onAddConnection, onDeleteConnection, svgRef: externalSvgRef, zoom, onZoomChange
}) {
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState(null);
  const [draggingNodeId, setDraggingNodeId] = useState(null);
  const [dragNodeOffset, setDragNodeOffset] = useState(null);
  const [connectingFromId, setConnectingFromId] = useState(null);
  const [selectedConnIdx, setSelectedConnIdx] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const svgRef = useRef(null);
  const containerRef = useRef(null);

  // Sync zoom from toolbar
  useEffect(() => {
    if (zoom !== undefined && zoom !== transform.scale) {
      setTransform(prev => ({ ...prev, scale: zoom }));
    }
  }, [zoom]);

  // Report zoom changes up
  const updateScale = (newScale) => {
    const clamped = Math.max(0.2, Math.min(3, newScale));
    setTransform(prev => ({ ...prev, scale: clamped }));
    onZoomChange?.(clamped);
  };

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
      if (canvasX >= node.x - w/2 - 14 && canvasX <= node.x + w/2 + 14 &&
          canvasY >= node.y - h/2 && canvasY <= node.y + h/2) {
        return node;
      }
    }
    return null;
  }, [nodes]);

  const handleWheel = (e) => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.08 : 0.93;
    setTransform(prev => {
      const newScale = Math.max(0.2, Math.min(3, prev.scale * factor));
      onZoomChange?.(newScale);
      return { ...prev, scale: newScale };
    });
  };

  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    const pos = screenToCanvas(e.clientX, e.clientY);
    const node = findNodeAtPos(pos.x, pos.y);

    if (node) {
      if (connectingFromId) {
        if (connectingFromId !== node.id) onAddConnection?.(connectingFromId, node.id);
        setConnectingFromId(null);
        return;
      }
      setDraggingNodeId(node.id);
      setDragNodeOffset({ dx: pos.x - node.x, dy: pos.y - node.y });
      e.stopPropagation();
      return;
    }

    if (connectingFromId) { setConnectingFromId(null); return; }
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

  const nodeMap = Object.fromEntries(nodes.map(n => [n.id, n]));

  return (
    <div
      ref={containerRef}
      className="w-full h-full bg-[#080808] relative overflow-hidden"
      style={{ cursor: connectingFromId ? 'crosshair' : draggingNodeId ? 'grabbing' : isPanning ? 'grabbing' : 'default' }}
      onDrop={handleDrop}
      onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'copy'; }}
    >
      {/* Grid */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.08 }}>
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#444" strokeWidth="0.5" />
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
        <defs>
          <linearGradient id="nodeGradTop" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>
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
              onSelect={() => setSelectedConnIdx(selectedConnIdx === i ? null : i)}
              onDelete={() => {
                onDeleteConnection?.(i);
                setSelectedConnIdx(null);
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
              opacity={0.9}
              style={{ filter: 'drop-shadow(0 0 6px #22c55e)' }}
            />
          )}

          {/* Nodes */}
          {nodes.map(node => (
            <Node3D
              key={node.id}
              node={node}
              isSelected={selectedNodeId === node.id}
              isConnectingMode={connectingFromId !== null && connectingFromId !== node.id}
              onStartConnect={(id) => setConnectingFromId(id)}
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
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-green-950/95 border border-green-500/60 rounded-lg px-4 py-2 text-xs text-green-300 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          Clique em outro bloco para conectar • ESC para cancelar
          <button onClick={() => setConnectingFromId(null)} className="ml-2 text-white/50 hover:text-white">✕</button>
        </div>
      )}

      {nodes.length <= 1 && !connectingFromId && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/80 border border-primary/30 rounded-lg px-4 py-2 text-xs text-white/70 flex items-center gap-2 pointer-events-none">
          Arraste elementos do painel esquerdo para o canvas
        </div>
      )}
    </div>
  );
}