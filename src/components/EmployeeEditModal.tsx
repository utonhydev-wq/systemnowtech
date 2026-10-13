import React, { useState } from 'react';
import { X, User, Save, Calendar, Briefcase, CheckCircle2 } from 'lucide-react';
import { Employee, EmployeeStatus } from '../types/employee';

interface EmployeeEditModalProps {
  initialEmployee?: Employee | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (employee: Employee) => void;
}

export const EmployeeEditModal: React.FC<EmployeeEditModalProps> = ({
  initialEmployee,
  isOpen,
  onClose,
  onSave,
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState(initialEmployee?.name || '');
  const [birthDate, setBirthDate] = useState(initialEmployee?.birthDate || '');
  const [role, setRole] = useState(initialEmployee?.role || '');
  const [status, setStatus] = useState<EmployeeStatus>(initialEmployee?.status || 'ATIVO');
  const [notes, setNotes] = useState(initialEmployee?.notes || '');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Por favor, informe o nome completo.');
      return;
    }
    // Simple validation of DD/MM/YYYY format
    const regex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!regex.test(birthDate.trim())) {
      setError('A data de nascimento deve estar no formato DD/MM/AAAA (ex: 14/03/1992).');
      return;
    }

    const updated: Employee = {
      id: initialEmployee?.id || `emp-${Date.now().toString().slice(-4)}`,
      name: name.trim(),
      birthDate: birthDate.trim(),
      role: role.trim() || 'Colaborador',
      status,
      notes: notes.trim(),
      createdAt: initialEmployee?.createdAt || new Date().toISOString().slice(0, 10),
    };

    onSave(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <User className="w-4 h-4 text-amber-400" />
            {initialEmployee ? 'Editar Funcionário' : 'Cadastrar Novo Funcionário'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
          {error && (
            <div className="p-2.5 bg-rose-950/40 border border-rose-800 text-rose-300 rounded-lg text-xs">
              {error}
            </div>
          )}

          <div>
            <label className="block text-slate-400 text-xs mb-1">Nome Completo *</label>
            <input
              type="text"
              required
              value={name}
              placeholder="ex: Demitri Akini"
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 text-xs mb-1">
                Data de Nascimento (DD/MM/AAAA) *
              </label>
              <input
                type="text"
                required
                value={birthDate}
                placeholder="ex: 14/03/1992"
                onChange={(e) => {
                  setBirthDate(e.target.value);
                  setError('');
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-400 text-xs mb-1">Status do Vínculo</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as EmployeeStatus)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400"
              >
                <option value="ATIVO">Ativo (Aniversariante do Time)</option>
                <option value="DESLIGADO">Desligado (Preserva Histórico)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-400 text-xs mb-1">Cargo / Função *</label>
            <input
              type="text"
              required
              value={role}
              placeholder="ex: Supervisor Técnico, Vendedor Externo..."
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-slate-400 text-xs mb-1">Observações Internas (Opcional)</label>
            <input
              type="text"
              value={notes}
              placeholder="ex: Unidade Caruaru, polo Recife..."
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400"
            />
          </div>

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
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Salvar Dados</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
