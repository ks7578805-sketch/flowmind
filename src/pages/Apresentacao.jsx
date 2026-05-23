import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, Pause, ChevronLeft, ChevronRight, X, Maximize, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import MapCanvas from '@/components/editor/MapCanvas';

export default function Apresentacao() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [mapData, setMapData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (id) {
      base44.entities.Project.list()
        .then(projects => {
          const p = projects.find(p => p.id === id);
          if (p) {
            setProject(p);
            try {
              setMapData(p.data_json ? JSON.parse(p.data_json) : null);
            } catch { setMapData(null); }
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-[#050505] flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-3 bg-black/60 backdrop-blur-sm border-b border-white/5 z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <span className="text-sm font-semibold text-white">{project?.title || 'Apresentação'}</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white">
            <span className="text-muted-foreground">Modo Apresentação</span>
          </div>
          <button className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground hover:text-white transition-colors">
            <Maximize className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 relative">
        {mapData ? (
          <MapCanvas
            nodes={mapData.nodes || []}
            connections={mapData.connections || []}
            onSelectNode={() => {}}
            selectedNodeId={null}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-6xl mb-4">🗺️</div>
              <p className="text-white font-bold text-xl">Nenhum mapa para apresentar</p>
              <p className="text-muted-foreground text-sm mt-2">Abra um projeto no editor primeiro.</p>
              <button
                onClick={() => navigate('/projetos')}
                className="mt-4 px-6 py-2.5 bg-primary rounded-lg text-white font-semibold text-sm hover:bg-primary/80 transition-colors"
              >
                Ver Projetos
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom controls */}
      <div className="flex items-center justify-center gap-4 py-4 bg-black/60 backdrop-blur-sm border-t border-white/5">
        <button className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground hover:text-white transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-white hover:bg-primary/80 transition-colors neon-glow"
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
        </button>
        <button className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground hover:text-white transition-colors">
          <ChevronRight className="w-5 h-5" />
        </button>

        <div className="ml-4 text-xs text-muted-foreground">
          Clique nos botões <span className="text-primary font-bold">+</span> para revelar o mapa progressivamente
        </div>
      </div>
    </div>
  );
}