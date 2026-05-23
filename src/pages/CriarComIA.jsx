import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, Sparkles, History, Zap, Maximize2, ChevronRight, RefreshCw, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const SUGGESTIONS = ['Lançamento de produto', 'Funil de vendas', 'Estratégia de conteúdo', 'Plano de negócios', 'Mapa de objetivos'];

const VERSION_OPTIONS = [
  {
    id: 1,
    label: 'Versão 1',
    name: 'Estrutura em Mapa Mental',
    desc: 'Visão radial com foco central e ramificações para todas as etapas.',
    tags: ['Mapa Mental', 'Completo', 'Estratégico'],
    gradient: 'from-red-900 via-red-800 to-orange-900',
  },
  {
    id: 2,
    label: 'Versão 2',
    name: 'Estrutura em Fluxo + Funil',
    desc: 'Fluxo linear combinado com funil de vendas para uma jornada clara e objetiva.',
    tags: ['Fluxo', 'Funil', 'Jornada'],
    gradient: 'from-purple-900 via-purple-800 to-pink-900',
    border: 'border-purple-500/50',
  },
  {
    id: 3,
    label: 'Versão 3',
    name: 'Estrutura Híbrida 360°',
    desc: 'Visão estratégica completa com conexões entre todas as áreas do lançamento.',
    tags: ['Híbrido', '360°', 'Conexões'],
    gradient: 'from-blue-900 via-blue-800 to-cyan-900',
  },
];

const HOW_IT_WORKS = [
  { icon: '📝', title: 'Descreva sua ideia', desc: 'Quanto mais detalhes, melhor será o resultado.' },
  { icon: '🤖', title: 'A IA processa e estrutura', desc: 'Nossa IA entende o contexto e cria estruturas inteligentes para seu mapa.' },
  { icon: '🎯', title: 'Escolha sua versão favorita', desc: 'Você recebe 3 opções únicas para comparar e escolher.' },
  { icon: '✏️', title: 'Edite e personalize', desc: 'Abra no editor e deixe o mapa com a sua cara, com total liberdade.' },
];

const tagColors = {
  'Mapa Mental': 'bg-red-500/20 text-red-400',
  'Completo': 'bg-green-500/20 text-green-400',
  'Estratégico': 'bg-yellow-500/20 text-yellow-400',
  'Fluxo': 'bg-purple-500/20 text-purple-400',
  'Funil': 'bg-pink-500/20 text-pink-400',
  'Jornada': 'bg-indigo-500/20 text-indigo-400',
  'Híbrido': 'bg-blue-500/20 text-blue-400',
  '360°': 'bg-cyan-500/20 text-cyan-400',
  'Conexões': 'bg-teal-500/20 text-teal-400',
};

export default function CriarComIA() {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [versions, setVersions] = useState(null);
  const [charCount, setCharCount] = useState(0);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Você é um especialista em criação de mapas mentais e fluxogramas estratégicos para marketing e negócios digitais.
        
O usuário quer criar um mapa visual sobre: "${prompt}"

Crie 3 versões diferentes de estruturas de mapa mental. Para cada versão, gere os nós (nodes) e conexões.

Retorne um JSON com a estrutura abaixo:`,
        response_json_schema: {
          type: 'object',
          properties: {
            versions: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'number' },
                  title: { type: 'string' },
                  type: { type: 'string' },
                  description: { type: 'string' },
                  nodes: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        id: { type: 'string' },
                        title: { type: 'string' },
                        description: { type: 'string' },
                        type: { type: 'string' },
                        x: { type: 'number' },
                        y: { type: 'number' },
                        expanded: { type: 'boolean' },
                        parent_id: { type: 'string' }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      });

      if (result?.versions) {
        setVersions(result.versions);
      } else {
        setVersions(VERSION_OPTIONS.map((v, i) => ({
          ...v,
          nodes: generateDefaultNodes(prompt, i)
        })));
      }
    } catch (err) {
      setVersions(VERSION_OPTIONS);
    } finally {
      setLoading(false);
    }
  };

  const generateDefaultNodes = (topic, versionIdx) => {
    const center = { id: 'root', title: topic, type: 'center', x: 500, y: 350, expanded: true, parent_id: null };
    return [center];
  };

  const handleSelectVersion = async (version) => {
    const data_json = JSON.stringify({
      nodes: version.nodes || [
        { id: 'root', title: version.title || prompt, type: 'center', x: 500, y: 350, expanded: true, parent_id: null }
      ],
      connections: []
    });

    const project = await base44.entities.Project.create({
      title: version.title || version.name || prompt,
      description: `Criado com IA: ${prompt}`,
      category: 'Estratégia',
      data_json,
      map_type: 'mind_map',
    });

    navigate(`/editor/${project.id}`);
  };

  return (
    <div className="min-h-screen bg-background p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-white">Criação com IA</h1>
          <p className="text-muted-foreground text-sm mt-1">Descreva sua ideia e nossa IA irá transformar em mapas visuais poderosos.</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-muted-foreground hover:text-white transition-colors">
            <History className="w-4 h-4" />
            Histórico de Criações
          </button>
          <div className="flex items-center gap-1.5 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white">
            <Zap className="w-4 h-4 text-primary" />
            Créditos de IA: <span className="font-bold text-primary">2.450 / 5.000</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left - Input */}
        <div className="col-span-2 space-y-5">
          {/* Prompt area */}
          <div className="rounded-xl border border-white/10 bg-card p-5">
            <h3 className="font-semibold text-white mb-3 text-sm">Descreva sua ideia</h3>
            <div className="flex gap-4">
              <div className="flex-1">
                <textarea
                  value={prompt}
                  onChange={e => { setPrompt(e.target.value); setCharCount(e.target.value.length); }}
                  placeholder="Quero um mapa visual completo sobre o lançamento de um produto digital, com etapas de pesquisa, validação, criação, marketing, funil de vendas, métricas e escala. Inclua estratégias, ferramentas e exemplos práticos."
                  className="w-full h-32 bg-transparent text-sm text-white placeholder:text-muted-foreground resize-none focus:outline-none leading-relaxed"
                  maxLength={2000}
                />
                <div className="text-[11px] text-muted-foreground mt-1">{charCount}/2000</div>

                {/* Suggestions */}
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="text-[11px] text-muted-foreground">Sugestões:</span>
                  {SUGGESTIONS.map(s => (
                    <button
                      key={s}
                      onClick={() => { setPrompt(s); setCharCount(s.length); }}
                      className="text-[11px] text-primary border border-primary/30 px-2 py-0.5 rounded-full hover:bg-primary/10 transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mic */}
              <div className="flex flex-col items-center justify-center">
                <button className="w-16 h-16 rounded-full bg-primary/10 border-2 border-primary/40 flex items-center justify-center hover:bg-primary/20 transition-all group neon-border">
                  <Mic className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
                </button>
                <p className="text-[10px] text-muted-foreground mt-2 text-center">Clique no microfone<br/>para falar sua ideia</p>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={!prompt.trim() || loading}
              className="w-full mt-4 py-3 rounded-xl bg-primary text-white font-bold flex items-center justify-center gap-2 hover:bg-primary/80 transition-all neon-glow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" />Gerando mapas...</>
              ) : (
                <><Sparkles className="w-4 h-4" />Gerar Mapas com IA ✨</>
              )}
            </button>
            <p className="text-center text-[11px] text-muted-foreground mt-2">A IA irá criar 3 opções diferentes para você escolher.</p>
          </div>

          {/* Version Selection */}
          {(versions || loading === false) && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-yellow-400">✨</span>
                <h3 className="font-bold text-white">Escolha a melhor versão para você</h3>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {VERSION_OPTIONS.map((version, i) => (
                  <div
                    key={version.id}
                    className={`rounded-xl border ${version.border || 'border-white/10'} overflow-hidden group cursor-pointer hover:border-primary/50 transition-all`}
                  >
                    <div className={`relative h-36 bg-gradient-to-br ${version.gradient}`}>
                      <div className="absolute inset-0 flex items-center justify-center opacity-20">
                        <div className="w-16 h-16 rounded-full border-2 border-white/40" />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <div className="absolute top-2 left-2 text-[10px] font-bold text-white/80 bg-black/40 px-2 py-0.5 rounded">
                        {version.label}
                      </div>
                      <button
                        className="absolute top-2 right-2 w-6 h-6 bg-black/40 rounded-md flex items-center justify-center text-white/60 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Maximize2 className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="p-3 bg-card">
                      <p className="text-xs font-bold text-white">{version.name}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">{version.desc}</p>
                      <div className="flex flex-wrap gap-1 mt-2 mb-3">
                        {version.tags.map(tag => (
                          <span key={tag} className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full ${tagColors[tag] || 'bg-white/10 text-white/60'}`}>
                            {tag}
                          </span>
                        ))}
                      </div>
                      <button
                        onClick={() => handleSelectVersion(version)}
                        className="w-full py-1.5 rounded-lg bg-primary/15 border border-primary/30 text-primary text-xs font-semibold hover:bg-primary/25 transition-colors"
                      >
                        Selecionar esta versão
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-center gap-2 mt-4">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="text-base">💡</span>
                  <span>Dica: Você pode regenerar novas opções quantas vezes quiser. Cada geração consome créditos de IA.</span>
                </div>
                <button className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-colors ml-auto">
                  <RefreshCw className="w-3.5 h-3.5" />
                  Regenerar novas opções
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right - How it works */}
        <div className="rounded-xl border border-white/10 bg-card p-5 h-fit">
          <h3 className="font-bold text-white mb-4 text-sm">Como funciona?</h3>
          <div className="space-y-4">
            {HOW_IT_WORKS.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-sm flex-shrink-0">
                  {item.icon}
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">{item.title}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}