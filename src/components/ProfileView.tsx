import React, { useState, useRef } from 'react';
import { 
  User, 
  Shield, 
  Smartphone, 
  Download, 
  Upload, 
  LogOut, 
  RefreshCw, 
  CheckCircle2, 
  Share2, 
  Cloud, 
  FileText, 
  AlertCircle, 
  HelpCircle, 
  Users, 
  BookOpen, 
  X, 
  ExternalLink, 
  Server,
  KeyRound,
  Key,
  ShieldCheck,
  Lock
} from 'lucide-react';
import { AppUser } from '../types/auth';
import { teamUsersList } from '../data/authUsersData';
import { storageService } from '../services/storageService';
import { isFirebaseConfigured } from '../services/firebase';
import { ChangePinModal } from './ChangePinModal';
import { AdminManagePinsModal } from './AdminManagePinsModal';
import { PinLoginModal } from './PinLoginModal';

interface ProfileViewProps {
  currentUser: AppUser;
  onLogout: () => void;
  onSwitchUser: (newUser: AppUser) => void;
  onOpenInstallModal: () => void;
  isPWAInstalled: boolean;
  onExportBackup: () => void;
  onImportBackup: (backupJson: string) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  currentUser,
  onLogout,
  onSwitchUser,
  onOpenInstallModal,
  isPWAInstalled,
  onExportBackup,
  onImportBackup,
}) => {
  const [isSwitching, setIsSwitching] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isChangePinOpen, setIsChangePinOpen] = useState(false);
  const [isAdminManagePinsOpen, setIsAdminManagePinsOpen] = useState(false);
  const [switchTargetUser, setSwitchTargetUser] = useState<AppUser | null>(null);

  const [importStatus, setImportStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check if admin: Carlos Eduardo, William Bernardo, Wellington Bernardo, Williams Antonio or userRole ADMIN
  const isAdmin = 
    currentUser.userRole === 'ADMIN' || 
    ['user-carlos', 'user-william', 'user-wellington', 'user-williams'].includes(currentUser.id);

  const hasFirebase = isFirebaseConfigured();
  const initials = currentUser.initials || currentUser.name.slice(0, 2).toUpperCase();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        onImportBackup(text);
        setImportStatus('Backup importado com sucesso!');
        setTimeout(() => setImportStatus(null), 3000);
      } catch (err: any) {
        setImportStatus('Erro ao importar arquivo: ' + (err?.message || 'Arquivo inválido'));
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleSwitchTargetSelected = (targetUser: AppUser) => {
    if (targetUser.id === currentUser.id) return;
    setSwitchTargetUser(targetUser);
  };

  const handleSwitchPinSuccess = (validatedUser: AppUser) => {
    setSwitchTargetUser(null);
    setIsSwitching(false);
    onSwitchUser(validatedUser);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4 animate-fade-in pb-10">
      {/* 1. Collaborator Identity Card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/30 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-amber-400/20 text-amber-400 border-2 border-amber-400/30 flex items-center justify-center font-black text-xl sm:text-2xl shadow-lg shrink-0">
            {initials}
          </div>

          <div className="space-y-1 flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                {currentUser.name}
              </h2>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                isAdmin 
                  ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30' 
                  : 'bg-slate-800 text-slate-300 border border-slate-700'
              }`}>
                {currentUser.userRole}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-amber-400 font-semibold">
              {currentUser.role}
            </p>
            <p className="text-xs text-slate-400">
              Setor: {currentUser.department || 'Operações & Comercial NowTech'}
            </p>
            {currentUser.email && (
              <p className="text-[11px] text-slate-500 font-mono">
                {currentUser.email}
              </p>
            )}
          </div>

          <button
            onClick={onLogout}
            title="Sair do perfil e retornar à tela inicial"
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-rose-500/20 hover:text-rose-300 text-slate-300 text-xs font-bold border border-slate-700 transition-colors min-h-[42px]"
          >
            <LogOut className="w-4 h-4" />
            <span>Sair</span>
          </button>
        </div>
      </div>

      {/* 2. Segurança & Credenciais de PIN Individual */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
              Segurança & PIN de Acesso Individual
            </h3>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            FIREBASE CLOUD
          </span>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          Cada colaborador possui um PIN individual de 6 dígitos para acesso seguro ao calendário, tarefas e ações da NowTech Solar. Todas as alterações são salvas permanentemente no banco de dados Firebase.
        </p>

        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">Banco Oficial de PINs:</span>
            <span className="font-semibold text-white">Cloud Firestore (/pin_credentials)</span>
          </div>
          <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
            Ativo e Criptografado
          </span>
        </div>

        <div className="pt-1 flex flex-wrap items-center gap-2">
          {/* Option for collaborator to change their own PIN */}
          <button
            onClick={() => setIsChangePinOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-400/15 hover:bg-amber-400/25 text-amber-300 text-xs font-semibold border border-amber-400/30 transition-colors min-h-[40px]"
          >
            <Key className="w-3.5 h-3.5 text-amber-400" />
            <span>Alterar Meu PIN</span>
          </button>

          {/* Option for ADMINs to manage team PINs */}
          {isAdmin && (
            <button
              onClick={() => setIsAdminManagePinsOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-white text-xs font-bold border border-slate-700 transition-colors min-h-[40px]"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Gerenciar PINs da Equipe (Admin)</span>
            </button>
          )}
        </div>
      </div>

      {/* 3. Firebase Cloud Sync Status */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cloud className={`w-4 h-4 ${hasFirebase ? 'text-emerald-400' : 'text-amber-400'}`} />
            <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
              Sincronização em Nuvem (Firebase Firestore)
            </h3>
          </div>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
            hasFirebase 
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
              : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
          }`}>
            {hasFirebase ? 'CONECTADO' : 'STANDALONE / LOCAL'}
          </span>
        </div>

        <p className="text-xs text-slate-400">
          {hasFirebase 
            ? 'Seus dados de marketing, tarefas, aniversários e PINs estão sincronizados com o Cloud Firestore do Firebase.' 
            : 'O aplicativo está operando com cache local e BroadcastChannel de alta velocidade. Para ativar o banco permanente na Vercel, consulte o guia de implantação.'}
        </p>

        <div className="pt-1 flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsGuideOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors min-h-[38px]"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span>Ver Passo a Passo de Implantação</span>
          </button>
        </div>
      </div>

      {/* 4. Switch Profile (Trocar de Colaborador com PIN) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
              Trocar de Perfil da Equipe
            </h3>
          </div>
          <button
            onClick={() => setIsSwitching(!isSwitching)}
            className="text-xs text-amber-400 hover:text-amber-300 font-semibold"
          >
            {isSwitching ? 'Ocultar' : 'Selecionar'}
          </button>
        </div>

        <p className="text-xs text-slate-400">
          Alterne para outro membro da NowTech Solar informando o respectivo PIN individual de 6 dígitos:
        </p>

        {isSwitching && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 max-h-60 overflow-y-auto pr-1">
            {teamUsersList.map((user) => {
              const targetInitials = user.initials || user.name.slice(0, 2).toUpperCase();
              return (
                <button
                  key={user.id}
                  onClick={() => handleSwitchTargetSelected(user)}
                  className={`flex items-center justify-between p-2.5 rounded-xl border text-left transition-all ${
                    user.id === currentUser.id
                      ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="w-6 h-6 rounded-md bg-slate-800 flex items-center justify-center font-bold text-[10px] text-amber-400 shrink-0">
                      {targetInitials}
                    </span>
                    <div className="truncate">
                      <div className="text-xs font-bold truncate">{user.name}</div>
                      <div className="text-[10px] text-slate-400 truncate">{user.role}</div>
                    </div>
                  </div>
                  {user.id === currentUser.id ? (
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 5. PWA Installation & Mobile App Status */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm space-y-3">
        <div className="flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-emerald-400" />
          <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
            Aplicativo NowTech Solar no Celular
          </h3>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>Status do App:</span>
              {isPWAInstalled ? (
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Instalado em modo aplicativo
                </span>
              ) : (
                <span className="text-amber-400 font-semibold">
                  Pronto para adicionar à tela inicial
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400">
              Otimizado prioritariamente para celulares Android e iPhone.
            </p>
          </div>

          {!isPWAInstalled && (
            <button
              onClick={onOpenInstallModal}
              className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold transition-colors whitespace-nowrap min-h-[38px]"
            >
              Instalar App
            </button>
          )}
        </div>
      </div>

      {/* 6. Backup & Restore (Restrito a Administradores) */}
      {isAdmin && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Download className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                Backup e Restauração de Dados (Admin)
              </h3>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/20">
              EXCLUSIVO ADMIN
            </span>
          </div>

          <p className="text-xs text-slate-400">
            Exporte ou restaure todos os eventos, aniversariantes, tarefas e homenagens em arquivo JSON.
          </p>

          <div className="flex flex-wrap gap-2 pt-1">
            <button
              onClick={onExportBackup}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors min-h-[38px]"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Baixar Backup Completo</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors min-h-[38px]"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Restaurar de Arquivo JSON</span>
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>

          {importStatus && (
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{importStatus}</span>
            </div>
          )}
        </div>
      )}

      {/* Change PIN Modal */}
      {isChangePinOpen && (
        <ChangePinModal
          currentUser={currentUser}
          isOpen={true}
          onClose={() => setIsChangePinOpen(false)}
        />
      )}

      {/* Admin Manage PINs Modal */}
      {isAdminManagePinsOpen && (
        <AdminManagePinsModal
          adminUser={currentUser}
          isOpen={true}
          onClose={() => setIsAdminManagePinsOpen(false)}
        />
      )}

      {/* Pin verification modal when switching user */}
      {switchTargetUser && (
        <PinLoginModal
          user={switchTargetUser}
          isOpen={true}
          onClose={() => setSwitchTargetUser(null)}
          onSuccess={handleSwitchPinSuccess}
        />
      )}

      {/* Guide Modal */}
      {isGuideOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full max-h-[85vh] overflow-y-auto p-5 sm:p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm sm:text-base font-bold text-white">
                  Guia de Configuração Vercel & Firebase
                </h3>
              </div>
              <button
                onClick={() => setIsGuideOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-300">
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="font-bold text-amber-400 flex items-center gap-1.5">
                  <span>1. Autenticação por PIN Individual</span>
                </div>
                <p className="text-slate-400">
                  Os 10 colaboradores possuem PIN individual de 6 dígitos criptografado com hash SHA-256 e sincronizado. Administradores podem redefinir o PIN de qualquer colaborador.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="font-bold text-amber-400 flex items-center gap-1.5">
                  <span>2. Authentication & Cloud Firestore</span>
                </div>
                <p className="text-slate-400">
                  Em <strong>Authentication</strong> e <strong>Firestore Database</strong>, o banco armazena eventos, tarefas, aniversários e credenciais protegidas.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="font-bold text-amber-400 flex items-center gap-1.5">
                  <span>3. Variáveis de Ambiente na Vercel</span>
                </div>
                <p className="text-slate-400">
                  No painel do projeto <code>calendarianowtech</code> na Vercel, cadastre em Settings &gt; Environment Variables as credenciais do Firebase.
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsGuideOpen(false)}
              className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-colors"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
