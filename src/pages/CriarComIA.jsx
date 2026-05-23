import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, Sparkles, History, Zap, Maximize2, RefreshCw, Loader2, ImagePlus, X, Upload, Eye } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const SUGGESTIONS = ['Lançamento de produto', 'Funil de vendas', 'Estratégia de conteúdo', 'Plano de negócios', 'Mapa de objetivos'];

const VERSION_OPTIONS = [
  {
    id: 1,
    label: 'Versão 1',
    name: 'Estrutura em Mapa Mental',
    desc: 'Visão radial com foco central e ramificações para todas as etapas.',
    tags: ['Mapa Mental', 'Completo', 'Estratégico'],
    gradient: 'from-red-950 via-red-900 to-orange-950',
    accent: '#e53e3e',
  },
  {
    id: 2,
    label: 'Versão 2',
    name: 'Estrutura em Fluxo + Funil',
    desc: 'Fluxo linear combinado com funil de vendas para uma jornada clara e objetiva.',
    tags: ['Fluxo', 'Funil', 'Jornada'],
    gradient: 'from-purple-950 via-purple-900 to-pink-950',
    accent: '#a855f7',
    border: 'border-purple-500/40',
  },
  {
    id: 3,
    label: 'Versão 3',
    name: 'Estrutura Híbrida 360°',
    desc: 'Visão estratégica completa com conexões entre todas as áreas.',
    tags: ['Híbrido', '360°', 'Conexões'],
    gradient: 'from-blue-950 via-blue-900 to-cyan-950',
    accent: '#3b82f6',
  },
];

const HOW_IT_WORKS = [
  { icon: '📝', title: 'Descreva sua ideia', desc: 'Quanto mais detalhes, melhor será o resultado.' },
  { icon: '🖼️', title: 'Envie uma referência visual', desc: 'Opcional: envie uma imagem de referência para o estilo do fluxo.' },
  { icon: '🤖', title: 'A IA processa e estrutura', desc: 'Nossa IA entende o contexto e cria estruturas cinematográficas.' },
  { icon: '🎯', title: 'Escolha sua versão favorita', desc: 'Você recebe 3 opções únicas para comparar e escolher.' },
];

const tagColors = {
  'Mapa Mental': 'bg-red-500/20 text-red-400 border border-red-500/30',
  'Completo': 'bg-green-500/20 text-green-400 border border-green-500/30',
  'Estratégico': 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
  'Fluxo': 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
  'Funil': 'bg-pink-500/20 text-pink-400 border border-pink-500/30',
  'Jornada': 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30',
  'Híbrido': 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
  '360°': 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30',
  'Conexões': 'bg-teal-500/20 text-teal-400 border border-teal-500/30',
};

export default function CriarComIA() {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [versions, setVersions] = useState(null);
  const [charCount, setCharCount] = useState(0);
  const [referenceImage, setReferenceImage] = useState(null); // { file, url, uploaded_url }
  const [uploadingImage, setUploadingImage] = useState(false);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const localUrl = URL.createObjectURL(file);
    setReferenceImage({ file, localUrl, uploaded_url: null });
    setUploadingImage(true);

    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setReferenceImage({ file, localUrl, uploaded_url: file_url });
    } catch {
      // keep localUrl only, will use InvokeLLM without file_url
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = () => {
    setReferenceImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      const hasImage = referenceImage?.uploaded_url;

      const imageContext = hasImage
        ? `\n\nO usuário também enviou uma IMAGEM DE REFERÊNCIA do estilo visual que deseja. Analise a estrutura, layout, hierarquia de nós, e estilo cinematográfico da imagem. Reproduza um fluxo com ESTRUTURA SIMILAR: mesmo nível de profundidade, mesma lógica de ramificações, mesmo estilo de organização espacial. O resultado deve ser igualmente RICO e DENSO em informações, com efeitos visuais cinematográficos (bordas neon, gradientes escuros, brilho nos conectores).`
        : '';

      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Você é um especialista em criação de mapas mentais CINEMATOGRÁFICOS e fluxogramas estratégicos de alto impacto visual para marketing e negócios digitais.

O usuário quer criar um mapa visual sobre: "${prompt}"${imageContext}

REGRAS VISUAIS OBRIGATÓRIAS para todos os nós:
- Estilo dark premium com fundo preto/escuro
- Bordas neon vermelhas/laranjas brilhantes
- Efeitos de glow/brilho intensos
- Conectores com animação de fluxo
- Nós densos com títulos impactantes em MAIÚSCULAS
- Descrições detalhadas em cada nó
- Hierarquia clara: center → branch → leaf

Crie 3 versões RICAS e DENSAS com pelo menos 8-15 nós cada, com posicionamentos x/y bem distribuídos no canvas (canvas é 1200x800px). Use tipos: "center", "branch", "leaf", "highlight".

Retorne JSON com 3 versões completas:`,
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
                  },
                  connections: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        from: { type: 'string' },
                        to: { type: 'string' }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        ...(hasImage ? { file_urls: [referenceImage.uploaded_url] } : {}),
      });

      if (result?.versions?.length > 0) {
        setVersions(result.versions);
      } else {
        setVersions(VERSION_OPTIONS);
      }
    } catch {
      setVersions(VERSION_OPTIONS);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectVersion = async (version) => {
    const data_json = JSON.stringify({
      nodes: version.nodes || [
        { id: 'root', title: version.title || prompt, type: 'center', x: 550, y: 380, expanded: true, parent_id: null }
      ],
      connections: version.connections || [],
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

  const displayVersions = versions || [];
  const showVersions = versions !== null;

  return (
    <div className="min-h-screen bg-cinematic p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-white">Criação com IA</h1>
          <p className="text-muted-foreground text-sm mt-1">Descreva sua ideia e nossa IA irá transformar em mapas visuais cinematográficos.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-muted-foreground hover:text-white hover:border-white/20 transition-all">
            <History className="w-4 h-4" />
            Histórico
          </button>
          <div className="flex items-center gap-1.5 px-3 py-2 bg-primary/10 border border-primary/30 rounded-lg text-sm text-white neon-border">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-primary font-bold">2.450</span>
            <span className="text-muted-foreground">/ 5.000 créditos</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left - Input */}
        <div className="col-span-2 space-y-5">

          {/* Prompt area */}
          <div className="rounded-xl border border-white/8 bg-[#0c0c0c] p-5 card-glow relative overflow-hidden">
            {/* subtle top glow line */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

            <h3 className="font-bold text-white mb-3 text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              Descreva sua ideia
            </h3>

            <div className="flex gap-4">
              <div className="flex-1">
                <textarea
                  value={prompt}
                  onChange={e => { setPrompt(e.target.value); setCharCount(e.target.value.length); }}
                  placeholder="Descreva o mapa que você quer criar em detalhes. Ex: 'Quero um mapa completo sobre lançamento de produto digital, com etapas de pesquisa, validação, criação, marketing, funil de vendas, métricas e escala...'"
                  className="w-full h-28 bg-transparent text-sm text-white placeholder:text-muted-foreground/60 resize-none focus:outline-none leading-relaxed"
                  maxLength={2000}
                />
                <div className="flex items-center justify-between mt-1">
                  <div className="text-[11px] text-muted-foreground">{charCount}/2000</div>
                </div>

                {/* Suggestions */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  <span className="text-[11px] text-muted-foreground self-center">Sugestões:</span>
                  {SUGGESTIONS.map(s => (
                    <button
                      key={s}
                      onClick={() => { setPrompt(s); setCharCount(s.length); }}
                      className="text-[11px] text-primary border border-primary/25 px-2 py-0.5 rounded-full hover:bg-primary/10 hover:border-primary/50 transition-all"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mic */}
              <div className="flex flex-col items-center justify-center gap-2">
                <button className="w-14 h-14 rounded-full bg-primary/10 border-2 border-primary/40 flex items-center justify-center hover:bg-primary/20 transition-all group glow-pulse">
                  <Mic className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                </button>
                <p className="text-[9px] text-muted-foreground text-center">Falar ideia</p>
              </div>
            </div>

            {/* ── IMAGE REFERENCE SECTION ── */}
            <div className="mt-4 pt-4 border-t border-white/5">
              <div className="flex items-center gap-2 mb-3">
                <ImagePlus className="w-4 h-4 text-primary" />
                <span className="text-xs font-semibold text-white">Imagem de referência visual</span>
                <span className="text-[10px] text-muted-foreground bg-white/5 px-2 py-0.5 rounded-full">Opcional</span>
              </div>

              {!referenceImage ? (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border border-dashed border-primary/25 rounded-xl p-4 flex flex-col items-center gap-2 hover:border-primary/50 hover:bg-primary/5 transition-all group cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
                    <Upload className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-semibold text-white">Arraste ou clique para enviar</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">PNG, JPG ou WEBP • A IA vai replicar o estilo estrutural e cinematográfico</p>
                  </div>
                </button>
              ) : (
                <div className="flex items-start gap-3 bg-white/3 border border-white/8 rounded-xl p-3">
                  {/* Thumbnail */}
                  <div className="relative w-20 h-16 rounded-lg overflow-hidden border border-white/10 flex-shrink-0">
                    <img src={referenceImage.localUrl} alt="Referência" className="w-full h-full object-cover" />
                    {uploadingImage && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <Loader2 className="w-4 h-4 text-primary animate-spin" />
                      </div>
                    )}
                    {!uploadingImage && referenceImage.uploaded_url && (
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <button onClick={() => setShowImagePreview(true)} className="text-white">
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      {uploadingImage ? (
                        <span className="text-[11px] text-muted-foreground flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" />Fazendo upload...</span>
                      ) : referenceImage.uploaded_url ? (
                        <span className="text-[11px] text-green-400 flex items-center gap-1">✓ Imagem pronta para análise</span>
                      ) : (
                        <span className="text-[11px] text-yellow-400">Imagem carregada localmente</span>
                      )}
                    </div>
                    <p className="text-[10px] text-muted-foreground leading-relaxed">
                      A IA vai analisar a estrutura, profundidade, layout e estilo cinematográfico desta imagem e replicar no seu mapa.
                    </p>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="text-[10px] text-primary hover:underline mt-1"
                    >
                      Trocar imagem
                    </button>
                  </div>
                  <button
                    onClick={handleRemoveImage}
                    className="w-6 h-6 rounded-lg bg-white/5 hover:bg-destructive/20 flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors flex-shrink-0"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/jpg"
                className="hidden"
                onChange={handleImageSelect}
              />
            </div>

            {/* Generate button */}
            <button
              onClick={handleGenerate}
              disabled={!prompt.trim() || loading || uploadingImage}
              className="w-full mt-5 py-3.5 rounded-xl bg-primary text-white font-black text-sm flex items-center justify-center gap-2 hover:bg-red-600 transition-all neon-glow disabled:opacity-40 disabled:cursor-not-allowed relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" />Gerando mapas cinematográficos...</>
              ) : (
                <><Sparkles className="w-4 h-4" />Gerar Mapas com IA ✨{referenceImage ? ' (com referência visual)' : ''}</>
              )}
            </button>
            <p className="text-center text-[11px] text-muted-foreground mt-2">
              A IA irá criar 3 versões diferentes com efeitos cinematográficos intensos.
            </p>
          </div>

          {/* Version Selection */}
          {showVersions && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-yellow-400 text-base">✨</span>
                  <h3 className="font-black text-white">Escolha a melhor versão para você</h3>
                </div>
                <button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="flex items-center gap-1.5 text-xs text-primary border border-primary/30 px-3 py-1.5 rounded-lg hover:bg-primary/10 transition-all"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                  Regenerar
                </button>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {(displayVersions.length > 0 ? displayVersions : VERSION_OPTIONS).map((version, i) => {
                  const opt = VERSION_OPTIONS[i] || VERSION_OPTIONS[0];
                  return (
                    <div
                      key={version.id || i}
                      className={`rounded-xl border ${opt.border || 'border-white/8'} overflow-hidden group cursor-pointer hover:border-primary/50 transition-all card-glow`}
                      style={{ '--accent': opt.accent }}
                    >
                      <div className={`relative h-36 bg-gradient-to-br ${opt.gradient} overflow-hidden`}>
                        {/* Neon grid lines */}
                        <div className="absolute inset-0 opacity-10">
                          {[...Array(5)].map((_, j) => (
                            <div key={j} className="absolute h-px bg-red-400 w-full" style={{ top: `${j * 25}%` }} />
                          ))}
                          {[...Array(5)].map((_, j) => (
                            <div key={j} className="absolute w-px bg-red-400 h-full" style={{ left: `${j * 25}%` }} />
                          ))}
                        </div>
                        {/* Center glow */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-12 h-12 rounded-full border border-white/20" style={{ boxShadow: `0 0 30px ${opt.accent}60` }} />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                        <div className="absolute top-2 left-2">
                          <span className="text-[10px] font-bold text-white bg-black/50 border border-white/10 px-2 py-0.5 rounded-md">
                            {opt.label}
                          </span>
                        </div>
                        <button className="absolute top-2 right-2 w-6 h-6 bg-black/40 rounded-md flex items-center justify-center text-white/40 hover:text-white opacity-0 group-hover:opacity-100 transition-all">
                          <Maximize2 className="w-3 h-3" />
                        </button>
                        {/* Bottom accent line */}
                        <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${opt.accent}, transparent)`, boxShadow: `0 0 10px ${opt.accent}` }} />
                      </div>
                      <div className="p-3 bg-[#0c0c0c]">
                        <p className="text-xs font-black text-white">{version.name || opt.name}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">{version.description || opt.desc}</p>
                        <div className="flex flex-wrap gap-1 mt-2 mb-3">
                          {(version.tags || opt.tags || []).map(tag => (
                            <span key={tag} className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full ${tagColors[tag] || 'bg-white/10 text-white/60'}`}>
                              {tag}
                            </span>
                          ))}
                        </div>
                        <button
                          onClick={() => handleSelectVersion(version.nodes ? version : opt)}
                          className="w-full py-1.5 rounded-lg text-white text-xs font-bold hover:opacity-80 transition-all"
                          style={{ background: `linear-gradient(135deg, ${opt.accent}30, ${opt.accent}15)`, border: `1px solid ${opt.accent}50`, color: opt.accent }}
                        >
                          Selecionar esta versão
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="text-center text-[11px] text-muted-foreground">
                💡 Cada geração consome créditos de IA. Você pode editar qualquer versão no editor.
              </p>
            </div>
          )}
        </div>

        {/* Right - How it works */}
        <div className="space-y-4">
          <div className="rounded-xl border border-white/8 bg-[#0c0c0c] p-5 card-glow relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
            <h3 className="font-black text-white mb-4 text-sm">Como funciona?</h3>
            <div className="space-y-4">
              {HOW_IT_WORKS.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-sm flex-shrink-0" style={{ boxShadow: '0 0 10px rgba(229,62,62,0.15)' }}>
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">{item.title}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reference tip card */}
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center text-sm flex-shrink-0">
                🎨
              </div>
              <div>
                <p className="text-xs font-black text-white">Dica: Use a imagem de referência</p>
                <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
                  Envie uma foto do seu fluxo ou mapa mental de referência. A IA vai replicar o estilo visual, profundidade e estrutura com efeitos neon cinematográficos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Preview Modal */}
      {showImagePreview && referenceImage && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-8" onClick={() => setShowImagePreview(false)}>
          <div className="relative max-w-3xl max-h-full">
            <img src={referenceImage.localUrl} alt="Referência" className="max-w-full max-h-[80vh] rounded-xl border border-white/10 object-contain" />
            <button
              onClick={() => setShowImagePreview(false)}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 border border-white/20 flex items-center justify-center text-white hover:bg-black/80 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}