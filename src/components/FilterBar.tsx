import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  X, 
  Calendar as CalendarIcon, 
  Sparkles, 
  Cake, 
  Clock, 
  AlertTriangle, 
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Tag,
  History,
  User,
  CheckCircle,
  FileText
} from 'lucide-react';
import { 
  FunnelStage, 
  ContentFormat, 
  ContentStatus, 
  ContentType, 
  MonthFilter, 
  TemporalFilter,
  PeriodFilter,
  YearFilter,
  EventCategory
} from '../types/marketing';

export interface FilterValues {
  search: string;
  period: PeriodFilter;
  year: YearFilter;
  month: MonthFilter;
  category: string;
  campaign: string;
  format: string;
  funnelStage: string;
  status: string;
  contentType: string;
  onlyHolidays: boolean;
  temporal: TemporalFilter;
  responsible: string;
}

export interface PeriodSummaryMetrics {
  total: number;
  published: number;
  pending: number;
  overdue: number;
  holidays: number;
  birthdays: number;
}

interface FilterBarProps {
  filters: FilterValues;
  setFilters: React.Dispatch<React.SetStateAction<FilterValues>>;
  campaignOptions: string[];
  responsibleOptions?: string[];
  totalMatches: number;
  totalTotal: number;
  onOpenBirthdays?: () => void;
  summaryMetrics?: PeriodSummaryMetrics;
  temporalCounts?: {
    today: number;
    next: number;
    past: number;
    future: number;
    pendingPast: number;
  };
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  setFilters,
  campaignOptions,
  responsibleOptions = [],
  totalMatches,
  totalTotal,
  onOpenBirthdays,
  summaryMetrics,
  temporalCounts,
}) => {
  const [showAdvancedMobile, setShowAdvancedMobile] = useState(false);

  const hasActiveFilters =
    filters.search !== '' ||
    filters.period !== 'TODOS' ||
    filters.year !== 'TODOS' ||
    filters.month !== 'TODOS' ||
    filters.category !== 'TODAS' ||
    filters.campaign !== 'TODAS' ||
    filters.format !== 'TODOS' ||
    filters.funnelStage !== 'TODAS' ||
    filters.status !== 'TODOS' ||
    filters.contentType !== 'TODOS' ||
    filters.onlyHolidays ||
    filters.responsible !== 'TODOS' ||
    filters.temporal !== 'TODAS';

  const handleReset = () => {
    setFilters({
      search: '',
      period: 'TODOS',
      year: 'TODOS',
      month: 'TODOS',
      category: 'TODAS',
      campaign: 'TODAS',
      format: 'TODOS',
      funnelStage: 'TODAS',
      status: 'TODOS',
      contentType: 'TODOS',
      onlyHolidays: false,
      temporal: 'TODAS',
      responsible: 'TODOS',
    });
  };

  const allMonths: { key: MonthFilter; label: string }[] = [
    { key: 'TODOS', label: 'Todos os Meses' },
    { key: 'JANEIRO', label: 'Janeiro' },
    { key: 'FEVEREIRO', label: 'Fevereiro' },
    { key: 'MARÇO', label: 'Março' },
    { key: 'ABRIL', label: 'Abril' },
    { key: 'MAIO', label: 'Maio' },
    { key: 'JUNHO', label: 'Junho' },
    { key: 'JULHO', label: 'Julho' },
    { key: 'AGOSTO', label: 'Agosto' },
    { key: 'SETEMBRO', label: 'Setembro' },
    { key: 'OUTUBRO', label: 'Outubro' },
    { key: 'NOVEMBRO', label: 'Novembro' },
    { key: 'DEZEMBRO', label: 'Dezembro' },
  ];

  const categoryOptions: EventCategory[] = [
    'Feriado nacional',
    'Feriado estadual',
    'Feriado municipal',
    'Ponto facultativo',
    'Data comemorativa',
    'Data regional',
    'Data ambiental',
    'Data profissional',
    'Data tecnológica',
    'Aniversário de funcionário',
    'Campanha comercial',
    'Campanha institucional',
    'Publicação de marketing',
    'Evento interno',
  ];

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 sm:p-4 mb-5 space-y-3 shadow-sm">
      {/* Top Bar: Primary Period Navigator (2026 Histórico vs 2027 Planejamento vs Todos) */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5 pb-2 border-b border-slate-800/60">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1 hidden sm:inline">
            Período:
          </span>
          
          <button
            onClick={() => setFilters((prev) => ({ ...prev, period: 'PLANEJAMENTO_2027', year: '2027' }))}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap min-h-[36px] ${
              filters.period === 'PLANEJAMENTO_2027' || filters.year === '2027'
                ? 'bg-amber-400 text-slate-950 shadow-md ring-1 ring-amber-300'
                : 'bg-slate-950 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>Planejamento 2027 (Jaboatão & Nordeste)</span>
          </button>

          <button
            onClick={() => setFilters((prev) => ({ ...prev, period: 'HISTORICO_2026', year: '2026' }))}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap min-h-[36px] ${
              filters.period === 'HISTORICO_2026' || filters.year === '2026'
                ? 'bg-slate-200 text-slate-950 font-bold shadow-xs'
                : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <History className="w-3.5 h-3.5 text-slate-400" />
            <span>Histórico 2026 (Out-Dez)</span>
          </button>

          <button
            onClick={() => setFilters((prev) => ({ ...prev, period: 'TODOS', year: 'TODOS' }))}
            className={`px-3 py-1.5 text-xs rounded-xl transition-all whitespace-nowrap min-h-[36px] ${
              filters.period === 'TODOS' && filters.year === 'TODOS'
                ? 'bg-slate-800 text-white font-bold'
                : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            Todos os Anos
          </button>
        </div>

        {/* Action tags: Holidays, Team Birthdays, Reset */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setFilters((prev) => ({ ...prev, onlyHolidays: !prev.onlyHolidays }))}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-colors flex items-center gap-1.5 whitespace-nowrap min-h-[36px] ${
              filters.onlyHolidays
                ? 'bg-amber-500/15 border-amber-500/60 text-amber-300'
                : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Feriados Oficiais</span>
          </button>

          {onOpenBirthdays && (
            <button
              onClick={onOpenBirthdays}
              className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-rose-500/40 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 transition-colors flex items-center gap-1.5 whitespace-nowrap min-h-[36px]"
            >
              <Cake className="w-3.5 h-3.5 text-rose-400" />
              <span>Aniversários da Equipe</span>
            </button>
          )}

          {/* Mobile advanced toggle */}
          <button
            onClick={() => setShowAdvancedMobile(!showAdvancedMobile)}
            className="sm:hidden px-2.5 py-1.5 text-xs font-semibold rounded-xl border border-slate-800 bg-slate-950 text-slate-300 flex items-center gap-1 min-h-[36px]"
          >
            <Filter className="w-3.5 h-3.5 text-amber-400" />
            {showAdvancedMobile ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {hasActiveFilters && (
            <button
              onClick={handleReset}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 rounded-xl transition-colors whitespace-nowrap min-h-[36px]"
            >
              <X className="w-3.5 h-3.5" />
              <span>Limpar ({totalMatches}/{totalTotal})</span>
            </button>
          )}
        </div>
      </div>

      {/* Indicadores de Resumo do Período Selecionado (Prompt 8: Total, Publicadas, Pendentes, Atrasadas, Feriados, Aniversários) */}
      {summaryMetrics && (
        <div className="bg-slate-950/90 rounded-xl p-2 sm:p-2.5 border border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-slate-300 font-semibold text-[11px]">
            <FileText className="w-3.5 h-3.5 text-amber-400" />
            <span>Indicadores do Período ({filters.year === 'TODOS' ? 'Geral' : filters.year}):</span>
          </div>
          <div className="flex flex-wrap items-center gap-1 sm:gap-1.5">
            <span className="bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-lg text-slate-200 text-[11px]">
              Total: <strong className="font-mono text-white">{summaryMetrics.total}</strong>
            </span>
            <span className="bg-emerald-950/50 border border-emerald-500/30 px-2 py-0.5 rounded-lg text-emerald-300 text-[11px] flex items-center gap-1">
              <CheckCircle className="w-2.5 h-2.5 text-emerald-400" />
              Publicadas: <strong className="font-mono text-emerald-400">{summaryMetrics.published}</strong>
            </span>
            <span className="bg-purple-950/40 border border-purple-500/30 px-2 py-0.5 rounded-lg text-purple-300 text-[11px]">
              Pendentes: <strong className="font-mono text-purple-400">{summaryMetrics.pending}</strong>
            </span>
            {summaryMetrics.overdue > 0 && (
              <span className="bg-rose-950/60 border border-rose-500/50 px-2 py-0.5 rounded-lg text-rose-300 text-[11px] flex items-center gap-1 font-semibold">
                <AlertTriangle className="w-2.5 h-2.5 text-rose-400" />
                Atrasadas: <strong className="font-mono text-rose-200">{summaryMetrics.overdue}</strong>
              </span>
            )}
            <span className="bg-amber-950/40 border border-amber-500/30 px-2 py-0.5 rounded-lg text-amber-300 text-[11px] flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-amber-400" />
              Feriados: <strong className="font-mono text-amber-300">{summaryMetrics.holidays}</strong>
            </span>
            <span className="bg-rose-950/40 border border-rose-500/30 px-2 py-0.5 rounded-lg text-rose-300 text-[11px] flex items-center gap-1">
              <Cake className="w-2.5 h-2.5 text-rose-400" />
              Aniversários: <strong className="font-mono text-rose-300">{summaryMetrics.birthdays}</strong>
            </span>
          </div>
        </div>
      )}

      {/* Middle row: Search + Month horizontal selector */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-2.5">
        {/* Search input */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar tema, legenda, data, Santo Amaro, feriado..."
            value={filters.search}
            onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
            className="w-full bg-slate-950/90 border border-slate-800 rounded-xl pl-9 pr-8 py-2 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-400/80 transition-colors"
          />
          {filters.search && (
            <button
              onClick={() => setFilters((prev) => ({ ...prev, search: '' }))}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* 12 Months segmented control (Smooth touch horizontal scroll) */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 overflow-x-auto no-scrollbar max-w-full lg:max-w-2xl">
          {allMonths.map((m) => (
            <button
              key={m.key}
              onClick={() => setFilters((prev) => ({ ...prev, month: m.key }))}
              className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors min-h-[36px] ${
                filters.month === m.key
                  ? 'bg-amber-400 text-slate-950 shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Temporal Status Filter (Regra 11: Passadas, Hoje, Próximo, Futuro, Pendentes) */}
      <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-semibold">
          <Clock className="w-3.5 h-3.5 text-amber-400" />
          <span>Filtro Temporal:</span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setFilters((prev) => ({ ...prev, temporal: 'TODAS' }))}
            className={`px-2.5 py-1 text-xs rounded-lg transition-all min-h-[32px] ${
              filters.temporal === 'TODAS'
                ? 'bg-slate-200 text-slate-950 font-bold shadow-xs'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Todas
          </button>

          <button
            onClick={() => setFilters((prev) => ({ ...prev, temporal: 'HOJE' }))}
            className={`px-2.5 py-1 text-xs rounded-lg flex items-center gap-1.5 transition-all min-h-[32px] ${
              filters.temporal === 'HOJE'
                ? 'bg-amber-400 text-slate-950 font-bold shadow-xs ring-1 ring-amber-300'
                : 'bg-slate-950 text-amber-400/90 hover:text-amber-300 border border-amber-500/30'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping inline-block" />
            <span>Hoje {temporalCounts?.today !== undefined ? `(${temporalCounts.today})` : ''}</span>
          </button>

          <button
            onClick={() => setFilters((prev) => ({ ...prev, temporal: 'PROXIMO' }))}
            className={`px-2.5 py-1 text-xs rounded-lg flex items-center gap-1 transition-all min-h-[32px] ${
              filters.temporal === 'PROXIMO'
                ? 'bg-sky-400 text-slate-950 font-bold shadow-xs'
                : 'bg-slate-950 text-sky-400/90 hover:text-sky-300 border border-sky-500/30'
            }`}
          >
            <span>Próximo</span>
          </button>

          <button
            onClick={() => setFilters((prev) => ({ ...prev, temporal: 'FUTURAS' }))}
            className={`px-2.5 py-1 text-xs rounded-lg transition-all min-h-[32px] ${
              filters.temporal === 'FUTURAS'
                ? 'bg-indigo-400 text-slate-950 font-bold shadow-xs'
                : 'bg-slate-950 text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            <span>Futuras {temporalCounts?.future !== undefined ? `(${temporalCounts.future})` : ''}</span>
          </button>

          <button
            onClick={() => setFilters((prev) => ({ ...prev, temporal: 'PASSADAS' }))}
            className={`px-2.5 py-1 text-xs rounded-lg flex items-center gap-1 transition-all min-h-[32px] ${
              filters.temporal === 'PASSADAS'
                ? 'bg-slate-700 text-white font-bold shadow-xs'
                : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Passadas {temporalCounts?.past !== undefined ? `(${temporalCounts.past})` : ''}</span>
          </button>

          <button
            onClick={() => setFilters((prev) => ({ ...prev, temporal: 'PENDENTES_PASSADAS' }))}
            className={`px-2.5 py-1 text-xs rounded-lg flex items-center gap-1 transition-all min-h-[32px] ${
              filters.temporal === 'PENDENTES_PASSADAS'
                ? 'bg-rose-500 text-white font-bold shadow-xs'
                : 'bg-rose-950/40 text-rose-300 hover:text-rose-200 border border-rose-500/40'
            }`}
            title="Publicações planejadas para dias anteriores que ainda não foram marcadas como PUBLICADAS"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            <span>
              Pendentes {temporalCounts?.pendingPast !== undefined ? `(${temporalCounts.pendingPast})` : ''}
            </span>
          </button>

          <button
            onClick={() => setFilters((prev) => ({ ...prev, temporal: 'CONCLUIDAS' }))}
            className={`px-2.5 py-1 text-xs rounded-lg flex items-center gap-1 transition-all min-h-[32px] ${
              filters.temporal === 'CONCLUIDAS'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-xs'
                : 'bg-slate-950 text-emerald-400 hover:text-emerald-300 border border-emerald-500/30'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Concluídas</span>
          </button>
        </div>
      </div>

      {/* Advanced Dropdowns (Always shown on desktop, toggleable on mobile for screen economy) */}
      <div className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-2 border-t border-slate-800/80 text-xs ${
        showAdvancedMobile ? 'block' : 'hidden sm:grid'
      }`}>
        {/* Categoria Oficial */}
        <div>
          <label className="block text-[11px] text-slate-400 mb-1 flex items-center gap-1">
            <Tag className="w-3 h-3 text-amber-400" /> Categoria
          </label>
          <select
            value={filters.category}
            onChange={(e) => setFilters((prev) => ({ ...prev, category: e.target.value }))}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2 py-1.5 text-slate-200 focus:outline-none focus:border-amber-400 min-h-[38px]"
          >
            <option value="TODAS">Todas as Categorias</option>
            {categoryOptions.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Campanha */}
        <div>
          <label className="block text-[11px] text-slate-400 mb-1">Campanha</label>
          <select
            value={filters.campaign}
            onChange={(e) => setFilters((prev) => ({ ...prev, campaign: e.target.value }))}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2 py-1.5 text-slate-200 focus:outline-none focus:border-amber-400 min-h-[38px]"
          >
            <option value="TODAS">Todas as Campanhas</option>
            {campaignOptions.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Formato */}
        <div>
          <label className="block text-[11px] text-slate-400 mb-1">Formato</label>
          <select
            value={filters.format}
            onChange={(e) => setFilters((prev) => ({ ...prev, format: e.target.value }))}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2 py-1.5 text-slate-200 focus:outline-none focus:border-amber-400 min-h-[38px]"
          >
            <option value="TODOS">Todos os Formatos</option>
            <option value="Reels">Reels</option>
            <option value="Carrossel">Carrossel</option>
            <option value="Post">Post (Estático)</option>
            <option value="Stories">Stories</option>
            <option value="WhatsApp">WhatsApp</option>
          </select>
        </div>

        {/* Etapa do Funil */}
        <div>
          <label className="block text-[11px] text-slate-400 mb-1">Etapa do Funil</label>
          <select
            value={filters.funnelStage}
            onChange={(e) => setFilters((prev) => ({ ...prev, funnelStage: e.target.value }))}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2 py-1.5 text-slate-200 focus:outline-none focus:border-amber-400 min-h-[38px]"
          >
            <option value="TODAS">Todas as Etapas</option>
            <option value="Atração">Atração (Novos Públicos)</option>
            <option value="Educação">Educação (Didático/Solar)</option>
            <option value="Conversão">Conversão (Vendas/Leads)</option>
            <option value="Relacionamento">Relacionamento (Marca)</option>
          </select>
        </div>

        {/* Tipo de Conteúdo */}
        <div>
          <label className="block text-[11px] text-slate-400 mb-1">Tipo de Conteúdo</label>
          <select
            value={filters.contentType}
            onChange={(e) => setFilters((prev) => ({ ...prev, contentType: e.target.value }))}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2 py-1.5 text-slate-200 focus:outline-none focus:border-amber-400 min-h-[38px]"
          >
            <option value="TODOS">Todos os Tipos</option>
            <option value="Educativo">Educativo</option>
            <option value="Comercial">Comercial</option>
            <option value="Relacionamento">Relacionamento</option>
            <option value="Institucional">Institucional</option>
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="block text-[11px] text-slate-400 mb-1">Status</label>
          <select
            value={filters.status}
            onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2 py-1.5 text-slate-200 focus:outline-none focus:border-amber-400 min-h-[38px]"
          >
            <option value="TODOS">Todos os Status</option>
            <option value="IDEIA">IDEIA</option>
            <option value="PLANEJADO">PLANEJADO</option>
            <option value="EM PRODUÇÃO">EM PRODUÇÃO</option>
            <option value="APROVADO">APROVADO</option>
            <option value="PUBLICADO">PUBLICADO</option>
          </select>
        </div>

        {/* Responsável */}
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-[11px] text-slate-400 mb-1 flex items-center gap-1">
            <User className="w-3 h-3 text-amber-400" /> Responsável
          </label>
          <select
            value={filters.responsible}
            onChange={(e) => setFilters((prev) => ({ ...prev, responsible: e.target.value }))}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2 py-1.5 text-slate-200 focus:outline-none focus:border-amber-400 min-h-[38px]"
          >
            <option value="TODOS">Todos os Responsáveis</option>
            {responsibleOptions.map((resp) => (
              <option key={resp} value={resp}>
                {resp}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
