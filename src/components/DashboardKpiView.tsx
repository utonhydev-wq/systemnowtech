import React from 'react';
import { 
  Calendar, 
  Sparkles, 
  Send, 
  CheckCircle2, 
  Clock, 
  Flame, 
  Video, 
  Layers, 
  Image as ImageIcon, 
  MessageSquare, 
  TrendingUp, 
  Target, 
  ShieldCheck, 
  Sun, 
  Award, 
  ChevronRight, 
  Cake, 
  Gift,
  AlertTriangle
} from 'lucide-react';
import { MarketingKPIs, ContentItem } from '../types/marketing';
import { NextMilestones } from '../data/marketingPlan';
import { Employee } from '../types/employee';
import { formatToDateBR } from '../utils/dateUtils';

interface DashboardKpiViewProps {
  kpis: MarketingKPIs;
  milestones: NextMilestones;
  nextEmployeeBirthday?: { employee: Employee; daysUntil: number } | null;
  todayStr?: string;
  temporalMetrics?: {
    pastCount: number;
    todayCount: number;
    futureCount: number;
    pendingPastCount: number;
    todayItem?: ContentItem | null;
    nextItem?: ContentItem | null;
  };
  onSelectContent: (item: ContentItem) => void;
  onSelectBirthday?: (employee: Employee) => void;
  onNavigateToCalendar: () => void;
  onNavigateToBirthdays?: () => void;
}

export const DashboardKpiView: React.FC<DashboardKpiViewProps> = ({
  kpis,
  milestones,
  nextEmployeeBirthday,
  todayStr = '2026-10-09',
  temporalMetrics,
  onSelectContent,
  onSelectBirthday,
  onNavigateToCalendar,
  onNavigateToBirthdays,
}) => {
  // Funnel percentages
  const total = kpis.total || 1;
  const pctEducation = Math.round((kpis.funnelEducation / total) * 100);
  const pctConversion = Math.round((kpis.funnelConversion / total) * 100);
  const pctRelationship = Math.round((kpis.funnelRelationship / total) * 100);
  const pctAttraction = Math.round((kpis.funnelAttraction / total) * 100);

  const pctEducType = Math.round((kpis.educational / total) * 100);
  const pctCommType = Math.round((kpis.commercial / total) * 100);
  const pctRelType = Math.round((kpis.relationship / total) * 100);
  const pctInstType = Math.round((kpis.institutional / total) * 100);

  return (
    <div className="space-y-6">
      {/* Real-time Temporal Monitoring Card (Regra 11) */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/20 border border-slate-800 rounded-xl p-4 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
            <Clock className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                Monitoramento Temporal Automático
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Fuso: America/Recife (UTC-3)
              </span>
            </div>
            <div className="text-sm font-semibold text-white flex items-center gap-2 mt-0.5">
              <span>Data do Sistema: <strong className="text-amber-300 font-mono">{formatToDateBR(todayStr)}</strong></span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                Sincronizado Diariamente
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 flex items-center gap-1.5">
            <span className="text-slate-400">Datas Passadas:</span>
            <span className="font-mono font-bold text-slate-200">{temporalMetrics?.pastCount ?? 0}</span>
          </div>

          <div className="bg-amber-950/30 px-3 py-1.5 rounded-lg border border-amber-500/30 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
            <span className="text-amber-300 font-medium">Hoje:</span>
            <span className="font-mono font-bold text-amber-400">{temporalMetrics?.todayCount ?? 0}</span>
          </div>

          <div className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 flex items-center gap-1.5">
            <span className="text-slate-400">Datas Futuras:</span>
            <span className="font-mono font-bold text-slate-200">{temporalMetrics?.futureCount ?? 0}</span>
          </div>

          {(temporalMetrics?.pendingPastCount ?? 0) > 0 && (
            <div className="bg-rose-950/40 px-3 py-1.5 rounded-lg border border-rose-500/40 flex items-center gap-1.5 text-rose-300 font-medium">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              <span>Pendências Passadas: <strong>{temporalMetrics?.pendingPastCount}</strong></span>
            </div>
          )}
        </div>
      </div>
      {/* Top 4 Strategic Priority Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Próxima Publicação */}
        <div 
          onClick={() => milestones.nextPublication && onSelectContent(milestones.nextPublication)}
          className="bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 rounded-xl p-4 cursor-pointer transition-all hover:bg-slate-850 group"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-semibold tracking-wider text-amber-400 uppercase text-[11px] flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> Próxima Publicação
            </span>
            <span className="font-mono text-[11px] text-slate-400">
              {milestones.nextPublication?.date ? milestones.nextPublication.date.split('-').reverse().join('/') : '--/--'}
            </span>
          </div>
          <h4 className="text-sm font-semibold text-white line-clamp-2 group-hover:text-amber-300 transition-colors">
            {milestones.nextPublication?.theme || 'Nenhuma pendente'}
          </h4>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
            <span className="font-medium text-slate-300">
              {milestones.nextPublication?.format} · {milestones.nextPublication?.suggestedTime || '12:00'}
            </span>
            <span className="text-[11px] text-amber-400 flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
              Ver detalhes <ChevronRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Card 2: Próxima Data Comemorativa */}
        <div 
          onClick={() => milestones.nextHoliday && onSelectContent(milestones.nextHoliday)}
          className="bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 rounded-xl p-4 cursor-pointer transition-all hover:bg-slate-850 group"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-semibold tracking-wider text-emerald-400 uppercase text-[11px] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Próxima Data Comemorativa
            </span>
            <span className="font-mono text-[11px] text-slate-400">
              {milestones.nextHoliday?.date ? milestones.nextHoliday.date.split('-').reverse().join('/') : '--/--'}
            </span>
          </div>
          <h4 className="text-sm font-semibold text-white line-clamp-2 group-hover:text-emerald-300 transition-colors">
            {milestones.nextHoliday?.holiday || 'Nenhuma cadastrada'}
          </h4>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
            <span className="font-medium text-slate-300">
              {milestones.nextHoliday?.holidayCategory || 'Comemorativa'}
            </span>
            <span className="text-[11px] text-emerald-400 flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
              Ver roteiro <ChevronRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Card 3: Próxima Campanha Estruturada */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-semibold tracking-wider text-sky-400 uppercase text-[11px] flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5" /> Próxima Grande Campanha
            </span>
            <span className="font-mono text-[11px] text-slate-400">
              Início: {milestones.nextCampaign.startDate}
            </span>
          </div>
          <h4 className="text-sm font-semibold text-white line-clamp-1">
            {milestones.nextCampaign.name}
          </h4>
          <p className="mt-1 text-xs text-slate-400 line-clamp-2">
            {milestones.nextCampaign.description}
          </p>
        </div>

        {/* Card 4: Status do Planejamento */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-semibold tracking-wider text-slate-300 uppercase text-[11px] flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> Status do Planejamento
            </span>
            <span className="font-mono font-bold text-amber-400">
              {milestones.planningStatus.scorePercent}%
            </span>
          </div>
          <div>
            <div className="text-sm font-semibold text-white">
              {milestones.planningStatus.label}
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full mt-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-amber-400 to-emerald-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${milestones.planningStatus.scorePercent}%` }}
              />
            </div>
          </div>
          <div className="text-[11px] text-slate-400 mt-2 flex items-center justify-between">
            <span>Período: 08/10 a 31/12/2026</span>
            <span className="font-mono">{kpis.total} Dias Ativos</span>
          </div>
        </div>
      </div>

      {/* Team Birthday Alert Card */}
      {nextEmployeeBirthday && (
        <div 
          onClick={() => {
            if (onSelectBirthday) onSelectBirthday(nextEmployeeBirthday.employee);
            else if (onNavigateToBirthdays) onNavigateToBirthdays();
          }}
          className="bg-gradient-to-r from-rose-950/40 via-slate-900 to-amber-950/30 border border-rose-500/30 hover:border-rose-500/60 rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 cursor-pointer transition-all hover:bg-slate-850 group"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30">
              <Cake className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider">
                  Aniversário da Equipe
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {nextEmployeeBirthday.employee.birthDate.slice(0, 5)}
                </span>
                <span className="text-[10px] text-amber-400 font-bold bg-amber-400/10 px-1.5 py-0.2 rounded font-mono">
                  {nextEmployeeBirthday.daysUntil === 0 ? 'HOJE!' : `em ${nextEmployeeBirthday.daysUntil} dias`}
                </span>
              </div>
              <p className="text-xs text-white font-semibold group-hover:text-rose-300 transition-colors">
                {nextEmployeeBirthday.employee.name} — <span className="text-slate-300 font-normal">{nextEmployeeBirthday.employee.role}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs text-rose-300 font-semibold group-hover:translate-x-0.5 transition-transform self-end sm:self-auto">
            <span>Planejar homenagem da equipe</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>
      )}

      {/* Main KPI Counter Strip */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-amber-400" />
            Visão Geral de Execução & Status
          </h3>
          <button
            onClick={onNavigateToCalendar}
            className="text-xs text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1"
          >
            Abrir calendário completo <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-3">
            <span className="text-[11px] text-slate-400 uppercase font-semibold">Total Conteúdos</span>
            <div className="text-2xl font-bold font-mono text-white mt-1 tabular-nums">
              {kpis.total}
            </div>
            <span className="text-[11px] text-slate-400">85 dias preenchidos</span>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-3">
            <span className="text-[11px] text-slate-400 uppercase font-semibold">Publicados</span>
            <div className="text-2xl font-bold font-mono text-emerald-400 mt-1 tabular-nums">
              {kpis.published}
            </div>
            <span className="text-[11px] text-slate-400">Finalizados na rede</span>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-3">
            <span className="text-[11px] text-slate-400 uppercase font-semibold">Aprovados</span>
            <div className="text-2xl font-bold font-mono text-sky-400 mt-1 tabular-nums">
              {kpis.approved}
            </div>
            <span className="text-[11px] text-slate-400">Prontos para agendamento</span>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-3">
            <span className="text-[11px] text-slate-400 uppercase font-semibold">Em Produção</span>
            <div className="text-2xl font-bold font-mono text-amber-400 mt-1 tabular-nums">
              {kpis.inProduction}
            </div>
            <span className="text-[11px] text-slate-400">Gravação ou arte</span>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-3">
            <span className="text-[11px] text-slate-400 uppercase font-semibold">Planejados</span>
            <div className="text-2xl font-bold font-mono text-purple-400 mt-1 tabular-nums">
              {kpis.planned}
            </div>
            <span className="text-[11px] text-slate-400">Roteiro concluído</span>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-3">
            <span className="text-[11px] text-slate-400 uppercase font-semibold">Datas Comemorativas</span>
            <div className="text-2xl font-bold font-mono text-amber-300 mt-1 tabular-nums">
              {kpis.holidaysCount}
            </div>
            <span className="text-[11px] text-slate-400">Regionais e nacionais</span>
          </div>
        </div>
      </div>

      {/* Grid 2 Columns: Breakdown by Format & Breakdown by Editorial Balance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Formatos de Publicação */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              Distribuição por Formato
            </h3>
            <span className="text-xs text-slate-400 font-mono">Frequência Semanal</span>
          </div>

          <div className="space-y-3">
            {/* Reels */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-300 flex items-center gap-1.5 font-medium">
                  <Video className="w-3.5 h-3.5 text-pink-400" /> Reels (Vídeos Curtos)
                </span>
                <span className="font-mono text-white font-semibold">
                  {kpis.reels} <span className="text-slate-400 font-normal">({Math.round((kpis.reels / total) * 100)}%)</span>
                </span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-pink-500 h-full rounded-full" 
                  style={{ width: `${(kpis.reels / total) * 100}%` }}
                />
              </div>
              <span className="text-[11px] text-slate-400">Meta: 2 a 3 por semana · Foco em Atração e Curiosidade</span>
            </div>

            {/* Carrossel */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-300 flex items-center gap-1.5 font-medium">
                  <Layers className="w-3.5 h-3.5 text-amber-400" /> Carrosséis Didáticos
                </span>
                <span className="font-mono text-white font-semibold">
                  {kpis.carousels} <span className="text-slate-400 font-normal">({Math.round((kpis.carousels / total) * 100)}%)</span>
                </span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-amber-400 h-full rounded-full" 
                  style={{ width: `${(kpis.carousels / total) * 100}%` }}
                />
              </div>
              <span className="text-[11px] text-slate-400">Meta: 1 a 2 por semana · Alto salvamento e autoridade</span>
            </div>

            {/* Post Estático */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-300 flex items-center gap-1.5 font-medium">
                  <ImageIcon className="w-3.5 h-3.5 text-sky-400" /> Posts (Feed / Imagem Única)
                </span>
                <span className="font-mono text-white font-semibold">
                  {kpis.posts} <span className="text-slate-400 font-normal">({Math.round((kpis.posts / total) * 100)}%)</span>
                </span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-sky-400 h-full rounded-full" 
                  style={{ width: `${(kpis.posts / total) * 100}%` }}
                />
              </div>
              <span className="text-[11px] text-slate-400">Meta: 3 a 4 por semana · Datas, Depoimentos e Anúncios</span>
            </div>

            {/* Stories Diários */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-300 flex items-center gap-1.5 font-medium">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Stories (Estratégia Diária)
                </span>
                <span className="font-mono text-white font-semibold">
                  {kpis.stories} <span className="text-slate-400 font-normal">({Math.round((kpis.stories / total) * 100)}%)</span>
                </span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-emerald-400 h-full rounded-full" 
                  style={{ width: `${(kpis.stories / total) * 100}%` }}
                />
              </div>
              <span className="text-[11px] text-slate-400">Cadência diária ativa · Enquetes, bastidores e links diretos</span>
            </div>
          </div>
        </div>

        {/* Equilíbrio Editorial & Regra dos 40-25-25-10 */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              Equilíbrio Estratégico (Regra Fundamental)
            </h3>
            <span className="text-xs text-slate-400 font-mono">Meta vs Atual</span>
          </div>

          <div className="space-y-3">
            {/* Educação 40% */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">
                  Educação Solar (Meta: 40%)
                </span>
                <span className="font-mono font-semibold text-sky-400">
                  {pctEducType}% ({kpis.educational} conteúdos)
                </span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-sky-500 h-full rounded-full" 
                  style={{ width: `${pctEducType}%` }}
                />
              </div>
              <span className="text-[11px] text-slate-400">Explicação simples para pessoas comuns, faturas, funcionamento</span>
            </div>

            {/* Comercial / Conversão 25% */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">
                  Comercial & Conversão (Meta: 25%)
                </span>
                <span className="font-mono font-semibold text-amber-400">
                  {pctCommType}% ({kpis.commercial} conteúdos)
                </span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-amber-400 h-full rounded-full" 
                  style={{ width: `${pctCommType}%` }}
                />
              </div>
              <span className="text-[11px] text-slate-400">Orçamentos, Black Friday, simulação, financiamento sem entrada</span>
            </div>

            {/* Relacionamento / Autoridade 25% */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">
                  Relacionamento & Autoridade (Meta: 25%)
                </span>
                <span className="font-mono font-semibold text-emerald-400">
                  {pctRelType}% ({kpis.relationship} conteúdos)
                </span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-emerald-400 h-full rounded-full" 
                  style={{ width: `${pctRelType}%` }}
                />
              </div>
              <span className="text-[11px] text-slate-400">Bastidores, equipe técnica, cases reais, orgulho nordestino</span>
            </div>

            {/* Institucional / Entretenimento 10% */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">
                  Institucional & Conscientização (Meta: 10%)
                </span>
                <span className="font-mono font-semibold text-purple-400">
                  {pctInstType}% ({kpis.institutional} conteúdos)
                </span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-purple-400 h-full rounded-full" 
                  style={{ width: `${pctInstType}%` }}
                />
              </div>
              <span className="text-[11px] text-slate-400">Datas cívicas, feriados nacionais e compromisso ambiental</span>
            </div>
          </div>
        </div>
      </div>

      {/* Highlights Section: 3 Campaign Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Outubro */}
        <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-semibold text-amber-400 uppercase tracking-wide">
              Outubro / 2026
            </span>
            <span className="text-slate-400 font-mono">24 Conteúdos</span>
          </div>
          <h4 className="text-sm font-semibold text-white mb-1">
            Presença Regional & Quebra de Objeções
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Destaque obrigatório: <strong>08/10 Dia do Nordestino</strong> (Orgulho de ser Nordeste). Introdução da economia de longo prazo e primeiro teaser da Black Friday no Halloween.
          </p>
        </div>

        {/* Novembro */}
        <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-amber-500/30 rounded-xl p-4 relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-16 h-16 bg-amber-500/10 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-semibold text-amber-300 uppercase tracking-wide flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-amber-400" /> Novembro / 2026
            </span>
            <span className="text-amber-400/80 font-mono">30 Conteúdos</span>
          </div>
          <h4 className="text-sm font-semibold text-white mb-1">
            Black Friday Solar NowTech (4 Fases)
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Principal campanha comercial: Fase 1 Aquecimento (16-20/11), Fase 2 Pré-BF (21-26/11), Fase 3 Black Friday Oficial (27/11) e Fase 4 Última Chance até Cyber Monday (30/11).
          </p>
        </div>

        {/* Dezembro */}
        <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-semibold text-sky-400 uppercase tracking-wide">
              Dezembro / 2026
            </span>
            <span className="text-slate-400 font-mono">31 Conteúdos</span>
          </div>
          <h4 className="text-sm font-semibold text-white mb-1">
            "2027 Começa com Economia"
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Temporada de sol: <strong>21/12 Início do Verão</strong> no Nordeste. Fechamento de ano com mensagem de Natal acolhedora e retrospectiva de conquistas.
          </p>
        </div>
      </div>
    </div>
  );
};
