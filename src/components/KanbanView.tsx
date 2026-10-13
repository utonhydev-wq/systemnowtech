import React from 'react';
import { 
  Sparkles, 
  Video, 
  Layers, 
  Image as ImageIcon, 
  ArrowRight, 
  Clock, 
  Check, 
  Calendar,
  Send,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { ContentItem, ContentStatus, ContentFormat } from '../types/marketing';
import { getEventTemporalStatus } from '../utils/dateUtils';

interface KanbanViewProps {
  items: ContentItem[];
  todayStr: string;
  nextEventDate?: string | null;
  onSelectContent: (item: ContentItem) => void;
  onUpdateStatus: (id: string, newStatus: ContentStatus) => void;
}

export const KanbanView: React.FC<KanbanViewProps> = ({
  items,
  todayStr,
  nextEventDate,
  onSelectContent,
  onUpdateStatus,
}) => {
  const columns: { status: ContentStatus; label: string; color: string; border: string }[] = [
    { status: 'IDEIA', label: 'Ideia', color: 'text-slate-400 bg-slate-800/40', border: 'border-slate-800' },
    { status: 'PLANEJADO', label: 'Planejado', color: 'text-purple-400 bg-purple-950/40', border: 'border-purple-900/50' },
    { status: 'EM PRODUÇÃO', label: 'Em Produção', color: 'text-amber-400 bg-amber-950/40', border: 'border-amber-900/50' },
    { status: 'APROVADO', label: 'Aprovado', color: 'text-sky-400 bg-sky-950/40', border: 'border-sky-900/50' },
    { status: 'PUBLICADO', label: 'Publicado', color: 'text-emerald-400 bg-emerald-950/40', border: 'border-emerald-900/50' },
  ];

  const getFormatIcon = (format: ContentFormat) => {
    switch (format) {
      case 'Reels':
        return <Video className="w-3.5 h-3.5 text-pink-400" />;
      case 'Carrossel':
        return <Layers className="w-3.5 h-3.5 text-amber-400" />;
      case 'Post':
        return <ImageIcon className="w-3.5 h-3.5 text-sky-400" />;
      case 'Stories':
        return <Sparkles className="w-3.5 h-3.5 text-emerald-400" />;
      case 'WhatsApp':
        return <Send className="w-3.5 h-3.5 text-green-400" />;
    }
  };

  const getNextStatus = (current: ContentStatus): ContentStatus | null => {
    switch (current) {
      case 'IDEIA':
        return 'PLANEJADO';
      case 'PLANEJADO':
        return 'EM PRODUÇÃO';
      case 'EM PRODUÇÃO':
        return 'APROVADO';
      case 'APROVADO':
        return 'PUBLICADO';
      case 'PUBLICADO':
        return null;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
      {columns.map((col) => {
        const columnItems = items.filter((i) => i.status === col.status);

        return (
          <div
            key={col.status}
            className={`bg-slate-900/70 border ${col.border} rounded-xl p-3 flex flex-col min-w-[260px] max-h-[820px]`}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded ${col.color}`}>
                  {col.label}
                </span>
                <span className="font-mono text-xs text-slate-400">({columnItems.length})</span>
              </div>
            </div>

            {/* Column Card List */}
            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 no-scrollbar">
              {columnItems.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-500 italic">
                  Nenhum item nesta etapa
                </div>
              ) : (
                columnItems.map((item) => {
                  const nextStatus = getNextStatus(item.status);
                  const temporalStatus = getEventTemporalStatus(
                    item.date,
                    item.endDate,
                    todayStr,
                    nextEventDate
                  );
                  const isPast = temporalStatus === 'PASSADA';
                  const isToday = temporalStatus === 'HOJE';
                  const isNext = temporalStatus === 'PROXIMO';
                  const isPendingPast = isPast && item.status !== 'PUBLICADO';

                  let cardBorder = 'border-slate-800 hover:border-slate-700 bg-slate-950/90';
                  if (isToday) {
                    cardBorder = 'border-amber-400 ring-1 ring-amber-400/40 bg-amber-950/20';
                  } else if (isNext) {
                    cardBorder = 'border-sky-500/50 bg-sky-950/20';
                  } else if (isPendingPast) {
                    cardBorder = 'border-rose-900/50 bg-slate-950/90 opacity-90';
                  } else if (isPast) {
                    cardBorder = 'border-slate-800/80 bg-slate-950/60 opacity-80';
                  }

                  return (
                    <div
                      key={item.id}
                      className={`border rounded-lg p-3 space-y-2 transition-all hover:bg-slate-900 group shadow-sm ${cardBorder}`}
                    >
                      {/* Top date + temporal badge + format */}
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-mono text-[11px] text-slate-200 font-semibold flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-amber-400" />
                            {item.date.split('-').reverse().slice(0, 2).join('/')}
                          </span>

                          {isToday && (
                            <span className="text-[9px] font-bold text-amber-950 bg-amber-400 px-1.5 py-0.2 rounded-full uppercase flex items-center gap-0.5 shadow-xs">
                              <span className="w-1 h-1 rounded-full bg-slate-950 animate-ping" />
                              Hoje
                            </span>
                          )}

                          {isNext && (
                            <span className="text-[9px] font-bold text-sky-300 bg-sky-500/20 px-1 py-0.2 rounded border border-sky-500/40">
                              Próximo
                            </span>
                          )}

                          {isPast && (
                            <span className="text-[9px] text-slate-400 flex items-center gap-0.5 bg-slate-900 px-1 rounded border border-slate-800">
                              <Clock className="w-2.5 h-2.5" /> Passada
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1">
                          {getFormatIcon(item.format)}
                          <span className="text-[11px] font-medium text-slate-300">
                            {item.format}
                          </span>
                        </div>
                      </div>

                      {/* Commemorative date badge */}
                      {item.holiday && (
                        <div className="text-[10px] font-semibold text-amber-300 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20 line-clamp-1">
                          ★ {item.holiday}
                        </div>
                      )}

                      {/* Theme Title */}
                      <h4
                        onClick={() => onSelectContent(item)}
                        className={`text-xs font-semibold cursor-pointer line-clamp-2 leading-tight transition-colors ${
                          isToday ? 'text-amber-200 group-hover:text-amber-100' : 'text-white group-hover:text-amber-300'
                        }`}
                      >
                        {item.theme}
                      </h4>

                      {/* Pending warning if past */}
                      {isPendingPast && (
                        <div className="flex items-center gap-1 text-[10px] font-semibold text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20">
                          <AlertTriangle className="w-3 h-3 text-rose-400 shrink-0" />
                          <span>Data passada · Publicação pendente</span>
                        </div>
                      )}

                      {/* Funnel Stage */}
                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-900">
                        <span>{item.funnelStage}</span>
                        <span className="text-slate-400 font-mono text-[10px]">{item.suggestedTime}</span>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center justify-between pt-1 gap-1">
                        <button
                          onClick={() => onSelectContent(item)}
                          className="text-[11px] text-slate-400 hover:text-white transition-colors"
                        >
                          Ver detalhes
                        </button>

                        {nextStatus && (
                          <button
                            onClick={() => onUpdateStatus(item.id, nextStatus)}
                            className="flex items-center gap-1 text-[11px] text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 px-2 py-0.5 rounded transition-all font-semibold"
                          >
                            <span>Avançar</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
