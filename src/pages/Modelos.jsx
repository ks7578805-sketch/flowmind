import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, Bookmark, Plus } from 'lucide-react';

const CATEGORIES = ['Todos', 'Negócios', 'Marketing', 'Vendas', 'Educação', 'Desenvolvimento Pessoal', 'Projetos', 'Estratégia', 'Análise', 'Produtividade', 'Criativo'];

const TEMPLATES = [
  { id: 1, title: 'Funil de Marketing Completo', desc: 'Da atração à conversão com etapas detalhadas.', category: 'Marketing', gradient: 'from-red-900 via-red-800 to-orange-900', tags: ['Marketing'] },
  { id: 2, title: 'Lançamento de Produto', desc: 'Mapa estratégico para lançar produtos digitais.', category: 'Negócios', gradient: 'from-orange-900 via-red-800 to-red-900', tags: ['Negócios'] },
  { id: 3, title: 'Análise SWOT Pessoal', desc: 'Avalie forças, fraquezas, oportunidades e ameaças.', category: 'Desenvolvimento Pessoal', gradient: 'from-purple-900 via-purple-800 to-pink-900', tags: ['Desenvolvimento Pessoal'] },
  { id: 4, title: 'Estratégia de Conteúdo', desc: 'Planejamento completo para multiplataforma.', category: 'Marketing', gradient: 'from-blue-900 via-blue-800 to-cyan-900', tags: ['Marketing'] },
  { id: 5, title: 'Mapa Mental Criativo', desc: 'Organize ideias e conecte conceitos com liberdade.', category: 'Criativo', gradient: 'from-yellow-900 via-yellow-800 to-orange-900', tags: ['Criativo'] },
  { id: 6, title: 'Linha do Tempo de Projetos', desc: 'Visualize eventos, marcos e entregas importantes.', category: 'Projetos', gradient: 'from-green-900 via-green-800 to-teal-900', tags: ['Projetos'] },
  { id: 7, title: 'Pirâmide de Aprendizado', desc: 'Estruture conteúdos do básico ao avançado.', category: 'Educação', gradient: 'from-indigo-900 via-indigo-800 to-blue-900', tags: ['Educação'] },
  { id: 8, title: 'Funil de Vendas', desc: 'Processo completo para gerar e fechar vendas.', category: 'Vendas', gradient: 'from-red-900 via-purple-900 to-pink-900', tags: ['Vendas'] },
  { id: 9, title: 'Planejamento OKR', desc: 'Defina objetivos, resultados-chave e iniciativas.', category: 'Estratégia', gradient: 'from-teal-900 via-teal-800 to-cyan-900', tags: ['Estratégia'] },
  { id: 10, title: 'Plano de Metas - 90 Dias', desc: 'Defina metas claras e acompanhe seu progresso.', category: 'Produtividade', gradient: 'from-pink-900 via-pink-800 to-rose-900', tags: ['Produtividade'] },
  { id: 11, title: 'Comparativo de Opções', desc: 'Compare soluções e tome decisões melhores.', category: 'Análise', gradient: 'from-violet-900 via-violet-800 to-purple-900', tags: ['Análise'] },
  { id: 12, title: 'Jornada do Cliente', desc: 'Entenda cada etapa da experiência do seu cliente.', category: 'Negócios', gradient: 'from-amber-900 via-amber-800 to-orange-900', tags: ['Negócios'] },
  { id: 13, title: 'Facebook Ads - Criativos', desc: 'Por que você precisa de vários criativos.', category: 'Marketing', gradient: 'from-red-900 via-red-800 to-orange-900', tags: ['Marketing'] },
  { id: 14, title: 'Análise SWOT Empresarial', desc: 'Pontos fortes, fracos, oportunidades e ameaças.', category: 'Análise', gradient: 'from-purple-900 via-purple-800 to-indigo-900', tags: ['Análise'] },
  { id: 15, title: 'Mapa de Objetivos', desc: 'Visualize seus objetivos e o caminho para atingi-los.', category: 'Estratégia', gradient: 'from-cyan-900 via-cyan-800 to-blue-900', tags: ['Estratégia'] },
  { id: 16, title: 'Criar do Zero', desc: 'Comece com uma tela em branco e crie livremente.', category: 'Criativo', gradient: 'from-gray-900 via-gray-800 to-gray-900', tags: ['Criativo'] },
];

export default function Modelos() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [search, setSearch] = useState('');
  const [bookmarked, setBookmarked] = useState(new Set());

  const filtered = TEMPLATES.filter(t => {
    const matchCat = activeCategory === 'Todos' || t.category === activeCategory;
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase()) || t.desc.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const toggleBookmark = (id, e) => {
    e.stopPropagation();
    setBookmarked(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

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
  };

  return (
    <div className="min-h-screen bg-background p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-2xl font-black text-white">Modelos (Templates)</h1>
          <p className="text-muted-foreground text-sm mt-1">Escolha um modelo e comece do jeito fácil e profissional.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar modelos..."
              className="pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 w-56"
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-muted-foreground hover:text-white transition-colors">
            <SlidersHorizontal className="w-4 h-4" />
            Filtros
          </button>
          <select className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-muted-foreground focus:outline-none focus:border-primary/50">
            <option>Mais recentes</option>
            <option>Mais populares</option>
          </select>
        </div>
      </div>

      {/* Category tabs */}
      <div className="flex gap-1 mt-6 mb-6 overflow-x-auto pb-1 scrollbar-none flex-wrap">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              activeCategory === cat
                ? 'bg-primary/20 text-primary border border-primary/30'
                : 'text-muted-foreground hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {filtered.map(template => (
          <div
            key={template.id}
            onClick={() => navigate(`/editor?template=${template.id}`)}
            className="group rounded-xl border border-white/8 overflow-hidden cursor-pointer hover:border-primary/40 transition-all card-glow"
          >
            <div className={`relative h-44 bg-gradient-to-br ${template.gradient} overflow-hidden`}>
              <div className="absolute inset-0 flex items-center justify-center opacity-25">
                <div className="w-20 h-20 rounded-full border-2 border-white/30" />
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="absolute w-px h-16 bg-white/20"
                    style={{ transform: `rotate(${i * 45}deg)`, transformOrigin: '50% 100%', top: '50%' }} />
                ))}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <button
                onClick={e => toggleBookmark(template.id, e)}
                className={`absolute top-3 right-3 w-7 h-7 rounded-lg flex items-center justify-center transition-all ${bookmarked.has(template.id) ? 'bg-primary/30 text-primary' : 'bg-black/40 text-white/40 opacity-0 group-hover:opacity-100'}`}
              >
                <Bookmark className="w-3.5 h-3.5" fill={bookmarked.has(template.id) ? 'currentColor' : 'none'} />
              </button>
            </div>
            <div className="p-4 bg-card">
              <h3 className="font-bold text-sm text-white">{template.title}</h3>
              <p className="text-[11px] text-muted-foreground mt-1">{template.desc}</p>
              <div className="flex gap-1.5 mt-3 flex-wrap">
                {template.tags.map(tag => (
                  <span key={tag} className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${categoryColors[tag] || 'bg-white/10 text-white/60'}`}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="mt-8 rounded-xl border border-white/8 bg-card p-5 flex items-center justify-between">
        <div>
          <p className="text-white font-semibold">🎯 Não encontrou o que precisa?</p>
          <p className="text-muted-foreground text-sm mt-0.5">Crie seu mapa com IA em segundos ou comece do zero em uma tela em branco.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/criar-com-ia')}
            className="px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary/80 transition-colors neon-glow flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Criar com IA
          </button>
          <button
            onClick={() => navigate('/editor')}
            className="px-5 py-2.5 bg-white/5 border border-white/10 text-white text-sm font-semibold rounded-lg hover:bg-white/10 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Mapa em Branco
          </button>
        </div>
      </div>
    </div>
  );
}

function Sparkles({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 3l1.5 1.5M18.5 3L17 4.5M3 18.5L4.5 17M17 17l1.5 1.5M12 2v2M12 20v2M2 12h2M20 12h2" />
    </svg>
  );
}