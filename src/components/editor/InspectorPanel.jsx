import { useState } from 'react';
import { X, Trash2, Copy } from 'lucide-react';

const EMOJIS = [
  '🎯','🚀','💡','⭐','🔥','💰','📊','🎨','🤝','⚡',
  '🏆','📱','💎','🌟','🎪','❤️','🧠','💼','📌','✅',
  '🎭','🌍','📈','🔑','🎵','🏅','🌈','💫','🎲','🔮',
  '🦋','🌺','🍀','⚙️','🎓','🏠','🚗','✈️','🌙','☀️',
  '💪','👑','🎁','📣','🔔','💬','🛡️','⚔️','🧩','🎬',
];

const COLORS = [
  '#e53e3e','#ff6b00','#22c55e','#3b82f6','#a855f7','#f59e0b',
  '#10b981','#ec4899','#06b6d4','#6366f1','#ffffff','#6b7280',
  '#ef4444','#f97316','#84cc16','#14b8a6','#8b5cf6','#f43f5e',
];

const ANIMATIONS = [
  { id: 'none',        label: 'Nenhuma',     icon: '—'  },
  { id: 'fade',        label: 'Fade In',     icon: '✦'  },
  { id: 'slide-left',  label: 'Slide ←',    icon: '←'  },
  { id: 'slide-right', label: 'Slide →',    icon: '→'  },
  { id: 'slide-up',    label: 'Slide ↑',    icon: '↑'  },
  { id: 'zoom',        label: 'Zoom In',     icon: '⊕'  },
  { id: 'bounce',      label: 'Bounce',      icon: '↕'  },
  { id: 'pulse',       label: 'Pulsar',      icon: '○'  },
  { id: 'glow',        label: 'Neon Glow',   icon: '✦'  },
];

const EFFECTS = [
  { id: 'none',       label: 'Nenhum',      icon: '—'  },
  { id: 'pulse-glow', label: 'Pulso Neon',  icon: '🔴' },
  { id: 'shake',      label: 'Vibrar',      icon: '〰️' },
  { id: 'float',      label: 'Flutuar',     icon: '🌊' },
];

export default function InspectorPanel({ selectedNode, onUpdate, onDelete, onDuplicate, onClose }) {
  const [activeTab, setActiveTab] = useState('conteudo');

  if (!selectedNode) return null;

  const tabs = [
    { id: 'conteudo',  label: 'Conteúdo'  },
    { id: 'animacao',  label: 'Animação'  },
  ];

  const glowIntensity = selectedNode.glow_intensity !== undefined ? selectedNode.glow_intensity : 50;

  return (
    <div className="w-60 bg-[#0d0d0d] border-l border-white/5 flex flex-col overflow-hidden" style={{ maxHeight: '100%' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-white/5 flex-shrink-0">
        <span className="text-[11px] font-bold text-white tracking-widest">INSPECTOR</span>
        <button onClick={onClose} className="text-muted-foreground hover:text-white transition-colors p-0.5 rounded hover:bg-white/10">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Block label */}
      <div className="px-3 pt-2 pb-1 flex-shrink-0">
        <div className="text-[9px] text-muted-foreground uppercase tracking-widest mb-1">Bloco selecionado</div>
        <div className="rounded-lg bg-white/5 border border-white/8 px-2 py-1.5 text-xs font-semibold text-white truncate">
          {selectedNode.icon && <span className="mr-1">{selectedNode.icon}</span>}
          {selectedNode.title || 'Sem título'}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/5 flex-shrink-0 px-2">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2 text-[10px] font-semibold transition-colors rounded-t ${
              activeTab === tab.id ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-white'
            }`}
          >{tab.label}</button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {activeTab === 'conteudo' && (
          <>
            <div>
              <label className="text-[10px] text-muted-foreground uppercase tracking-wide">Título</label>
              <input
                value={selectedNode.title || ''}
                onChange={e => onUpdate({ ...selectedNode, title: e.target.value })}
                className="w-full mt-1 px-2 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-primary/60 transition-colors"
              />
            </div>

            <div>
              <label className="text-[10px] text-muted-foreground uppercase tracking-wide">Descrição</label>
              <textarea
                value={selectedNode.description || ''}
                onChange={e => onUpdate({ ...selectedNode, description: e.target.value })}
                className="w-full mt-1 px-2 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-primary/60 transition-colors resize-none h-14"
              />
            </div>

            {/* Emoji */}
            <div>
              <label className="text-[10px] text-muted-foreground uppercase tracking-wide">Emoji</label>
              <div className="grid grid-cols-6 gap-1 mt-1.5 max-h-28 overflow-y-auto pr-0.5">
                {EMOJIS.map(emoji => (
                  <button key={emoji}
                    onClick={() => onUpdate({ ...selectedNode, icon: selectedNode.icon === emoji ? undefined : emoji })}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-base transition-all hover:scale-110 ${
                      selectedNode.icon === emoji ? 'bg-primary/20 border border-primary/60 scale-110' : 'bg-white/5 hover:bg-white/10 border border-transparent'
                    }`}
                  >{emoji}</button>
                ))}
              </div>
              {selectedNode.icon && (
                <button onClick={() => onUpdate({ ...selectedNode, icon: undefined })}
                  className="text-[9px] text-muted-foreground hover:text-primary mt-1 transition-colors">
                  ✕ Remover emoji
                </button>
              )}
            </div>

            {/* Color */}
            <div>
              <label className="text-[10px] text-muted-foreground uppercase tracking-wide">Cor do Bloco</label>
              <div className="grid grid-cols-6 gap-1.5 mt-1.5">
                {COLORS.map(color => (
                  <button key={color}
                    onClick={() => onUpdate({ ...selectedNode, custom_color: selectedNode.custom_color === color ? undefined : color })}
                    className="w-7 h-7 rounded-lg border-2 transition-all hover:scale-110 flex-shrink-0"
                    style={{
                      background: color,
                      borderColor: selectedNode.custom_color === color ? '#fff' : 'transparent',
                      boxShadow: selectedNode.custom_color === color ? `0 0 10px ${color}` : 'none'
                    }}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <label className="text-[9px] text-muted-foreground">Personalizada:</label>
                <input type="color"
                  value={selectedNode.custom_color || '#e53e3e'}
                  onChange={e => onUpdate({ ...selectedNode, custom_color: e.target.value })}
                  className="w-8 h-6 rounded cursor-pointer bg-transparent border-0"
                />
                {selectedNode.custom_color && (
                  <button onClick={() => onUpdate({ ...selectedNode, custom_color: undefined })}
                    className="text-[9px] text-muted-foreground hover:text-white">Resetar</button>
                )}
              </div>

              {/* Glow intensity slider */}
              <div className="mt-3">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[10px] text-muted-foreground uppercase tracking-wide">Intensidade do Brilho</label>
                  <span className="text-[10px] text-white/60">{glowIntensity}%</span>
                </div>
                <input
                  type="range" min={0} max={100} step={5}
                  value={glowIntensity}
                  onChange={e => onUpdate({ ...selectedNode, glow_intensity: Number(e.target.value) })}
                  className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                  style={{ accentColor: selectedNode.custom_color || '#e53e3e' }}
                />
                <div className="flex justify-between text-[9px] text-muted-foreground mt-0.5">
                  <span>Sem brilho</span>
                  <span>Máximo</span>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'animacao' && (
          <div className="space-y-4">
            {/* Animation preview area */}
            {selectedNode.animation && selectedNode.animation !== 'none' && (
              <div className="rounded-lg bg-white/5 border border-white/10 p-3 text-center">
                <div
                  className="inline-block px-4 py-2 rounded-lg border text-xs font-bold text-white"
                  style={{
                    borderColor: selectedNode.custom_color || '#e53e3e',
                    background: '#1a1a1a',
                    animationName: `map${selectedNode.animation.charAt(0).toUpperCase() + selectedNode.animation.slice(1).replace(/-([a-z])/g, g => g[1].toUpperCase())}`,
                    animationDuration: selectedNode.anim_speed === 'lenta' ? '1.2s' : selectedNode.anim_speed === 'rápida' ? '0.3s' : '0.6s',
                    animationIterationCount: ['pulse','glow'].includes(selectedNode.animation) ? 'infinite' : '1',
                    animationFillMode: 'both',
                  }}
                >
                  Pré-visualização
                </div>
              </div>
            )}

            <div>
              <label className="text-[10px] text-muted-foreground uppercase tracking-wide">Animação de Entrada</label>
              <div className="grid grid-cols-1 gap-1 mt-2">
                {ANIMATIONS.map(anim => (
                  <button key={anim.id}
                    onClick={() => onUpdate({ ...selectedNode, animation: anim.id === 'none' ? undefined : anim.id })}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all text-left ${
                      (selectedNode.animation === anim.id) || (!selectedNode.animation && anim.id === 'none')
                        ? 'bg-primary/15 border border-primary/50 text-white'
                        : 'bg-white/5 border border-transparent text-muted-foreground hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <span className="w-5 text-center">{anim.icon}</span>
                    <span>{anim.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[10px] text-muted-foreground uppercase tracking-wide">Velocidade</label>
              <div className="flex gap-1.5 mt-1.5">
                {['lenta','normal','rápida'].map(speed => (
                  <button key={speed}
                    onClick={() => onUpdate({ ...selectedNode, anim_speed: speed })}
                    className={`flex-1 py-1.5 rounded-lg text-[10px] capitalize transition-all ${
                      (selectedNode.anim_speed || 'normal') === speed
                        ? 'bg-primary/20 border border-primary/50 text-white'
                        : 'bg-white/5 border border-transparent text-muted-foreground hover:bg-white/10'
                    }`}
                  >{speed.charAt(0).toUpperCase() + speed.slice(1)}</button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[10px] text-muted-foreground uppercase tracking-wide">Efeito Contínuo</label>
              <div className="grid grid-cols-1 gap-1 mt-1.5">
                {EFFECTS.map(fx => (
                  <button key={fx.id}
                    onClick={() => onUpdate({ ...selectedNode, anim_effect: fx.id === 'none' ? undefined : fx.id })}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all text-left ${
                      (selectedNode.anim_effect === fx.id) || (!selectedNode.anim_effect && fx.id === 'none')
                        ? 'bg-primary/15 border border-primary/50 text-white'
                        : 'bg-white/5 border border-transparent text-muted-foreground hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <span className="w-5 text-center">{fx.icon}</span>
                    <span>{fx.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-white/5 flex gap-2 flex-shrink-0">
        <button onClick={onDuplicate}
          className="flex-1 py-2 rounded-lg bg-white/5 border border-white/10 text-[10px] text-muted-foreground hover:text-white hover:bg-white/10 transition-all flex items-center justify-center gap-1">
          <Copy className="w-3 h-3" /> Duplicar
        </button>
        <button onClick={onDelete}
          className="flex-1 py-2 rounded-lg bg-destructive/10 border border-destructive/20 text-[10px] text-destructive hover:bg-destructive/20 transition-all flex items-center justify-center gap-1">
          <Trash2 className="w-3 h-3" /> Excluir
        </button>
      </div>
    </div>
  );
}