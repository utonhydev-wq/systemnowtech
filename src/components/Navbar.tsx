import React from 'react';
import { 
  Plus, 
  Download, 
  Sparkles, 
  Cake, 
  Calendar, 
  LayoutDashboard, 
  MessageSquare, 
  Calculator,
  Search,
  Bell,
  CheckSquare,
  Home,
  Smartphone,
  User
} from 'lucide-react';
import { NowTechLogo } from './NowTechLogo';
import { AppUser } from '../types/auth';
import { MainAppTab } from './MobileBottomNav';

interface NavbarProps {
  activeTab: MainAppTab;
  setActiveTab: (tab: MainAppTab) => void;
  onOpenNewModal: () => void;
  onExport: () => void;
  onOpenNotifications: () => void;
  onOpenInstallModal: () => void;
  currentUser: AppUser | null;
  unreadNotificationsCount?: number;
  totalItems: number;
  upcomingBirthdaysCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenNewModal,
  onExport,
  onOpenNotifications,
  onOpenInstallModal,
  currentUser,
  unreadNotificationsCount = 0,
  totalItems,
  upcomingBirthdaysCount = 0,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800/90 px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 sm:gap-4">
        {/* Zone 1: Official Brand Logo & Identity */}
        <button
          onClick={() => setActiveTab('home')}
          className="flex items-center text-left focus:outline-none shrink-0"
        >
          <NowTechLogo size="md" variant="full" />
        </button>

        {/* Zone 2: Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-1.5 text-xs lg:text-sm font-medium">
          <button
            onClick={() => setActiveTab('home')}
            className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === 'home'
                ? 'bg-slate-900 text-amber-400 font-bold border border-amber-500/40 shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>Início</span>
          </button>

          <button
            onClick={() => setActiveTab('calendar')}
            className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap shrink-0 ${
              activeTab === 'calendar'
                ? 'bg-slate-900 text-amber-400 font-bold border border-amber-500/40 shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
            }`}
          >
            <span>Calendário</span>
            <span className="ml-1 text-[11px] font-mono opacity-80">({totalItems})</span>
          </button>

          <button
            onClick={() => setActiveTab('birthdays')}
            className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === 'birthdays'
                ? 'bg-slate-900 text-rose-400 font-bold border border-rose-500/40 shadow-xs'
                : 'text-slate-400 hover:text-rose-300 hover:bg-slate-900/60'
            }`}
          >
            <Cake className="w-3.5 h-3.5 text-rose-400" />
            <span>Equipe</span>
            {upcomingBirthdaysCount > 0 && (
              <span className="text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 px-1.5 rounded-full font-mono">
                {upcomingBirthdaysCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('stories')}
            className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap shrink-0 ${
              activeTab === 'stories'
                ? 'bg-slate-900 text-amber-400 font-bold border border-amber-500/40 shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
            }`}
          >
            Stories
          </button>

          <button
            onClick={() => setActiveTab('whatsapp')}
            className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap shrink-0 ${
              activeTab === 'whatsapp'
                ? 'bg-slate-900 text-emerald-400 font-bold border border-emerald-500/40 shadow-xs'
                : 'text-slate-400 hover:text-emerald-300 hover:bg-slate-900/60'
            }`}
          >
            WhatsApp
          </button>

          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap shrink-0 ${
              activeTab === 'dashboard'
                ? 'bg-slate-900 text-amber-400 font-bold border border-amber-500/40 shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
            }`}
          >
            Métricas
          </button>

          <button
            onClick={() => setActiveTab('calculator')}
            className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap shrink-0 ${
              activeTab === 'calculator'
                ? 'bg-slate-900 text-amber-400 font-bold border border-amber-500/40 shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
            }`}
          >
            Calculadora
          </button>
        </nav>

        {/* Zone 3: Header Right Controls (Notifications, PWA, User, New Content) */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* PWA Install Button */}
          <button
            onClick={onOpenInstallModal}
            title="Instalar aplicativo no celular ou computador"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-amber-400 border border-slate-800 transition-colors text-xs font-semibold min-h-[38px]"
          >
            <Smartphone className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">App</span>
          </button>

          {/* Notifications Bell */}
          <button
            onClick={onOpenNotifications}
            title="Ver notificações"
            className="relative p-2 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-white border border-slate-800 transition-colors min-h-[38px] min-w-[38px] flex items-center justify-center"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-400 text-slate-950 font-bold text-[10px] flex items-center justify-center shadow-sm">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* Collaborator Profile Badge */}
          {currentUser && (
            <button
              onClick={() => setActiveTab('profile')}
              title={`Perfil: ${currentUser.name}`}
              className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 transition-colors min-h-[38px]"
            >
              <div className="w-7 h-7 rounded-lg bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center justify-center font-bold text-xs">
                {currentUser.initials || currentUser.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="hidden lg:block text-left">
                <div className="text-xs font-bold text-white truncate max-w-[100px]">
                  {currentUser.name.split(' ')[0]}
                </div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wider">
                  {currentUser.userRole}
                </div>
              </div>
            </button>
          )}

          {/* New Content Action Button - Exclusive to Admins */}
          {currentUser?.userRole === 'ADMIN' && (
            <button
              onClick={onOpenNewModal}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-xl shadow-md shadow-amber-500/20 transition-all whitespace-nowrap min-h-[38px]"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span className="hidden sm:inline">Novo Conteúdo</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
