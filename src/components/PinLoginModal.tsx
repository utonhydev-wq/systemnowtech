import React, { useState, useEffect, useRef } from 'react';
import { 
  Lock, 
  X, 
  ArrowRight, 
  AlertCircle, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  Clock, 
  KeyRound,
  Shield
} from 'lucide-react';
import { AppUser } from '../types/auth';
import { pinAuthService } from '../services/pinAuthService';

interface PinLoginModalProps {
  user: AppUser;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: AppUser) => void;
}

export const PinLoginModal: React.FC<PinLoginModalProps> = ({
  user,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lockoutSeconds, setLockoutSeconds] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const isAdmin = user.userRole === 'ADMIN';
  const initials = user.initials || user.name.slice(0, 2).toUpperCase();

  // Check lockout on mount and interval
  useEffect(() => {
    if (!isOpen) {
      setPin('');
      setError(null);
      return;
    }

    const checkLock = () => {
      const remaining = pinAuthService.getLockoutSeconds(user.id);
      setLockoutSeconds(remaining);
      if (remaining > 0) {
        setError(`Acesso bloqueado temporariamente. Aguarde ${remaining}s.`);
      }
    };

    checkLock();
    const interval = setInterval(checkLock, 1000);

    // Focus input
    setTimeout(() => {
      inputRef.current?.focus();
    }, 150);

    return () => clearInterval(interval);
  }, [isOpen, user.id]);

  if (!isOpen) return null;

  const handleDigitClick = (digit: string) => {
    if (lockoutSeconds > 0) return;
    if (pin.length < 6) {
      const nextPin = pin + digit;
      setPin(nextPin);
      setError(null);
      if (nextPin.length === 6) {
        executeValidation(nextPin);
      }
    }
  };

  const handleDeleteDigit = () => {
    if (lockoutSeconds > 0) return;
    setPin((prev) => prev.slice(0, -1));
    setError(null);
  };

  const handleClearPin = () => {
    if (lockoutSeconds > 0) return;
    setPin('');
    setError(null);
  };

  const executeValidation = async (pinToTest: string) => {
    if (lockoutSeconds > 0) return;
    if (pinToTest.length !== 6) {
      setError('O PIN deve conter exatamente 6 dígitos numéricos.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await pinAuthService.verifyPin(user.id, pinToTest);
      if (result.success) {
        onSuccess(user);
      } else {
        setError(result.error || 'PIN incorreto. Verifique seus dados.');
        if (result.lockedSeconds) {
          setLockoutSeconds(result.lockedSeconds);
        }
        setPin('');
      }
    } catch {
      setError('Erro ao validar PIN. Tente novamente.');
      setPin('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeValidation(pin);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="pin-dialog-title"
        className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-5 sm:p-6 shadow-2xl space-y-4 relative overflow-hidden"
      >
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl pointer-events-none -mr-10 -mt-10" />

        {/* Header with Collaborator details */}
        <div className="flex items-start justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm shadow-md ${
              isAdmin 
                ? 'bg-amber-400 text-slate-950 shadow-amber-500/20' 
                : 'bg-slate-800 text-amber-400 border border-slate-700'
            }`}>
              {initials}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 id="pin-dialog-title" className="text-sm sm:text-base font-bold text-white tracking-tight">
                  {user.name}
                </h3>
                {isAdmin && (
                  <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
                    ADMIN
                  </span>
                )}
              </div>
              <p className="text-xs text-amber-400/90 font-medium">
                {user.role}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            title="Cancelar e fechar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Instructions */}
        <div className="text-center space-y-1 pt-1 relative z-10">
          <p className="text-xs font-semibold text-slate-200">
            Digite seu PIN individual de 6 dígitos:
          </p>
          <p className="text-[11px] text-slate-400">
            Acesso exclusivo do colaborador à plataforma NowTech.
          </p>
        </div>

        {/* 6-digit visual slots */}
        <div className="flex justify-center items-center gap-2 py-2 relative z-10">
          {[0, 1, 2, 3, 4, 5].map((index) => {
            const hasDigit = index < pin.length;
            const digitChar = pin[index];
            return (
              <div
                key={index}
                className={`w-10 h-12 rounded-xl flex items-center justify-center text-lg font-bold border transition-all ${
                  hasDigit
                    ? 'border-amber-400 bg-amber-400/10 text-amber-300 shadow-sm shadow-amber-500/20'
                    : 'border-slate-800 bg-slate-950 text-slate-600'
                } ${lockoutSeconds > 0 ? 'opacity-40' : ''}`}
              >
                {hasDigit ? (showPin ? digitChar : '•') : ''}
              </div>
            );
          })}
        </div>

        {/* Hidden or real input for direct typing */}
        <form onSubmit={handleSubmit} className="space-y-3 relative z-10">
          <div className="relative">
            <input
              ref={inputRef}
              type={showPin ? 'text' : 'password'}
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              value={pin}
              disabled={lockoutSeconds > 0}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                setPin(val);
                setError(null);
                if (val.length === 6) {
                  executeValidation(val);
                }
              }}
              placeholder="Digite os 6 números"
              className="w-full text-center tracking-[0.4em] py-2.5 px-4 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-base focus:outline-none focus:border-amber-400 disabled:opacity-40"
            />
            <button
              type="button"
              onClick={() => setShowPin(!showPin)}
              className="absolute right-3 top-3 text-slate-400 hover:text-white"
              title={showPin ? 'Ocultar PIN' : 'Mostrar PIN'}
            >
              {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Error / Lockout Banner */}
          {error && (
            <div className={`p-2.5 rounded-xl text-xs flex items-center gap-2 ${
              lockoutSeconds > 0 
                ? 'bg-amber-500/15 border border-amber-500/30 text-amber-300' 
                : 'bg-rose-500/15 border border-rose-500/30 text-rose-300'
            }`}>
              {lockoutSeconds > 0 ? (
                <Clock className="w-4 h-4 shrink-0 text-amber-400 animate-pulse" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              )}
              <span className="leading-tight">{error}</span>
            </div>
          )}

          {/* Quick On-Screen Number Pad (Perfect for Mobile Touch) */}
          <div className="grid grid-cols-3 gap-2 pt-1">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
              <button
                key={num}
                type="button"
                disabled={lockoutSeconds > 0 || isLoading}
                onClick={() => handleDigitClick(num)}
                className="py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 active:bg-amber-500/20 border border-slate-800/80 hover:border-slate-700 text-white font-semibold text-base transition-all disabled:opacity-30 min-h-[44px]"
              >
                {num}
              </button>
            ))}
            <button
              type="button"
              disabled={lockoutSeconds > 0 || isLoading}
              onClick={handleClearPin}
              className="py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800/80 text-slate-400 hover:text-white font-medium text-xs transition-all disabled:opacity-30 min-h-[44px]"
            >
              Limpar
            </button>
            <button
              type="button"
              disabled={lockoutSeconds > 0 || isLoading}
              onClick={() => handleDigitClick('0')}
              className="py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 active:bg-amber-500/20 border border-slate-800/80 hover:border-slate-700 text-white font-semibold text-base transition-all disabled:opacity-30 min-h-[44px]"
            >
              0
            </button>
            <button
              type="button"
              disabled={lockoutSeconds > 0 || isLoading}
              onClick={handleDeleteDigit}
              className="py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800/80 text-slate-400 hover:text-rose-400 font-medium text-xs transition-all disabled:opacity-30 min-h-[44px]"
            >
              Apagar
            </button>
          </div>

          {/* Action buttons: Entrar e Cancelar */}
          <div className="pt-2 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white font-semibold text-xs transition-colors min-h-[46px]"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isLoading || lockoutSeconds > 0 || pin.length !== 6}
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-1.5 disabled:opacity-40 min-h-[46px]"
            >
              {isLoading ? (
                <span>Validando...</span>
              ) : (
                <>
                  <span>Entrar</span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
