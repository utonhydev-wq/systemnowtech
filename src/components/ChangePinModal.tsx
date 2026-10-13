import React, { useState } from 'react';
import { 
  KeyRound, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  Lock 
} from 'lucide-react';
import { AppUser } from '../types/auth';
import { pinAuthService } from '../services/pinAuthService';

interface ChangePinModalProps {
  currentUser: AppUser;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const ChangePinModal: React.FC<ChangePinModalProps> = ({
  currentUser,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [showPins, setShowPins] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (currentPin.length !== 6 || newPin.length !== 6) {
      setError('Os PINs devem conter exatamente 6 dígitos numéricos.');
      return;
    }

    if (newPin !== confirmPin) {
      setError('A confirmação do novo PIN não coincide.');
      return;
    }

    if (currentPin === newPin) {
      setError('O novo PIN deve ser diferente do PIN atual.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await pinAuthService.changeUserPin(
        currentUser.id,
        currentPin,
        newPin
      );

      if (result.success) {
        setSuccessMessage('Seu novo PIN foi gravado com sucesso no Firebase!');
        setCurrentPin('');
        setNewPin('');
        setConfirmPin('');
        if (onSuccess) onSuccess();
        setTimeout(() => {
          onClose();
        }, 1800);
      } else {
        setError(result.error || 'Erro ao salvar novo PIN no Firebase.');
      }
    } catch {
      setError('Ocorreu um erro ao atualizar o PIN no Firebase. O PIN anterior permanece válido.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-5 sm:p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-400/20 text-amber-400 flex items-center justify-center">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Alterar Meu PIN</h3>
              <p className="text-[11px] text-slate-400">{currentUser.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">
              PIN Atual (6 dígitos)
            </label>
            <input
              type={showPins ? 'text' : 'password'}
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              value={currentPin}
              onChange={(e) => setCurrentPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
              required
              placeholder="Digite seu PIN atual"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-sm focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">
              Novo PIN (6 dígitos)
            </label>
            <input
              type={showPins ? 'text' : 'password'}
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              value={newPin}
              onChange={(e) => setNewPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
              required
              placeholder="Digite o novo PIN"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-sm focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">
              Confirmar Novo PIN
            </label>
            <input
              type={showPins ? 'text' : 'password'}
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              value={confirmPin}
              onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
              required
              placeholder="Repita o novo PIN"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-sm focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={() => setShowPins(!showPins)}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5"
            >
              {showPins ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{showPins ? 'Ocultar dígitos' : 'Visualizar dígitos'}</span>
            </button>
          </div>

          {error && (
            <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          <div className="pt-2 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading || newPin.length !== 6 || confirmPin.length !== 6}
              className="flex-1 py-2.5 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold transition-all disabled:opacity-40"
            >
              {isLoading ? 'Salvando...' : 'Salvar Novo PIN'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
