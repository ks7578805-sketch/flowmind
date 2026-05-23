import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Sparkles, Edit3, ArrowRight, Bell, Search, Settings } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import ProjectCard from '@/components/ui/ProjectCard';

const suggestedModels = [
  { id: 1, title: 'Plano de Negócios', category: 'Negócios', gradient: 'from-red-900 to-orange-900' },
  { id: 2, title: 'Funil de Marketing', category: 'Marketing', gradient: 'from-purple-900 to-pink-900' },
  { id: 3, title: 'Mapa Mental Criativo', category: 'Criativo', gradient: 'from-blue-900 to-cyan-900' },
  { id: 4, title: 'Linha do Tempo', category: 'Projetos', gradient: 'from-green-900 to-teal-900' },
  { id: 5, title: 'Mapa de Objetivos', category: 'Estratégia', gradient: 'from-yellow-900 to-orange-900' },
  { id: 6, title: 'Comparativo de Produtos', category: 'Análise', gradient: 'from-indigo-900 to-blue-900' },
];

export default function Home() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.Project.list('-updated_date', 6)
      .then(setProjects)
      .catch(() => setProjects([]))
      .finally(() => setLoading(false));
  }, []);

  const handleFavorite = async (project) => {
    await base44.entities.Project.update(project.id, { is_favorite: !project.is_favorite });
    setProjects(prev => prev.map(p => p.id === project.id ? { ...p, is_favorite: !p.is_favorite } : p));
  };

  return (
    <div className="min-h-screen bg-cinematic">
      {/* Header */}
      <div className="flex items-center justify-between px-8 py-4 border-b border-white/5">
        <div />
        <div className="flex items-center gap-3">
          <button className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground hover:text-white transition-colors">
            <Search className="w-4 h-4" />
          </button>
          <button className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground hover:text-white transition-colors relative">
            <Bell className="w-4 h-4" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-primary rounded-full" />
          </button>
          <button className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground hover:text-white transition-colors">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="px-8 py-8 space-y-10">
        {/* Hero */}
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#0a0a0a] via-[#1a0303] to-[#0a0a0a] border border-primary/15 p-8 min-h-[200px] flex items-center card-glow">
          <div className="relative z-10 max-w-lg">
            <p className="text-white/60 text-sm mb-1">Bem-vindo de volta! 👋</p>
            <h1 className="text-3xl font-black text-white leading-tight mb-3">
              Transforme ideias em mapas<br />
              <span className="text-neon">visuais poderosos.</span>
            </h1>
            <p className="text-muted-foreground text-sm mb-6">
              Crie, organize e apresente suas ideias com inteligência<br/>artificial e ferramentas visuais de última geração.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => navigate('/projetos')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-black text-sm hover:bg-red-600 transition-all neon-glow group relative overflow-hidden"
              >
                <Plus className="w-4 h-4" />
                Criar novo mapa
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => navigate('/criar-com-ia')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-semibold text-sm hover:bg-white/10 transition-all"
              >
                <Sparkles className="w-4 h-4 text-primary" />
                Criar com IA
              </button>
              <button
                onClick={() => navigate('/editor')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-semibold text-sm hover:bg-white/10 transition-all"
              >
                <Edit3 className="w-4 h-4 text-white/60" />
                Criar manualmente
              </button>
            </div>
          </div>

          {/* Rocket visual */}
          <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-80 hidden lg:block">
            <div className="relative w-40 h-40">
              <div className="absolute inset-0 rounded-full bg-primary/10 animate-pulse" />
              <div className="absolute inset-4 rounded-full bg-primary/20" />
              <div className="absolute inset-0 flex items-center justify-center text-6xl">🚀</div>
            </div>
          </div>

          {/* Ambient lines */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/4 via-transparent to-orange-500/4" />
          </div>
        </div>

        {/* Recent Projects */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-sm">🕐</span>
              <h2 className="font-bold text-white">Projetos recentes</h2>
            </div>
            <button onClick={() => navigate('/projetos')} className="text-sm text-primary hover:text-primary/80 flex items-center gap-1 transition-colors">
              Ver todos os projetos <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-52 rounded-xl bg-white/5 animate-pulse" />
              ))}
            </div>
          ) : projects.length === 0 ? (
            <div className="rounded-xl border border-dashed border-white/10 p-10 text-center">
              <p className="text-muted-foreground text-sm">Nenhum projeto ainda.</p>
              <button onClick={() => navigate('/editor')} className="mt-3 text-primary text-sm hover:underline">Criar seu primeiro mapa →</button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {projects.map((p, i) => (
                <ProjectCard key={p.id} project={p} index={i} onFavorite={handleFavorite} />
              ))}
            </div>
          )}
        </div>

        {/* Suggested Models */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-sm">⭐</span>
              <h2 className="font-bold text-white">Modelos sugeridos para você</h2>
            </div>
            <button onClick={() => navigate('/modelos')} className="text-sm text-primary hover:text-primary/80 flex items-center gap-1 transition-colors">
              Ver todos os modelos <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {suggestedModels.map((model) => (
              <div
                key={model.id}
                onClick={() => navigate('/modelos')}
                className="group rounded-xl border border-white/8 overflow-hidden cursor-pointer hover:border-primary/40 transition-all"
              >
                <div className={`h-24 bg-gradient-to-br ${model.gradient} relative flex items-center justify-center`}>
                  <div className="absolute inset-0 opacity-20 flex items-center justify-center">
                    <div className="w-12 h-12 border border-white/30 rounded-full" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
                <div className="p-2.5 bg-card">
                  <p className="text-xs font-semibold text-white truncate">{model.title}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{model.category}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}