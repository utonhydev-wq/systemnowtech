import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Sparkles, 
  Video, 
  Layers, 
  Image as ImageIcon, 
  Send,
  Clock,
  Cake,
  Gift,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { ContentItem, ContentFormat, ContentStatus, MonthFilter, YearFilter } from '../types/marketing';
import { Employee, BirthdayTribute } from '../types/employee';
import { parseBirthDate, calculateAge } from '../data/employeesData';
import { getEventTemporalStatus, isBirthdayPassedInYear } from '../utils/dateUtils';

interface CalendarGridViewProps {
  items: ContentItem[];
  employees: Employee[];
  tributes?: BirthdayTribute[];
  selectedMonth: MonthFilter;
  selectedYear?: YearFilter;
  todayStr: string;
  nextEventDate?: string | null;
  onSelectContent: (item: ContentItem) => void;
  onSelectEmployeeBirthday: (employee: Employee) => void;
  onUpdateStatus: (id: string, newStatus: ContentStatus) => void;
}

export const CalendarGridView: React.FC<CalendarGridViewProps> = ({
  items,
  employees,
  tributes = [],
  selectedMonth,
  selectedYear,
  todayStr,
  nextEventDate,
  onSelectContent,
  onSelectEmployeeBirthday,
  onUpdateStatus,
}) => {
  // Current active year and month (YYYY-MM)
  // Default to 2027 if planning 2027 or 2026 if historical
  const [activeYear, setActiveYear] = useState<number>(() => {
    if (selectedYear && selectedYear !== 'TODOS') {
      const yrNum = Number(selectedYear);
      if (!isNaN(yrNum)) return yrNum;
    }
    return 2027;
  });

  // Sync activeYear when selectedYear prop changes
  React.useEffect(() => {
    if (selectedYear && selectedYear !== 'TODOS') {
      const yrNum = Number(selectedYear);
      if (!isNaN(yrNum) && yrNum !== activeYear) {
        setActiveYear(yrNum);
      }
    }
  }, [selectedYear]);

  const [activeMonth, setActiveMonth] = useState<number>(() => {
    const monthIndexMap: Record<string, number> = {
      JANEIRO: 1,
      FEVEREIRO: 2,
      MARÇO: 3,
      ABRIL: 4,
      MAIO: 5,
      JUNHO: 6,
      JULHO: 7,
      AGOSTO: 8,
      SETEMBRO: 9,
      OUTUBRO: 10,
      NOVEMBRO: 11,
      DEZEMBRO: 12,
    };
    if (selectedMonth !== 'TODOS' && monthIndexMap[selectedMonth]) {
      return monthIndexMap[selectedMonth];
    }
    return 1; // Default to Janeiro for 2027 planning
  });

  // Keep activeMonth synced when user clicks month filter from outside
  React.useEffect(() => {
    const monthIndexMap: Record<string, number> = {
      JANEIRO: 1,
      FEVEREIRO: 2,
      MARÇO: 3,
      ABRIL: 4,
      MAIO: 5,
      JUNHO: 6,
      JULHO: 7,
      AGOSTO: 8,
      SETEMBRO: 9,
      OUTUBRO: 10,
      NOVEMBRO: 11,
      DEZEMBRO: 12,
    };
    if (selectedMonth !== 'TODOS' && monthIndexMap[selectedMonth]) {
      setActiveMonth(monthIndexMap[selectedMonth]);
      if (['OUTUBRO', 'NOVEMBRO', 'DEZEMBRO'].includes(selectedMonth) && activeYear === 2027) {
        // Leave year as is unless specified
      }
    }
  }, [selectedMonth]);

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  // Dynamic calendar math for any month/year
  const firstDayWeekday = new Date(activeYear, activeMonth - 1, 1).getDay(); // 0 = Sun
  const totalDays = new Date(activeYear, activeMonth, 0).getDate();

  const weekdays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  // Map marketing items by date string YYYY-MM-DD
  const itemMap = new Map<string, ContentItem>();
  for (const item of items) {
    itemMap.set(item.date, item);
  }

  // Active employees
  const activeEmployees = employees.filter((e) => e.status === 'ATIVO');

  // Generate calendar grid cells (including empty padding before day 1)
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDayWeekday; i++) {
    cells.push(null);
  }
  for (let d = 1; d <= totalDays; d++) {
    cells.push(d);
  }

  const handlePrevMonth = () => {
    if (activeMonth === 1) {
      setActiveMonth(12);
      setActiveYear(activeYear - 1);
    } else {
      setActiveMonth(activeMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (activeMonth === 12) {
      setActiveMonth(1);
      setActiveYear(activeYear + 1);
    } else {
      setActiveMonth(activeMonth + 1);
    }
  };

  const getFormatIcon = (format: ContentFormat) => {
    switch (format) {
      case 'Reels':
        return <Video className="w-3 h-3 text-pink-400" />;
      case 'Carrossel':
        return <Layers className="w-3 h-3 text-amber-400" />;
      case 'Post':
        return <ImageIcon className="w-3 h-3 text-sky-400" />;
      case 'Stories':
        return <Sparkles className="w-3 h-3 text-emerald-400" />;
      case 'WhatsApp':
        return <Send className="w-3 h-3 text-green-400" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: ContentStatus) => {
    switch (status) {
      case 'PUBLICADO':
        return (
          <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5">
            <CheckCircle2 className="w-2.5 h-2.5" /> Publicado
          </span>
        );
      case 'APROVADO':
        return <span className="text-[10px] text-sky-400 font-medium">Aprovado</span>;
      case 'EM PRODUÇÃO':
        return <span className="text-[10px] text-amber-400 font-medium">Em Prod.</span>;
      case 'PLANEJADO':
        return <span className="text-[10px] text-purple-400 font-medium">Planejado</span>;
      case 'IDEIA':
        return <span className="text-[10px] text-slate-400 font-medium">Ideia</span>;
    }
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
      {/* Calendar Header with Month Selector and Navigation */}
      <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-950/60">
        <div>
          <div className="flex items-center gap-3">
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-amber-400" />
              {monthNames[activeMonth - 1]} / {activeYear}
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            Atualização diária automática. Datas passadas são marcadas automaticamente em cinza, hoje em destaque e pendências sinalizadas.
          </span>
        </div>

        {/* Month selector controls with Q4 quick shortcuts & arrows */}
        <div className="flex flex-wrap items-center gap-1.5 self-stretch sm:self-auto justify-between sm:justify-start">
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              onClick={handlePrevMonth}
              title="Mês anterior"
              className="p-1 text-slate-400 hover:text-white hover:bg-slate-900 rounded"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono font-semibold px-2 text-slate-200">
              {activeMonth.toString().padStart(2, '0')}/{activeYear}
            </span>
            <button
              onClick={handleNextMonth}
              title="Próximo mês"
              className="p-1 text-slate-400 hover:text-white hover:bg-slate-900 rounded"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Year and Period selector shortcuts */}
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => {
                setActiveYear(2027);
                if (activeMonth < 1 || activeMonth > 12) setActiveMonth(1);
              }}
              className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all flex items-center gap-1 ${
                activeYear === 2027
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>2027</span>
              <span className="text-[10px] opacity-75 font-normal hidden sm:inline">(Planejamento)</span>
            </button>

            <button
              onClick={() => {
                setActiveYear(2026);
                if (activeMonth < 10) setActiveMonth(10);
              }}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all flex items-center gap-1 ${
                activeYear === 2026
                  ? 'bg-slate-200 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>2026</span>
              <span className="text-[10px] opacity-75 font-normal hidden sm:inline">(Histórico)</span>
            </button>

            <button
              onClick={() => {
                setActiveYear(2028);
                setActiveMonth(1);
              }}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                activeYear === 2028
                  ? 'bg-slate-200 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              2028+
            </button>
          </div>
        </div>
      </div>

      {/* Mobile touch tip */}
      <div className="sm:hidden px-4 py-2 bg-slate-950/70 border-b border-slate-800 text-[11px] text-amber-300/80 flex items-center justify-between">
        <span>💡 Dica: Deslize horizontalmente ou use o modo <strong>Agenda</strong></span>
      </div>

      {/* Responsive Grid Wrapper (Ensures 7-day grid doesn't crush below legible widths on phone screens) */}
      <div className="overflow-x-auto">
        <div className="min-w-[680px] lg:min-w-0">
          {/* Weekday Labels Grid */}
          <div className="grid grid-cols-7 border-b border-slate-800 bg-slate-950 text-slate-400 text-xs font-semibold py-2 px-1 text-center">
            {weekdays.map((day, idx) => (
              <div key={day} className={idx === 0 || idx === 6 ? 'text-amber-400/80' : ''}>
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Day Cells */}
          <div className="grid grid-cols-7 gap-px bg-slate-800/80 p-px">
            {cells.map((dayNum, index) => {
          if (!dayNum) {
            return (
              <div
                key={`empty-${index}`}
                className="bg-slate-950/40 min-h-[120px] lg:min-h-[150px] p-2 opacity-30"
              />
            );
          }

          const dayStr = dayNum.toString().padStart(2, '0');
          const monthStr = activeMonth.toString().padStart(2, '0');
          const dateStr = `${activeYear}-${monthStr}-${dayStr}`;

          // Check if this date has a marketing content item
          const content = itemMap.get(dateStr);
          const isSpecialHoliday = content?.holiday;
          const isBlackFriday = dateStr === '2026-11-27';

          // Temporal status calculation according to Rule 11
          // Rule 6: multi-day events consider content.endDate
          const temporalStatus = getEventTemporalStatus(
            dateStr,
            content?.endDate,
            todayStr,
            nextEventDate
          );

          const isPast = temporalStatus === 'PASSADA';
          const isToday = temporalStatus === 'HOJE';
          const isNextEvent = temporalStatus === 'PROXIMO';
          const isManuallyCompleted = content?.status === 'PUBLICADO';
          const isPendingPast = isPast && content && !isManuallyCompleted;

          // Check if this day corresponds to any employee birthday (recurring every year)
          const dayBirthdays = activeEmployees.filter((emp) => {
            const parsed = parseBirthDate(emp.birthDate);
            return parsed.month === activeMonth && parsed.day === dayNum;
          });

          // Check if birthday in this year already passed
          const hasPastBirthday = isPast && dayBirthdays.length > 0;

          const isBeforePlanningStart = activeYear === 2026 && activeMonth === 10 && dayNum < 8;

          // Cell styling based on temporal status and priorities
          let cellStyleClass = 'bg-slate-950 hover:bg-slate-900 border border-transparent hover:border-slate-700';

          if (isToday) {
            // Rule 11: Hoje - destaque visual com borda ou cor especial e texto "Hoje"
            cellStyleClass = 'bg-gradient-to-b from-amber-950/40 to-slate-900 border-2 border-amber-400 shadow-md ring-1 ring-amber-400/40 z-10';
          } else if (isNextEvent) {
            // Rule 11: Próximo evento - identificação destacada
            cellStyleClass = 'bg-slate-900/95 border-2 border-sky-500/60 shadow-sm';
          } else if (isBlackFriday) {
            cellStyleClass = isPast
              ? 'bg-slate-900/80 border border-amber-700/40 opacity-80'
              : 'bg-amber-950/30 hover:bg-amber-950/50 border border-amber-500/50';
          } else if (isPast) {
            // Rule 11: Data passada - cor cinza, ícone de relógio ou marca de concluído
            cellStyleClass = isPendingPast
              ? 'bg-slate-900/70 border border-rose-900/30 text-slate-400 opacity-90 hover:opacity-100'
              : 'bg-slate-950/80 border border-slate-800/80 text-slate-400 opacity-75 hover:opacity-100';
          } else if (isSpecialHoliday) {
            cellStyleClass = 'bg-slate-900 hover:bg-slate-850 border border-slate-700/60';
          } else if (dayBirthdays.length > 0) {
            cellStyleClass = 'bg-slate-900/80 hover:bg-slate-850 border border-rose-500/30';
          }

          return (
            <div
              key={dateStr}
              className={`min-h-[120px] lg:min-h-[150px] p-2 flex flex-col justify-between transition-all group relative ${cellStyleClass}`}
            >
              {/* Day header: number + temporal status badge + marketing format icon */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`font-mono font-bold ${
                        isToday
                          ? 'text-amber-950 bg-amber-400 px-1.5 py-0.5 rounded text-xs'
                          : isNextEvent
                          ? 'text-sky-300 font-extrabold'
                          : isBlackFriday
                          ? 'text-amber-400'
                          : dayBirthdays.length > 0
                          ? 'text-rose-400 font-extrabold'
                          : isPast
                          ? 'text-slate-500'
                          : 'text-slate-300'
                      }`}
                    >
                      {dayNum}
                    </span>

                    {/* Rule 11 Indicator: Hoje, Próximo evento, ou Data passada */}
                    {isToday && (
                      <span className="text-[9px] font-bold text-amber-950 bg-amber-400 px-1.5 py-0.2 rounded-full uppercase tracking-wider flex items-center gap-0.5 shadow-xs">
                        <span className="w-1 h-1 rounded-full bg-slate-950 animate-ping" />
                        Hoje
                      </span>
                    )}

                    {isNextEvent && (
                      <span className="text-[9px] font-bold text-sky-300 bg-sky-500/20 px-1.5 py-0.2 rounded border border-sky-500/40 uppercase tracking-tight">
                        Próximo
                      </span>
                    )}

                    {isPast && !isToday && (
                      <span
                        className="text-[9px] text-slate-500 flex items-center gap-0.5 bg-slate-900 px-1 rounded border border-slate-800"
                        title="Data passada"
                      >
                        <Clock className="w-2.5 h-2.5 text-slate-500" />
                        <span className="hidden sm:inline">Passada</span>
                      </span>
                    )}
                  </div>

                  {content && (
                    <div className="flex items-center gap-1">
                      {getFormatIcon(content.format)}
                      <span className={`text-[10px] font-medium hidden sm:inline ${isPast ? 'text-slate-500' : 'text-slate-400'}`}>
                        {content.format}
                      </span>
                    </div>
                  )}
                </div>

                {/* Commemorative date & official holiday badge if present */}
                {content?.holiday && (
                  <div
                    title={`${content.holiday} — ${content.category || 'Data comemorativa'}${
                      content.legalReference ? ` (${content.legalReference})` : ''
                    }${content.source ? ` · Fonte: ${content.source}` : ''}`}
                    className={`line-clamp-1 text-[10px] font-semibold px-1 py-0.5 rounded border flex items-center gap-1 ${
                      content.category === 'Feriado municipal'
                        ? 'text-amber-300 bg-amber-500/20 border-amber-400/50 shadow-xs'
                        : content.category === 'Ponto facultativo'
                        ? 'text-purple-300 bg-purple-950/40 border-purple-500/30'
                        : content.category === 'Feriado estadual'
                        ? 'text-sky-300 bg-sky-950/40 border-sky-500/40'
                        : isPast
                        ? 'text-slate-400 bg-slate-800/40 border-slate-700/40'
                        : 'text-amber-300 bg-amber-500/10 border-amber-500/20'
                    }`}
                  >
                    {content.category === 'Feriado municipal' ? (
                      <span>🏛️ Jaboatão: {content.holiday}</span>
                    ) : content.category === 'Ponto facultativo' ? (
                      <span>📋 P. Facultativo: {content.holiday}</span>
                    ) : content.category === 'Feriado estadual' ? (
                      <span>🚩 PE: {content.holiday}</span>
                    ) : (
                      <span>★ {content.holiday}</span>
                    )}
                  </div>
                )}
              </div>

              {/* Day Center Area: Content theme + Team birthdays */}
              <div className="my-1 space-y-1">
                {/* Employee Birthdays badges (Rule 5: indicate if passed this year while preserving recurrence) */}
                {dayBirthdays.map((bEmp) => {
                  const empAge = calculateAge(bEmp.birthDate, activeYear);
                  return (
                    <div
                      key={bEmp.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectEmployeeBirthday(bEmp);
                      }}
                      title={`Aniversário de ${bEmp.name} (${bEmp.role})${empAge > 0 ? ` · ${empAge} anos` : ''}${
                        isPast ? ` - Já passou em ${activeYear}` : isToday ? ' - É HOJE!' : ''
                      } - Clique para ver/editar`}
                      className={`flex items-center gap-1.5 p-1 rounded cursor-pointer transition-all ${
                        isToday
                          ? 'bg-gradient-to-r from-rose-900 via-rose-950 to-amber-950 border-2 border-rose-400 shadow-sm animate-pulse'
                          : isPast
                          ? 'bg-slate-900/60 border border-slate-700/60 text-slate-400 opacity-80 hover:opacity-100'
                          : 'bg-gradient-to-r from-rose-950/80 to-amber-950/50 border border-rose-500/50 hover:border-rose-400 shadow-xs'
                      }`}
                    >
                      <Cake className={`w-3 h-3 shrink-0 ${isToday ? 'text-rose-300' : isPast ? 'text-slate-400' : 'text-rose-400'}`} />
                      <div className="min-w-0 flex-1">
                        <span className={`text-[10px] font-bold block truncate leading-tight ${
                          isToday ? 'text-rose-200' : isPast ? 'text-slate-300' : 'text-rose-200'
                        }`}>
                          {bEmp.name} {empAge > 0 ? `(${empAge} anos)` : ''}
                        </span>
                        <span className="text-[8px] text-slate-400 block truncate leading-none">
                          {isToday ? `🎂 Completa ${empAge} anos Hoje!` : isPast ? `🎂 Completou ${empAge} anos` : `🎂 Fará ${empAge} anos · ${bEmp.role}`}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {/* Marketing Content Title */}
                {content ? (
                  <div 
                    onClick={() => onSelectContent(content)}
                    className="cursor-pointer"
                  >
                    <p className={`text-[11px] font-medium line-clamp-2 transition-colors leading-tight ${
                      isPast 
                        ? 'text-slate-400 group-hover:text-slate-200' 
                        : isToday 
                        ? 'text-amber-200 font-semibold group-hover:text-amber-100' 
                        : 'text-slate-200 group-hover:text-amber-300'
                    }`}>
                      {content.theme}
                    </p>
                  </div>
                ) : isBeforePlanningStart ? (
                  <div className="text-[10px] text-slate-600 italic">Início em 08/10</div>
                ) : dayBirthdays.length === 0 ? (
                  <div className="text-[10px] text-slate-600 italic">Sem publicação</div>
                ) : null}
              </div>

              {/* Day Footer: status & time (Rule 4: Differentiate past date from completed task) */}
              {content ? (
                <div 
                  onClick={() => onSelectContent(content)}
                  className={`flex items-center justify-between text-[10px] pt-1 border-t cursor-pointer ${
                    isPast ? 'border-slate-800' : 'border-slate-800/80'
                  }`}
                >
                  <span className={`font-mono text-[10px] ${isPast ? 'text-slate-500' : 'text-slate-400'}`}>
                    {content.suggestedTime || '12:00'}
                  </span>

                  {/* If past and NOT published: clearly warn "Pendente" */}
                  {isPendingPast ? (
                    <span 
                      className="flex items-center gap-0.5 text-[9px] font-semibold text-rose-400 bg-rose-500/10 px-1 py-0.5 rounded border border-rose-500/20"
                      title="Data já passou, mas a publicação ainda consta como pendente"
                    >
                      <AlertTriangle className="w-2.5 h-2.5 text-rose-400" />
                      Pendente
                    </span>
                  ) : (
                    getStatusBadge(content.status)
                  )}
                </div>
              ) : dayBirthdays.length > 0 ? (
                <div 
                  onClick={() => onSelectEmployeeBirthday(dayBirthdays[0])}
                  className="text-[10px] text-rose-400 font-medium pt-1 border-t border-slate-800/60 cursor-pointer flex items-center justify-between"
                >
                  <span className={isPast ? 'text-slate-500' : 'text-rose-400'}>
                    {isToday ? 'Comemorar Hoje' : isPast ? 'Já comemorado' : 'Equipe'}
                  </span>
                  <Gift className={`w-3 h-3 ${isPast ? 'text-slate-500' : 'text-rose-400'}`} />
                </div>
              ) : (
                <div className="h-2" />
              )}
            </div>
          );
        })}
          </div>
        </div>
      </div>
    </div>
  );
};
