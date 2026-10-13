import React from 'react';
import { WifiOff, Clock } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const { isOnline, lastSyncTime } = useOnlineStatus();

  if (isOnline) return null;

  const formattedTime = lastSyncTime.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="fixed top-14 left-3 right-3 sm:left-auto sm:right-6 sm:w-auto z-50 flex items-center justify-between gap-3 px-3.5 py-2 rounded-xl bg-amber-500/95 text-slate-950 font-medium text-xs shadow-xl backdrop-blur-md border border-amber-400">
      <div className="flex items-center gap-2">
        <WifiOff className="w-4 h-4 text-slate-950 stroke-[2.5]" />
        <span>Modo Offline — Navegando pelos dados salvos localmente</span>
      </div>
      <div className="flex items-center gap-1 text-[11px] font-mono opacity-90 shrink-0">
        <Clock className="w-3 h-3" />
        <span>Última sinc.: {formattedTime}</span>
      </div>
    </div>
  );
};
