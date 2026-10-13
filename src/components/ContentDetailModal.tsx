import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  Calendar, 
  Clock, 
  Share2, 
  Sparkles, 
  Edit3, 
  CheckCircle2, 
  Video, 
  Layers, 
  Image as ImageIcon, 
  Send,
  MessageSquare,
  ChevronRight,
  Eye,
  Smartphone,
  Heart,
  Bookmark,
  MessageCircle,
  ThumbsUp
} from 'lucide-react';
import { ContentItem, ContentStatus, ContentFormat } from '../types/marketing';
import { NowTechLogo } from './NowTechLogo';

interface ContentDetailModalProps {
  item: ContentItem;
  isAdmin?: boolean;
  onClose: () => void;
  onEdit: (item: ContentItem) => void;
  onUpdateStatus: (id: string, newStatus: ContentStatus) => void;
}

export const ContentDetailModal: React.FC<ContentDetailModalProps> = ({
  item,
  isAdmin = true,
  onClose,
  onEdit,
  onUpdateStatus,
}) => {
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [copiedCta, setCopiedCta] = useState(false);
  const [activeViewMode, setActiveViewMode] = useState<'briefing' | 'preview_instagram' | 'preview_whatsapp'>('briefing');

  const handleCopyCaption = () => {
    navigator.clipboard.writeText(item.caption);
    setCopiedCaption(true);
    setTimeout(() => setCopiedCaption(false), 2000);
  };

  const handleCopyCta = () => {
    navigator.clipboard.writeText(item.cta);
    setCopiedCta(true);
    setTimeout(() => setCopiedCta(false), 2000);
  };

  const handleShareWhatsApp = () => {
    const text = `☀️ *NOWTECH SOLAR — PAUTA DE MARKETING*\n\n📅 *Data:* ${item.date.split('-').reverse().join('/')} (${item.dayOfWeek})\n📌 *Tema:* ${item.theme}\n🎯 *Formato:* ${item.format} · *Horário:* ${item.suggestedTime || '12:00'}\n\n📝 *LEGENDA DO POST:*\n${item.caption}\n\n👉 *CTA:* ${item.cta}\n\n💡 *Conceito:* ${item.contentIdea}`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const getFormatIcon = (format: ContentFormat) => {
    switch (format) {
      case 'Reels':
        return <Video className="w-4 h-4 text-pink-400" />;
      case 'Carrossel':
        return <Layers className="w-4 h-4 text-amber-400" />;
      case 'Post':
        return <ImageIcon className="w-4 h-4 text-sky-400" />;
      case 'Stories':
        return <Sparkles className="w-4 h-4 text-emerald-400" />;
      case 'WhatsApp':
        return <Send className="w-4 h-4 text-green-400" />;
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/85 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-2xl w-full max-w-4xl max-h-[92vh] sm:max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Drag Handle */}
        <div className="sm:hidden w-12 h-1.5 bg-slate-750 rounded-full mx-auto mt-2.5 mb-1" />

        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-start justify-between gap-3 bg-slate-950/70">
          <div className="space-y-1.5 flex-1 min-w-0">
            {/* Top row with date and format */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="font-mono text-amber-400 font-bold flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {item.date.split('-').reverse().join('/')} · {item.dayOfWeek}
              </span>

              {item.holiday && (
                <span className="text-[11px] font-semibold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  ★ {item.holiday}
                </span>
              )}

              <span className="text-slate-400 hidden sm:inline">· {item.campaign}</span>
            </div>

            {/* Theme Title */}
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight leading-snug truncate sm:whitespace-normal">
              {item.theme}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Fechar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub-header: View Mode Switcher (Roteiro vs Mockup Instagram vs WhatsApp) */}
        <div className="px-4 sm:px-5 py-2.5 bg-slate-950 border-b border-slate-800/80 flex items-center justify-between gap-2 overflow-x-auto">
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveViewMode('briefing')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                activeViewMode === 'briefing'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Roteiro & Copy
            </button>
            <button
              onClick={() => setActiveViewMode('preview_instagram')}
              className={`flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                activeViewMode === 'preview_instagram'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Simulador Instagram</span>
            </button>
            <button
              onClick={() => setActiveViewMode('preview_whatsapp')}
              className={`flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                activeViewMode === 'preview_whatsapp'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Send className="w-3.5 h-3.5 text-emerald-400" />
              <span>Simulador WhatsApp</span>
            </button>
          </div>

          {/* Quick share on WhatsApp */}
          <button
            onClick={handleShareWhatsApp}
            title="Enviar roteiro para o WhatsApp"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-300 hover:text-emerald-200 bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/40 rounded-xl transition-all whitespace-nowrap shrink-0"
          >
            <Share2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Enviar no WhatsApp</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-xs sm:text-sm flex-1">
          {/* TAB 1: BRIEFING & COPY */}
          {activeViewMode === 'briefing' && (
            <>
              {/* Metadata Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl">
                <div>
                  <span className="block text-[11px] text-slate-400 mb-1">Formato</span>
                  <div className="flex items-center gap-1.5 font-semibold text-white">
                    {getFormatIcon(item.format)}
                    <span>{item.format}</span>
                  </div>
                </div>

                <div>
                  <span className="block text-[11px] text-slate-400 mb-1">Funil & Tipo</span>
                  <div className="font-semibold text-white">
                    {item.funnelStage} · {item.contentType}
                  </div>
                </div>

                <div>
                  <span className="block text-[11px] text-slate-400 mb-1">Horário & Canais</span>
                  <div className="font-semibold text-white font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{item.suggestedTime || '12:00'}</span>
                    <span className="font-sans text-[11px] text-slate-400 hidden sm:inline">
                      ({item.channels?.join(', ') || 'Instagram, WhatsApp'})
                    </span>
                  </div>
                </div>

                <div>
                  <span className="block text-[11px] text-slate-400 mb-1">Status do Conteúdo</span>
                  <select
                    value={item.status}
                    onChange={(e) => onUpdateStatus(item.id, e.target.value as ContentStatus)}
                    className={`w-full text-xs font-semibold rounded-md px-2 py-1 border transition-colors bg-slate-900 cursor-pointer ${
                      item.status === 'PUBLICADO'
                        ? 'border-emerald-500/50 text-emerald-400'
                        : item.status === 'APROVADO'
                        ? 'border-sky-500/50 text-sky-400'
                        : item.status === 'EM PRODUÇÃO'
                        ? 'border-amber-500/50 text-amber-400'
                        : item.status === 'PLANEJADO'
                        ? 'border-purple-500/50 text-purple-400'
                        : 'border-slate-700 text-slate-400'
                    }`}
                  >
                    <option value="IDEIA">IDEIA</option>
                    <option value="PLANEJADO">PLANEJADO</option>
                    <option value="EM PRODUÇÃO">EM PRODUÇÃO</option>
                    <option value="APROVADO">APROVADO</option>
                    <option value="PUBLICADO">PUBLICADO (Concluído)</option>
                  </select>
                </div>
              </div>

              {/* Objetivo Estratégico */}
              <div>
                <h4 className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">
                  Objetivo Estratégico
                </h4>
                <p className="text-slate-200 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/80">
                  {item.objective}
                </p>
              </div>

              {/* Conceito do Conteúdo */}
              <div>
                <h4 className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">
                  Conceito & Roteiro do Conteúdo
                </h4>
                <p className="text-slate-200 leading-relaxed bg-slate-950/40 p-3 rounded-lg border border-slate-800/80">
                  {item.contentIdea}
                </p>
              </div>

              {/* Legenda Completa com Copiar */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <h4 className="text-xs uppercase tracking-wider text-amber-400 font-semibold">
                    Legenda Completa (Copywriting)
                  </h4>
                  <button
                    onClick={handleCopyCaption}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors shadow-xs"
                  >
                    {copiedCaption ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-slate-950" />
                        <span>Copiado com Sucesso!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar Legenda</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-slate-200 font-sans whitespace-pre-wrap leading-relaxed select-all">
                  {item.caption}
                </div>
              </div>

              {/* CTA (Call To Action) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-xs uppercase tracking-wider text-emerald-400 font-semibold">
                    Chamada Para Ação (CTA)
                  </h4>
                  <button
                    onClick={handleCopyCta}
                    className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white"
                  >
                    {copiedCta ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedCta ? 'Copiado' : 'Copiar'}</span>
                  </button>
                </div>
                <div className="p-3 bg-emerald-950/20 border border-emerald-900/40 rounded-xl text-emerald-300 font-medium">
                  👉 {item.cta}
                </div>
              </div>

              {/* Informações Oficiais, Categoria & Legislação */}
              {(item.category || item.source || item.legalReference || item.responsible) && (
                <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 space-y-2">
                  <h4 className="text-xs uppercase tracking-wider text-amber-400 font-semibold flex items-center gap-1.5">
                    <span>🏛️ Informações Oficiais & Classificação</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
                    {item.category && (
                      <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                        <span className="text-[10px] text-slate-400 block font-medium">Categoria</span>
                        <span className="font-semibold text-slate-200">{item.category}</span>
                      </div>
                    )}
                    {item.source && (
                      <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                        <span className="text-[10px] text-slate-400 block font-medium">Origem dos Dados</span>
                        <span className="font-semibold text-slate-200">{item.source}</span>
                      </div>
                    )}
                    {item.legalReference && (
                      <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                        <span className="text-[10px] text-slate-400 block font-medium">Referência Legal</span>
                        <span className="font-semibold text-amber-300 font-mono text-[11px]">{item.legalReference}</span>
                      </div>
                    )}
                    {item.responsible && (
                      <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                        <span className="text-[10px] text-slate-400 block font-medium">Responsável</span>
                        <span className="font-semibold text-slate-200">{item.responsible}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Orientações para Design & Notas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-950/50 p-3.5 rounded-xl border border-slate-800">
                  <h5 className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-1">
                    Diretrizes de Design & Gravação
                  </h5>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {item.visualBrief || 'Seguir padrão visual NowTech (azul profundo, amarelo solar, fontes geométricas limpas e tecnologia solar).'}
                  </p>
                </div>

                <div className="bg-slate-950/50 p-3.5 rounded-xl border border-slate-800">
                  <h5 className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-1">
                    Orientações Estratégicas & Notas
                  </h5>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {item.notes || 'Acompanhar comentários e responder dúvidas sobre economia solar e financiamento em até 1 hora.'}
                  </p>
                </div>
              </div>
            </>
          )}

          {/* TAB 2: INSTAGRAM MOCKUP PREVIEW */}
          {activeViewMode === 'preview_instagram' && (
            <div className="flex flex-col items-center justify-center py-2">
              <div className="w-full max-w-sm bg-black border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
                {/* Instagram Post Header */}
                <div className="p-3 border-b border-slate-900 flex items-center justify-between bg-slate-950">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 p-0.5">
                      <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center">
                        <NowTechLogo variant="icon" size="sm" />
                      </div>
                    </div>
                    <div>
                      <span className="font-bold text-xs text-white block leading-tight">
                        nowtechsolar
                      </span>
                      <span className="text-[10px] text-slate-400">Pernambuco · Brasil</span>
                    </div>
                  </div>
                  <span className="text-slate-400 text-xs font-mono">···</span>
                </div>

                {/* Simulated Creative Media Slot */}
                <div className="aspect-square bg-gradient-to-br from-slate-900 via-slate-950 to-amber-950/40 relative flex flex-col justify-between p-5 border-b border-slate-900">
                  {/* Subtle solar grid effect */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:16px_16px]" />
                  
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-amber-400 bg-slate-900/80 px-2 py-0.5 rounded border border-amber-500/30 uppercase tracking-wider">
                      {item.format}
                    </span>
                    <span className="text-[10px] font-mono text-slate-300 bg-slate-900/80 px-1.5 py-0.5 rounded">
                      NowTech Solar
                    </span>
                  </div>

                  <div className="relative z-10 text-center space-y-2 px-2">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 mx-auto flex items-center justify-center border border-amber-500/30 shadow-lg">
                      {getFormatIcon(item.format)}
                    </div>
                    <h4 className="text-base font-extrabold text-white leading-tight drop-shadow-md">
                      {item.theme}
                    </h4>
                    <p className="text-xs text-slate-300 line-clamp-2">
                      {item.contentIdea}
                    </p>
                  </div>

                  <div className="relative z-10 flex items-center justify-between text-[10px] text-amber-300">
                    <span>⚡ Economia de até 95%</span>
                    <span>Arrasta para o lado 👉</span>
                  </div>
                </div>

                {/* Instagram Post Action Row */}
                <div className="p-3 bg-slate-950 space-y-2.5">
                  <div className="flex items-center justify-between text-slate-300">
                    <div className="flex items-center gap-3">
                      <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
                      <MessageCircle className="w-5 h-5" />
                      <Send className="w-5 h-5" />
                    </div>
                    <Bookmark className="w-5 h-5" />
                  </div>

                  <div className="text-[11px] text-white font-semibold">
                    Curtido por <strong className="text-amber-300">energia.solar.pe</strong> e outras pessoas
                  </div>

                  {/* Caption */}
                  <div className="text-xs text-slate-200 leading-snug space-y-1">
                    <p>
                      <strong className="text-white mr-1.5">nowtechsolar</strong>
                      {item.caption}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: WHATSAPP SIMULATOR */}
          {activeViewMode === 'preview_whatsapp' && (
            <div className="flex flex-col items-center justify-center py-2">
              <div className="w-full max-w-md bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
                {/* WhatsApp Chat Header */}
                <div className="p-3 bg-slate-900 border-b border-slate-800 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-slate-950 font-bold text-xs">
                    NT
                  </div>
                  <div className="flex-1">
                    <h5 className="font-bold text-xs text-white">NowTech Solar · Equipe Comercial</h5>
                    <span className="text-[10px] text-emerald-400">online</span>
                  </div>
                </div>

                {/* Chat Bubble */}
                <div className="p-4 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] min-h-[280px] flex flex-col justify-end">
                  <div className="bg-[#005c4b] text-slate-100 p-3.5 rounded-2xl rounded-tr-none max-w-[90%] self-end space-y-2 shadow-md text-xs leading-relaxed">
                    <div className="font-bold text-emerald-300 text-[11px]">
                      ☀️ NowTech Solar Fotovoltaica
                    </div>
                    <p className="whitespace-pre-wrap">{item.caption}</p>
                    <div className="pt-1 border-t border-emerald-600/40 text-[11px] font-semibold text-amber-300">
                      👉 {item.cta}
                    </div>
                    <div className="text-right text-[9px] text-emerald-200/60 font-mono">
                      {item.suggestedTime || '12:00'} ✓✓
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950/90 flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            {isAdmin && (
              <button
                onClick={() => onEdit(item)}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors min-h-[44px]"
              >
                <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                <span>Editar Conteúdo</span>
              </button>
            )}

            {item.status !== 'PUBLICADO' ? (
              <button
                onClick={() => onUpdateStatus(item.id, 'PUBLICADO')}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-emerald-300 hover:text-emerald-200 bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-500/40 rounded-xl transition-colors min-h-[44px]"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Marcar como Publicado</span>
              </button>
            ) : (
              <span className="text-xs text-emerald-400 flex items-center gap-1 font-semibold px-3 py-2 bg-emerald-950/30 rounded-xl border border-emerald-500/30">
                <CheckCircle2 className="w-3.5 h-3.5" /> Publicado
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-colors shadow-sm min-h-[44px]"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
