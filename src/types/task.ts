export type TaskPriority = 'ALTA' | 'MEDIA' | 'BAIXA';
export type TaskStatus = 'PENDENTE' | 'EM_ANDAMENTO' | 'CONCLUIDA';

export interface TaskChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface TeamTask {
  id: string;
  title: string;
  description: string;
  assignedTo: string; // Employee name or ID
  assignedEmployeeId?: string;
  dueDate: string; // YYYY-MM-DD
  priority: TaskPriority;
  status: TaskStatus;
  checklist: TaskChecklistItem[];
  relatedCampaign?: string;
  link?: string;
  notes?: string;
  createdAt: string;
  completedAt?: string;
}
