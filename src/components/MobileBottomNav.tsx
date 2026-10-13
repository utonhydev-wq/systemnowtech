import React from 'react';
import { 
  Home,
  Calendar as CalendarIcon, 
  Users, 
  User
} from 'lucide-react';

export type MainAppTab = 'home' | 'calendar' | 'birthdays' | 'profile' | 'dashboard' | 'stories' | 'whatsapp' | 'calculator';

interface MobileBottomNavProps {
  activeTab: MainAppTab;
  setActiveTab: (tab: MainAppTab) => void;
  upcomingBirthdaysCount?: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
  upcomingBirthdaysCount = 0,
}) => {
  return (
    <nav 
      aria-label="Navegação Principal Móvel"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/90 pb-safe shadow-2xl"
    >
      <div className="grid grid-cols-4 items-center h-16 px-1 max-w-lg mx-auto">
        {/* 1. Início */}
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center justify-center h-full min-h-[48px] transition-colors relative ${
            activeTab === 'home'
              ? 'text-amber-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] mt-1 tracking-tight">Início</span>
          {activeTab === 'home' && (
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 absolute top-1" />
          )}
        </button>

        {/* 2. Calendário */}
        <button
          onClick={() => setActiveTab('calendar')}
          className={`flex flex-col items-center justify-center h-full min-h-[48px] transition-colors relative ${
            activeTab === 'calendar' || activeTab === 'dashboard'
              ? 'text-amber-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <CalendarIcon className="w-5 h-5" />
          <span className="text-[10px] mt-1 tracking-tight">Calendário</span>
          {(activeTab === 'calendar' || activeTab === 'dashboard') && (
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 absolute top-1" />
          )}
        </button>

        {/* 3. Equipe (Colaboradores e Aniversários) */}
        <button
          onClick={() => setActiveTab('birthdays')}
          className={`flex flex-col items-center justify-center h-full min-h-[48px] transition-colors relative ${
            activeTab === 'birthdays'
              ? 'text-rose-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users className="w-5 h-5" />
          <span className="text-[10px] mt-1 tracking-tight">Equipe</span>
          {upcomingBirthdaysCount > 0 && (
            <span className="absolute top-1.5 right-6 text-[9px] font-bold bg-rose-500 text-white rounded-full w-4 h-4 flex items-center justify-center">
              {upcomingBirthdaysCount}
            </span>
          )}
          {activeTab === 'birthdays' && (
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 absolute top-1" />
          )}
        </button>

        {/* 4. Perfil */}
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center justify-center h-full min-h-[48px] transition-colors relative ${
            activeTab === 'profile'
              ? 'text-amber-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] mt-1 tracking-tight">Perfil</span>
          {activeTab === 'profile' && (
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 absolute top-1" />
          )}
        </button>
      </div>
    </nav>
  );
};
