import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Undo2, Redo2, Minus, Plus, Save, History, Download, Share2, Play, MoreHorizontal, Edit2, Loader2, ArrowLeft } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import MapCanvas from '@/components/editor/MapCanvas';
import ElementsPanel from '@/components/editor/ElementsPanel';
import InspectorPanel from '@/components/editor/InspectorPanel';

// Facebook Ads template from the original image
const FACEBOOK_ADS_TEMPLATE = {
  nodes: [
    // Center
    { id: 'root', title: 'POR QUE VOCÊ PRECISA DE VÁRIOS CRIATIVOS NO FACEBOOK ADS', description: 'Nem todo criativo vai escalar, mas todos podem ajudar a escalar.', type: 'center', x: 550, y: 400, expanded: true, parent_id: null },

    // Left branches
    { id: 'tipos', title: 'OS 2 TIPOS DE CRIATIVOS', type: 'branch', x: 200, y: 200, parent_id: 'root' },
    { id: 'criativo_vende', title: 'CRIATIVO QUE VENDE (Mas não escala)', description: 'Faz algumas vendas • Funciona com pouco orçamento', type: 'leaf', x: 60, y: 140, parent_id: 'tipos' },
    { id: 'criativo_escala', title: 'CRIATIVO QUE ESCALA (Campeão)', description: 'Quanto mais orçamento, mais escala • Traz volume e consistência', type: 'leaf', x: 60, y: 250, parent_id: 'tipos' },
    { id: 'erro', title: 'ERRO MAIS COMUM', description: 'Focar apenas em encontrar criativos que escalem e descartar todos os outros.', type: 'highlight', x: 120, y: 370, parent_id: 'root' },
    { id: 'exemplo', title: 'EXEMPLO PRÁTICO', type: 'branch', x: 130, y: 530, parent_id: 'root' },
    { id: 'anuncio1', title: 'ANÚNCIO 1 - GANCHO / CURSOS', description: 'Apresenta o tema e desperta curiosidade.', type: 'leaf', x: 50, y: 480, parent_id: 'exemplo' },
    { id: 'anuncio2', title: 'ANÚNCIO 2 - PROVA SOCIAL', description: 'Mostra alunos e resultados reais.', type: 'leaf', x: 50, y: 530, parent_id: 'exemplo' },
    { id: 'anuncio3', title: 'ANÚNCIO 3 - RESULTADOS', description: 'Mostra números, antes e depois.', type: 'leaf', x: 50, y: 580, parent_id: 'exemplo' },
    { id: 'anuncio4', title: 'ANÚNCIO 4 - OFERTA IRRESISTÍVEL (CAMPEÃO)', description: 'Oferta clara + bônus + urgência.', type: 'leaf', x: 50, y: 630, parent_id: 'exemplo' },
    { id: 'compra_ex', title: 'COMPRA', description: 'Decisão tomada!', type: 'highlight', x: 100, y: 680, parent_id: 'exemplo' },

    // Bottom
    { id: 'por_que', title: 'POR QUE CRIATIVOS QUE NÃO ESCALAM SÃO ESSENCIAIS?', type: 'branch', x: 550, y: 680, parent_id: 'root' },
    { id: 'aquecem', title: 'AQUECEM O PÚBLICO', description: 'Preparam a mente e despertam emoções.', type: 'leaf', x: 280, y: 750, parent_id: 'por_que' },
    { id: 'constroi', title: 'CONSTROEM CONFIANÇA', description: 'Através de diferentes provas e ângulos.', type: 'leaf', x: 410, y: 750, parent_id: 'por_que' },
    { id: 'aumentam', title: 'AUMENTAM A DECISÃO DE COMPRA', description: 'Cada contato fortalece a vontade de comprar.', type: 'leaf', x: 550, y: 750, parent_id: 'por_que' },
    { id: 'trabalham', title: 'TRABALHAM EM CONJUNTO', description: 'Um criativo completa o outro.', type: 'leaf', x: 680, y: 750, parent_id: 'por_que' },
    { id: 'potencializam', title: 'POTENCIALIZAM O CRIATIVO CAMPEÃO', description: 'Mais resultados com menos custo.', type: 'leaf', x: 810, y: 750, parent_id: 'por_que' },
    { id: 'resumo', title: 'RESUMO DA ESTRATÉGIA', description: 'Tenha muitos criativos rodando. Deixe que cada um cumpra seu papel. Assim, seu criativo campeão terá o caminho perfeito para ESCALAR.', type: 'center', x: 550, y: 870, parent_id: 'por_que' },

    // Right branches
    { id: 'influenciam', title: 'COMO VÁRIOS CRIATIVOS INFLUENCIAM NA DECISÃO DE COMPRA', type: 'branch', x: 900, y: 200, parent_id: 'root' },
    { id: 'contato1', title: '1º CONTATO - CRIATIVO QUE VENDE', description: 'Desperta o primeiro interesse. "Nossa, que interessante!"', type: 'leaf', x: 1050, y: 130, parent_id: 'influenciam' },
    { id: 'emocao1', title: 'EMOÇÃO: INTERESSE ⭐⭐', type: 'leaf', x: 1220, y: 130, parent_id: 'contato1' },
    { id: 'contato2', title: '2º CONTATO - PROVA SOCIAL', description: 'Cria confiança e validação. "Outras pessoas já compraram."', type: 'leaf', x: 1050, y: 230, parent_id: 'influenciam' },
    { id: 'emocao2', title: 'EMOÇÃO: CONFIANÇA ⭐⭐⭐', type: 'leaf', x: 1220, y: 230, parent_id: 'contato2' },
    { id: 'contato3', title: '3º CONTATO - RESULTADOS / BENEFÍCIOS', description: 'Mostra transformação e reforça o valor.', type: 'leaf', x: 1050, y: 330, parent_id: 'influenciam' },
    { id: 'emocao3', title: 'EMOÇÃO: DESEJO ⭐⭐⭐⭐', type: 'leaf', x: 1220, y: 330, parent_id: 'contato3' },
    { id: 'contato4', title: '4º CONTATO - CRIATIVO QUE ESCALA', description: 'Fecha o ciclo e converte. "É agora! Vou comprar."', type: 'leaf', x: 1050, y: 430, parent_id: 'influenciam' },
    { id: 'emocao4', title: 'EMOÇÃO: DECISÃO ⭐⭐⭐⭐⭐', type: 'leaf', x: 1220, y: 430, parent_id: 'contato4' },
    { id: 'compra', title: '🛒 COMPRA REALIZADA', type: 'highlight', x: 1050, y: 520, parent_id: 'influenciam' },

    { id: 'entender', title: 'O QUE VOCÊ PRECISA ENTENDER', type: 'branch', x: 950, y: 600, parent_id: 'root' },
    { id: 'e1', title: 'Nem todo criativo nasceu para escalar, mas todos podem contribuir.', type: 'leaf', x: 1100, y: 560, parent_id: 'entender' },
    { id: 'e2', title: 'Cada pessoa precisa de vários estímulos para tomar uma decisão.', type: 'leaf', x: 1100, y: 610, parent_id: 'entender' },
    { id: 'e3', title: 'Descartar criativos cedo demais é jogar dinheiro fora.', type: 'leaf', x: 1100, y: 660, parent_id: 'entender' },
    { id: 'e4', title: 'Mais criativos = mais toques = mais vendas com menos custo.', type: 'leaf', x: 1100, y: 710, parent_id: 'entender' },
  ],
  connections: [
    { from: 'root', to: 'tipos' },
    { from: 'root', to: 'erro' },
    { from: 'root', to: 'exemplo' },
    { from: 'root', to: 'por_que' },
    { from: 'root', to: 'influenciam' },
    { from: 'root', to: 'entender' },
    { from: 'tipos', to: 'criativo_vende' },
    { from: 'tipos', to: 'criativo_escala' },
    { from: 'exemplo', to: 'anuncio1' },
    { from: 'exemplo', to: 'anuncio2' },
    { from: 'exemplo', to: 'anuncio3' },
    { from: 'exemplo', to: 'anuncio4' },
    { from: 'exemplo', to: 'compra_ex' },
    { from: 'por_que', to: 'aquecem' },
    { from: 'por_que', to: 'constroi' },
    { from: 'por_que', to: 'aumentam' },
    { from: 'por_que', to: 'trabalham' },
    { from: 'por_que', to: 'potencializam' },
    { from: 'por_que', to: 'resumo' },
    { from: 'influenciam', to: 'contato1' },
    { from: 'influenciam', to: 'contato2' },
    { from: 'influenciam', to: 'contato3' },
    { from: 'influenciam', to: 'contato4' },
    { from: 'influenciam', to: 'compra' },
    { from: 'contato1', to: 'emocao1' },
    { from: 'contato2', to: 'emocao2' },
    { from: 'contato3', to: 'emocao3' },
    { from: 'contato4', to: 'emocao4' },
    { from: 'entender', to: 'e1' },
    { from: 'entender', to: 'e2' },
    { from: 'entender', to: 'e3' },
    { from: 'entender', to: 'e4' },
  ]
};

const DEFAULT_MAP = {
  nodes: [
    { id: 'root', title: 'Mapa Principal', description: 'Clique + para expandir', type: 'center', x: 550, y: 380, expanded: true, parent_id: null },
    { id: 'n1', title: 'Tópico 1', description: 'Descrição do tópico 1', type: 'branch', x: 280, y: 250, parent_id: 'root' },
    { id: 'n2', title: 'Tópico 2', description: 'Descrição do tópico 2', type: 'branch', x: 820, y: 250, parent_id: 'root' },
    { id: 'n3', title: 'Tópico 3', description: 'Descrição do tópico 3', type: 'branch', x: 280, y: 520, parent_id: 'root' },
    { id: 'n4', title: 'Tópico 4', description: 'Descrição do tópico 4', type: 'branch', x: 820, y: 520, parent_id: 'root' },
    { id: 'n1a', title: 'Sub-tópico 1a', type: 'leaf', x: 100, y: 180, parent_id: 'n1' },
    { id: 'n1b', title: 'Sub-tópico 1b', type: 'leaf', x: 100, y: 300, parent_id: 'n1' },
    { id: 'n2a', title: 'Sub-tópico 2a', type: 'leaf', x: 1000, y: 180, parent_id: 'n2' },
    { id: 'n2b', title: 'Sub-tópico 2b', type: 'leaf', x: 1000, y: 300, parent_id: 'n2' },
  ],
  connections: [
    { from: 'root', to: 'n1' },
    { from: 'root', to: 'n2' },
    { from: 'root', to: 'n3' },
    { from: 'root', to: 'n4' },
    { from: 'n1', to: 'n1a' },
    { from: 'n1', to: 'n1b' },
    { from: 'n2', to: 'n2a' },
    { from: 'n2', to: 'n2b' },
  ]
};

export default function Editor() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [mapData, setMapData] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState('Novo Mapa');
  const [editingTitle, setEditingTitle] = useState(false);

  useEffect(() => {
    const templateId = searchParams.get('template');

    if (id) {
      base44.entities.Project.list()
        .then(projects => {
          const p = projects.find(p => p.id === id);
          if (p) {
            setProject(p);
            setTitle(p.title);
            try {
              const data = p.data_json ? JSON.parse(p.data_json) : null;
              setMapData(data || DEFAULT_MAP);
            } catch {
              setMapData(DEFAULT_MAP);
            }
          } else {
            setMapData(DEFAULT_MAP);
          }
        })
        .catch(() => setMapData(DEFAULT_MAP))
        .finally(() => setLoading(false));
    } else if (templateId === '13') {
      // Facebook Ads template
      setMapData(FACEBOOK_ADS_TEMPLATE);
      setTitle('Facebook Ads - Criativos');
      setLoading(false);
    } else {
      setMapData(DEFAULT_MAP);
      setLoading(false);
    }
  }, [id, searchParams]);

  const handleSave = async () => {
    setSaving(true);
    const dataStr = JSON.stringify(mapData);
    if (project?.id) {
      await base44.entities.Project.update(project.id, { title, data_json: dataStr });
    } else {
      const p = await base44.entities.Project.create({
        title,
        data_json: dataStr,
        category: 'Estratégia',
        map_type: 'mind_map',
      });
      setProject(p);
      navigate(`/editor/${p.id}`, { replace: true });
    }
    setSaving(false);
  };

  const handleNodeUpdate = (updatedNode) => {
    setMapData(prev => ({
      ...prev,
      nodes: prev.nodes.map(n => n.id === updatedNode.id ? updatedNode : n)
    }));
    setSelectedNode(updatedNode);
  };

  const handleAddNode = (type, x, y) => {
    const newNode = {
      id: `node_${Date.now()}`,
      title: type === 'title' ? 'Título' : type === 'text' ? 'Texto' : type === 'block' ? 'Bloco explicativo' : 'Novo Bloco',
      description: '',
      type: type === 'title' ? 'branch' : type === 'center' ? 'center' : 'leaf',
      x: x ?? (400 + Math.random() * 300),
      y: y ?? (250 + Math.random() * 200),
      parent_id: selectedNode?.id || null,
      expanded: true,
    };
    setMapData(prev => ({
      nodes: [...prev.nodes, newNode],
      connections: selectedNode
        ? [...prev.connections, { from: selectedNode.id, to: newNode.id }]
        : prev.connections,
    }));
    setSelectedNode(newNode);
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background h-screen">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden" style={{ maxHeight: '100vh' }}>
      {/* Top toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#0d0d0d] border-b border-white/5 flex-shrink-0">
        <div className="flex items-center gap-3">
          {/* Back button */}
          <button
            onClick={() => navigate(-1)}
            className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground hover:text-white hover:bg-white/10 transition-colors"
            title="Voltar"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-center gap-1.5">
            {editingTitle ? (
              <input
                autoFocus
                value={title}
                onChange={e => setTitle(e.target.value)}
                onBlur={() => setEditingTitle(false)}
                onKeyDown={e => e.key === 'Enter' && setEditingTitle(false)}
                className="bg-white/10 border border-white/20 rounded px-2 py-0.5 text-sm font-semibold text-white focus:outline-none focus:border-primary/50 min-w-40"
              />
            ) : (
              <button onClick={() => setEditingTitle(true)} className="flex items-center gap-1.5 hover:bg-white/5 px-2 py-0.5 rounded transition-colors">
                <span className="text-sm font-semibold text-white">{title}</span>
                <Edit2 className="w-3 h-3 text-muted-foreground" />
              </button>
            )}
          </div>
          <span className="text-[10px] text-muted-foreground">Salvo automaticamente</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Undo/redo */}
          <div className="flex gap-0.5 border border-white/10 rounded-lg overflow-hidden">
            <button className="px-2 py-1.5 hover:bg-white/5 text-muted-foreground hover:text-white transition-colors">
              <Undo2 className="w-3.5 h-3.5" />
            </button>
            <button className="px-2 py-1.5 hover:bg-white/5 text-muted-foreground hover:text-white transition-colors border-l border-white/5">
              <Redo2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Zoom display */}
          <div className="flex items-center gap-1 px-2 py-1.5 border border-white/10 rounded-lg text-xs text-muted-foreground">
            <Minus className="w-3 h-3" />
            <span>100%</span>
            <Plus className="w-3 h-3" />
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs text-white hover:bg-white/10 transition-colors"
          >
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            Salvar
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs text-muted-foreground hover:text-white transition-colors">
            <History className="w-3.5 h-3.5" />
            Histórico
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs text-muted-foreground hover:text-white transition-colors">
            <Download className="w-3.5 h-3.5" />
            Exportar
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs text-muted-foreground hover:text-white transition-colors">
            <Share2 className="w-3.5 h-3.5" />
            Compartilhar
          </button>
          <button
            onClick={() => project?.id && navigate(`/apresentacao/${project.id}`)}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-primary rounded-lg text-xs text-white font-semibold hover:bg-primary/80 transition-colors neon-glow"
          >
            <Play className="w-3.5 h-3.5" />
            Apresentar
          </button>
          <button className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground hover:text-white transition-colors">
            <MoreHorizontal className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Editor body */}
      <div className="flex flex-1 overflow-hidden">
        <ElementsPanel onAddNode={handleAddNode} />

        <div className="flex-1 relative">
          {mapData && (
            <MapCanvas
              nodes={mapData.nodes || []}
              connections={mapData.connections || []}
              onSelectNode={setSelectedNode}
              selectedNodeId={selectedNode?.id}
              onDropNode={handleAddNode}
              onNodeMove={(nodeId, x, y) => {
                setMapData(prev => ({
                  ...prev,
                  nodes: prev.nodes.map(n => n.id === nodeId ? { ...n, x, y } : n)
                }));
              }}
            />
          )}
        </div>

        <InspectorPanel
          selectedNode={selectedNode}
          onUpdate={handleNodeUpdate}
          onClose={() => setSelectedNode(null)}
        />
      </div>
    </div>
  );
}