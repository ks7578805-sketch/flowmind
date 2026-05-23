import { Link, useLocation } from 'react-router-dom';
import { Home, FolderOpen, LayoutGrid, Sparkles, Edit3, Monitor, Share2, Star, ChevronUp } from 'lucide-react';

const navItems = [
  { icon: Home, label: 'Início', path: '/' },
  { icon: FolderOpen, label: 'Projetos', path: '/projetos' },
  { icon: LayoutGrid, label: 'Modelos', path: '/modelos' },
  { icon: Sparkles, label: 'Criação com IA', path: '/criar-com-ia' },
  { icon: Edit3, label: 'Editor', path: '/editor' },
  { icon: Monitor, label: 'Apresentação', path: '/apresentacao' },
  { icon: Share2, label: 'Compartilhar / Exportar', path: '/compartilhar' },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-56 min-h-screen bg-[#0d0d0d] border-r border-white/5 flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center neon-border">
            <Star className="w-4 h-4 text-primary" />
          </div>
          <div>
            <div className="font-bold text-sm text-white">MAPA TÁTICO</div>
            <div className="text-[10px] text-muted-foreground leading-tight">Mapas visuais que transformam<br/>ideias em impacto.</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-primary/15 text-primary border border-primary/30 neon-border'
                  : 'text-muted-foreground hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Upgrade */}
      <div className="p-3 space-y-3">
        <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/5 p-3">
          <div className="flex items-center gap-2 mb-1">
            <Star className="w-3.5 h-3.5 text-yellow-400" />
            <span className="text-xs font-semibold text-yellow-400">Upgrade para Pro</span>
          </div>
          <p className="text-[10px] text-muted-foreground mb-2">Desbloqueie recursos avançados, IA ilimitada e exportações em 4K.</p>
          <button className="w-full py-1.5 rounded-md bg-primary text-white text-xs font-semibold hover:bg-primary/80 transition-colors">
            Fazer Upgrade
          </button>
        </div>

        {/* User */}
        <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/5 cursor-pointer">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center text-xs font-bold text-white">U</div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-white truncate">Usuário</div>
            <div className="text-[10px] text-primary">Pro</div>
          </div>
          <ChevronUp className="w-3 h-3 text-muted-foreground" />
        </div>

        {/* Usage */}
        <div className="px-2 pb-2 space-y-2">
          <div>
            <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
              <span>Mapas criados</span>
              <span>18 / 50</span>
            </div>
            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary to-orange-500 rounded-full" style={{width: '36%'}} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
              <span>Créditos de IA</span>
              <span>2.450 / 5.000</span>
            </div>
            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary to-orange-500 rounded-full" style={{width: '49%'}} />
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}