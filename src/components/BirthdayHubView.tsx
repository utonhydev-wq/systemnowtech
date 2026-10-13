import React, { useState, useMemo } from 'react';
import { 
  Cake, 
  Gift, 
  UserPlus, 
  Search, 
  Calendar, 
  Sparkles, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Edit3, 
  UserCheck, 
  UserX, 
  Eye, 
  EyeOff, 
  Filter,
  MessageSquare,
  ChevronRight,
  ShieldCheck,
  Send
} from 'lucide-react';
import { Employee, BirthdayTribute, BirthdayAlert } from '../types/employee';
import { 
  parseBirthDate, 
  calculateAge, 
  getDaysUntilBirthday, 
  getBirthdayAlerts 
} from '../data/employeesData';

interface BirthdayHubViewProps {
  employees: Employee[];
  tributes: BirthdayTribute[];
  isAdmin?: boolean;
  onOpenTributeModal: (employee: Employee) => void;
  onOpenNewEmployeeModal: () => void;
  onEditEmployee: (employee: Employee) => void;
  onToggleEmployeeStatus: (id: string) => void;
  currentYear?: number;
  todayStr?: string;
}

export const BirthdayHubView: React.FC<BirthdayHubViewProps> = ({
  employees,
  tributes,
  isAdmin = false,
  onOpenTributeModal,
  onOpenNewEmployeeModal,
  onEditEmployee,
  onToggleEmployeeStatus,
  currentYear = 2026,
  todayStr = '2026-10-09',
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'TODOS' | 'ATIVO' | 'DESLIGADO'>('ATIVO');
  const [showAge, setShowAge] = useState(false);
  const [activeTab, setActiveTab] = useState<'proximos' | 'todos' | 'alertas' | 'historico'>('proximos');

  // Today reference date: parsed from todayStr (fuso Recife)
  const refDate = useMemo(() => {
    if (todayStr && todayStr.includes('-')) {
      const [y, m, d] = todayStr.split('-').map(Number);
      return new Date(y, m - 1, d, 0, 0, 0, 0);
    }
    return new Date();
  }, [todayStr]);

  // Sorted active employees by next upcoming birthday
  const sortedUpcoming = useMemo(() => {
    return employees
      .filter((e) => e.status === 'ATIVO')
      .map((e) => {
        const parts = e.birthDate.split('/').map(Number);
        const day = (parts[0] || 1).toString().padStart(2, '0');
        const month = (parts[1] || 1).toString().padStart(2, '0');
        const thisYearDateStr = `${currentYear}-${month}-${day}`;
        const hasPassedInThisYear = thisYearDateStr < todayStr;
        const isToday = thisYearDateStr === todayStr;

        return {
          ...e,
          daysUntil: getDaysUntilBirthday(e.birthDate, refDate),
          parsed: parseBirthDate(e.birthDate),
          hasPassedInThisYear,
          isToday,
        };
      })
      .sort((a, b) => a.daysUntil - b.daysUntil);
  }, [employees, refDate, currentYear, todayStr]);

  // Next immediate birthday
  const nextBirthday = sortedUpcoming[0] || null;

  // Birthdays in next 30 days
  const next30Days = useMemo(() => {
    return sortedUpcoming.filter((e) => e.daysUntil <= 30);
  }, [sortedUpcoming]);

  // Birthdays of current reference month (October = month 10)
  const currentMonthBirthdays = useMemo(() => {
    const currentM = refDate.getMonth() + 1;
    return sortedUpcoming.filter((e) => e.parsed.month === currentM);
  }, [sortedUpcoming, refDate]);

  // Alerts
  const alerts = useMemo(() => {
    return getBirthdayAlerts(employees, tributes, refDate);
  }, [employees, tributes, refDate]);

  // Filtered employees list for administration
  const filteredEmployees = useMemo(() => {
    return employees.filter((e) => {
      if (statusFilter !== 'TODOS' && e.status !== statusFilter) return false;
      if (search.trim()) {
        const query = search.toLowerCase();
        const matchName = e.name.toLowerCase().includes(query);
        const matchRole = e.role.toLowerCase().includes(query);
        const matchDate = e.birthDate.includes(query);
        if (!matchName && !matchRole && !matchDate) return false;
      }
      return true;
    });
  }, [employees, statusFilter, search]);

  const getTributeForEmployee = (employeeId: string) => {
    return tributes.find((t) => t.employeeId === employeeId && t.year === currentYear);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-rose-950/30 border border-slate-800 rounded-2xl p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20 uppercase tracking-wider flex items-center gap-1">
              <Cake className="w-3 h-3" />
              Gestão de Pessoas & Cultura NowTech
            </span>
            <span className="text-xs text-slate-400 font-mono">
              {employees.filter((e) => e.status === 'ATIVO').length} Colaboradores Ativos
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Aniversariantes da NowTech Solar
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Acompanhe as datas especiais do nosso time, programe homenagens internas e públicas com antecedência e fortaleça o pertencimento e a união da equipe.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-stretch md:self-auto justify-end">
          {/* Privacy Toggle for Age */}
          <button
            onClick={() => setShowAge(!showAge)}
            title="Exibir ou ocultar cálculo de idade"
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 border border-slate-800 rounded-xl transition-all"
          >
            {showAge ? <Eye className="w-4 h-4 text-amber-400" /> : <EyeOff className="w-4 h-4 text-slate-400" />}
            <span>{showAge ? 'Ocultar Idade' : 'Exibir Idade'}</span>
          </button>

          {isAdmin && (
            <button
              onClick={onOpenNewEmployeeModal}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-xl transition-all shadow-sm shadow-amber-500/20"
            >
              <UserPlus className="w-4 h-4" />
              <span>Cadastrar Funcionário</span>
            </button>
          )}
        </div>
      </div>

      {/* Top Cards: Próximo Aniversariante + Resumo deste mês + Alertas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Próximo Aniversariante */}
        <div className="bg-slate-900/90 border border-slate-800 hover:border-rose-500/40 rounded-2xl p-5 flex flex-col justify-between transition-all group">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="font-semibold tracking-wider text-rose-400 uppercase text-[11px] flex items-center gap-1.5">
                <Gift className="w-3.5 h-3.5" /> Próximo Aniversariante
              </span>
              {nextBirthday && (
                <span className="font-mono text-[11px] text-amber-400 font-bold bg-amber-400/10 px-2 py-0.5 rounded">
                  {nextBirthday.daysUntil === 0 ? 'HOJE! 🎉' : `em ${nextBirthday.daysUntil} dias`}
                </span>
              )}
            </div>

            {nextBirthday ? (
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white group-hover:text-rose-300 transition-colors">
                  {nextBirthday.name}
                </h3>
                <p className="text-xs text-slate-300">{nextBirthday.role}</p>
                <div className="text-xs text-slate-400 font-mono pt-1">
                  Data: {nextBirthday.parsed.day.toString().padStart(2, '0')}/{nextBirthday.parsed.month.toString().padStart(2, '0')}
                  {showAge && ` · ${calculateAge(nextBirthday.birthDate, currentYear)} anos`}
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">Nenhum aniversariante ativo cadastrado.</p>
            )}
          </div>

          {nextBirthday && (
            <button
              onClick={() => onOpenTributeModal(nextBirthday)}
              className="mt-4 flex items-center justify-center gap-1.5 w-full py-2 text-xs font-semibold text-rose-300 hover:text-white bg-rose-950/40 hover:bg-rose-900/60 border border-rose-900/50 rounded-xl transition-colors"
            >
              <span>Planejar Homenagem</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Card 2: Aniversários nos Próximos 30 Dias */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="font-semibold tracking-wider text-amber-400 uppercase text-[11px] flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" /> Próximos 30 Dias
              </span>
              <span className="font-mono text-xs text-slate-300 font-bold">
                {next30Days.length} Colega(s)
              </span>
            </div>

            <div className="space-y-2 max-h-32 overflow-y-auto pr-1">
              {next30Days.length === 0 ? (
                <p className="text-xs text-slate-400 italic pt-2">
                  Nenhum aniversário previsto para os próximos 30 dias.
                </p>
              ) : (
                next30Days.map((emp) => (
                  <div
                    key={emp.id}
                    onClick={() => onOpenTributeModal(emp)}
                    className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-850 hover:border-slate-700 cursor-pointer text-xs"
                  >
                    <div>
                      <span className="font-semibold text-white block">{emp.name}</span>
                      <span className="text-[11px] text-slate-400">{emp.role}</span>
                    </div>
                    <span className="font-mono text-amber-400 text-[11px]">
                      {emp.parsed.day.toString().padStart(2, '0')}/{emp.parsed.month.toString().padStart(2, '0')}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
          <span className="text-[11px] text-slate-500 pt-2 block">
            Clique no nome para abrir o roteiro de felicitações.
          </span>
        </div>

        {/* Card 3: Alertas Ativos da Equipe */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="font-semibold tracking-wider text-sky-400 uppercase text-[11px] flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" /> Alertas Internos
              </span>
              <span className="font-mono text-xs text-sky-400 font-bold">
                {alerts.length} Notificação(ões)
              </span>
            </div>

            <div className="space-y-2 max-h-32 overflow-y-auto pr-1">
              {alerts.length === 0 ? (
                <div className="p-3 bg-slate-950/50 rounded-lg border border-slate-850 text-xs text-slate-400 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Nenhum prazo urgente pendente para os próximos 7 dias.</span>
                </div>
              ) : (
                alerts.map((alt) => {
                  const emp = employees.find((e) => e.id === alt.employeeId);
                  return (
                    <div
                      key={alt.employeeId}
                      onClick={() => emp && onOpenTributeModal(emp)}
                      className="p-2 bg-slate-950/70 border border-slate-800 hover:border-sky-500/40 rounded-lg text-xs space-y-1 cursor-pointer"
                    >
                      <div className="flex items-center justify-between font-semibold">
                        <span className="text-white">{alt.employeeName}</span>
                        <span className="text-[10px] text-sky-400 font-mono">
                          {alt.daysUntil === 0 ? 'HOJE' : `${alt.daysUntil}d`}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-snug">
                        {alt.message}
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          </div>
          <span className="text-[11px] text-slate-500 pt-2 block">
            Alertas em: 7d (planejar), 3d (arte), 1d (aprovar) e no dia.
          </span>
        </div>
      </div>

      {/* Tabs Row: Próximos no Ano vs Todos os Funcionários vs Histórico */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 overflow-x-auto">
          <button
            onClick={() => setActiveTab('proximos')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'proximos'
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Ordem Cronológica (Próximos)
          </button>
          <button
            onClick={() => setActiveTab('todos')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'todos'
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Cadastro de Funcionários ({employees.length})
          </button>
          <button
            onClick={() => setActiveTab('historico')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'historico'
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Histórico de Homenagens ({tributes.length})
          </button>
        </div>

        {/* Search input */}
        <div className="relative min-w-[220px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por nome ou cargo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
          />
        </div>
      </div>

      {/* Tab 1: Ordem Cronológica (Próximos no Ano) */}
      {activeTab === 'proximos' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedUpcoming.map((emp) => {
            const tribute = getTributeForEmployee(emp.id);
            const status = tribute?.status || 'Não planejado';

            return (
              <div
                key={emp.id}
                className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-xl p-4 flex flex-col justify-between space-y-3 transition-all hover:bg-slate-850 group"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-mono text-rose-400 font-bold flex items-center gap-1.5">
                      <Cake className="w-3.5 h-3.5" />
                      {emp.parsed.day.toString().padStart(2, '0')}/{emp.parsed.month.toString().padStart(2, '0')}
                    </span>

                    <div className="flex items-center gap-1">
                      {emp.isToday ? (
                        <span className="text-[10px] font-bold text-amber-950 bg-amber-400 px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
                          É HOJE! 🎂
                        </span>
                      ) : emp.hasPassedInThisYear ? (
                        <span className="text-[10px] text-slate-400 bg-slate-800/90 px-1.5 py-0.5 rounded border border-slate-700 flex items-center gap-1" title={`Aniversário em ${emp.birthDate.slice(0, 5)} já passou no ano de ${currentYear}`}>
                          <Clock className="w-2.5 h-2.5 text-slate-400" />
                          <span>Já passou em {currentYear}</span>
                        </span>
                      ) : (
                        <span className="text-[11px] font-mono text-slate-300">
                          Faltam {emp.daysUntil} dias
                        </span>
                      )}
                    </div>
                  </div>

                  <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                    {emp.name}
                  </h4>
                  <p className="text-xs text-slate-300">{emp.role}</p>

                  {showAge && (
                    <span className="text-[11px] text-slate-400 font-mono mt-1 block">
                      Idade: {calculateAge(emp.birthDate, currentYear)} anos
                    </span>
                  )}

                  {/* Tribute status pill */}
                  <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-400">Homenagem:</span>
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                        status === 'Aprovado' || status === 'Publicado ou enviado'
                          ? 'text-emerald-400 bg-emerald-950/60 border border-emerald-800/60'
                          : status === 'Aguardando aprovação' || status === 'Arte em produção'
                          ? 'text-amber-400 bg-amber-950/60 border border-amber-800/60'
                          : status === 'Homenagem planejada'
                          ? 'text-purple-400 bg-purple-950/60 border border-purple-800/60'
                          : 'text-slate-400 bg-slate-950 border border-slate-800'
                      }`}
                    >
                      {status}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => onOpenTributeModal(emp)}
                    className="flex-1 py-1.5 text-xs font-semibold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors flex items-center justify-center gap-1"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                    <span>{tribute ? 'Ver Homenagem' : 'Criar Homenagem'}</span>
                  </button>

                  <button
                    onClick={() => onEditEmployee(emp)}
                    title="Editar dados cadastrais"
                    className="p-1.5 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 2: Cadastro de Funcionários (Administração) */}
      {activeTab === 'todos' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
          <div className="p-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">
              Listagem Geral de Colaboradores Cadastrados
            </span>
            <div className="flex items-center gap-2">
              <label className="text-slate-400 text-xs">Vínculo:</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as 'TODOS' | 'ATIVO' | 'DESLIGADO')}
                className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white focus:outline-none"
              >
                <option value="TODOS">Todos os Colaboradores</option>
                <option value="ATIVO">Apenas Ativos</option>
                <option value="DESLIGADO">Desligados (Histórico)</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-950 text-slate-400 border-b border-slate-800">
                  <th className="py-3 px-4 font-semibold text-slate-300">Colaborador</th>
                  <th className="py-3 px-3 font-semibold text-slate-300">Cargo</th>
                  <th className="py-3 px-3 font-semibold text-slate-300">Nascimento</th>
                  {showAge && <th className="py-3 px-3 font-semibold text-slate-300">Idade</th>}
                  <th className="py-3 px-3 font-semibold text-slate-300">Vínculo</th>
                  <th className="py-3 px-4 font-semibold text-slate-300 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-850/60 transition-colors">
                    <td className="py-3 px-4 text-white font-semibold flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-[11px] text-amber-400 font-bold shrink-0">
                        {emp.name.slice(0, 2).toUpperCase()}
                      </div>
                      <span>{emp.name}</span>
                    </td>
                    <td className="py-3 px-3 text-slate-300">{emp.role}</td>
                    <td className="py-3 px-3 font-mono text-amber-400/90">{emp.birthDate}</td>
                    {showAge && (
                      <td className="py-3 px-3 font-mono text-slate-400">
                        {calculateAge(emp.birthDate, currentYear)} anos
                      </td>
                    )}
                    <td className="py-3 px-3">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          emp.status === 'ATIVO'
                            ? 'text-emerald-400 bg-emerald-950/60 border border-emerald-800/60'
                            : 'text-slate-400 bg-slate-900 border border-slate-800'
                        }`}
                      >
                        {emp.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onOpenTributeModal(emp)}
                          title="Planejar homenagem"
                          className="p-1.5 text-slate-400 hover:text-rose-400 bg-slate-800 hover:bg-slate-700 rounded-md transition-colors"
                        >
                          <Cake className="w-3.5 h-3.5" />
                        </button>

                        {isAdmin && (
                          <>
                            <button
                              onClick={() => onEditEmployee(emp)}
                              title="Editar colaborador"
                              className="p-1.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-md transition-colors"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => onToggleEmployeeStatus(emp.id)}
                              title={emp.status === 'ATIVO' ? 'Marcar como Desligado' : 'Reativar Colaborador'}
                              className={`p-1.5 rounded-md transition-colors ${
                                emp.status === 'ATIVO'
                                  ? 'text-slate-400 hover:text-rose-400 bg-slate-800 hover:bg-slate-700'
                                  : 'text-emerald-400 hover:text-emerald-300 bg-emerald-950/40 hover:bg-emerald-900/60'
                              }`}
                            >
                              {emp.status === 'ATIVO' ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Histórico de Homenagens */}
      {activeTab === 'historico' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
          <div className="p-3 bg-slate-950/80 border-b border-slate-800 text-xs text-slate-400">
            Histórico das homenagens e comunicações corporativas registradas no sistema NowTech Solar
          </div>

          {tributes.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-500 italic">
              Nenhuma homenagem planejada ou registrada até o momento.
            </div>
          ) : (
            <div className="divide-y divide-slate-850">
              {tributes.map((trib) => {
                const emp = employees.find((e) => e.id === trib.employeeId);
                return (
                  <div key={trib.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-slate-850/50 transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{emp?.name || 'Colaborador'}</span>
                        <span className="text-xs text-slate-400">({emp?.role})</span>
                        <span className="text-[10px] font-mono text-amber-400 font-semibold bg-amber-500/10 px-2 py-0.5 rounded">
                          Ano {trib.year}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 font-sans italic line-clamp-2">
                        "{trib.message}"
                      </p>
                      <div className="text-[11px] text-slate-500 flex items-center gap-3">
                        <span>Formato: {trib.format}</span>
                        <span>·</span>
                        <span>Responsável: {trib.responsibleName}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-stretch sm:self-auto justify-between sm:justify-end">
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded ${
                          trib.status === 'Publicado ou enviado' || trib.status === 'Aprovado'
                            ? 'text-emerald-400 bg-emerald-950/60 border border-emerald-800/60'
                            : 'text-amber-400 bg-amber-950/60 border border-amber-800/60'
                        }`}
                      >
                        {trib.status}
                      </span>
                      {emp && (
                        <button
                          onClick={() => onOpenTributeModal(emp)}
                          className="text-xs text-amber-400 hover:text-white underline font-medium"
                        >
                          Ver / Editar
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
