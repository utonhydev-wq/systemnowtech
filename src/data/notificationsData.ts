import { AppNotification } from '../types/notification';

export const initialNotificationsData: AppNotification[] = [
  {
    id: 'notif-1',
    type: 'PRAZO_PROXIMO',
    title: 'Ação estratégica de marketing',
    message: 'Finalização dos criativos da Black Friday Solar NowTech agendada no calendário.',
    date: '2026-10-09',
    read: false,
    targetTab: 'calendar',
    createdAt: '2026-10-09T08:30:00Z',
  },
  {
    id: 'notif-2',
    type: 'ANIVERSARIO_PROXIMO',
    title: 'Aniversário se aproximando',
    message: 'O aniversário de William Bernardo (Diretor Administrativo) é no dia 03/12. Homenagem já está programada.',
    date: '2026-10-09',
    read: false,
    targetTab: 'birthdays',
    createdAt: '2026-10-09T09:00:00Z',
  },
  {
    id: 'notif-3',
    type: 'APROVACAO_PENDENTE',
    title: 'Publicação de Halloween aguardando validação',
    message: 'O post "Conta de luz assustadora? Venha para a NowTech Solar" está pronto para aprovação.',
    date: '2026-10-08',
    read: true,
    targetTab: 'calendar',
    createdAt: '2026-10-08T14:15:00Z',
  },
  {
    id: 'notif-4',
    type: 'PRAZO_PROXIMO',
    title: 'Prazo próximo: Depoimento em campo',
    message: 'Gravação na obra com a equipe técnica agendada para 14/10.',
    date: '2026-10-08',
    read: true,
    targetTab: 'calendar',
    createdAt: '2026-10-08T10:00:00Z',
  },
];
