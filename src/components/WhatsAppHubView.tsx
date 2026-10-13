import React, { useState } from 'react';
import { 
  Send, 
  Copy, 
  Check, 
  ExternalLink, 
  MessageSquare, 
  User, 
  Phone, 
  Sparkles,
  Users,
  Target,
  Clock
} from 'lucide-react';
import { whatsappCampaigns } from '../data/whatsappData';

export const WhatsAppHubView: React.FC = () => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [leadName, setLeadName] = useState('João');
  const [consultantName, setConsultantName] = useState('Lucas');
  const [selectedCategory, setSelectedCategory] = useState<string>('TODAS');

  const categories = [
    'TODAS',
    'Conversão / Captação',
    'Conversão Direta',
    'Black Friday (Fase 1 e 2)',
    'Black Friday (Fase 3)',
    'Black Friday (Fase 4)',
    'Autoridade & Nutrição',
    'Relacionamento & Pós-Venda',
    'Campanha de Fim de Ano'
  ];

  const getPersonalizedText = (template: string) => {
    return template
      .replace(/\[Nome\]/g, leadName || 'Cliente')
      .replace(/\[Consultor\]/g, consultantName || 'Especialista');
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredCampaigns = selectedCategory === 'TODAS'
    ? whatsappCampaigns
    : whatsappCampaigns.filter((c) => c.category.includes(selectedCategory));

  return (
    <div className="space-y-6">
      {/* Header banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
            <Send className="w-3.5 h-3.5" />
            Canal de Fechamento & Relacionamento 1 a 1
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Hub de Campanhas e Scripts de WhatsApp NowTech
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Mensagens profissionais, diretas e persuasivas prontas para disparos em listas de transmissão, grupos VIP e conversas individuais da equipe de vendas da NowTech Solar.
          </p>
        </div>
      </div>

      {/* Simulator / Variables Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <span className="font-semibold text-slate-300 uppercase tracking-wider text-[11px] flex items-center gap-1">
            <User className="w-3.5 h-3.5 text-amber-400" /> Personalizar Prévia:
          </span>

          <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
            <span className="text-slate-400">Nome do Lead:</span>
            <input
              type="text"
              value={leadName}
              onChange={(e) => setLeadName(e.target.value)}
              className="bg-transparent text-white font-medium focus:outline-none w-24"
              placeholder="ex: Carlos"
            />
          </div>

          <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
            <span className="text-slate-400">Consultor:</span>
            <input
              type="text"
              value={consultantName}
              onChange={(e) => setConsultantName(e.target.value)}
              className="bg-transparent text-white font-medium focus:outline-none w-24"
              placeholder="ex: Lucas"
            />
          </div>
        </div>

        {/* Category filter */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-400 whitespace-nowrap">Filtrar Categoria:</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Campaign Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCampaigns.map((camp) => {
          const personalizedText = getPersonalizedText(camp.messageText);
          const encodedUrl = `https://wa.me/?text=${encodeURIComponent(personalizedText)}`;

          return (
            <div
              key={camp.id}
              className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 flex flex-col justify-between space-y-4 transition-all shadow-sm"
            >
              {/* Card Header */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    {camp.category}
                  </span>
                  <span className="text-slate-400 font-mono text-[11px] flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {camp.triggerEvent}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white tracking-tight">
                  {camp.title}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                  <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-850">
                    <span className="block text-[10px] text-slate-400 font-semibold uppercase">
                      Público-Alvo
                    </span>
                    <p className="text-slate-300 mt-0.5">{camp.targetAudience}</p>
                  </div>

                  <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-850">
                    <span className="block text-[10px] text-slate-400 font-semibold uppercase">
                      Objetivo de Conversão
                    </span>
                    <p className="text-slate-300 mt-0.5">{camp.objective}</p>
                  </div>
                </div>
              </div>

              {/* Message Box */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Texto do Script (com Emojis e Formatação)
                  </span>
                  <span className="text-[11px] text-emerald-400 font-medium">
                    CTA: {camp.recommendedCta}
                  </span>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs text-slate-200 whitespace-pre-wrap leading-relaxed font-sans max-h-56 overflow-y-auto selection:bg-emerald-500/30">
                  {personalizedText}
                </div>
              </div>

              {/* Card Actions */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-3">
                <button
                  onClick={() => handleCopy(personalizedText, camp.id)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition-colors"
                >
                  {copiedId === camp.id ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400">Texto Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copiar Mensagem</span>
                    </>
                  )}
                </button>

                <a
                  href={encodedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors whitespace-nowrap shadow-sm shadow-emerald-600/20"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Enviar via WhatsApp</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
