import { useState } from 'react';
import { X, Image, Plus } from 'lucide-react';

const ICONS = ['🎯', '🚀', '💡', '⭐', '🔥', '💰', '📊', '🎨', '🤝', '⚡', '🏆', '📱', '💎', '🌟', '🎪'];

export default function InspectorPanel({ selectedNode, onUpdate, onClose }) {
  const [activeTab, setActiveTab] = useState('conteudo');

  if (!selectedNode) {
    return (
      <div className="w-56 bg-[#0d0d0d] border-l border-white/5 flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-white/5">
          <span className="text-sm font-bold text-white">INSPECTOR</span>
          <button onClick={onClose} className="text-muted-foreground hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1 flex items-center justify-center p-4">
          <p className="text-xs text-muted-foreground text-center">Selecione um bloco no canvas para editar suas propriedades.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-56 bg-[#0d0d0d] border-l border-white/5 flex flex-col overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/5">
        <span className="text-sm font-bold text-white">INSPECTOR</span>
        <button onClick={onClose} className="text-muted-foreground hover:text-white transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Block preview */}
      <div className="p-3 border-b border-white/5">
        <div className="text-[10px] text-muted-foreground mb-2">BLOCO SELECIONADO</div>
        <div className="rounded-lg overflow-hidden border border-white/10 bg-gradient-to-br from-red-900 to-orange-900 h-24 flex items-center justify-center relative group">
          <div className="absolute inset-0 flex items-center justify-center flex-col p-2 text-center">
            <div className="text-xs font-bold text-white leading-tight">{selectedNode.title}</div>
            {selectedNode.description && (
              <div className="text-[9px] text-white/60 mt-0.5">{selectedNode.description}</div>
            )}
          </div>
          <button className="absolute bottom-1.5 left-1.5 right-1.5 text-[9px] bg-black/50 text-white/70 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
            <Image className="w-2.5 h-2.5" /> Trocar Imagem
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/5">
        {['conteudo', 'estilo', 'conexao', 'animacao'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 text-[9px] font-semibold capitalize transition-colors ${
              activeTab === tab ? 'text-primary border-b border-primary' : 'text-muted-foreground hover:text-white'
            }`}
          >
            {tab === 'conteudo' ? 'Conteúdo' : tab === 'estilo' ? 'Estilo' : tab === 'conexao' ? 'Conexão' : 'Animação'}
          </button>
        ))}
      </div>

      <div className="flex-1 p-3 space-y-4">
        {activeTab === 'conteudo' && (
          <>
            {/* Title */}
            <div>
              <label className="text-[10px] text-muted-foreground">Título</label>
              <input
                value={selectedNode.title || ''}
                onChange={e => onUpdate({ ...selectedNode, title: e.target.value })}
                className="w-full mt-1 px-2 py-1.5 bg-white/5 border border-white/10 rounded text-xs text-white focus:outline-none focus:border-primary/50"
              />
            </div>

            {/* Description */}
            <div>
              <label className="text-[10px] text-muted-foreground">Descrição</label>
              <textarea
                value={selectedNode.description || ''}
                onChange={e => onUpdate({ ...selectedNode, description: e.target.value })}
                className="w-full mt-1 px-2 py-1.5 bg-white/5 border border-white/10 rounded text-xs text-white focus:outline-none focus:border-primary/50 resize-none h-16"
              />
            </div>

            {/* Icons */}
            <div>
              <label className="text-[10px] text-muted-foreground">Ícones</label>
              <div className="grid grid-cols-5 gap-1 mt-1">
                {ICONS.map(icon => (
                  <button
                    key={icon}
                    onClick={() => onUpdate({ ...selectedNode, icon })}
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm transition-all ${
                      selectedNode.icon === icon ? 'bg-primary/20 border border-primary/50' : 'bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    {icon}
                  </button>
                ))}
                <button className="w-7 h-7 rounded-lg flex items-center justify-center bg-white/5 hover:bg-white/10 transition-all">
                  <Plus className="w-3 h-3 text-muted-foreground" />
                </button>
              </div>
              <button className="text-[9px] text-muted-foreground hover:text-primary mt-1 transition-colors">− Adicionar ícone</button>
            </div>
          </>
        )}

        {activeTab === 'estilo' && (
          <>
            {/* Node color */}
            <div>
              <label className="text-[10px] text-muted-foreground mb-2 block">COR DA BORDA / LINHA</label>
              <div className="grid grid-cols-6 gap-1.5 mb-2">
                {['#e53e3e','#ff6b00','#22c55e','#3b82f6','#a855f7','#f59e0b',
                  '#10b981','#ec4899','#06b6d4','#6366f1','#ffffff','#6b7280'].map(color => (
                  <button
                    key={color}
                    onClick={() => onUpdate({ ...selectedNode, custom_color: color })}
                    className="w-6 h-6 rounded-lg border-2 transition-all hover:scale-110"
                    style={{
                      background: color,
                      borderColor: selectedNode.custom_color === color ? '#fff' : 'transparent',
                      boxShadow: selectedNode.custom_color === color ? `0 0 8px ${color}` : 'none'
                    }}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2">
                <label className="text-[9px] text-muted-foreground">Cor personalizada:</label>
                <input
                  type="color"
                  value={selectedNode.custom_color || '#e53e3e'}
                  onChange={e => onUpdate({ ...selectedNode, custom_color: e.target.value })}
                  className="w-8 h-6 rounded cursor-pointer bg-transparent border-0"
                />
                {selectedNode.custom_color && (
                  <button
                    onClick={() => onUpdate({ ...selectedNode, custom_color: undefined })}
                    className="text-[9px] text-muted-foreground hover:text-white"
                  >
                    Resetar
                  </button>
                )}
              </div>
            </div>
          </>
        )}

        {activeTab === 'conexao' && (
          <div className="text-xs text-muted-foreground">
            <p>Selecione dois blocos para criar conexões entre eles.</p>
          </div>
        )}

        {activeTab === 'animacao' && (
          <div className="text-xs text-muted-foreground">
            <p>Animações de entrada e saída para apresentações.</p>
          </div>
        )}
      </div>

      {/* Footer actions */}
      <div className="p-3 border-t border-white/5 flex gap-2">
        <button className="flex-1 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[10px] text-muted-foreground hover:text-white hover:bg-white/10 transition-all">
          Duplicar bloco
        </button>
        <button className="flex-1 py-1.5 rounded-lg bg-destructive/10 border border-destructive/20 text-[10px] text-destructive hover:bg-destructive/20 transition-all">
          Excluir bloco
        </button>
      </div>
    </div>
  );
}