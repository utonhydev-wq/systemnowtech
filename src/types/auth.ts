export type UserRole = 'ADMIN' | 'COLABORADOR';

export interface AppUser {
  id: string;
  name: string;
  role: string;
  userRole: UserRole;
  initials?: string;
  email?: string;
  avatar?: string;
  department?: string;
  employeeId?: string;
  hasCustomPin?: boolean;
  lastLoginAt?: string;
  status?: 'ATIVO' | 'INATIVO';
}

export interface AuthState {
  isAuthenticated: boolean;
  currentUser: AppUser | null;
}

