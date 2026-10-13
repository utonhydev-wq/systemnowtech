import React, { useState } from 'react';
import { 
  Sparkles, 
  HelpCircle, 
  Check, 
  Copy, 
  Flame, 
  Calendar, 
  ArrowRight, 
  Share2,
  Clock,
  MessageCircle,
  TrendingUp
} from 'lucide-react';
import { storiesWeeklyCadence, campaignStoriesSpecials } from '../data/storiesData';

export const StoriesStrategyView: React.FC = () => {
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const sampleInteractiveStickers = [
    {
      id: 'stk-1',
      type: 'Enquete (2 Opções)',
      question: 'Sua conta de energia no último mês veio:',
      options: ['Dentro do esperado', 'Um absurdo de cara! 😱'],
      bestDay: 'Terça-feira',
    },
    {
      id: 'stk-2',
      type: 'Caixa de Perguntas',
      question: 'Qual sua maior dúvida antes de instalar energia solar?',
      options: ['Respondendo tudo com nosso engenheiro ao vivo às 17h!'],
      bestDay: 'Terça ou Quinta-feira',
    },
    {
      id: 'stk-3',
      type: 'Quiz com Resposta Certa',
      question: 'Quantos anos dura em média a geração de um painel NowTech?',
      options: ['5 anos', '10 anos', 'Mais de 25 anos! ✅'],
      bestDay: 'Quarta-feira',
    },
    {
      id: 'stk-4',
      type: 'Slider de Fogo 🔥',
      question: 'O quanto o calor de Pernambuco te obriga a ligar o ar-condicionado?',
      options: ['Deslize o fogo até 100% 🔥'],
      bestDay: 'Segunda ou Domingo',
    },
    {
      id: 'stk-5',
      type: 'Link Direto WhatsApp',
      question: 'Simule sua economia em 3 minutos sem compromisso!',
      options: ['Clique no link oficial da NowTech'],
      bestDay: 'Sexta-feira',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Introduction banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            Estratégia de Frequência Contínua
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Estratégia de Stories Diários NowTech Solar
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Stories são o canal diário de calor, engajamento e conversa direta na DM com futuros clientes. 
            Seguindo essa cadência semanal previsível, a NowTech mantém a retenção alta e gera leads qualificados todos os dias.
          </p>
        </div>
      </div>

      {/* 7 Days of the Week Strategy Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-amber-400" />
            Cadência Semanal Oficial (Segunda a Domingo)
          </h3>
          <span className="text-xs text-slate-400 font-mono">Frequência: Todo dia</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {storiesWeeklyCadence.map((cadence, index) => (
            <div
              key={cadence.dayOfWeek}
              className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between hover:border-slate-700 transition-all hover:bg-slate-850"
            >
              <div className="space-y-2.5">
                {/* Header: day of week & time */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                    {cadence.dayOfWeek}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {cadence.bestTime}
                  </span>
                </div>

                {/* Theme */}
                <h4 className="text-sm font-semibold text-white leading-snug">
                  {cadence.theme}
                </h4>

                {/* Description */}
                <p className="text-xs text-slate-300 leading-relaxed">
                  {cadence.description}
                </p>

                {/* Interactive sticker recommendation */}
                <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800/80 space-y-1">
                  <span className="block text-[10px] text-slate-400 uppercase font-semibold">
                    Sticker Recomendado
                  </span>
                  <p className="text-xs text-amber-300/90 font-medium">
                    {cadence.interactiveSticker}
                  </p>
                </div>
              </div>

              {/* Example Hook Copy */}
              <div className="pt-3 mt-3 border-t border-slate-800/80 space-y-2">
                <span className="block text-[10px] text-slate-400 uppercase font-semibold">
                  Exemplo de Gancho
                </span>
                <p className="text-xs text-slate-300 italic bg-slate-950/40 p-2 rounded border border-slate-850">
                  "{cadence.exampleHook}"
                </p>
                <button
                  onClick={() => handleCopy(cadence.exampleHook, `cadence-${index}`)}
                  className="w-full flex items-center justify-center gap-1.5 py-1 text-xs text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-750 rounded transition-colors"
                >
                  {copiedText === `cadence-${index}` ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400 font-medium">Copiado</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copiar Gancho</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Campaign Adaptations Section */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Flame className="w-4 h-4 text-amber-400" />
          Aceleração de Stories durante Grandes Campanhas
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {campaignStoriesSpecials.map((special) => (
            <div
              key={special.phase}
              className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400">
                    {special.period}
                  </span>
                  <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    {special.frequency}
                  </span>
                </div>

                <h4 className="text-sm font-semibold text-white">
                  {special.phase}
                </h4>

                <div className="space-y-2 pt-1">
                  {special.storySequence.map((step, idx) => (
                    <div
                      key={idx}
                      className="text-xs text-slate-300 bg-slate-950/60 p-2 rounded border border-slate-850 flex items-start gap-2"
                    >
                      <span className="text-amber-400 font-bold font-mono shrink-0">
                        0{idx + 1}.
                      </span>
                      <span className="leading-relaxed">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ready-to-Use Sticker Bank */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-amber-400" />
          Banco de Figurinhas Interativas para o Designer / Social Media
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {sampleInteractiveStickers.map((stk) => (
            <div
              key={stk.id}
              className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2.5"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-amber-400">{stk.type}</span>
                <span className="text-slate-400 text-[11px]">{stk.bestDay}</span>
              </div>

              <div className="font-medium text-white text-xs">
                "{stk.question}"
              </div>

              <div className="space-y-1">
                {stk.options.map((opt, oIdx) => (
                  <div
                    key={oIdx}
                    className="text-[11px] text-slate-300 bg-slate-900 px-2.5 py-1 rounded border border-slate-800"
                  >
                    • {opt}
                  </div>
                ))}
              </div>

              <button
                onClick={() => handleCopy(`${stk.question}\n${stk.options.join('\n')}`, stk.id)}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors mt-2"
              >
                {copiedText === stk.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-semibold">Copiado para colar no Canva</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar Texto da Figurinha</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
