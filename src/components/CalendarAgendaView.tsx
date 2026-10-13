import React, { useState } from 'react';
import { 
  Calendar, 
  Copy, 
  Check, 
  Clock, 
  Video, 
  Layers, 
  Image as ImageIcon, 
  Sparkles, 
  Send, 
  Cake, 
  ExternalLink,
  Share2,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Filter
} from 'lucide-react';
import { ContentItem, ContentStatus, ContentFormat } from '../types/marketing';
import { Employee } from '../types/employee';
import { parseBirthDate, calculateAge } from '../data/employeesData';
import { getEventTemporalStatus } from '../utils/dateUtils';

interface CalendarAgendaViewProps {
  items: ContentItem[];
  employees: Employee[];
  todayStr: string;
  nextEventDate?: string | null;
  onSelectContent: (item: ContentItem) => void;
  onSelectEmployeeBirthday: (employee: Employee) => void;
  onUpdateStatus: (id: string, newStatus: ContentStatus) => void;
}

export const CalendarAgendaView: React.FC<CalendarAgendaViewProps> = ({
  items,
  employees,
  todayStr,
  nextEventDate,
  onSelectContent,
  onSelectEmployeeBirthday,
  onUpdateStatus,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyCaption = (e: React.MouseEvent, item: ContentItem) => {
    e.stopPropagation();
    navigator.clipboard.writeText(item.caption);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleShareWhatsApp = (e: React.MouseEvent, item: ContentItem) => {
    e.stopPropagation();
    const text = `☀️ *NOWTECH SOLAR — PLANEJAMENTO DE POST*\n\n📅 *Data:* ${item.date.split('-').reverse().join('/')} (${item.dayOfWeek})\n📌 *Tema:* ${item.theme}\n🎯 *Formato:* ${item.format} | *Horário:* ${item.suggestedTime || '12:00'}\n\n📝 *LEGENDA SUGERIDA:*\n${item.caption}\n\n👉 *CTA:* ${item.cta}`;
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

  const activeEmployees = employees.filter((e) => e.status === 'ATIVO');

  return (
    <div className="space-y-3.5">
      {/* Header bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-amber-400" />
          <span className="text-xs sm:text-sm font-bold text-white">
            Feed Diário de Conteúdo ({items.length} dias programados)
          </span>
        </div>
        <span className="text-[11px] text-slate-400">
          Otimizado para visualização rápida no celular e computador
        </span>
      </div>

      {items.length === 0 ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-8 text-center space-y-2">
          <p className="text-sm text-slate-400">Nenhum conteúdo encontrado para os filtros selecionados.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => {
            const temporalStatus = getEventTemporalStatus(
              item.date,
              item.endDate,
              todayStr,
              nextEventDate
            );

            const isPast = temporalStatus === 'PASSADA';
            const isToday = temporalStatus === 'HOJE';
            const isNext = temporalStatus === 'PROXIMO';
            const isCompleted = item.status === 'PUBLICADO';
            const isPendingPast = isPast && !isCompleted;

            // Birthday check for this day
            const [, m, d] = item.date.split('-').map(Number);
            const dayBirthdays = activeEmployees.filter((emp) => {
              const parsed = parseBirthDate(emp.birthDate);
              return parsed.month === m && parsed.day === d;
            });

            let cardContainerClass = 'bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 sm:p-5 transition-all shadow-sm';
            if (isToday) {
              cardContainerClass = 'bg-gradient-to-b from-amber-950/40 via-slate-900 to-slate-900 border-2 border-amber-400 rounded-2xl p-4 sm:p-5 shadow-lg shadow-amber-500/10 ring-1 ring-amber-400/40';
            } else if (isNext) {
              cardContainerClass = 'bg-slate-900 border-2 border-sky-500/60 rounded-2xl p-4 sm:p-5 shadow-md shadow-sky-500/10';
            } else if (isPendingPast) {
              cardContainerClass = 'bg-slate-900/70 border border-rose-900/50 rounded-2xl p-4 sm:p-5 opacity-90';
            } else if (isPast) {
              cardContainerClass = 'bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4 sm:p-5 opacity-80 hover:opacity-100';
            }

            return (
              <article
                key={item.id}
                onClick={() => onSelectContent(item)}
                className={`${cardContainerClass} cursor-pointer group`}
              >
                {/* Card Top: Date info + Temporal status + Format badge */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-800/80">
                  <div className="flex items-center gap-2">
                    {/* Date Pill */}
                    <div className="flex items-baseline gap-1.5 font-mono">
                      <span className="text-base sm:text-lg font-bold text-white">
                        {item.date.split('-')[2]}
                      </span>
                      <span className="text-xs text-slate-400 font-sans font-semibold">
                        /{item.date.split('-')[1]} · {item.dayOfWeek}
                      </span>
                    </div>

                    {/* Temporal status badges */}
                    {isToday && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-400 text-slate-950 uppercase tracking-wider flex items-center gap-1 shadow-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-ping" />
                        Hoje
                      </span>
                    )}

                    {isNext && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                        Próximo Evento
                      </span>
                    )}

                    {isPast && (
                      <span className="px-2 py-0.5 rounded text-[10px] text-slate-400 bg-slate-800/80 border border-slate-700/60 flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" />
                        <span>Data passada</span>
                      </span>
                    )}

                    {isPendingPast && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold text-rose-300 bg-rose-950/60 border border-rose-500/40 flex items-center gap-1">
                        <AlertTriangle className="w-2.5 h-2.5 text-rose-400" />
                        <span>Publicação Pendente</span>
                      </span>
                    )}
                  </div>

                  {/* Format & Suggested time */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950/80 border border-slate-800 text-xs font-semibold text-slate-200">
                      {getFormatIcon(item.format)}
                      <span>{item.format}</span>
                    </div>

                    <div className="text-xs font-mono text-slate-400 hidden sm:flex items-center gap-1 bg-slate-950/60 px-2 py-1 rounded-lg border border-slate-800">
                      <Clock className="w-3 h-3" />
                      <span>{item.suggestedTime || '12:00'}</span>
                    </div>
                  </div>
                </div>

                {/* Holiday Banner if present */}
                {item.holiday && (
                  <div className="mb-2.5 flex flex-wrap items-center gap-1.5 text-xs font-semibold text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                    <span>★ {item.holiday}</span>
                    {item.category && (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        item.category === 'Feriado municipal'
                          ? 'bg-amber-400 text-slate-950 border-amber-300'
                          : item.category === 'Ponto facultativo'
                          ? 'bg-purple-950/80 text-purple-300 border-purple-500/40'
                          : item.category === 'Feriado estadual'
                          ? 'bg-sky-950/80 text-sky-300 border-sky-500/40'
                          : 'bg-slate-900 text-slate-300 border-slate-700'
                      }`}>
                        {item.category === 'Feriado municipal' ? '🏛️ Feriado Municipal (Jaboatão)' : item.category}
                      </span>
                    )}
                    {item.legalReference && (
                      <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
                        · {item.legalReference}
                      </span>
                    )}
                  </div>
                )}

                {/* Employee Birthday Alert if on this date */}
                {dayBirthdays.map((bEmp) => {
                  const itemYr = Number(item.date.split('-')[0]) || 2027;
                  const empAge = calculateAge(bEmp.birthDate, itemYr);
                  return (
                    <div
                      key={bEmp.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectEmployeeBirthday(bEmp);
                      }}
                      className="mb-2.5 flex items-center justify-between p-2 rounded-xl bg-gradient-to-r from-rose-950/80 to-amber-950/40 border border-rose-500/40 hover:border-rose-400 transition-all text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <Cake className="w-4 h-4 text-rose-400 animate-pulse" />
                        <div>
                          <span className="font-bold text-rose-200">
                            🎂 Aniversário da equipe: {bEmp.name} {empAge > 0 ? `(${empAge} anos)` : ''}
                          </span>
                          <span className="text-slate-400 ml-1">({bEmp.role})</span>
                        </div>
                      </div>
                      <span className="text-[11px] text-rose-300 font-semibold flex items-center gap-0.5">
                        Planejar homenagem <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  );
                })}

                {/* Main Content Title & Concept */}
                <div className="space-y-1.5">
                  <h3 className={`text-base font-bold transition-colors ${
                    isToday ? 'text-amber-300 group-hover:text-amber-200' : 'text-white group-hover:text-amber-400'
                  }`}>
                    {item.theme}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 leading-relaxed">
                    {item.contentIdea}
                  </p>
                </div>

                {/* Caption Snippet preview */}
                <div className="mt-3 p-3 rounded-xl bg-slate-950/90 border border-slate-800/80 text-xs text-slate-300 leading-relaxed font-sans line-clamp-3">
                  <span className="font-semibold text-amber-400/90 block mb-0.5 text-[11px] uppercase tracking-wider">
                    Prévia da Legenda:
                  </span>
                  {item.caption}
                </div>

                {/* CTA Box */}
                <div className="mt-2.5 flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/20 px-3 py-1.5 rounded-lg border border-emerald-900/40">
                  <span className="font-semibold">CTA:</span>
                  <span className="line-clamp-1">{item.cta}</span>
                </div>

                {/* Bottom Action Strip (Touch-First & Desktop Friendly) */}
                <div 
                  className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Status Dropdown */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-slate-400">Status:</span>
                    <select
                      value={item.status}
                      onChange={(e) => onUpdateStatus(item.id, e.target.value as ContentStatus)}
                      className={`text-xs font-semibold rounded-lg px-2.5 py-1.5 border transition-colors cursor-pointer bg-slate-950 ${
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

                  {/* Quick Action Buttons */}
                  <div className="flex items-center gap-2">
                    {/* Copy Caption */}
                    <button
                      onClick={(e) => handleCopyCaption(e, item)}
                      title="Copiar legenda completa"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
                    >
                      {copiedId === item.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copiado</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copiar Legenda</span>
                        </>
                      )}
                    </button>

                    {/* Share on WhatsApp */}
                    <button
                      onClick={(e) => handleShareWhatsApp(e, item)}
                      title="Enviar pauta formatada para o WhatsApp"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-400 bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-500/40 transition-colors"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">WhatsApp</span>
                    </button>

                    {/* View Details */}
                    <button
                      onClick={() => onSelectContent(item)}
                      title="Abrir roteiro completo"
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-colors"
                    >
                      <span>Detalhes</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};
