import React from 'react';
import { X, Bell, Check, Clock, Calendar, Cake, CheckSquare, Sparkles } from 'lucide-react';
import { AppNotification } from '../types/notification';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onSelectNotification: (notif: AppNotification) => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onSelectNotification,
}) => {
  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'ANIVERSARIO_PROXIMO':
        return <Cake className="w-4 h-4 text-rose-400" />;
      case 'TAREFA_ATRIBUIDA':
        return <CheckSquare className="w-4 h-4 text-emerald-400" />;
      case 'PRAZO_PROXIMO':
        return <Clock className="w-4 h-4 text-amber-400" />;
      case 'APROVACAO_PENDENTE':
        return <Calendar className="w-4 h-4 text-sky-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-sm p-0 sm:p-4 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="w-full sm:max-w-md bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl space-y-4 max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Notificações & Alertas</h3>
              <p className="text-[11px] text-slate-400">
                {unreadCount > 0 ? `${unreadCount} não lidas` : 'Todas em dia'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={onMarkAllAsRead}
                className="text-[11px] text-amber-400 hover:text-amber-300 font-semibold"
              >
                Marcar lidas
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-2 overflow-y-auto flex-1 pr-1">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              Nenhuma notificação no momento.
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => {
                  onSelectNotification(notif);
                  onClose();
                }}
                className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 group ${
                  notif.read
                    ? 'bg-slate-950/40 border-slate-850 opacity-70'
                    : 'bg-slate-950/80 border-amber-500/30 hover:border-amber-400 shadow-sm'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
                  {getIcon(notif.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className={`text-xs font-bold leading-tight ${notif.read ? 'text-slate-300' : 'text-white group-hover:text-amber-300'}`}>
                      {notif.title}
                    </h4>
                    <span className="text-[10px] text-slate-400 font-mono shrink-0">
                      {notif.date.split('-').reverse().join('/')}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-0.5">
                    {notif.message}
                  </p>
                </div>

                {!notif.read && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onMarkAsRead(notif.id);
                    }}
                    title="Marcar como lida"
                    className="p-1 rounded-lg text-slate-400 hover:text-emerald-400"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
