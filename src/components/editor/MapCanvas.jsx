import { useState, useRef, useCallback, useEffect } from 'react';

const NODE_STYLES = {
  center:    { bg: '#120808', border: '#e53e3e', w: 240, h: 130 },
  branch:    { bg: '#0e0e0e', border: '#e53e3e', w: 190, h: 80 },
  leaf:      { bg: '#0e0e0e', border: '#3a3a3a', w: 170, h: 68 },
  highlight: { bg: '#110808', border: '#e53e3e', w: 190, h: 76 },
  title:     { bg: '#0e0e14', border: '#6366f1', w: 200, h: 52 },
  text:      { bg: '#0e0e0e', border: '#3a3a3a', w: 200, h: 72 },
  block:     { bg: '#0a100a', border: '#22c55e', w: 200, h: 92 },
  image:     { bg: '#0a0a14', border: '#3b82f6', w: 210, h: 140 },
  icon:      { bg: '#110811', border: '#a855f7', w: 84,  h: 84 },
  audio:     { bg: '#0a100a', border: '#10b981', w: 200, h: 60 },
  video:     { bg: '#110800', border: '#f97316', w: 220, h: 140 },
  ai_text:   { bg: '#0d0a18', border: '#8b5cf6', w: 200, h: 72 },
};

function getStyle(node) {
  const base = NODE_STYLES[node.element_type] || NODE_STYLES[node.type] || NODE_STYLES.leaf;
  const border = node.custom_color || base.border;
  const intensity = node.glow_intensity !== undefined ? node.glow_intensity / 100 : 0.3;
  const glowAlpha = Math.round(intensity * 180).toString(16).padStart(2, '0');
  return { ...base, border, glow: border + glowAlpha };
}

function getNodeAnimStyle(node) {
  if (!node.animation && !node.anim_effect) return {};
  const dur = node.anim_speed === 'lenta' ? '1.2s' : node.anim_speed === 'rápida' ? '0.3s' : '0.6s';
  const anims = [];
  if (node.animation === 'fade') anims.push(`mapFadeIn ${dur} ease forwards`);
  if (node.animation === 'slide-left') anims.push(`mapSlideLeft ${dur} ease forwards`);
  if (node.animation === 'slide-right') anims.push(`mapSlideRight ${dur} ease forwards`);
  if (node.animation === 'slide-up') anims.push(`mapSlideUp ${dur} ease forwards`);
  if (node.animation === 'zoom') anims.push(`mapZoomIn ${dur} cubic-bezier(0.34,1.56,0.64,1) forwards`);
  if (node.animation === 'bounce') anims.push(`mapBounce ${dur} ease forwards`);
  if (node.animation === 'pulse') anims.push(`mapPulseGlow 1.2s ease-in-out infinite`);
  if (node.animation === 'glow') anims.push(`mapPulseGlow 1.5s ease-in-out infinite`);
  if (node.anim_effect === 'pulse-glow') anims.push(`mapPulseGlow 1.8s ease-in-out infinite`);
  if (node.anim_effect === 'shake') anims.push(`mapShake 0.6s ease-in-out infinite`);
  if (node.anim_effect === 'float') anims.push(`mapFloat 3s ease-in-out infinite`);
  return anims.length ? { animation: anims.join(', ') } : {};
}

// Rich text rendering: supports **bold**, *color:hex:text*
function renderRichText(text) {
  if (!text) return null;
  // Parse [color:#hex]word[/color] pattern
  const parts = [];
  const re = /\[color:(#[0-9a-fA-F]{3,6})\](.*?)\[\/color\]/g;
  let last = 0, m;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push({ t: text.slice(last, m.index), c: null });
    parts.push({ t: m[2], c: m[1] });
    last = re.lastIndex;
  }
  if (last < text.length) parts.push({ t: text.slice(last), c: null });
  if (parts.length === 0) return text;
  return parts.map((p, i) => p.c ? <span key={i} style={{ color: p.c }}>{p.t}</span> : <span key={i}>{p.t}</span>);
}

function NodeContent({ node, style }) {
  const type = node.element_type || node.type;
  const w = style.w;
  const h = style.h;
  const hasImage = !!node.image_url;
  const imgW = hasImage ? 48 : 0;
  const px = 10;
  const textX = node.x - w / 2 + px + (hasImage ? imgW + 6 : 0);
  const textW = w - px * 2 - (hasImage ? imgW + 6 : 0) - (node.icon ? 20 : 0);
  const cy = node.y;

  if (type === 'image') return (
    <g>
      {node.image_url
        ? <image href={node.image_url} x={node.x - w/2 + 8} y={node.y - h/2 + 8} width={w-16} height={h-28} preserveAspectRatio="xMidYMid slice" clipPath={`inset(0 round 6px)`} />
        : <>
            <rect x={node.x-w/2+8} y={node.y-h/2+8} width={w-16} height={h-32} rx={6} fill="#1a2a3a" stroke="#3b82f6" strokeWidth={1} opacity={0.5} />
            <text x={node.x} y={node.y - 4} textAnchor="middle" fontSize={20} fill="#3b82f6" opacity={0.6}>🖼️</text>
          </>
      }
      <foreignObject x={node.x-w/2+8} y={node.y+h/2-22} width={w-16} height={18}>
        <div xmlns="http://www.w3.org/1999/xhtml" style={{ fontFamily:'Inter',fontSize:8,color:'#6b7280',textAlign:'center',userSelect:'none' }}>{node.title || 'Imagem'}</div>
      </foreignObject>
    </g>
  );

  if (type === 'video') return (
    <g>
      <rect x={node.x-w/2+8} y={node.y-h/2+8} width={w-16} height={h-32} rx={6} fill="#110800" stroke="#f97316" strokeWidth={1} opacity={0.5} />
      <text x={node.x} y={node.y-4} textAnchor="middle" fontSize={22} fill="#f97316" opacity={0.8}>▶️</text>
      <foreignObject x={node.x-w/2+8} y={node.y+h/2-22} width={w-16} height={18}>
        <div xmlns="http://www.w3.org/1999/xhtml" style={{ fontFamily:'Inter',fontSize:8,color:'#f97316',textAlign:'center',userSelect:'none' }}>{node.title || 'Vídeo'}</div>
      </foreignObject>
    </g>
  );

  if (type === 'audio') return (
    <g>
      <text x={node.x-w/2+20} y={cy+5} fontSize={14} fill="#10b981">🎵</text>
      <foreignObject x={node.x-w/2+40} y={cy-14} width={w-50} height={28}>
        <div xmlns="http://www.w3.org/1999/xhtml" style={{ fontFamily:'Inter',fontSize:10,color:'#10b981',fontWeight:600,userSelect:'none' }}>{node.title||'Áudio'}</div>
      </foreignObject>
    </g>
  );

  if (type === 'icon') return (
    <text x={node.x} y={cy+8} textAnchor="middle" fontSize={30} fill={style.border} opacity={0.9}>{node.icon||'⭐'}</text>
  );

  if (type === 'title') return (
    <foreignObject x={node.x-w/2+px} y={cy-h/2+8} width={w-px*2} height={h-16}>
      <div xmlns="http://www.w3.org/1999/xhtml" style={{ fontFamily:'Inter',fontSize:13,fontWeight:900,color:'#fff',letterSpacing:'0.03em',userSelect:'none',lineHeight:1.2 }}>
        {renderRichText(node.title || 'Título')}
      </div>
    </foreignObject>
  );

  if (type === 'block') return (
    <g>
      <rect x={node.x-w/2+8} y={node.y-h/2+8} width={3} height={h-16} rx={1.5} fill={style.border} />
      <foreignObject x={node.x-w/2+18} y={cy-h/2+10} width={w-30} height={h-20}>
        <div xmlns="http://www.w3.org/1999/xhtml" style={{ fontFamily:'Inter',fontSize:10,color:'#e2e8f0',userSelect:'none',lineHeight:1.4 }}>
          <div style={{ fontWeight:700,marginBottom:2,fontSize:10 }}>{renderRichText(node.title||'Bloco')}</div>
          {node.description && <div style={{ opacity:0.65,fontSize:9 }}>{renderRichText(node.description)}</div>}
        </div>
      </foreignObject>
    </g>
  );

  if (type === 'text' || type === 'ai_text') return (
    <foreignObject x={node.x-w/2+px} y={cy-h/2+8} width={w-px*2} height={h-16}>
      <div xmlns="http://www.w3.org/1999/xhtml" style={{ fontFamily:'Inter',userSelect:'none',lineHeight:1.4 }}>
        {type === 'ai_text' && <div style={{ fontSize:7,color:'#8b5cf6',fontWeight:700,marginBottom:2,letterSpacing:'0.05em' }}>✨ IA</div>}
        <div style={{ fontSize:10,color:'#e2e8f0',fontWeight:500 }}>{renderRichText(node.title||'Texto')}</div>
        {node.description && <div style={{ fontSize:9,color:'#9ca3af',marginTop:2 }}>{renderRichText(node.description)}</div>}
      </div>
    </foreignObject>
  );

  // Default: center / branch / leaf / highlight
  const isCenter = node.type === 'center';
  const titleSize = isCenter ? 12 : 10;
  return (
    <g>
      {/* Side image thumbnail */}
      {hasImage && (
        <image
          href={node.image_url}
          x={node.x - w/2 + px}
          y={cy - imgW/2}
          width={imgW} height={imgW}
          preserveAspectRatio="xMidYMid slice"
          clipPath="inset(0 round 6px)"
          style={{ borderRadius: 6 }}
        />
      )}
      {/* Emoji icon */}
      {node.icon && !hasImage && (
        <text x={node.x-w/2+16} y={cy+5} fontSize={13} fill={style.border} opacity={0.85}>{node.icon}</text>
      )}
      {/* Title */}
      <foreignObject x={textX} y={cy-h/2+8} width={textW} height={isCenter ? 66 : 42}>
        <div xmlns="http://www.w3.org/1999/xhtml" style={{ fontFamily:'Inter',fontSize:titleSize,fontWeight:700,color:'#fff',wordBreak:'break-word',userSelect:'none',lineHeight:1.25,textAlign:isCenter?'center':'left' }}>
          {renderRichText(node.title)}
        </div>
      </foreignObject>
      {/* Description */}
      {node.description && (
        <foreignObject x={textX} y={cy+(isCenter?-8:16)} width={textW} height={24}>
          <div xmlns="http://www.w3.org/1999/xhtml" style={{ fontFamily:'Inter',fontSize:8,color:'#6b7280',userSelect:'none',lineHeight:1.3 }}>
            {renderRichText(node.description)}
          </div>
        </foreignObject>
      )}
    </g>
  );
}

function Node3D({ node, isSelected, isConnectingMode, onMouseDown, onClick, onStartConnect, onContextMenu }) {
  const [hovered, setHovered] = useState(false);
  const style = getStyle(node);
  const { w, h } = style;
  const animStyle = getNodeAnimStyle(node);
  const depth = node.depth_3d !== false ? (node.depth_amount || 7) : 0;
  const showShadow = node.show_shadow !== false;
  const showBorder = node.show_neon_border !== false;
  const glowIntensity = node.glow_intensity !== undefined ? node.glow_intensity / 100 : 0.3;

  const borderOpacity = isSelected ? 1 : hovered ? 0.85 : 0.7;
  const glowFilter = isSelected
    ? `drop-shadow(0 0 ${8 * glowIntensity + 4}px ${style.border}${Math.round(glowIntensity * 200 + 55).toString(16).padStart(2,'0')})`
    : hovered
      ? `drop-shadow(0 0 ${5 * glowIntensity + 2}px ${style.border}${Math.round(glowIntensity * 180 + 40).toString(16).padStart(2,'0')})`
      : `drop-shadow(0 2px 6px rgba(0,0,0,0.85))`;

  return (
    <g
      onMouseDown={onMouseDown}
      onClick={onClick}
      onContextMenu={onContextMenu}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ cursor: isConnectingMode ? 'crosshair' : 'grab', ...animStyle }}
    >
      {/* 3D depth shadow layer */}
      {depth > 0 && (
        <>
          <rect x={node.x-w/2+depth} y={node.y-h/2+depth} width={w} height={h} rx={12}
            fill={style.border} opacity={0.12} />
          {/* Right side face */}
          <path
            d={`M ${node.x+w/2} ${node.y-h/2+8} L ${node.x+w/2+depth} ${node.y-h/2+depth+2} L ${node.x+w/2+depth} ${node.y+h/2+depth-2} L ${node.x+w/2} ${node.y+h/2-4} Z`}
            fill={style.border} opacity={0.22}
          />
          {/* Bottom face */}
          <path
            d={`M ${node.x-w/2+8} ${node.y+h/2} L ${node.x-w/2+depth+2} ${node.y+h/2+depth} L ${node.x+w/2+depth-2} ${node.y+h/2+depth} L ${node.x+w/2-4} ${node.y+h/2} Z`}
            fill={style.border} opacity={0.14}
          />
        </>
      )}

      {/* Drop shadow */}
      {showShadow && (
        <rect x={node.x-w/2+4} y={node.y-h/2+8} width={w} height={h} rx={12}
          fill="rgba(0,0,0,0.7)" style={{ filter:'blur(8px)' }} />
      )}

      {/* Main face */}
      <rect
        x={node.x-w/2} y={node.y-h/2} width={w} height={h} rx={12}
        fill={style.bg}
        stroke={showBorder ? style.border : 'transparent'}
        strokeWidth={isSelected ? 2 : hovered ? 1.5 : 1}
        strokeOpacity={borderOpacity}
        style={{ filter: glowFilter }}
      />

      {/* Inner gradient — subtle top highlight only */}
      <defs>
        <linearGradient id={`ng_${node.id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="white" stopOpacity="0.06" />
          <stop offset="40%" stopColor="white" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect x={node.x-w/2+1} y={node.y-h/2+1} width={w-2} height={h-2} rx={11} fill={`url(#ng_${node.id})`} />

      {/* Selection ring */}
      {isSelected && (
        <rect x={node.x-w/2-3} y={node.y-h/2-3} width={w+6} height={h+6} rx={14}
          fill="none" stroke={style.border} strokeWidth={1.5} strokeOpacity={0.6}
          strokeDasharray="4 3"
        />
      )}

      {/* Connect target ring */}
      {isConnectingMode && (
        <rect x={node.x-w/2-4} y={node.y-h/2-4} width={w+8} height={h+8} rx={15}
          fill="none" stroke="#22c55e" strokeWidth={2} strokeDasharray="5 3" opacity={0.85}
        />
      )}

      <NodeContent node={node} style={style} />

      {/* Connect handle (+) on hover */}
      {hovered && !isConnectingMode && (
        <g onMouseDown={(e) => { e.stopPropagation(); onStartConnect(node.id); }} style={{ cursor:'crosshair' }}>
          <circle cx={node.x+w/2+13} cy={node.y} r={14} fill="transparent" />
          <circle cx={node.x+w/2+13} cy={node.y} r={9} fill="#161616" stroke="#22c55e" strokeWidth={1.5} />
          <text x={node.x+w/2+13} y={node.y+4.5} textAnchor="middle" fontSize={13} fill="#22c55e" fontWeight="bold" style={{ userSelect:'none' }}>+</text>
        </g>
      )}
    </g>
  );
}

function ConnectionLine({ from, to, conn, isSelected, onSelect, onDelete }) {
  if (!from || !to) return null;
  const fromStyle = getStyle(from);
  const toStyle = getStyle(to);

  // S-curve: connect from right/left edge smartly
  const goRight = to.x >= from.x;
  const x1 = from.x + (goRight ? fromStyle.w/2 : -fromStyle.w/2);
  const y1 = from.y;
  const x2 = to.x + (goRight ? -toStyle.w/2 : toStyle.w/2);
  const y2 = to.y;

  // True S-curve control points
  const dx = Math.abs(x2 - x1) * 0.5;
  const path = `M ${x1} ${y1} C ${x1 + (goRight ? dx : -dx)} ${y1}, ${x2 + (goRight ? -dx : dx)} ${y2}, ${x2} ${y2}`;

  const color = conn?.custom_color || from.custom_color || '#e53e3e';

  // Midpoint on cubic bezier at t=0.5
  const midX = 0.125*x1 + 0.375*(x1+(goRight?dx:-dx)) + 0.375*(x2+(goRight?-dx:dx)) + 0.125*x2;
  const midY = (y1 + y2) / 2;

  // Arrow direction
  const nearEndX = x2 + (goRight ? -8 : 8);
  const angle = Math.atan2(y2 - midY, x2 - nearEndX) * 180 / Math.PI;

  return (
    <g>
      {/* Wide invisible hit area */}
      <path d={path} fill="none" stroke="transparent" strokeWidth={30} style={{ cursor:'pointer' }}
        onClick={(e) => { e.stopPropagation(); onSelect(); }} />

      {/* Outer glow */}
      <path d={path} fill="none" stroke={color} strokeWidth={6} opacity={0.08} strokeLinecap="round" />
      {/* Inner glow */}
      <path d={path} fill="none" stroke={color} strokeWidth={3} opacity={0.15} strokeLinecap="round" />

      {/* Main line */}
      <path d={path} fill="none" stroke={color}
        strokeWidth={isSelected ? 2.5 : 1.8}
        opacity={isSelected ? 1 : 0.75}
        strokeLinecap="round"
        onClick={(e) => { e.stopPropagation(); onSelect(); }}
        style={{ cursor:'pointer' }}
      />

      {/* Animated flow dash */}
      <path d={path} fill="none" stroke="white" strokeWidth={1} opacity={0.18}
        strokeDasharray="6 8" className="flow-line" strokeLinecap="round" />

      {/* Arrowhead */}
      <g transform={`translate(${x2},${y2}) rotate(${angle})`}>
        <polygon points="-7,-3.5 0,0 -7,3.5" fill={color} opacity={0.9} />
      </g>

      {/* Delete button — at midpoint, only when selected */}
      {isSelected && (
        <g onClick={(e) => { e.stopPropagation(); onDelete(); }} style={{ cursor:'pointer' }}>
          <circle cx={midX} cy={midY} r={22} fill="transparent" />
          <circle cx={midX} cy={midY} r={13} fill="#1a0808" stroke="#e53e3e" strokeWidth={1.5} opacity={0.95} />
          <text x={midX} y={midY+5} textAnchor="middle" fontSize={13} fill="#e53e3e" style={{ userSelect:'none' }}>🗑</text>
        </g>
      )}
    </g>
  );
}

// Minimap component
function Minimap({ nodes, transform, canvasW, canvasH }) {
  if (!nodes.length) return null;
  const mmW = 120, mmH = 80;
  const padding = 20;
  const allX = nodes.map(n => n.x);
  const allY = nodes.map(n => n.y);
  const minX = Math.min(...allX) - padding;
  const maxX = Math.max(...allX) + padding;
  const minY = Math.min(...allY) - padding;
  const maxY = Math.max(...allY) + padding;
  const scaleX = mmW / (maxX - minX || 1);
  const scaleY = mmH / (maxY - minY || 1);
  const scale = Math.min(scaleX, scaleY);

  return (
    <div className="absolute bottom-14 left-4 rounded-lg overflow-hidden border border-white/10 bg-black/70 backdrop-blur-sm" style={{ width: mmW+2, height: mmH+2 }}>
      <svg width={mmW} height={mmH}>
        {nodes.map(n => {
          const nx = (n.x - minX) * scale;
          const ny = (n.y - minY) * scale;
          const style = NODE_STYLES[n.element_type] || NODE_STYLES[n.type] || NODE_STYLES.leaf;
          const nw = Math.max(4, style.w * scale);
          const nh = Math.max(3, style.h * scale);
          const color = n.custom_color || style.border;
          return <rect key={n.id} x={nx - nw/2} y={ny - nh/2} width={nw} height={nh} rx={2} fill={color} opacity={0.5} />;
        })}
      </svg>
    </div>
  );
}

export default function MapCanvas({
  nodes, connections, onSelectNode, selectedNodeId, onDropNode, onNodeMove,
  onAddConnection, onDeleteConnection, onDeleteNode, svgRef: externalSvgRef, zoom, onZoomChange
}) {
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState(null);
  const [draggingNodeId, setDraggingNodeId] = useState(null);
  const [dragNodeOffset, setDragNodeOffset] = useState(null);
  const [connectingFromId, setConnectingFromId] = useState(null);
  const [selectedConnIdx, setSelectedConnIdx] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [contextMenu, setContextMenu] = useState(null);
  const svgRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (zoom !== undefined && zoom !== transform.scale) {
      setTransform(prev => ({ ...prev, scale: zoom }));
    }
  }, [zoom]);

  useEffect(() => {
    if (externalSvgRef) externalSvgRef.current = svgRef.current;
  }, [externalSvgRef]);

  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') { setConnectingFromId(null); setSelectedConnIdx(null); setContextMenu(null); } };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  useEffect(() => {
    const h = () => setContextMenu(null);
    window.addEventListener('click', h);
    return () => window.removeEventListener('click', h);
  }, []);

  const screenToCanvas = useCallback((clientX, clientY) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return { x: 500, y: 350 };
    return {
      x: (clientX - rect.left - transform.x) / transform.scale,
      y: (clientY - rect.top - transform.y) / transform.scale,
    };
  }, [transform]);

  const findNodeAtPos = useCallback((cx, cy) => {
    for (let i = nodes.length - 1; i >= 0; i--) {
      const n = nodes[i];
      const s = NODE_STYLES[n.element_type] || NODE_STYLES[n.type] || NODE_STYLES.leaf;
      if (cx >= n.x-s.w/2 && cx <= n.x+s.w/2 && cy >= n.y-s.h/2 && cy <= n.y+s.h/2) return n;
    }
    return null;
  }, [nodes]);

  const handleWheel = (e) => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.08 : 0.93;
    setTransform(prev => {
      const ns = Math.max(0.15, Math.min(3, prev.scale * factor));
      onZoomChange?.(ns);
      return { ...prev, scale: ns };
    });
  };

  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    setContextMenu(null);
    const pos = screenToCanvas(e.clientX, e.clientY);
    const node = findNodeAtPos(pos.x, pos.y);
    if (node) {
      if (connectingFromId) { if (connectingFromId !== node.id) onAddConnection?.(connectingFromId, node.id); setConnectingFromId(null); return; }
      setDraggingNodeId(node.id);
      setDragNodeOffset({ dx: pos.x - node.x, dy: pos.y - node.y });
      e.stopPropagation(); return;
    }
    if (connectingFromId) { setConnectingFromId(null); return; }
    setSelectedConnIdx(null);
    setIsPanning(true);
    setPanStart({ x: e.clientX - transform.x, y: e.clientY - transform.y });
  };

  const handleMouseMove = (e) => {
    const pos = screenToCanvas(e.clientX, e.clientY);
    setMousePos(pos);
    if (draggingNodeId) { onNodeMove?.(draggingNodeId, pos.x - dragNodeOffset.dx, pos.y - dragNodeOffset.dy); return; }
    if (isPanning && panStart) setTransform(prev => ({ ...prev, x: e.clientX - panStart.x, y: e.clientY - panStart.y }));
  };

  const handleMouseUp = (e) => {
    if (connectingFromId) {
      const pos = screenToCanvas(e.clientX, e.clientY);
      const node = findNodeAtPos(pos.x, pos.y);
      if (node && node.id !== connectingFromId) onAddConnection?.(connectingFromId, node.id);
      setConnectingFromId(null);
    }
    setDraggingNodeId(null); setDragNodeOffset(null); setIsPanning(false); setPanStart(null);
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
      className="w-full h-full relative overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse 70% 60% at 50% 40%, #0d0000 0%, #080808 70%, #050505 100%)',
        cursor: connectingFromId ? 'crosshair' : draggingNodeId ? 'grabbing' : isPanning ? 'grabbing' : 'default'
      }}
      onDrop={handleDrop}
      onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'copy'; }}
    >
      <style>{`
        @keyframes mapFadeIn { from{opacity:0} to{opacity:1} }
        @keyframes mapSlideLeft { from{opacity:0;transform:translateX(-40px)} to{opacity:1;transform:translateX(0)} }
        @keyframes mapSlideRight { from{opacity:0;transform:translateX(40px)} to{opacity:1;transform:translateX(0)} }
        @keyframes mapSlideUp { from{opacity:0;transform:translateY(40px)} to{opacity:1;transform:translateY(0)} }
        @keyframes mapZoomIn { from{opacity:0;transform:scale(0.3)} to{opacity:1;transform:scale(1)} }
        @keyframes mapBounce { 0%{opacity:0;transform:scale(0.3)} 60%{transform:scale(1.12)} 80%{transform:scale(0.96)} 100%{opacity:1;transform:scale(1)} }
        @keyframes mapPulseGlow { 0%,100%{opacity:0.85} 50%{opacity:1;filter:brightness(1.3)} }
        @keyframes mapShake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-4px)} 40%{transform:translateX(4px)} 60%{transform:translateX(-3px)} 80%{transform:translateX(3px)} }
        @keyframes mapFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-7px)} }
        .flow-line { stroke-dasharray:6 8; animation:flowDash 1.5s linear infinite; }
        @keyframes flowDash { to{stroke-dashoffset:-28} }
      `}</style>

      {/* Subtle dot grid */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity:0.06 }}>
        <defs>
          <pattern id="dots" width="30" height="30" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1" fill="#888" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dots)" />
      </svg>

      <svg ref={svgRef} className="w-full h-full"
        onWheel={handleWheel} onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp} style={{ userSelect:'none' }}
      >
        <rect width="100%" height="100%" fill="transparent" />
        <g transform={`translate(${transform.x},${transform.y}) scale(${transform.scale})`}>
          {connections.map((conn, i) => (
            <ConnectionLine key={i}
              from={nodeMap[conn.from]} to={nodeMap[conn.to]} conn={conn}
              isSelected={selectedConnIdx === i}
              onSelect={() => setSelectedConnIdx(selectedConnIdx === i ? null : i)}
              onDelete={() => { onDeleteConnection?.(i); setSelectedConnIdx(null); }}
            />
          ))}

          {/* Live wire */}
          {connectingFromId && nodeMap[connectingFromId] && (() => {
            const fn = nodeMap[connectingFromId];
            const fs = NODE_STYLES[fn.element_type] || NODE_STYLES[fn.type] || NODE_STYLES.leaf;
            return (
              <line x1={fn.x+fs.w/2} y1={fn.y} x2={mousePos.x} y2={mousePos.y}
                stroke="#22c55e" strokeWidth={1.5} strokeDasharray="5 4" opacity={0.8} />
            );
          })()}

          {nodes.map(node => (
            <Node3D key={node.id} node={node}
              isSelected={selectedNodeId === node.id}
              isConnectingMode={connectingFromId !== null && connectingFromId !== node.id}
              onStartConnect={(id) => setConnectingFromId(id)}
              onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); setContextMenu({ x:e.clientX, y:e.clientY, nodeId:node.id }); }}
              onMouseDown={(e) => {
                e.stopPropagation();
                const pos = screenToCanvas(e.clientX, e.clientY);
                if (connectingFromId) { if (connectingFromId !== node.id) onAddConnection?.(connectingFromId, node.id); setConnectingFromId(null); }
                else { setDraggingNodeId(node.id); setDragNodeOffset({ dx:pos.x-node.x, dy:pos.y-node.y }); }
              }}
              onClick={(e) => { e.stopPropagation(); if (!draggingNodeId) { onSelectNode(node); setSelectedConnIdx(null); } }}
            />
          ))}
        </g>
      </svg>

      {/* Minimap */}
      <Minimap nodes={nodes} transform={transform} />

      {/* Context menu */}
      {contextMenu && (
        <div className="absolute z-50 bg-[#161616] border border-white/10 rounded-xl shadow-2xl py-1.5 min-w-[170px]"
          style={{ left:contextMenu.x, top:contextMenu.y }} onClick={(e) => e.stopPropagation()}>
          <button className="w-full px-4 py-2 text-xs text-left text-white/90 hover:bg-white/8 flex items-center gap-2.5"
            onClick={() => { onSelectNode(nodes.find(n => n.id===contextMenu.nodeId)); setContextMenu(null); }}>
            ✏️ Editar bloco
          </button>
          <button className="w-full px-4 py-2 text-xs text-left text-white/90 hover:bg-white/8 flex items-center gap-2.5"
            onClick={() => { setConnectingFromId(contextMenu.nodeId); setContextMenu(null); }}>
            ➕ Conectar a outro bloco
          </button>
          <div className="border-t border-white/8 my-1" />
          <button className="w-full px-4 py-2 text-xs text-left text-red-400 hover:bg-red-500/8 flex items-center gap-2.5"
            onClick={() => { onDeleteNode?.(contextMenu.nodeId); setContextMenu(null); }}>
            🗑️ Deletar bloco
          </button>
        </div>
      )}

      {connectingFromId && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-[#0d1a0d]/95 border border-green-600/40 rounded-lg px-4 py-2 text-xs text-green-400 flex items-center gap-2 pointer-events-none">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          Arraste até outro bloco para conectar • ESC cancela
        </div>
      )}

      {nodes.length <= 1 && !connectingFromId && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/70 border border-white/10 rounded-lg px-4 py-2 text-xs text-white/50 pointer-events-none">
          Arraste elementos do painel esquerdo para o canvas
        </div>
      )}
    </div>
  );
}