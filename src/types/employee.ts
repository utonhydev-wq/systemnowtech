export type EmployeeStatus = 'ATIVO' | 'DESLIGADO';

export type TributeFormat = 
  | 'Homenagem interna para a equipe'
  | 'Mensagem de parabéns no grupo corporativo'
  | 'Arte para Stories do Instagram'
  | 'Publicação institucional no Instagram'
  | 'Mensagem personalizada de aniversário'
  | 'Registro sem publicação externa';

export type TributeStatus = 
  | 'Não planejado'
  | 'Homenagem planejada'
  | 'Arte em produção'
  | 'Aguardando aprovação'
  | 'Aprovado'
  | 'Publicado ou enviado'
  | 'Não haverá publicação';

export interface Employee {
  id: string;
  name: string;
  birthDate: string; // DD/MM/YYYY
  role: string;
  status: EmployeeStatus;
  notes?: string;
  createdAt: string;
}

export interface BirthdayTribute {
  id: string;
  employeeId: string;
  year: number; // e.g. 2026
  status: TributeStatus;
  format: TributeFormat;
  responsibleName: string;
  prepDate?: string; // YYYY-MM-DD
  publishDate?: string; // YYYY-MM-DD
  message: string;
  notes?: string;
  updatedAt: string;
}

export interface BirthdayAlert {
  employeeId: string;
  employeeName: string;
  role: string;
  birthDateFormatted: string; // DD/MM
  daysUntil: number;
  alertType: 'PLANEJAR_7_DIAS' | 'PREPARAR_3_DIAS' | 'APROVAR_1_DIA' | 'HOJE' | 'FUTURO';
  message: string;
  tributeStatus: TributeStatus;
}
