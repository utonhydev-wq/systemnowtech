import React from 'react';
import { 
  Calendar as CalendarIcon, 
  Cake, 
  ArrowRight, 
  ChevronRight, 
  Clock, 
  Sparkles, 
  Smartphone, 
  Calculator, 
  MessageSquare,
  Shield,
  CheckCircle2,
  TrendingUp,
  SunMedium
} from 'lucide-react';
import { ContentItem } from '../types/marketing';
import { Employee, BirthdayTribute } from '../types/employee';
import { AppUser } from '../types/auth';
import { formatToDateBR } from '../utils/dateUtils';

interface HomeDashboardViewProps {
  currentUser: AppUser;
  todayStr: string;
  items: ContentItem[];
  employees: Employee[];
  tributes: BirthdayTribute[];
  onNavigateTab: (tab: 'calendar' | 'dashboard' | 'birthdays' | 'stories' | 'whatsapp' | 'calculator' | 'profile') => void;
  onSelectContent: (item: ContentItem) => void;
  onSelectEmployee: (employee: Employee) => void;
}

export const HomeDashboardView: React.FC<HomeDashboardViewProps> = ({
  currentUser,
  todayStr,
  items,
  employees,
  tributes,
  onNavigateTab,
  onSelectContent,
  onSelectEmployee,
}) => {
  const firstName = currentUser.name.split(' ')[0];

  // Today's marketing items
  const todayItems = items.filter((item) => item.date === todayStr);

  // Next upcoming marketing item
  const nextItem = items
    .filter((item) => item.date > todayStr)
    .sort((a, b) => a.date.localeCompare(b.date))[0];

  // Upcoming Birthdays Calculation (next 60 days)
  const today = new Date();
  const currentYear = today.getFullYear();

  const upcomingBirthdays = employees
    .map((emp) => {
      const [d, m] = emp.birthDate.split('/').map(Number);
      let nextBday = new Date(currentYear, m - 1, d);
      if (nextBday < new Date(today.getFullYear(), today.getMonth(), today.getDate())) {
        nextBday = new Date(currentYear + 1, m - 1, d);
      }
      const diffTime = nextBday.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return { employee: emp, daysUntil: diffDays, dayMonth: `${String(d).padStart(2, '0')}/${String(m).padStart(2, '0')}` };
    })
    .sort((a, b) => a.daysUntil - b.daysUntil)
    .slice(0, 4);

  // KPIs
  const publishedCount = items.filter((i) => i.status === 'PUBLICADO').length;
  const inProdCount = items.filter((i) => i.status === 'EM PRODUÇÃO').length;
  const scheduledCount = items.filter((i) => i.status === 'PLANEJADO' || i.status === 'APROVADO').length;

  // Próximas campanhas agendadas a partir de HOJE (hoje em 1º ex: 13/10/2026, 14/10/2026 em 2º, e assim por diante)
  const upcomingCampaigns = React.useMemo(() => {
    const futureOrToday = items
      .filter((item) => item.date >= todayStr)
      .sort((a, b) => a.date.localeCompare(b.date));

    if (futureOrToday.length >= 4) {
      return futureOrToday.slice(0, 4);
    }

    const pastItems = items
      .filter((item) => item.date < todayStr)
      .sort((a, b) => b.date.localeCompare(a.date));

    return [...futureOrToday, ...pastItems].slice(0, 4);
  }, [items, todayStr]);

  return (
    <div className="space-y-4 sm:space-y-6 pb-20 md:pb-8 animate-fade-in">
      {/* 1. Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/40 border border-slate-800 p-5 sm:p-7 shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center gap-1.5">
                <SunMedium className="w-3.5 h-3.5 text-amber-400" />
                <span>NowTech Solar Energia</span>
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                Pernambuco & Nordeste
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
              Olá, <span className="text-amber-400">{firstName}</span>!
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Bem-vindo ao portal integrado de marketing, planejamento de publicações e equipe solar.
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => onNavigateTab('calendar')}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all min-h-[44px]"
            >
              <CalendarIcon className="w-4 h-4 stroke-[2.5]" />
              <span>Ver Calendário ({items.length})</span>
            </button>
            <button
              onClick={() => onNavigateTab('birthdays')}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition-colors min-h-[44px]"
            >
              <Cake className="w-4 h-4 text-rose-400" />
              <span>Equipe ({employees.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Priority Attention: Today or Next Marketing Action */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
              {todayItems.length > 0 ? 'Publicações Previstas Para Hoje' : 'Próxima Ação Estratégica'}
            </h3>
          </div>
          <button
            onClick={() => onNavigateTab('calendar')}
            className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
          >
            <span>Ver todas</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {todayItems.length > 0 ? (
          <div className="space-y-2.5">
            {todayItems.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectContent(item)}
                className="p-3.5 rounded-xl bg-slate-950/80 border border-amber-500/30 hover:border-amber-400 transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 group"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
                      HOJE · {item.suggestedTime || '12:00'}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {item.format}
                    </span>
                    {item.holiday && (
                      <span className="text-[10px] font-semibold text-rose-300 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                        {item.holiday}
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                    {item.theme}
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-1">
                    {item.caption}
                  </p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                    item.status === 'PUBLICADO'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  }`}>
                    {item.status}
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-400 transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>
            ))}
          </div>
        ) : nextItem ? (
          <div
            onClick={() => onSelectContent(nextItem)}
            className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 group"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30 font-mono">
                  {formatToDateBR(nextItem.date)} ({nextItem.dayOfWeek})
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  {nextItem.format}
                </span>
                {nextItem.holiday && (
                  <span className="text-[10px] font-semibold text-rose-300 bg-rose-500/10 px-2 py-0.5 rounded">
                    {nextItem.holiday}
                  </span>
                )}
              </div>
              <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                {nextItem.theme}
              </h4>
              <p className="text-xs text-slate-400 line-clamp-1">
                Campanha: {nextItem.campaign}
              </p>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                {nextItem.status}
              </span>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-400 transition-transform group-hover:translate-x-0.5" />
            </div>
          </div>
        ) : null}
      </div>

      {/* 3. Two Columns: Birthdays and Upcoming Publications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: Team Birthdays (10 employees preserved) */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cake className="w-4 h-4 text-rose-400" />
              <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                Próximos Aniversários da Equipe
              </h3>
            </div>
            <button
              onClick={() => onNavigateTab('birthdays')}
              className="text-xs text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1"
            >
              <span>Ver todos ({employees.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2">
            {upcomingBirthdays.map(({ employee, daysUntil, dayMonth }) => (
              <div
                key={employee.id}
                onClick={() => onSelectEmployee(employee)}
                className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-rose-500/40 transition-all cursor-pointer flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center font-bold text-xs shrink-0">
                    <Cake className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white group-hover:text-rose-300 transition-colors">
                      {employee.name}
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      {employee.role}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-bold text-rose-400 font-mono">
                    {dayMonth}
                  </span>
                  <div className="text-[10px] text-slate-400">
                    {daysUntil === 0 ? '🎂 É HOJE!' : `Em ${daysUntil} dias`}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Próximas Ações do Mês */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                Próximas Campanhas Agendadas
              </h3>
            </div>
            <button
              onClick={() => onNavigateTab('calendar')}
              className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
            >
              <span>Ver todas</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2">
            {upcomingCampaigns.map((item, index) => {
              const isToday = item.date === todayStr;
              return (
                <div
                  key={item.id}
                  onClick={() => onSelectContent(item)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 group ${
                    isToday
                      ? 'bg-amber-500/10 border-amber-400/60 hover:border-amber-400 ring-1 ring-amber-400/20 shadow-sm shadow-amber-500/10'
                      : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                      isToday
                        ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      <SunMedium className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                          isToday ? 'bg-amber-400/25 text-amber-300 border border-amber-400/30' : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}>
                          {index + 1}º
                        </span>
                        <h4 className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors truncate">
                          {item.theme}
                        </h4>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">
                        {item.dayOfWeek} · {item.format} · {item.channels?.join(', ')}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="flex items-center justify-end gap-1.5">
                      {isToday && (
                        <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 tracking-wider">
                          HOJE
                        </span>
                      )}
                      <span className={`text-xs font-mono font-bold ${
                        isToday ? 'text-amber-400' : 'text-slate-200'
                      }`}>
                        {formatToDateBR(item.date)}
                      </span>
                    </div>
                    <div className="text-[10px] text-amber-400/90 font-medium mt-0.5">
                      {item.status}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. Quick Indicator Metrics & Strategic Hubs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div 
          onClick={() => onNavigateTab('calendar')}
          className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-400/40 transition-all cursor-pointer space-y-1"
        >
          <div className="text-[11px] text-slate-400 flex items-center justify-between">
            <span>Posts Publicados</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl font-black text-white font-mono">
            {publishedCount}
          </div>
          <div className="text-[10px] text-emerald-400 font-medium">
            De {items.length} campanhas
          </div>
        </div>

        <div 
          onClick={() => onNavigateTab('calendar')}
          className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-400/40 transition-all cursor-pointer space-y-1"
        >
          <div className="text-[11px] text-slate-400 flex items-center justify-between">
            <span>Em Produção</span>
            <Clock className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-xl font-black text-white font-mono">
            {inProdCount}
          </div>
          <div className="text-[10px] text-amber-400 font-medium">
            Em andamento no funil
          </div>
        </div>

        <div 
          onClick={() => onNavigateTab('calendar')}
          className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-sky-400/40 transition-all cursor-pointer space-y-1"
        >
          <div className="text-[11px] text-slate-400 flex items-center justify-between">
            <span>Agendados</span>
            <CalendarIcon className="w-3.5 h-3.5 text-sky-400" />
          </div>
          <div className="text-xl font-black text-white font-mono">
            {scheduledCount}
          </div>
          <div className="text-[10px] text-sky-400 font-medium">
            Planejamento pronto
          </div>
        </div>

        <div 
          onClick={() => onNavigateTab('calculator')}
          className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-400/40 transition-all cursor-pointer space-y-1"
        >
          <div className="text-[11px] text-slate-400 flex items-center justify-between">
            <span>Economia Solar</span>
            <Calculator className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-xl font-black text-white font-mono">
            Até 95%
          </div>
          <div className="text-[10px] text-amber-400 font-medium">
            Simulador NowTech
          </div>
        </div>
      </div>

      {/* 5. Direct Shortcuts to Marketing Hubs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          onClick={() => onNavigateTab('stories')}
          className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-400/40 transition-all text-left group flex items-center gap-3.5"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">
              Estratégia de Stories
            </h4>
            <p className="text-[11px] text-slate-400">
              Planejamento diário e enquetes
            </p>
          </div>
        </button>

        <button
          onClick={() => onNavigateTab('whatsapp')}
          className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-400/40 transition-all text-left group flex items-center gap-3.5"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
              Disparos WhatsApp
            </h4>
            <p className="text-[11px] text-slate-400">
              Comunicação direta com clientes
            </p>
          </div>
        </button>

        <button
          onClick={() => onNavigateTab('calculator')}
          className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-sky-400/40 transition-all text-left group flex items-center gap-3.5"
        >
          <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white group-hover:text-sky-400 transition-colors">
              Calculadora Solar
            </h4>
            <p className="text-[11px] text-slate-400">
              Dimensionamento e payback
            </p>
          </div>
        </button>
      </div>
    </div>
  );
};
