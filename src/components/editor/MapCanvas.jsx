import { useState, useRef, useCallback, useEffect } from 'react';
import { Plus, ChevronRight } from 'lucide-react';

const NODE_COLORS = {
  center: { bg: '#1a0505', border: '#e53e3e', glow: 'rgba(229,62,62,0.6)', text: '#fff' },
  branch: { bg: '#0d1117', border: '#ff6b00', glow: 'rgba(255,107,0,0.4)', text: '#fff' },
  leaf: { bg: '#0d0d0d', border: '#4a4a4a', glow: 'rgba(74,74,74,0.3)', text: '#ccc' },
  highlight: { bg: '#1a0a0a', border: '#e53e3e', glow: 'rgba(229,62,62,0.5)', text: '#fff' },
};

function NodeComponent({ node, nodes, connections, expandedIds, onExpand, onSelect, selectedId, zoom }) {
  const colors = NODE_COLORS[node.type] || NODE_COLORS.leaf;
  const isSelected = selectedId === node.id;
  const isCenter = node.type === 'center';

  // Find child connections
  const childConnections = connections.filter(c => c.from === node.id);
  const hasHiddenChildren = childConnections.some(c => !expandedIds.has(c.to));

  const w = isCenter ? 220 : node.type === 'branch' ? 180 : 160;
  const h = isCenter ? 120 : 70;

  return (
    <g>
      {/* Glow effect */}
      <rect
        x={node.x - w/2 - 4}
        y={node.y - h/2 - 4}
        width={w + 8}
        height={h + 8}
        rx={14}
        fill="none"
        stroke={colors.border}
        strokeWidth={isSelected ? 2 : 1}
        opacity={isSelected ? 0.8 : 0.3}
        style={{ filter: `blur(${isSelected ? 8 : 4}px)` }}
      />

      {/* Main rect */}
      <rect
        x={node.x - w/2}
        y={node.y - h/2}
        width={w}
        height={h}
        rx={10}
        fill={colors.bg}
        stroke={colors.border}
        strokeWidth={isSelected ? 2 : 1}
        style={{ cursor: 'pointer', filter: isSelected ? `drop-shadow(0 0 12px ${colors.glow})` : `drop-shadow(0 0 4px ${colors.glow})` }}
        onClick={() => onSelect(node)}
        className="node-expanded"
      />

      {/* Icon circle for branch/leaf */}
      {!isCenter && node.icon && (
        <circle cx={node.x - w/2 + 20} cy={node.y} r={12} fill={colors.border} opacity={0.2} />
      )}

      {/* Title */}
      <foreignObject x={node.x - w/2 + 10} y={node.y - h/2 + 8} width={w - 20} height={isCenter ? 60 : 35}>
        <div className={`text-white font-bold leading-tight ${isCenter ? 'text-sm text-center' : 'text-xs'}`}
          style={{ fontFamily: 'Inter, sans-serif', wordBreak: 'break-word', userSelect: 'none' }}>
          {node.title}
        </div>
      </foreignObject>

      {/* Description */}
      {node.description && (
        <foreignObject x={node.x - w/2 + 10} y={node.y + (isCenter ? -20 : 5)} width={w - 20} height={30}>
          <div className="text-[10px] leading-tight text-center"
            style={{ color: '#888', fontFamily: 'Inter, sans-serif', userSelect: 'none' }}>
            {node.description}
          </div>
        </foreignObject>
      )}

      {/* Expand button if has hidden children */}
      {hasHiddenChildren && (
        <g
          style={{ cursor: 'pointer' }}
          onClick={(e) => { e.stopPropagation(); onExpand(node.id); }}
        >
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

  const fromW = from.type === 'center' ? 110 : from.type === 'branch' ? 90 : 80;
  const toW = to.type === 'center' ? 110 : to.type === 'branch' ? 90 : 80;

  const x1 = from.x + (to.x > from.x ? fromW : -fromW);
  const y1 = from.y;
  const x2 = to.x + (to.x > from.x ? -toW : toW);
  const y2 = to.y;

  const mx = (x1 + x2) / 2;
  const path = `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`;

  const isFromCenter = from.type === 'center';

  return (
    <g>
      {/* Glow */}
      <path d={path} fill="none" stroke={isFromCenter ? '#e53e3e' : '#ff6b00'} strokeWidth={4} opacity={0.2} strokeLinecap="round" />
      {/* Main */}
      <path d={path} fill="none" stroke={isFromCenter ? '#e53e3e' : '#ff6b00'} strokeWidth={isFromCenter ? 2 : 1.5}
        opacity={0.8} strokeLinecap="round"
        style={{ filter: `drop-shadow(0 0 4px ${isFromCenter ? 'rgba(229,62,62,0.5)' : 'rgba(255,107,0,0.4)'})` }}
      />
      {/* Animated flow */}
      <path d={path} fill="none" stroke="white" strokeWidth={1} opacity={0.3}
        strokeDasharray="6 6" className="flow-line" strokeLinecap="round"
      />
      {/* Arrow */}
      <circle cx={x2} cy={y2} r={3} fill={isFromCenter ? '#e53e3e' : '#ff6b00'} opacity={0.9} />
    </g>
  );
}

export default function MapCanvas({ nodes, connections, onSelectNode, selectedNodeId }) {
  const [expandedIds, setExpandedIds] = useState(new Set(['root']));
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const svgRef = useRef(null);

  const visibleNodes = nodes.filter(n => expandedIds.has(n.id));

  const handleExpand = useCallback((nodeId) => {
    const childConns = connections.filter(c => c.from === nodeId);
    const hiddenChildren = childConns.filter(c => !expandedIds.has(c.to)).map(c => c.to);

    if (hiddenChildren.length > 0) {
      // Reveal one at a time for progressive disclosure
      const nextId = hiddenChildren[0];
      setExpandedIds(prev => new Set([...prev, nextId]));
    }
  }, [connections, expandedIds]);

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY * -0.001;
    setTransform(prev => ({
      ...prev,
      scale: Math.max(0.3, Math.min(2, prev.scale + delta))
    }));
  };

  const handleMouseDown = (e) => {
    if (e.target.tagName === 'svg' || e.target.tagName === 'rect' && e.target.getAttribute('fill') === 'transparent') {
      setIsDragging(true);
      setDragStart({ x: e.clientX - transform.x, y: e.clientY - transform.y });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && dragStart) {
      setTransform(prev => ({
        ...prev,
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      }));
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragStart(null);
  };

  const nodeMap = Object.fromEntries(nodes.map(n => [n.id, n]));

  return (
    <div className="w-full h-full bg-[#080808] relative overflow-hidden" style={{ cursor: isDragging ? 'grabbing' : 'grab' }}>
      {/* Grid background */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.15 }}>
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
      >
        <rect width="100%" height="100%" fill="transparent" />
        <g transform={`translate(${transform.x}, ${transform.y}) scale(${transform.scale})`}>
          {/* Connections */}
          {connections.map((conn, i) => (
            <ConnectionLine
              key={i}
              from={nodeMap[conn.from]}
              to={nodeMap[conn.to]}
              expandedIds={expandedIds}
            />
          ))}

          {/* Nodes */}
          {visibleNodes.map(node => (
            <NodeComponent
              key={node.id}
              node={node}
              nodes={nodes}
              connections={connections}
              expandedIds={expandedIds}
              onExpand={handleExpand}
              onSelect={onSelectNode}
              selectedId={selectedNodeId}
              zoom={transform.scale}
            />
          ))}
        </g>
      </svg>

      {/* Zoom controls */}
      <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-black/60 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-muted-foreground">
        <button onClick={() => setTransform(prev => ({ ...prev, scale: Math.max(0.3, prev.scale - 0.1) }))} className="hover:text-white">−</button>
        <span>{Math.round(transform.scale * 100)}%</span>
        <button onClick={() => setTransform(prev => ({ ...prev, scale: Math.min(2, prev.scale + 0.1) }))} className="hover:text-white">+</button>
        <button onClick={() => setTransform({ x: 0, y: 0, scale: 1 })} className="hover:text-white ml-1">↺</button>
      </div>

      {/* Expand hint */}
      {expandedIds.size === 1 && nodes.length > 1 && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/80 border border-primary/30 rounded-lg px-4 py-2 text-xs text-white/70 flex items-center gap-2 animate-pulse">
          <Plus className="w-3 h-3 text-primary" />
          Clique nos botões <span className="text-primary font-bold">+</span> nas setas para revelar o mapa progressivamente
        </div>
      )}
    </div>
  );
}