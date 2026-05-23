import { Star, Play, Copy, MoreHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const categoryColors = {
  'Marketing': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'Vendas': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  'Negócios': 'bg-green-500/20 text-green-400 border-green-500/30',
  'Educação': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  'Estratégia': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  'Análise': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  'Produtividade': 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  'Criativo': 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
  'Projetos': 'bg-teal-500/20 text-teal-400 border-teal-500/30',
  'Desenvolvimento Pessoal': 'bg-rose-500/20 text-rose-400 border-rose-500/30',
  'Conteúdo': 'bg-violet-500/20 text-violet-400 border-violet-500/30',
  'Planejamento': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
};

const thumbnailGradients = [
  'from-red-900 via-red-800 to-orange-900',
  'from-purple-900 via-purple-800 to-pink-900',
  'from-blue-900 via-blue-800 to-cyan-900',
  'from-green-900 via-green-800 to-teal-900',
  'from-orange-900 via-orange-800 to-yellow-900',
  'from-indigo-900 via-indigo-800 to-blue-900',
];

export default function ProjectCard({ project, index = 0, onFavorite, onEdit }) {
  const navigate = useNavigate();
  const gradient = thumbnailGradients[index % thumbnailGradients.length];
  const categoryClass = categoryColors[project.category] || 'bg-white/10 text-white/60 border-white/20';

  const timeAgo = (dateStr) => {
    if (!dateStr) return '';
    const diff = Date.now() - new Date(dateStr).getTime();
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (hours < 1) return 'há poucos minutos';
    if (hours < 24) return `há ${hours}h`;
    if (days === 1) return 'há 1d';
    return `há ${days}d`;
  };

  return (
    <div
      className="group relative rounded-xl border border-white/8 bg-card overflow-hidden cursor-pointer hover:border-primary/40 transition-all duration-300 card-glow"
      onClick={() => navigate(`/editor/${project.id}`)}
    >
      {/* Thumbnail */}
      <div className={`relative h-36 bg-gradient-to-br ${gradient} overflow-hidden`}>
        <div className="absolute inset-0 flex items-center justify-center opacity-30">
          <div className="w-16 h-16 rounded-full border-2 border-white/30 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-white/20" />
          </div>
          {[...Array(6)].map((_, i) => (
            <div key={i} className="absolute w-px h-12 bg-white/10"
              style={{ transform: `rotate(${i * 60}deg)`, transformOrigin: '50% 100%' }} />
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Edited time */}
        <div className="absolute top-2 left-2 text-[10px] text-white/70 bg-black/40 px-2 py-0.5 rounded">
          Editado {timeAgo(project.updated_date)}
        </div>

        {/* Actions */}
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => { e.stopPropagation(); onFavorite?.(project); }}
            className={`w-6 h-6 rounded-md flex items-center justify-center bg-black/60 hover:bg-black/80 transition-colors ${project.is_favorite ? 'text-yellow-400' : 'text-white/50'}`}
          >
            <Star className="w-3 h-3" fill={project.is_favorite ? 'currentColor' : 'none'} />
          </button>
          <button
            onClick={(e) => e.stopPropagation()}
            className="w-6 h-6 rounded-md flex items-center justify-center bg-black/60 hover:bg-black/80 transition-colors text-white/50"
          >
            <MoreHorizontal className="w-3 h-3" />
          </button>
        </div>

        {/* Favorite badge */}
        {project.is_favorite && (
          <div className="absolute bottom-2 left-2">
            <Star className="w-3 h-3 text-yellow-400" fill="currentColor" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3">
        <h3 className="font-semibold text-sm text-white truncate">{project.title}</h3>
        <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">{project.description}</p>
        <div className="flex items-center gap-2 mt-2">
          <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded border ${categoryClass}`}>
            {project.category}
          </span>
        </div>
      </div>

      {/* Hover actions */}
      <div className="absolute bottom-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => { e.stopPropagation(); navigate(`/apresentacao/${project.id}`); }}
          className="w-6 h-6 rounded-md bg-primary/20 border border-primary/30 flex items-center justify-center text-primary hover:bg-primary/30 transition-colors"
        >
          <Play className="w-3 h-3" />
        </button>
        <button
          onClick={(e) => e.stopPropagation()}
          className="w-6 h-6 rounded-md bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:bg-white/10 transition-colors"
        >
          <Copy className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}