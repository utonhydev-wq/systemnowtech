import React, { useState, useEffect } from 'react';
import { 
  X, 
  Cake, 
  Gift, 
  Copy, 
  Check, 
  Calendar, 
  User, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  AlertTriangle,
  RotateCcw,
  Save,
  MessageSquare
} from 'lucide-react';
import { Employee, BirthdayTribute, TributeFormat, TributeStatus } from '../types/employee';
import { 
  generateSuggestedMessage, 
  parseBirthDate, 
  calculateAge, 
  getDaysUntilBirthday 
} from '../data/employeesData';

interface BirthdayTributeModalProps {
  employee: Employee;
  existingTribute?: BirthdayTribute | null;
  currentYear?: number;
  isOpen: boolean;
  onClose: () => void;
  onSave: (tribute: BirthdayTribute) => void;
  showAge?: boolean;
}

export const BirthdayTributeModal: React.FC<BirthdayTributeModalProps> = ({
  employee,
  existingTribute,
  currentYear = 2026,
  isOpen,
  onClose,
  onSave,
  showAge = false,
}) => {
  if (!isOpen) return null;

  const defaultFormat: TributeFormat = existingTribute?.format || 'Mensagem de parabéns no grupo corporativo';
  const defaultStatus: TributeStatus = existingTribute?.status || 'Não planejado';

  const [format, setFormat] = useState<TributeFormat>(defaultFormat);
  const [status, setStatus] = useState<TributeStatus>(defaultStatus);
  const [responsibleName, setResponsibleName] = useState<string>(existingTribute?.responsibleName || 'Marketing & Comercial');
  const [prepDate, setPrepDate] = useState<string>(existingTribute?.prepDate || '');
  const [publishDate, setPublishDate] = useState<string>(existingTribute?.publishDate || '');
  const [message, setMessage] = useState<string>(
    existingTribute?.message || generateSuggestedMessage(employee.name, employee.role, defaultFormat)
  );
  const [notes, setNotes] = useState<string>(existingTribute?.notes || '');
  const [copied, setCopied] = useState<boolean>(false);

  const { day, month } = parseBirthDate(employee.birthDate);
  const dayStr = day.toString().padStart(2, '0');
  const monthStr = month.toString().padStart(2, '0');
  const daysUntil = getDaysUntilBirthday(employee.birthDate, new Date(currentYear, 9, 8)); // reference date Oct 8, 2026
  const age = calculateAge(employee.birthDate, currentYear);

  // Auto update suggested message when format changes if user hasn't heavily customized
  const handleFormatChange = (newFormat: TributeFormat) => {
    setFormat(newFormat);
    setMessage(generateSuggestedMessage(employee.name, employee.role, newFormat));
  };

  const handleResetSuggestion = () => {
    setMessage(generateSuggestedMessage(employee.name, employee.role, format));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedTribute: BirthdayTribute = {
      id: existingTribute?.id || `trib-${employee.id}-${currentYear}`,
      employeeId: employee.id,
      year: currentYear,
      status,
      format,
      responsibleName,
      prepDate: prepDate || undefined,
      publishDate: publishDate || undefined,
      message,
      notes,
      updatedAt: new Date().toISOString(),
    };
    onSave(updatedTribute);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-start justify-between gap-4 bg-gradient-to-r from-slate-950 via-slate-900 to-rose-950/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-amber-500 flex items-center justify-center text-white shadow-md shadow-rose-500/20">
              <Cake className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-rose-400 uppercase tracking-wider">
                  Aniversário da Equipe
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {dayStr}/{monthStr} (Recorrente)
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                {employee.name}
              </h3>
              <p className="text-xs text-slate-300">
                {employee.role}
                {showAge && <span className="text-slate-400 ml-1.5 font-mono">({age} anos)</span>}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-5 text-xs sm:text-sm">
          {/* Important Rule Banner */}
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-300 leading-relaxed">
              <strong className="text-amber-300">Diretriz da NowTech Solar:</strong> As homenagens não são publicadas automaticamente nas redes sociais. Toda divulgação externa depende de validação e aprovação do responsável.
            </div>
          </div>

          {/* Row 1: Status & Format */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 text-xs font-semibold mb-1">
                Status da Homenagem *
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TributeStatus)}
                className={`w-full bg-slate-950 border rounded-lg p-2 text-xs font-semibold transition-colors focus:outline-none focus:border-amber-400 ${
                  status === 'Aprovado' || status === 'Publicado ou enviado'
                    ? 'border-emerald-500/50 text-emerald-400'
                    : status === 'Aguardando aprovação' || status === 'Arte em produção'
                    ? 'border-amber-500/50 text-amber-400'
                    : status === 'Homenagem planejada'
                    ? 'border-purple-500/50 text-purple-400'
                    : status === 'Não haverá publicação'
                    ? 'border-slate-700 text-slate-500'
                    : 'border-slate-800 text-slate-300'
                }`}
              >
                <option value="Não planejado">Não planejado</option>
                <option value="Homenagem planejada">Homenagem planejada</option>
                <option value="Arte em produção">Arte em produção</option>
                <option value="Aguardando aprovação">Aguardando aprovação</option>
                <option value="Aprovado">Aprovado</option>
                <option value="Publicado ou enviado">Publicado ou enviado</option>
                <option value="Não haverá publicação">Não haverá publicação</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 text-xs font-semibold mb-1">
                Formato da Ação *
              </label>
              <select
                value={format}
                onChange={(e) => handleFormatChange(e.target.value as TributeFormat)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-amber-400"
              >
                <option value="Homenagem interna para a equipe">Homenagem interna para a equipe</option>
                <option value="Mensagem de parabéns no grupo corporativo">Mensagem de parabéns no grupo corporativo</option>
                <option value="Arte para Stories do Instagram">Arte para Stories do Instagram</option>
                <option value="Publicação institucional no Instagram">Publicação institucional no Instagram</option>
                <option value="Mensagem personalizada de aniversário">Mensagem personalizada de aniversário</option>
                <option value="Registro sem publicação externa">Registro sem publicação externa</option>
              </select>
            </div>
          </div>

          {/* Row 2: Responsible & Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-400 text-xs mb-1">Responsável</label>
              <input
                type="text"
                value={responsibleName}
                onChange={(e) => setResponsibleName(e.target.value)}
                placeholder="ex: Wellington Bernardo"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-slate-400 text-xs mb-1">Data Preparação</label>
              <input
                type="date"
                value={prepDate}
                onChange={(e) => setPrepDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-amber-400 font-mono text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-400 text-xs mb-1">Data Envio / Publicação</label>
              <input
                type="date"
                value={publishDate}
                onChange={(e) => setPublishDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-amber-400 font-mono text-xs"
              />
            </div>
          </div>

          {/* Row 3: Message / Copy with auto generator button */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-slate-300 font-semibold text-xs flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Mensagem Sugerida de Parabéns
              </label>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleResetSuggestion}
                  className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white"
                  title="Restaurar sugestão padrão para o cargo e nome"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Sugerir Novamente</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex items-center gap-1 px-2.5 py-0.5 text-xs font-medium text-amber-400 hover:text-amber-300 bg-amber-500/10 rounded transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Copiado</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copiar</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white text-xs leading-relaxed focus:outline-none focus:border-amber-400 font-sans select-all"
            />
          </div>

          {/* Row 4: Notes */}
          <div>
            <label className="block text-slate-400 text-xs mb-1">
              Observações Internas da Equipe
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="ex: Coordenar bolo surpresa no refeitório às 15h ou enviar no grupo geral"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Alerts Guide */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 space-y-1.5">
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Sistema de Alertas Automáticos da NowTech:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
              <div className="p-1.5 bg-slate-900 rounded border border-slate-850 text-slate-300">
                <span className="text-purple-400 font-bold block">7 dias antes</span>
                Planejar formato
              </div>
              <div className="p-1.5 bg-slate-900 rounded border border-slate-850 text-slate-300">
                <span className="text-amber-400 font-bold block">3 dias antes</span>
                Criar arte / texto
              </div>
              <div className="p-1.5 bg-slate-900 rounded border border-slate-850 text-slate-300">
                <span className="text-sky-400 font-bold block">1 dia antes</span>
                Validar aprovação
              </div>
              <div className="p-1.5 bg-slate-900 rounded border border-slate-850 text-slate-300">
                <span className="text-emerald-400 font-bold block">No dia</span>
                Parabenizar equipe
              </div>
            </div>
          </div>

          {/* Footer buttons */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-lg transition-colors shadow-sm shadow-amber-500/20"
            >
              <Save className="w-4 h-4" />
              <span>Salvar Homenagem</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
