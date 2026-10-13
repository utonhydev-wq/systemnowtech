import React, { useState } from 'react';
import { 
  ShieldAlert, 
  KeyRound, 
  X, 
  RotateCcw, 
  Check, 
  Copy, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles,
  UserCheck
} from 'lucide-react';
import { AppUser } from '../types/auth';
import { teamUsersList } from '../data/authUsersData';
import { pinAuthService } from '../services/pinAuthService';

interface AdminManagePinsModalProps {
  adminUser: AppUser;
  isOpen: boolean;
  onClose: () => void;
}

export const AdminManagePinsModal: React.FC<AdminManagePinsModalProps> = ({
  adminUser,
  isOpen,
  onClose,
}) => {
  const [selectedTarget, setSelectedTarget] = useState<AppUser | null>(null);
  const [customPinInput, setCustomPinInput] = useState('');
  const [lastGeneratedPin, setLastGeneratedPin] = useState<{ userId: string; pin: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleResetPin = async (targetUser: AppUser, customPin?: string) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const result = await pinAuthService.adminResetPin(
        adminUser,
        targetUser.id,
        customPin
      );

      if (result.success && result.newPin) {
        setLastGeneratedPin({ userId: targetUser.id, pin: result.newPin });
        setSuccess(`PIN do colaborador ${targetUser.name} redefinido com sucesso e gravado permanentemente no Firebase!`);
        setSelectedTarget(null);
        setCustomPinInput('');
      } else {
        setError(result.error || 'Erro ao redefinir PIN no Firebase.');
      }
    } catch {
      setError('Falha ao processar redefinição de PIN.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnlockUser = async (targetUser: AppUser) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const result = await pinAuthService.adminUnlockUser(adminUser, targetUser.id);
      if (result.success) {
        setSuccess(`Acesso do colaborador ${targetUser.name} desbloqueado com sucesso! O PIN cadastrado permanece o mesmo.`);
      } else {
        setError(result.error || 'Erro ao desbloquear acesso.');
      }
    } catch {
      setError('Falha ao processar desbloqueio.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyPin = (pinText: string) => {
    navigator.clipboard.writeText(pinText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-400/20 text-amber-400 border border-amber-400/30 flex items-center justify-center">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <span>Gerenciar PINs da Equipe</span>
                <span className="text-[10px] bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-full font-black">
                  ADMIN
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Redefina e configure credenciais de 6 dígitos dos colaboradores.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          {/* Notification / Feedback */}
          {lastGeneratedPin && (
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Novo PIN Gerado:</span>
                </span>
                <button
                  onClick={() => handleCopyPin(lastGeneratedPin.pin)}
                  className="flex items-center gap-1 text-[11px] font-bold bg-amber-400/20 px-2 py-1 rounded-lg text-amber-300 hover:bg-amber-400/30 transition-colors"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copiado!' : 'Copiar PIN'}</span>
                </button>
              </div>
              <div className="text-2xl font-mono font-black tracking-widest text-white text-center py-1">
                {lastGeneratedPin.pin}
              </div>
              <p className="text-[11px] text-amber-200/80 text-center">
                Informe este código ao colaborador para que ele possa realizar o login e alterá-lo.
              </p>
            </div>
          )}

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {/* Target User Custom PIN Dialog if selected */}
          {selectedTarget && (
            <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-white">
                  Redefinir PIN de: <span className="text-amber-400">{selectedTarget.name}</span>
                </div>
                <button
                  onClick={() => setSelectedTarget(null)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-slate-300">
                  Definir PIN específico (deixe vazio para gerar aleatório de 6 dígitos):
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  value={customPinInput}
                  onChange={(e) => setCustomPinInput(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="Ex: 654321 ou em branco"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono text-sm focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => handleResetPin(selectedTarget, customPinInput || undefined)}
                  disabled={isLoading}
                  className="flex-1 py-2 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{customPinInput ? 'Salvar Este PIN' : 'Gerar Novo PIN Aleatório'}</span>
                </button>
              </div>
            </div>
          )}

          {/* List of 10 Team Members */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Lista dos 10 Colaboradores NowTech Solar
            </label>

            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
              {teamUsersList.map((user) => {
                const isAdmin = user.userRole === 'ADMIN';
                const lockout = pinAuthService.getLockoutSeconds(user.id);
                const isLocked = lockout > 0;
                const initials = user.initials || user.name.slice(0, 2).toUpperCase();
                const pinMeta = pinAuthService.getPinMetadata(user.id);

                return (
                  <div
                    key={user.id}
                    className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                        isAdmin 
                          ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30' 
                          : 'bg-slate-800 text-slate-200 border border-slate-700'
                      }`}>
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-white truncate">
                            {user.name}
                          </span>
                          {isAdmin && (
                            <span className="text-[9px] font-bold px-1.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                              ADMIN
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate">
                          {user.role}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className={`text-[9px] font-medium px-1.5 py-0.2 rounded ${
                            pinMeta?.hasCustomPin 
                              ? 'bg-blue-500/15 text-blue-300 border border-blue-500/20' 
                              : 'bg-slate-800 text-slate-400'
                          }`}>
                            {pinMeta?.hasCustomPin 
                              ? (pinMeta.updatedBy === 'admin' ? 'Redefinido por Admin' : 'Personalizado') 
                              : 'PIN Inicial Padrão'}
                          </span>
                          <span className="text-[9px] text-emerald-400 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                            Firebase
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {isLocked && (
                        <button
                          onClick={() => handleUnlockUser(user)}
                          className="px-2.5 py-1.5 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[11px] font-bold hover:bg-rose-500/30 transition-colors"
                          title="Desbloquear acesso mantendo o PIN do colaborador"
                        >
                          Desbloquear ({lockout}s)
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setSelectedTarget(user);
                          setCustomPinInput('');
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-amber-400/20 text-slate-300 hover:text-amber-300 border border-slate-700 hover:border-amber-400/40 text-xs font-semibold transition-all flex items-center gap-1"
                      >
                        <KeyRound className="w-3 h-3" />
                        <span>Redefinir PIN</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-slate-800 bg-slate-900/90 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
