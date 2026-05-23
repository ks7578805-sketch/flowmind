import { Type, Image, Star, Volume2, Video, Minus, GitFork, Share2, LayoutList, Circle, Grid3X3, Plus, Sparkles, AlignLeft, Heading1 } from 'lucide-react';
import { useState } from 'react';

const ELEMENTS = {
  'BÁSICOS': [
    { icon: Type, label: 'Texto', type: 'text' },
    { icon: Sparkles, label: 'Texto com IA', type: 'ai_text' },
    { icon: Heading1, label: 'Título', type: 'title' },
    { icon: AlignLeft, label: 'Bloco explicativo', type: 'block' },
    { icon: Image, label: 'Imagem', type: 'image' },
    { icon: Star, label: 'Ícone', type: 'icon' },
    { icon: Volume2, label: 'Áudio', type: 'audio' },
    { icon: Video, label: 'Vídeo', type: 'video' },
  ],
};

const CONNECTORS = [
  { icon: Sparkles, label: 'Conector Inteligente' },
  { icon: Minus, label: 'Seta' },
  { icon: Minus, label: 'Linha Pontilhada', dashed: true },
  { icon: GitFork, label: 'Fluxo' },
];

const STRUCTURES = [
  { icon: Share2, label: 'Mapa Mental' },
  { icon: GitFork, label: 'Fluxo (Fluxchart)' },
  { icon: LayoutList, label: 'Funil' },
  { icon: Circle, label: 'Comparação' },
  { icon: Minus, label: 'Linha do Tempo' },
  { icon: Grid3X3, label: 'Matriz' },
];

export default function ElementsPanel({ onAddNode }) {
  const [search, setSearch] = useState('');

  return (
    <div className="w-44 bg-[#0d0d0d] border-r border-white/5 flex flex-col overflow-y-auto">
      {/* Search */}
      <div className="p-3 border-b border-white/5">
        <div className="text-xs font-bold text-white mb-2">ELEMENTOS</div>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar elementos"
          className="w-full px-2 py-1.5 bg-white/5 border border-white/10 rounded text-xs text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
        />
      </div>

      {/* Basic elements */}
      <div className="p-3 border-b border-white/5">
        <div className="text-[10px] font-semibold text-muted-foreground mb-2">BÁSICOS</div>
        <div className="grid grid-cols-2 gap-1.5">
          {ELEMENTS['BÁSICOS'].map(el => (
            <div
              key={el.label}
              draggable
              onDragStart={e => {
                e.dataTransfer.setData('elementType', el.type);
                e.dataTransfer.effectAllowed = 'copy';
              }}
              onClick={() => onAddNode?.(el.type)}
              className="flex flex-col items-center gap-1 p-2 rounded-lg bg-white/3 border border-white/5 hover:bg-white/8 hover:border-primary/30 transition-all group cursor-grab active:cursor-grabbing select-none"
              title={`Arraste para o canvas ou clique para adicionar`}
            >
              <el.icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              <span className="text-[9px] text-muted-foreground group-hover:text-white transition-colors text-center leading-tight">{el.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Connectors */}
      <div className="p-3 border-b border-white/5">
        <div className="text-[10px] font-semibold text-muted-foreground mb-2">CONECTORES</div>
        <div className="space-y-1">
          {CONNECTORS.map(c => (
            <button
              key={c.label}
              className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/5 transition-colors group"
            >
              <c.icon className="w-3.5 h-3.5 text-primary" />
              <span className="text-[10px] text-muted-foreground group-hover:text-white transition-colors">{c.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Structures */}
      <div className="p-3 border-b border-white/5">
        <div className="text-[10px] font-semibold text-muted-foreground mb-2">ESTRUTURAS</div>
        <div className="grid grid-cols-2 gap-1.5">
          {STRUCTURES.map(s => (
            <button
              key={s.label}
              className="flex flex-col items-center gap-1 p-2 rounded-lg bg-white/3 border border-white/5 hover:bg-white/8 hover:border-primary/30 transition-all group"
            >
              <s.icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              <span className="text-[9px] text-muted-foreground group-hover:text-white transition-colors text-center leading-tight">{s.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* More */}
      <div className="p-3">
        <button className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg border border-dashed border-white/10 text-[10px] text-muted-foreground hover:text-white hover:border-white/20 transition-all">
          <Plus className="w-3 h-3" />
          + Mais elementos
        </button>
      </div>
    </div>
  );
}