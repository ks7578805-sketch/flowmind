import { useState, useRef } from 'react';

const DEFAULT_GLOWS = [
  { id: 'g1', x: 20, y: 30, color: '#e53e3e', size: 300, opacity: 0.12 },
  { id: 'g2', x: 75, y: 20, color: '#e53e3e', size: 200, opacity: 0.08 },
  { id: 'g3', x: 60, y: 70, color: '#ff6b00', size: 250, opacity: 0.07 },
  { id: 'g4', x: 10, y: 65, color: '#e53e3e', size: 180, opacity: 0.09 },
];

const GLOW_COLORS = [
  '#e53e3e', '#ff6b00', '#f59e0b', '#22c55e', '#3b82f6',
  '#a855f7', '#ec4899', '#06b6d4', '#ffffff',
];

export default function CanvasGlows({ editable = false }) {
  const [glows, setGlows] = useState(DEFAULT_GLOWS);
  const [selected, setSelected] = useState(null);
  const [showPanel, setShowPanel] = useState(false);
  const containerRef = useRef(null);

  const addGlow = () => {
    const newGlow = {
      id: `g${Date.now()}`,
      x: 30 + Math.random() * 40,
      y: 30 + Math.random() * 40,
      color: '#e53e3e',
      size: 200 + Math.random() * 150,
      opacity: 0.08 + Math.random() * 0.08,
    };
    setGlows(prev => [...prev, newGlow]);
    setSelected(newGlow.id);
  };

  const updateGlow = (id, patch) => {
    setGlows(prev => prev.map(g => g.id === id ? { ...g, ...patch } : g));
  };

  const removeGlow = (id) => {
    setGlows(prev => prev.filter(g => g.id !== id));
    setSelected(null);
  };

  const selectedGlow = glows.find(g => g.id === selected);

  if (!editable) {
    // Read-only mode: just render the glows
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {glows.map(g => (
          <div key={g.id} className="absolute rounded-full"
            style={{
              left: `${g.x}%`, top: `${g.y}%`,
              width: g.size, height: g.size,
              background: `radial-gradient(ellipse, ${g.color} 0%, transparent 70%)`,
              opacity: g.opacity,
              transform: 'translate(-50%, -50%)',
              filter: 'blur(40px)',
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <>
      {/* Glows layer */}
      <div ref={containerRef} className="absolute inset-0 pointer-events-none overflow-hidden">
        {glows.map(g => (
          <div key={g.id}
            className="absolute rounded-full"
            style={{
              left: `${g.x}%`, top: `${g.y}%`,
              width: g.size, height: g.size,
              background: `radial-gradient(ellipse, ${g.color} 0%, transparent 70%)`,
              opacity: g.opacity,
              transform: 'translate(-50%, -50%)',
              filter: 'blur(40px)',
              outline: selected === g.id ? '2px dashed rgba(255,255,255,0.3)' : 'none',
            }}
          />
        ))}
      </div>

      {/* Draggable hit targets (pointer-events enabled) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {editable && glows.map(g => (
          <div key={`hit_${g.id}`}
            className="absolute rounded-full pointer-events-auto cursor-move"
            title="Arrastar brilho"
            style={{
              left: `${g.x}%`, top: `${g.y}%`,
              width: 40, height: 40,
              transform: 'translate(-50%, -50%)',
              background: selected === g.id ? 'rgba(255,255,255,0.08)' : 'transparent',
              border: selected === g.id ? '1.5px dashed rgba(255,255,255,0.4)' : '1.5px dashed rgba(255,255,255,0.12)',
              borderRadius: '50%',
              zIndex: 5,
            }}
            onClick={(e) => { e.stopPropagation(); setSelected(g.id === selected ? null : g.id); setShowPanel(true); }}
            onMouseDown={(e) => {
              e.stopPropagation();
              const startX = e.clientX, startY = e.clientY;
              const startGX = g.x, startGY = g.y;
              const container = containerRef.current?.parentElement;
              if (!container) return;
              const { width: cw, height: ch } = container.getBoundingClientRect();
              const onMove = (ev) => {
                const dx = ((ev.clientX - startX) / cw) * 100;
                const dy = ((ev.clientY - startY) / ch) * 100;
                updateGlow(g.id, { x: Math.max(0, Math.min(100, startGX + dx)), y: Math.max(0, Math.min(100, startGY + dy)) });
              };
              const onUp = () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
              window.addEventListener('mousemove', onMove);
              window.addEventListener('mouseup', onUp);
            }}
          />
        ))}
      </div>

      {/* Edit panel */}
      {showPanel && selectedGlow && (
        <div className="absolute top-4 right-4 bg-[#161616] border border-white/10 rounded-xl p-3 z-30 shadow-2xl w-52"
          onClick={e => e.stopPropagation()}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold text-white/80 uppercase tracking-wide">Brilho de Fundo</span>
            <button onClick={() => setShowPanel(false)} className="text-white/30 hover:text-white text-xs">✕</button>
          </div>

          {/* Color */}
          <div className="mb-3">
            <div className="text-[9px] text-muted-foreground mb-1.5">Cor</div>
            <div className="flex flex-wrap gap-1">
              {GLOW_COLORS.map(c => (
                <button key={c}
                  onClick={() => updateGlow(selected, { color: c })}
                  className="w-6 h-6 rounded-full border-2 transition-all hover:scale-110"
                  style={{ background: c, borderColor: selectedGlow.color === c ? '#fff' : 'transparent' }}
                />
              ))}
              <input type="color" value={selectedGlow.color}
                onChange={e => updateGlow(selected, { color: e.target.value })}
                className="w-6 h-6 rounded-full cursor-pointer bg-transparent border-0" />
            </div>
          </div>

          {/* Size */}
          <div className="mb-3">
            <div className="flex justify-between mb-1">
              <span className="text-[9px] text-muted-foreground">Tamanho</span>
              <span className="text-[9px] text-white/40">{Math.round(selectedGlow.size)}px</span>
            </div>
            <input type="range" min={80} max={600} step={10} value={selectedGlow.size}
              onChange={e => updateGlow(selected, { size: Number(e.target.value) })}
              className="w-full h-1 rounded-full appearance-none cursor-pointer" style={{ accentColor: selectedGlow.color }} />
          </div>

          {/* Opacity */}
          <div className="mb-3">
            <div className="flex justify-between mb-1">
              <span className="text-[9px] text-muted-foreground">Intensidade</span>
              <span className="text-[9px] text-white/40">{Math.round(selectedGlow.opacity * 100)}%</span>
            </div>
            <input type="range" min={2} max={40} step={1} value={Math.round(selectedGlow.opacity * 100)}
              onChange={e => updateGlow(selected, { opacity: Number(e.target.value) / 100 })}
              className="w-full h-1 rounded-full appearance-none cursor-pointer" style={{ accentColor: selectedGlow.color }} />
          </div>

          <div className="flex gap-2 mt-2">
            <button onClick={addGlow}
              className="flex-1 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[9px] text-white/60 hover:text-white hover:bg-white/10 transition-all">
              + Adicionar
            </button>
            <button onClick={() => removeGlow(selected)}
              className="flex-1 py-1.5 rounded-lg bg-red-950/40 border border-red-900/40 text-[9px] text-red-400 hover:bg-red-900/30 transition-all">
              🗑 Remover
            </button>
          </div>
        </div>
      )}

      {/* Toggle button */}
      {!showPanel && (
        <button
          onClick={(e) => { e.stopPropagation(); setShowPanel(true); setSelected(glows[0]?.id); }}
          className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1.5 bg-black/70 border border-white/10 rounded-lg text-[9px] text-white/50 hover:text-white hover:bg-black/90 transition-colors z-10"
          title="Editar brilhos de fundo"
        >
          ✦ Brilhos
        </button>
      )}
    </>
  );
}