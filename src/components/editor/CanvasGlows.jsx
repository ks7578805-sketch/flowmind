import { useState } from 'react';

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

// Exported so ElementsPanel can trigger the panel
export default function CanvasGlows({ glows, setGlows, showPanel, setShowPanel }) {
  const [selected, setSelected] = useState(null);

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
    setSelected(prev => prev === id ? (glows.find(g => g.id !== id)?.id || null) : prev);
  };

  const selectedGlow = glows.find(g => g.id === selected) || glows[0];
  const activeId = selected || glows[0]?.id;

  return (
    <>
      {/* Static glow layer — no interaction */}
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

      {/* Edit panel — opens via external button */}
      {showPanel && (
        <div className="absolute top-4 right-4 bg-[#161616] border border-white/10 rounded-xl p-3 z-30 shadow-2xl w-56"
          onClick={e => e.stopPropagation()}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold text-white/80 uppercase tracking-wide">Brilhos de Fundo</span>
            <button onClick={() => setShowPanel(false)} className="text-white/30 hover:text-white text-xs">✕</button>
          </div>

          {/* Glow selector */}
          <div className="flex gap-1 mb-3 flex-wrap">
            {glows.map((g, i) => (
              <button key={g.id}
                onClick={() => setSelected(g.id)}
                className="w-6 h-6 rounded-full border-2 transition-all hover:scale-110"
                style={{ background: g.color, borderColor: activeId === g.id ? '#fff' : 'transparent', opacity: g.opacity * 5 + 0.4 }}
                title={`Brilho ${i + 1}`}
              />
            ))}
            <button onClick={addGlow}
              className="w-6 h-6 rounded-full border border-dashed border-white/20 text-white/30 hover:text-white hover:border-white/50 flex items-center justify-center text-xs transition-all">
              +
            </button>
          </div>

          {selectedGlow && (
            <>
              {/* Color */}
              <div className="mb-3">
                <div className="text-[9px] text-muted-foreground mb-1.5">Cor</div>
                <div className="flex flex-wrap gap-1">
                  {GLOW_COLORS.map(c => (
                    <button key={c}
                      onClick={() => updateGlow(activeId, { color: c })}
                      className="w-5 h-5 rounded-full border-2 transition-all hover:scale-110"
                      style={{ background: c, borderColor: selectedGlow.color === c ? '#fff' : 'transparent' }}
                    />
                  ))}
                  <input type="color" value={selectedGlow.color}
                    onChange={e => updateGlow(activeId, { color: e.target.value })}
                    className="w-5 h-5 rounded-full cursor-pointer bg-transparent border-0" />
                </div>
              </div>

              {/* Size */}
              <div className="mb-2">
                <div className="flex justify-between mb-1">
                  <span className="text-[9px] text-muted-foreground">Tamanho</span>
                  <span className="text-[9px] text-white/40">{Math.round(selectedGlow.size)}px</span>
                </div>
                <input type="range" min={80} max={800} step={10} value={selectedGlow.size}
                  onChange={e => updateGlow(activeId, { size: Number(e.target.value) })}
                  className="w-full h-1 rounded-full appearance-none cursor-pointer" style={{ accentColor: selectedGlow.color }} />
              </div>

              {/* Opacity */}
              <div className="mb-3">
                <div className="flex justify-between mb-1">
                  <span className="text-[9px] text-muted-foreground">Intensidade</span>
                  <span className="text-[9px] text-white/40">{Math.round(selectedGlow.opacity * 100)}%</span>
                </div>
                <input type="range" min={1} max={40} step={1} value={Math.round(selectedGlow.opacity * 100)}
                  onChange={e => updateGlow(activeId, { opacity: Number(e.target.value) / 100 })}
                  className="w-full h-1 rounded-full appearance-none cursor-pointer" style={{ accentColor: selectedGlow.color }} />
              </div>

              <button onClick={() => { removeGlow(activeId); }}
                className="w-full py-1.5 rounded-lg bg-red-950/40 border border-red-900/40 text-[9px] text-red-400 hover:bg-red-900/30 transition-all">
                🗑 Remover este brilho
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
}

export { DEFAULT_GLOWS };