import React, { useState } from 'react';
import { 
  Copy, 
  Check, 
  ExternalLink, 
  Calendar, 
  Sparkles, 
  Video, 
  Layers, 
  Image as ImageIcon, 
  Send, 
  ArrowUpDown, 
  Cake,
  Clock,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { ContentItem, ContentStatus, ContentFormat } from '../types/marketing';
import { Employee } from '../types/employee';
import { parseBirthDate, calculateAge } from '../data/employeesData';
import { getEventTemporalStatus } from '../utils/dateUtils';

interface ContentListViewProps {
  items: ContentItem[];
  employees?: Employee[];
  todayStr: string;
  nextEventDate?: string | null;
  onSelectContent: (item: ContentItem) => void;
  onSelectEmployeeBirthday?: (employee: Employee) => void;
  onUpdateStatus: (id: string, newStatus: ContentStatus) => void;
}

export const ContentListView: React.FC<ContentListViewProps> = ({
  items,
  employees = [],
  todayStr,
  nextEventDate,
  onSelectContent,
  onSelectEmployeeBirthday,
  onUpdateStatus,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [sortField, setSortField] = useState<'date' | 'theme' | 'format' | 'status'>('date');
  const [sortAsc, setSortAsc] = useState<boolean>(true);

  const handleCopyCaption = (e: React.MouseEvent, item: ContentItem) => {
    e.stopPropagation();
    navigator.clipboard.writeText(item.caption);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

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

  const sortedItems = [...items].sort((a, b) => {
    let cmp = 0;
    if (sortField === 'date') cmp = a.date.localeCompare(b.date);
    else if (sortField === 'theme') cmp = a.theme.localeCompare(b.theme);
    else if (sortField === 'format') cmp = a.format.localeCompare(b.format);
    else if (sortField === 'status') cmp = a.status.localeCompare(b.status);
    return sortAsc ? cmp : -cmp;
  });

  const toggleSort = (field: 'date' | 'theme' | 'format' | 'status') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-950/90 text-slate-400 border-b border-slate-800 select-none">
              <th 
                onClick={() => toggleSort('date')}
                className="py-3 px-3.5 font-semibold text-slate-300 cursor-pointer hover:text-white whitespace-nowrap"
              >
                <div className="flex items-center gap-1">
                  <span>Data & Situação</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th 
                onClick={() => toggleSort('format')}
                className="py-3 px-3 font-semibold text-slate-300 cursor-pointer hover:text-white whitespace-nowrap"
              >
                <div className="flex items-center gap-1">
                  <span>Formato</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th 
                onClick={() => toggleSort('theme')}
                className="py-3 px-4 font-semibold text-slate-300 cursor-pointer hover:text-white min-w-[280px]"
              >
                <div className="flex items-center gap-1">
                  <span>Tema / Pauta Estratégica</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-3 font-semibold text-slate-300 whitespace-nowrap hidden md:table-cell">
                Funil
              </th>
              <th className="py-3 px-3 font-semibold text-slate-300 whitespace-nowrap hidden lg:table-cell">
                Campanha
              </th>
              <th className="py-3 px-3 font-semibold text-slate-300 whitespace-nowrap hidden sm:table-cell">
                Horário
              </th>
              <th 
                onClick={() => toggleSort('status')}
                className="py-3 px-3 font-semibold text-slate-300 cursor-pointer hover:text-white whitespace-nowrap"
              >
                <div className="flex items-center gap-1">
                  <span>Status da Tarefa</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-3.5 font-semibold text-slate-300 text-right whitespace-nowrap">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-medium">
            {sortedItems.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-400 italic">
                  Nenhum conteúdo encontrado com os filtros selecionados.
                </td>
              </tr>
            ) : (
              sortedItems.map((item) => {
                const temporalStatus = getEventTemporalStatus(
                  item.date,
                  item.endDate,
                  todayStr,
                  nextEventDate
                );

                const isPast = temporalStatus === 'PASSADA';
                const isToday = temporalStatus === 'HOJE';
                const isNextEvent = temporalStatus === 'PROXIMO';
                const isCompleted = item.status === 'PUBLICADO';
                const isPendingPast = isPast && !isCompleted;

                let rowBgClass = 'hover:bg-slate-850/80 cursor-pointer transition-colors group';
                if (isToday) {
                  rowBgClass = 'bg-amber-950/20 hover:bg-amber-950/30 border-l-4 border-l-amber-400 cursor-pointer transition-colors group';
                } else if (isNextEvent) {
                  rowBgClass = 'bg-sky-950/20 hover:bg-sky-950/30 border-l-4 border-l-sky-400 cursor-pointer transition-colors group';
                } else if (isPendingPast) {
                  rowBgClass = 'bg-slate-900/60 hover:bg-slate-850/80 border-l-4 border-l-rose-500/60 cursor-pointer transition-colors group opacity-90';
                } else if (isPast) {
                  rowBgClass = 'bg-slate-950/50 hover:bg-slate-900/70 opacity-75 hover:opacity-100 cursor-pointer transition-colors group';
                }

                return (
                  <tr
                    key={item.id}
                    onClick={() => onSelectContent(item)}
                    className={rowBgClass}
                  >
                    {/* Date & Temporal Indicator */}
                    <td className="py-3 px-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-slate-200 font-semibold">
                          {item.date.split('-').reverse().join('/')}
                        </span>

                        {isToday && (
                          <span className="text-[10px] font-bold text-amber-950 bg-amber-400 px-1.5 py-0.2 rounded-full flex items-center gap-1 shadow-xs">
                            <span className="w-1 h-1 rounded-full bg-slate-950 animate-ping" />
                            Hoje
                          </span>
                        )}

                        {isNextEvent && (
                          <span className="text-[10px] font-bold text-sky-300 bg-sky-500/20 px-1.5 py-0.2 rounded border border-sky-500/40">
                            Próximo
                          </span>
                        )}

                        {isPast && (
                          <span 
                            className="text-[9px] text-slate-400 flex items-center gap-0.5 bg-slate-800/80 px-1.5 py-0.2 rounded border border-slate-700/60"
                            title="Data passada"
                          >
                            <Clock className="w-2.5 h-2.5 text-slate-400" />
                            <span>Data passada</span>
                          </span>
                        )}
                      </div>

                      <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                        <span>{item.dayOfWeek}</span>
                        {isPendingPast && (
                          <span className="text-[9px] font-bold text-rose-400 flex items-center gap-0.5">
                            <AlertTriangle className="w-2.5 h-2.5" /> Pendente
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Format */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-slate-200">
                        {getFormatIcon(item.format)}
                        <span>{item.format}</span>
                      </div>
                    </td>

                    {/* Theme & Holiday */}
                    <td className="py-3 px-4">
                      <div className={`font-semibold line-clamp-2 transition-colors ${
                        isToday 
                          ? 'text-amber-200 group-hover:text-amber-100' 
                          : isPast 
                          ? 'text-slate-300 group-hover:text-white' 
                          : 'text-white group-hover:text-amber-300'
                      }`}>
                        {item.theme}
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5 mt-1">
                        {item.holiday && (
                          <div className={`inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded border ${
                            isPast 
                              ? 'text-slate-400 bg-slate-800/40 border-slate-700/40' 
                              : 'text-amber-300 bg-amber-500/10 border-amber-500/20'
                          }`}>
                            ★ {item.holiday}
                          </div>
                        )}
                        {(() => {
                          const [, m, d] = item.date.split('-').map(Number);
                          const itemYr = Number(item.date.split('-')[0]) || 2027;
                          const bEmps = employees.filter(
                            (e) => e.status === 'ATIVO' && parseBirthDate(e.birthDate).month === m && parseBirthDate(e.birthDate).day === d
                          );
                          return bEmps.map((b) => {
                            const empAge = calculateAge(b.birthDate, itemYr);
                            return (
                              <div
                                key={b.id}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onSelectEmployeeBirthday?.(b);
                                }}
                                title={`Aniversário da equipe: ${b.name} (${b.role})${empAge > 0 ? ` · ${empAge} anos` : ''}${isPast ? ' - Já passou neste ano' : isToday ? ' - É HOJE!' : ''}`}
                                className={`inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded border cursor-pointer transition-colors ${
                                  isToday
                                    ? 'text-rose-200 bg-rose-900/80 border-rose-400 animate-pulse'
                                    : isPast
                                    ? 'text-slate-400 bg-slate-900 border-slate-700/60'
                                    : 'text-rose-300 bg-rose-950/60 hover:bg-rose-900/80 border-rose-500/40'
                                }`}
                              >
                                <Cake className="w-2.5 h-2.5 text-rose-400" />
                                <span>🎂 Niver: {b.name} {empAge > 0 ? `(${empAge} anos)` : isPast ? '(passou)' : isToday ? '(Hoje!)' : ''}</span>
                              </div>
                            );
                          });
                        })()}
                      </div>
                    </td>

                    {/* Funnel */}
                    <td className="py-3 px-3 whitespace-nowrap hidden md:table-cell">
                      <span className="text-slate-300">{item.funnelStage}</span>
                    </td>

                    {/* Campaign */}
                    <td className="py-3 px-3 whitespace-nowrap hidden lg:table-cell text-slate-400">
                      <span className="line-clamp-1 max-w-[180px]">{item.campaign}</span>
                    </td>

                    {/* Suggested Time */}
                    <td className="py-3 px-3 whitespace-nowrap hidden sm:table-cell font-mono text-slate-400">
                      {item.suggestedTime}
                    </td>

                    {/* Status Dropdown + Warning */}
                    <td className="py-3 px-3 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <div className="flex flex-col gap-1">
                        <select
                          value={item.status}
                          onChange={(e) => onUpdateStatus(item.id, e.target.value as ContentStatus)}
                          className={`text-xs font-semibold rounded-md px-2 py-1 border transition-colors cursor-pointer bg-slate-950 ${
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

                        {isPendingPast && (
                          <span className="text-[9px] text-rose-400 font-medium">
                            Atrasado p/ publicação
                          </span>
                        )}
                        {isCompleted && (
                          <span className="text-[9px] text-emerald-400 font-medium flex items-center gap-0.5">
                            <CheckCircle2 className="w-2.5 h-2.5" /> Concluído
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Action buttons */}
                    <td className="py-3 px-3.5 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={(e) => handleCopyCaption(e, item)}
                          title="Copiar legenda para a área de transferência"
                          className="p-1.5 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-md transition-colors"
                        >
                          {copiedId === item.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>

                        <button
                          onClick={() => onSelectContent(item)}
                          title="Ver detalhes completos"
                          className="p-1.5 text-slate-400 hover:text-amber-400 bg-slate-800/80 hover:bg-slate-700 rounded-md transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
