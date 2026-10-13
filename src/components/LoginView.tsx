import React, { useState } from 'react';
import { 
  Shield, 
  Lock, 
  UserCheck, 
  ChevronRight, 
  Cloud
} from 'lucide-react';
import { NowTechLogo } from './NowTechLogo';
import { AppUser } from '../types/auth';
import { teamUsersList } from '../data/authUsersData';
import { isFirebaseConfigured } from '../services/firebase';
import { PinLoginModal } from './PinLoginModal';

interface LoginViewProps {
  onLoginSuccess: (user: AppUser) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  // Selected user for individual PIN entry modal
  const [selectedUserForPin, setSelectedUserForPin] = useState<AppUser | null>(null);

  const hasFirebase = isFirebaseConfigured();

  const handleSelectUserProfile = (user: AppUser) => {
    setSelectedUserForPin(user);
  };

  const handlePinSuccess = (user: AppUser) => {
    setSelectedUserForPin(null);
    onLoginSuccess(user);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Background Solar Ambience */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      {/* Top Header */}
      <div className="relative z-10 max-w-md mx-auto w-full pt-3 sm:pt-6 text-center space-y-2.5">
        <div className="flex justify-center">
          <NowTechLogo size="lg" variant="full" />
        </div>

        <div className="flex items-center justify-center gap-2 flex-wrap">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
            <Shield className="w-3.5 h-3.5" />
            <span>Portal Exclusivo do Colaborador</span>
          </div>
          {hasFirebase ? (
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-medium">
              <Cloud className="w-3 h-3" />
              <span>Sincronizado Firestore</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[11px]">
              <span>Modo Protegido Local</span>
            </div>
          )}
        </div>

        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Acesso ao Sistema NowTech Solar
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto">
          Selecione seu perfil abaixo e digite seu PIN individual de 6 dígitos.
        </p>
      </div>

      {/* Central Login Card: SELEÇÃO DE PERFIL COM PIN INDIVIDUAL */}
      <div className="relative z-10 max-w-md mx-auto w-full my-4 bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl backdrop-blur-xl">
        <div className="space-y-3.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-amber-400" />
              <span>Colaboradores Cadastrados</span>
            </label>
            <span className="text-[11px] text-amber-400 font-mono font-bold bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
              10 Membros
            </span>
          </div>

          {/* Titulo Exato Solicitado: “Selecione seu perfil abaixo para acesso rápido:” */}
          <p className="text-xs sm:text-sm text-slate-300 font-semibold">
            Selecione seu perfil abaixo para acesso rápido:
          </p>

          {/* List of 10 Team Members with Official Initials */}
          <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
            {teamUsersList.map((user) => {
              const isAdmin = user.userRole === 'ADMIN';
              const initials = user.initials || user.name.slice(0, 2).toUpperCase();

              return (
                <button
                  key={user.id}
                  onClick={() => handleSelectUserProfile(user)}
                  className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-950/70 hover:bg-slate-800/80 border border-slate-800 hover:border-amber-500/40 transition-all text-left group min-h-[56px] focus:outline-none focus:border-amber-400"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs shrink-0 transition-transform group-hover:scale-105 ${
                      isAdmin 
                        ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40 shadow-sm shadow-amber-500/20' 
                        : 'bg-slate-800 text-slate-200 border border-slate-700'
                    }`}>
                      {initials}
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                        {user.name}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {user.role}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {isAdmin && (
                      <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                        ADMIN
                      </span>
                    )}
                    <div className="p-1 rounded-lg bg-slate-900 group-hover:bg-amber-400/20 transition-colors">
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="pt-2 text-center">
            <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>Autenticação individual protegida com PIN de 6 dígitos.</span>
            </p>
          </div>
        </div>
      </div>

      {/* Modal for 6-Digit Individual PIN Authentication */}
      {selectedUserForPin && (
        <PinLoginModal
          user={selectedUserForPin}
          isOpen={true}
          onClose={() => setSelectedUserForPin(null)}
          onSuccess={handlePinSuccess}
        />
      )}

      {/* Footer Security Notice */}
      <div className="relative z-10 max-w-md mx-auto w-full text-center space-y-2 pb-4">
        <p className="text-[11px] text-slate-400">
          Uso restrito e interno da NowTech Solar Energia Fotovoltaica.
        </p>
        <p className="text-[10px] text-slate-500 font-mono">
          Pernambuco & Nordeste · Autenticação por Perfil & PIN Individual
        </p>
      </div>
    </div>
  );
};
