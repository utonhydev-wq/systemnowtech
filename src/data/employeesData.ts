import { Employee, BirthdayTribute, TributeFormat, BirthdayAlert } from '../types/employee';

export const initialEmployees: Employee[] = [
  {
    id: 'emp-1',
    name: 'Demitri Akini',
    birthDate: '14/03/1992',
    role: 'Vendedor Externo',
    status: 'ATIVO',
    createdAt: '2026-01-01',
  },
  {
    id: 'emp-2',
    name: 'William Bernardo',
    birthDate: '03/12/1993',
    role: 'Diretor Administrativo',
    status: 'ATIVO',
    createdAt: '2026-01-01',
  },
  {
    id: 'emp-3',
    name: 'Wellington Bernardo',
    birthDate: '21/05/1995',
    role: 'Marketing & Comercial',
    status: 'ATIVO',
    createdAt: '2026-01-01',
  },
  {
    id: 'emp-4',
    name: 'Danielly Karolyne',
    birthDate: '23/04/1995',
    role: 'Assistente Administrativo',
    status: 'ATIVO',
    createdAt: '2026-01-01',
  },
  {
    id: 'emp-5',
    name: 'Marcos André',
    birthDate: '07/01/2002',
    role: 'Ajudante de Sistemas Solar',
    status: 'ATIVO',
    createdAt: '2026-01-01',
  },
  {
    id: 'emp-6',
    name: 'Pablo Sérgio',
    birthDate: '09/03/1999',
    role: 'Supervisor Técnico',
    status: 'ATIVO',
    createdAt: '2026-01-01',
  },
  {
    id: 'emp-7',
    name: 'Anderson Gonçalves',
    birthDate: '16/05/1995',
    role: 'Auxiliar de Instalação',
    status: 'ATIVO',
    createdAt: '2026-01-01',
  },
  {
    id: 'emp-8',
    name: 'Miqueas Waneson',
    birthDate: '10/09/1991',
    role: 'Auxiliar de Instalação',
    status: 'ATIVO',
    createdAt: '2026-01-01',
  },
  {
    id: 'emp-9',
    name: 'Carlos Eduardo',
    birthDate: '26/09/1995',
    role: 'Diretor Comercial',
    status: 'ATIVO',
    createdAt: '2026-01-01',
  },
  {
    id: 'emp-10',
    name: 'Williams Antonio',
    birthDate: '11/01/2004',
    role: 'Assistente de Marketing | T.I',
    status: 'ATIVO',
    createdAt: '2026-01-01',
  },
];

// Helper to parse DD/MM/YYYY
export function parseBirthDate(birthDateStr: string): { day: number; month: number; year: number } {
  const parts = birthDateStr.split('/').map(Number);
  return {
    day: parts[0] || 1,
    month: parts[1] || 1,
    year: parts[2] || 2000,
  };
}

export function calculateAge(birthDateStr: string, currentYear: number): number {
  const { year } = parseBirthDate(birthDateStr);
  return currentYear - year;
}

// Days until next birthday from referenceDate
export function getDaysUntilBirthday(birthDateStr: string, refDate: Date = new Date()): number {
  const { day, month } = parseBirthDate(birthDateStr);
  const currentYear = refDate.getFullYear();
  
  let nextBirthday = new Date(currentYear, month - 1, day);
  
  // Set times to midnight for precise day calculation
  nextBirthday.setHours(0, 0, 0, 0);
  const today = new Date(refDate.getFullYear(), refDate.getMonth(), refDate.getDate(), 0, 0, 0, 0);

  if (nextBirthday.getTime() < today.getTime()) {
    nextBirthday = new Date(currentYear + 1, month - 1, day, 0, 0, 0, 0);
  }

  const diffTime = nextBirthday.getTime() - today.getTime();
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

// Generate suggested message automatically
export function generateSuggestedMessage(name: string, role: string, format: TributeFormat): string {
  const firstName = name.split(' ')[0];

  switch (format) {
    case 'Homenagem interna para a equipe':
      return `Hoje é dia de comemorar o aniversário de ${name}, nosso ${role}! A equipe NowTech Solar agradece imensamente por todo o comprometimento, energia positiva e dedicação diária. Que este novo ciclo traga muita saúde, realizações e sucesso! Parabéns, ${firstName}! 🎂☀️`;

    case 'Mensagem de parabéns no grupo corporativo':
      return `🎉 Parabéns, ${name}! Toda a família NowTech Solar celebra com alegria o seu aniversário hoje. Obrigado por fazer a diferença como ${role}. Desejamos muita saúde, felicidade, paz e prosperidade em sua vida pessoal e profissional! 👏🚀☀️`;

    case 'Arte para Stories do Instagram':
      return `Hoje é dia de festa na NowTech Solar! ☀️🎂 Parabéns ao nosso ${role}, ${name}! Desejamos muitas felicidades, conquistas e luz no seu caminho. Deixe seu recado de parabéns aqui! 👇✨ #EquipeNowTech #NowTechSolar #Parabens`;

    case 'Publicação institucional no Instagram':
      return `Hoje celebramos o aniversário de ${name}, que desempenha com excelência e dedicação o papel de ${role} na NowTech Solar. ☀️👏

Profissionais como você são a energia que move a nossa empresa rumo ao futuro. Agradecemos pelo seu profissionalismo e por fazer parte da nossa história.

Desejamos muita saúde, realizações e um ano repleto de conquistas! Parabéns! 🎉

#NowTechSolar #EquipeNowTech #TimeSolar #Aniversário`;

    case 'Mensagem personalizada de aniversário':
      return `Feliz aniversário, ${firstName}! Que o seu dia seja repleto de sorrisos, cercado por quem você ama. É um orgulho enorme ter você como ${role} no nosso time. Muito sucesso e muita energia boa sempre! ☀️🎈`;

    case 'Registro sem publicação externa':
      return `Registro interno de aniversário de ${name} (${role}). Celebração e votos de parabéns registrados no sistema NowTech Solar.`;

    default:
      return `Hoje é dia de celebrar o aniversário de ${name}, nosso ${role}! A equipe NowTech Solar deseja muita saúde, felicidade, sucesso e novas conquistas. Parabéns! ☀️🎂`;
  }
}

// Calculate alerts (7 days, 3 days, 1 day, today)
export function getBirthdayAlerts(
  employees: Employee[],
  tributes: BirthdayTribute[],
  refDate: Date = new Date()
): BirthdayAlert[] {
  const alerts: BirthdayAlert[] = [];
  const activeEmployees = employees.filter((e) => e.status === 'ATIVO');

  for (const emp of activeEmployees) {
    const daysUntil = getDaysUntilBirthday(emp.birthDate, refDate);
    const { day, month } = parseBirthDate(emp.birthDate);
    const formattedDate = `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}`;
    
    // Find tribute for current/relevant year
    const tribute = tributes.find((t) => t.employeeId === emp.id && t.year === refDate.getFullYear());
    const status = tribute?.status || 'Não planejado';

    if (daysUntil === 0) {
      alerts.push({
        employeeId: emp.id,
        employeeName: emp.name,
        role: emp.role,
        birthDateFormatted: formattedDate,
        daysUntil: 0,
        alertType: 'HOJE',
        message: `HOJE é o aniversário de ${emp.name}! Parabenizar a equipe e verificar publicação.`,
        tributeStatus: status,
      });
    } else if (daysUntil === 1) {
      alerts.push({
        employeeId: emp.id,
        employeeName: emp.name,
        role: emp.role,
        birthDateFormatted: formattedDate,
        daysUntil: 1,
        alertType: 'APROVAR_1_DIA',
        message: `Falta 1 dia para o aniversário de ${emp.name}. Verificar aprovação final da homenagem!`,
        tributeStatus: status,
      });
    } else if (daysUntil <= 3) {
      alerts.push({
        employeeId: emp.id,
        employeeName: emp.name,
        role: emp.role,
        birthDateFormatted: formattedDate,
        daysUntil,
        alertType: 'PREPARAR_3_DIAS',
        message: `Faltam ${daysUntil} dias para o aniversário de ${emp.name}. Preparar arte e texto da homenagem.`,
        tributeStatus: status,
      });
    } else if (daysUntil <= 7) {
      alerts.push({
        employeeId: emp.id,
        employeeName: emp.name,
        role: emp.role,
        birthDateFormatted: formattedDate,
        daysUntil,
        alertType: 'PLANEJAR_7_DIAS',
        message: `Faltam ${daysUntil} dias para o aniversário de ${emp.name}. Planejar formato da homenagem.`,
        tributeStatus: status,
      });
    }
  }

  return alerts.sort((a, b) => a.daysUntil - b.daysUntil);
}
