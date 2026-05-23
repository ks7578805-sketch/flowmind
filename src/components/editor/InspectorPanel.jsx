import { useState, useRef } from 'react';
import { X, Trash2, Copy, Bold, Italic, Image as ImageIcon } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const EMOJIS = [
  '🎯','🚀','💡','⭐','🔥','💰','📊','🎨','🤝','⚡',
  '🏆','📱','💎','🌟','🎪','❤️','🧠','💼','📌','✅',
  '🎭','🌍','📈','🔑','🎵','🏅','🌈','💫','🎲','🔮',
  '🦋','🌺','🍀','⚙️','🎓','🏠','🚗','✈️','🌙','☀️',
  '💪','👑','🎁','📣','🔔','💬','🛡️','⚔️','🧩','🎬',
  '🛒','🏅','⚠️','✔️','➕','📌','🔗','💹','🎉','🧲',
];

const COLORS = [
  '#e53e3e','#ff6b00','#f59e0b','#22c55e','#10b981','#3b82f6',
  '#6366f1','#a855f7','#ec4899','#06b6d4','#ffffff','#6b7280',
];

const TEXT_COLORS = [
  '#ffffff','#e53e3e','#ff6b00','#f59e0b','#22c55e','#3b82f6',
  '#a855f7','#ec4899','#06b6d4','#facc15','#f87171','#86efac',
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

function Toggle({ value, onChange, label }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[10px] text-muted-foreground">{label}</span>
      <button
        onClick={() => onChange(!value)}
        className={`relative w-8 h-4 rounded-full transition-colors ${value ? 'bg-primary' : 'bg-white/10'}`}
      >
        <span className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform ${value ? 'translate-x-4' : 'translate-x-0.5'}`} />
      </button>
    </div>
  );
}

function RichTextEditor({ value, onChange, placeholder, rows = 2 }) {
  const [showColorPick, setShowColorPick] = useState(false);
  const textRef = useRef(null);

  const wrapSelection = (tag) => {
    const el = textRef.current;
    if (!el) return;
    const start = el.selectionStart, end = el.selectionEnd;
    if (start === end) return;
    const selected = value.slice(start, end);
    const before = value.slice(0, start);
    const after = value.slice(end);
    if (tag === 'bold') onChange(before + `**${selected}**` + after);
    if (tag === 'italic') onChange(before + `_${selected}_` + after);
  };

  const applyColor = (color) => {
    const el = textRef.current;
    if (!el) return;
    const start = el.selectionStart, end = el.selectionEnd;
    if (start === end) return;
    const selected = value.slice(start, end);
    const before = value.slice(0, start);
    const after = value.slice(end);
    onChange(before + `[color:${color}]${selected}[/color]` + after);
    setShowColorPick(false);
  };

  return (
    <div>
      {/* Format toolbar */}
      <div className="flex items-center gap-1 mb-1">
        <button onClick={() => wrapSelection('bold')} title="Negrito"
          className="w-6 h-6 rounded bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors">
          <Bold className="w-3 h-3" />
        </button>
        <button onClick={() => wrapSelection('italic')} title="Itálico"
          className="w-6 h-6 rounded bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors">
          <Italic className="w-3 h-3" />
        </button>
        <div className="relative">
          <button onClick={() => setShowColorPick(v => !v)} title="Cor da palavra"
            className="w-6 h-6 rounded bg-white/5 hover:bg-white/10 flex items-center justify-center text-xs text-yellow-400 hover:text-yellow-300 transition-colors font-bold">
            A
          </button>
          {showColorPick && (
            <div className="absolute left-0 top-7 z-50 bg-[#1a1a1a] border border-white/10 rounded-lg p-2 grid grid-cols-6 gap-1" style={{ width:140 }}>
              {TEXT_COLORS.map(c => (
                <button key={c} onClick={() => applyColor(c)}
                  className="w-5 h-5 rounded-md border-2 border-transparent hover:border-white transition-all"
                  style={{ background: c }} />
              ))}
            </div>
          )}
        </div>
        <span className="text-[8px] text-muted-foreground ml-1">Selecione o texto e aplique</span>
      </div>
      <textarea
        ref={textRef}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full px-2 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-primary/60 transition-colors resize-none font-mono"
        style={{ minHeight: rows * 22 }}
      />
    </div>
  );
}

export default function InspectorPanel({ selectedNode, onUpdate, onDelete, onDuplicate, onClose }) {
  const [activeTab, setActiveTab] = useState('conteudo');
  const [uploadingImg, setUploadingImg] = useState(false);
  const fileInputRef = useRef(null);

  if (!selectedNode) return null;

  const tabs = [
    { id: 'conteudo', label: 'Conteúdo' },
    { id: 'estilo',   label: 'Estilo'   },
    { id: 'animacao', label: 'Animação' },
  ];

  const glowIntensity = selectedNode.glow_intensity !== undefined ? selectedNode.glow_intensity : 30;

  const handleImageUpload = async (file) => {
    if (!file) return;
    setUploadingImg(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    onUpdate({ ...selectedNode, image_url: file_url });
    setUploadingImg(false);
  };

  // Block preview thumbnail
  const previewColor = selectedNode.custom_color || '#e53e3e';

  return (
    <div className="w-64 bg-[#0d0d0d] border-l border-white/5 flex flex-col overflow-hidden" style={{ maxHeight:'100%' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-white/5 flex-shrink-0">
        <span className="text-[11px] font-bold text-white tracking-widest">INSPECTOR</span>
        <button onClick={onClose} className="text-muted-foreground hover:text-white p-0.5 rounded hover:bg-white/10 transition-colors">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Block preview card */}
      <div className="px-3 pt-2 pb-1 flex-shrink-0">
        <div className="text-[9px] text-muted-foreground uppercase tracking-widest mb-1.5">Bloco selecionado</div>
        <div className="rounded-xl border flex overflow-hidden" style={{ borderColor: previewColor + '50', background:'#111' }}>
          {/* Image preview area */}
          <div className="w-14 h-14 flex-shrink-0 relative overflow-hidden" style={{ background:'#1a1a1a' }}>
            {selectedNode.image_url
              ? <img src={selectedNode.image_url} className="w-full h-full object-cover" />
              : <div className="w-full h-full flex items-center justify-center text-xl">
                  {selectedNode.icon || <span className="text-muted-foreground text-xs">🖼️</span>}
                </div>
            }
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 hover:opacity-100 transition-opacity text-[8px] text-white text-center">
              {uploadingImg ? '...' : 'Trocar'}
            </button>
          </div>
          <div className="flex-1 px-2 py-2 min-w-0">
            <div className="text-[10px] font-bold text-white truncate leading-tight">{selectedNode.title || 'Sem título'}</div>
            {selectedNode.description && <div className="text-[9px] text-muted-foreground mt-0.5 line-clamp-2">{selectedNode.description}</div>}
            <button onClick={() => fileInputRef.current?.click()}
              className="mt-1.5 text-[8px] text-primary/70 hover:text-primary flex items-center gap-1 transition-colors">
              <ImageIcon className="w-2.5 h-2.5" /> Trocar Imagem
            </button>
          </div>
        </div>
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
          onChange={e => handleImageUpload(e.target.files[0])} />
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/5 flex-shrink-0 px-2">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2 text-[10px] font-semibold transition-colors ${
              activeTab === tab.id ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-white'
            }`}>{tab.label}</button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">

        {activeTab === 'conteudo' && (
          <>
            <div>
              <label className="text-[10px] text-muted-foreground uppercase tracking-wide block mb-1">Título</label>
              <RichTextEditor
                value={selectedNode.title || ''}
                onChange={v => onUpdate({ ...selectedNode, title: v })}
                placeholder="Título do bloco..."
                rows={2}
              />
            </div>

            <div>
              <label className="text-[10px] text-muted-foreground uppercase tracking-wide block mb-1">Descrição</label>
              <RichTextEditor
                value={selectedNode.description || ''}
                onChange={v => onUpdate({ ...selectedNode, description: v })}
                placeholder="Descrição..."
                rows={3}
              />
            </div>

            {/* Emoji picker */}
            <div>
              <label className="text-[10px] text-muted-foreground uppercase tracking-wide block mb-1.5">Ícone / Emoji</label>
              <div className="grid grid-cols-6 gap-1 max-h-24 overflow-y-auto">
                {EMOJIS.map(emoji => (
                  <button key={emoji}
                    onClick={() => onUpdate({ ...selectedNode, icon: selectedNode.icon === emoji ? undefined : emoji })}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm transition-all hover:scale-110 ${
                      selectedNode.icon === emoji ? 'bg-primary/20 border border-primary/50 scale-110' : 'bg-white/4 hover:bg-white/10 border border-transparent'
                    }`}>{emoji}
                  </button>
                ))}
              </div>
              {selectedNode.icon && (
                <button onClick={() => onUpdate({ ...selectedNode, icon: undefined })}
                  className="text-[9px] text-muted-foreground hover:text-primary mt-1 transition-colors">
                  ✕ Remover ícone
                </button>
              )}
            </div>
          </>
        )}

        {activeTab === 'estilo' && (
          <>
            {/* Block color */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[10px] text-muted-foreground uppercase tracking-wide">Cor do bloco</label>
              </div>
              <div className="grid grid-cols-6 gap-1.5">
                {COLORS.map(color => (
                  <button key={color}
                    onClick={() => onUpdate({ ...selectedNode, custom_color: selectedNode.custom_color === color ? undefined : color })}
                    className="w-7 h-7 rounded-lg border-2 transition-all hover:scale-110"
                    style={{ background:color, borderColor:selectedNode.custom_color===color?'#fff':'transparent', boxShadow:selectedNode.custom_color===color?`0 0 8px ${color}`:'none' }}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <label className="text-[9px] text-muted-foreground">Custom:</label>
                <input type="color" value={selectedNode.custom_color||'#e53e3e'}
                  onChange={e => onUpdate({ ...selectedNode, custom_color:e.target.value })}
                  className="w-8 h-6 rounded cursor-pointer bg-transparent border-0" />
                {selectedNode.custom_color && (
                  <button onClick={() => onUpdate({ ...selectedNode, custom_color:undefined })}
                    className="text-[9px] text-muted-foreground hover:text-white">Resetar</button>
                )}
              </div>
            </div>

            {/* Glow intensity */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[10px] text-muted-foreground uppercase tracking-wide">Brilho</label>
                <span className="text-[10px] text-white/50">{glowIntensity}%</span>
              </div>
              <input type="range" min={0} max={100} step={5} value={glowIntensity}
                onChange={e => onUpdate({ ...selectedNode, glow_intensity:Number(e.target.value) })}
                className="w-full h-1 rounded-full appearance-none cursor-pointer"
                style={{ accentColor: selectedNode.custom_color||'#e53e3e' }} />
              <div className="flex justify-between text-[8px] text-muted-foreground mt-0.5">
                <span>Sem brilho</span><span>Máximo</span>
              </div>
            </div>

            {/* 3D depth */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[10px] text-muted-foreground uppercase tracking-wide">Profundidade 3D</label>
                <span className="text-[10px] text-white/50">{selectedNode.depth_amount || 7}</span>
              </div>
              <input type="range" min={0} max={20} step={1} value={selectedNode.depth_amount||7}
                onChange={e => onUpdate({ ...selectedNode, depth_3d:Number(e.target.value)>0, depth_amount:Number(e.target.value) })}
                className="w-full h-1 rounded-full appearance-none cursor-pointer"
                style={{ accentColor:'#e53e3e' }} />
            </div>

            {/* Toggles */}
            <div className="space-y-2.5">
              <Toggle label="Sombra" value={selectedNode.show_shadow !== false}
                onChange={v => onUpdate({ ...selectedNode, show_shadow:v })} />
              <Toggle label="Borda Neon" value={selectedNode.show_neon_border !== false}
                onChange={v => onUpdate({ ...selectedNode, show_neon_border:v })} />
            </div>
          </>
        )}

        {activeTab === 'animacao' && (
          <div className="space-y-4">
            <div>
              <label className="text-[10px] text-muted-foreground uppercase tracking-wide block mb-2">Animação de Entrada</label>
              <div className="space-y-1">
                {ANIMATIONS.map(anim => (
                  <button key={anim.id}
                    onClick={() => onUpdate({ ...selectedNode, animation:anim.id==='none'?undefined:anim.id })}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all text-left ${
                      (selectedNode.animation===anim.id)||(!selectedNode.animation&&anim.id==='none')
                        ? 'bg-primary/12 border border-primary/40 text-white'
                        : 'bg-white/4 border border-transparent text-muted-foreground hover:bg-white/8 hover:text-white'
                    }`}>
                    <span className="w-4 text-center text-sm">{anim.icon}</span>
                    <span>{anim.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[10px] text-muted-foreground uppercase tracking-wide block mb-1.5">Velocidade</label>
              <div className="flex gap-1.5">
                {['lenta','normal','rápida'].map(speed => (
                  <button key={speed}
                    onClick={() => onUpdate({ ...selectedNode, anim_speed:speed })}
                    className={`flex-1 py-1.5 rounded-lg text-[10px] capitalize transition-all ${
                      (selectedNode.anim_speed||'normal')===speed
                        ? 'bg-primary/20 border border-primary/50 text-white'
                        : 'bg-white/4 border border-transparent text-muted-foreground hover:bg-white/8'
                    }`}>{speed.charAt(0).toUpperCase()+speed.slice(1)}</button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[10px] text-muted-foreground uppercase tracking-wide block mb-2">Efeito Contínuo</label>
              <div className="space-y-1">
                {EFFECTS.map(fx => (
                  <button key={fx.id}
                    onClick={() => onUpdate({ ...selectedNode, anim_effect:fx.id==='none'?undefined:fx.id })}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all text-left ${
                      (selectedNode.anim_effect===fx.id)||(!selectedNode.anim_effect&&fx.id==='none')
                        ? 'bg-primary/12 border border-primary/40 text-white'
                        : 'bg-white/4 border border-transparent text-muted-foreground hover:bg-white/8 hover:text-white'
                    }`}>
                    <span className="w-4 text-center">{fx.icon}</span>
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
          className="flex-1 py-2 rounded-lg bg-white/5 border border-white/8 text-[10px] text-muted-foreground hover:text-white hover:bg-white/10 transition-all flex items-center justify-center gap-1">
          <Copy className="w-3 h-3" /> Duplicar
        </button>
        <button onClick={onDelete}
          className="flex-1 py-2 rounded-lg bg-red-950/40 border border-red-900/40 text-[10px] text-red-400 hover:bg-red-900/30 transition-all flex items-center justify-center gap-1">
          <Trash2 className="w-3 h-3" /> Excluir
        </button>
      </div>
    </div>
  );
}