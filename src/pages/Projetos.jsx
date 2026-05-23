import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, Plus, LayoutGrid, List, Star, Trash2, Clock, Play, Copy, MoreHorizontal } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import ProjectCard from '@/components/ui/ProjectCard';

const TABS = ['Todos os Projetos', 'Recentes', 'Favoritos', 'Lixeira'];

const categoryColors = {
  'Marketing': 'bg-blue-500/20 text-blue-400',
  'Vendas': 'bg-purple-500/20 text-purple-400',
  'Negócios': 'bg-green-500/20 text-green-400',
  'Educação': 'bg-cyan-500/20 text-cyan-400',
  'Estratégia': 'bg-yellow-500/20 text-yellow-400',
  'Análise': 'bg-orange-500/20 text-orange-400',
  'Produtividade': 'bg-pink-500/20 text-pink-400',
  'Criativo': 'bg-indigo-500/20 text-indigo-400',
  'Projetos': 'bg-teal-500/20 text-teal-400',
  'Desenvolvimento Pessoal': 'bg-rose-500/20 text-rose-400',
  'Conteúdo': 'bg-violet-500/20 text-violet-400',
  'Planejamento': 'bg-amber-500/20 text-amber-400',
};

export default function Projetos() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [viewMode, setViewMode] = useState('grid');
  const [search, setSearch] = useState('');

  useEffect(() => {
    base44.entities.Project.list('-updated_date', 50)
      .then(setProjects)
      .catch(() => setProjects([]))
      .finally(() => setLoading(false));
  }, []);

  const handleFavorite = async (project) => {
    await base44.entities.Project.update(project.id, { is_favorite: !project.is_favorite });
    setProjects(prev => prev.map(p => p.id === project.id ? { ...p, is_favorite: !p.is_favorite } : p));
  };

  const filtered = projects.filter(p => {
    const matchSearch = p.title?.toLowerCase().includes(search.toLowerCase());
    if (activeTab === 1) return matchSearch && p.status === 'active';
    if (activeTab === 2) return matchSearch && p.is_favorite;
    if (activeTab === 3) return matchSearch && p.status === 'trash';
    return matchSearch && p.status !== 'trash';
  });

  const timeAgo = (d) => {
    if (!d) return '';
    const diff = Date.now() - new Date(d).getTime();
    const h = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (h < 1) return 'Hoje';
    if (h < 24) return `Hoje às ${new Date(d).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
    if (days === 1) return 'Ontem';
    return `${days} dias atrás`;
  };

  return (
    <div className="min-h-screen bg-background p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-2xl font-black text-white">Projetos</h1>
          <p className="text-muted-foreground text-sm mt-1">Gerencie todos os seus mapas visuais em um só lugar.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar projetos..."
              className="pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 w-56"
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-muted-foreground hover:text-white transition-colors">
            <SlidersHorizontal className="w-4 h-4" />
            Filtros
          </button>
          <button
            onClick={() => navigate('/editor')}
            className="flex items-center gap-2 px-4 py-2 bg-primary rounded-lg text-white text-sm font-semibold hover:bg-primary/80 transition-colors neon-glow"
          >
            <Plus className="w-4 h-4" />
            Novo Mapa
          </button>
        </div>
      </div>

      {/* Tabs + View Toggle */}
      <div className="flex items-center justify-between mt-6 mb-4">
        <div className="flex gap-1 border-b border-white/10">
          {TABS.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveTab(i)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium transition-all border-b-2 ${
                activeTab === i
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-white'
              }`}
            >
              {i === 0 && <LayoutGrid className="w-3.5 h-3.5" />}
              {i === 1 && <Clock className="w-3.5 h-3.5" />}
              {i === 2 && <Star className="w-3.5 h-3.5" />}
              {i === 3 && <Trash2 className="w-3.5 h-3.5" />}
              {tab}
            </button>
          ))}
        </div>
        <div className="flex gap-1 border border-white/10 rounded-lg overflow-hidden">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-2 transition-colors ${viewMode === 'grid' ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:text-white'}`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-2 transition-colors ${viewMode === 'list' ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:text-white'}`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {[...Array(10)].map((_, i) => <div key={i} className="h-52 rounded-xl bg-white/5 animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-white/10 p-16 text-center">
          <p className="text-muted-foreground">Nenhum projeto encontrado.</p>
          <button onClick={() => navigate('/editor')} className="mt-3 text-primary text-sm hover:underline">Criar novo mapa →</button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {filtered.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} onFavorite={handleFavorite} />
          ))}
        </div>
      ) : (
        /* List view */
        <div>
          <div className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 px-4 py-2 text-xs text-muted-foreground border-b border-white/5 mb-1">
            <span>Nome do Projeto</span>
            <span>Categoria</span>
            <span>Editado em</span>
            <span>Criado em</span>
            <span>Ações</span>
          </div>
          {filtered.map((p) => (
            <div
              key={p.id}
              onClick={() => navigate(`/editor/${p.id}`)}
              className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 px-4 py-3 rounded-lg hover:bg-white/5 cursor-pointer border border-transparent hover:border-white/5 transition-all items-center"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-900 to-orange-900 flex-shrink-0" />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-medium text-white truncate">{p.title}</p>
                    {p.is_favorite && <Star className="w-3 h-3 text-yellow-400 flex-shrink-0" fill="currentColor" />}
                  </div>
                  <p className="text-[11px] text-muted-foreground truncate">{p.description}</p>
                </div>
              </div>
              <div>
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${categoryColors[p.category] || 'bg-white/10 text-white/60'}`}>
                  ● {p.category}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{timeAgo(p.updated_date)}</p>
              <p className="text-xs text-muted-foreground">{p.created_date ? new Date(p.created_date).toLocaleDateString('pt-BR') : ''}</p>
              <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                <button onClick={() => navigate(`/apresentacao/${p.id}`)} className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-muted-foreground hover:text-white transition-colors">
                  <Play className="w-3 h-3" />
                </button>
                <button className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-muted-foreground hover:text-white transition-colors">
                  <Copy className="w-3 h-3" />
                </button>
                <button className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-muted-foreground hover:text-white transition-colors">
                  <MoreHorizontal className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
          <div className="flex items-center justify-between mt-4 px-4 text-sm text-muted-foreground">
            <span>Mostrando 1 a {filtered.length} de {filtered.length} projetos</span>
          </div>
        </div>
      )}
    </div>
  );
}