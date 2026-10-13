export type NotificationType = 
  | 'PRAZO_PROXIMO'
  | 'TAREFA_ATRIBUIDA'
  | 'ANIVERSARIO_PROXIMO'
  | 'APROVACAO_PENDENTE'
  | 'SISTEMA_INFO';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  date: string;
  read: boolean;
  targetTab?: 'calendar' | 'birthdays' | 'home' | 'profile' | 'dashboard';
  targetId?: string;
  createdAt: string;
}
