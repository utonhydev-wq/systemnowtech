export type FunnelStage = 'Atração' | 'Educação' | 'Conversão' | 'Relacionamento';
export type ContentType = 'Comercial' | 'Educativo' | 'Institucional' | 'Relacionamento';
export type ContentFormat = 'Reels' | 'Carrossel' | 'Post' | 'Stories' | 'WhatsApp';
export type ContentStatus = 'IDEIA' | 'PLANEJADO' | 'EM PRODUÇÃO' | 'APROVADO' | 'PUBLICADO';

export type MonthFilter = 
  | 'TODOS' 
  | 'JANEIRO' 
  | 'FEVEREIRO' 
  | 'MARÇO' 
  | 'ABRIL' 
  | 'MAIO' 
  | 'JUNHO' 
  | 'JULHO' 
  | 'AGOSTO' 
  | 'SETEMBRO' 
  | 'OUTUBRO' 
  | 'NOVEMBRO' 
  | 'DEZEMBRO';

export type YearFilter = 'TODOS' | '2026' | '2027' | '2028';
export type PeriodFilter = 'TODOS' | 'HISTORICO_2026' | 'PLANEJAMENTO_2027' | 'FUTUROS';

export type EventCategory =
  | 'Feriado nacional'
  | 'Feriado estadual'
  | 'Feriado municipal'
  | 'Ponto facultativo'
  | 'Data comemorativa'
  | 'Data regional'
  | 'Data ambiental'
  | 'Data profissional'
  | 'Data tecnológica'
  | 'Aniversário de funcionário'
  | 'Campanha comercial'
  | 'Campanha institucional'
  | 'Publicação de marketing'
  | 'Evento interno';

export type TemporalFilter =
  | 'TODAS'
  | 'HOJE'
  | 'PROXIMO'
  | 'FUTURAS'
  | 'PASSADAS'
  | 'PENDENTES_PASSADAS'
  | 'CONCLUIDAS';

export interface ContentItem {
  id: string;
  date: string; // YYYY-MM-DD
  endDate?: string; // Optional YYYY-MM-DD for multi-day events/campaigns
  dayOfWeek: string;
  month: string; // 'Janeiro' | 'Fevereiro' | 'Março' ... | 'Dezembro'
  year?: number;
  holiday: string | null;
  holidayCategory?: 'Regional/Nordeste' | 'Nacional' | 'Comercial' | 'Profissional' | 'Ambiental/Social';
  category?: EventCategory;
  source?: string; // Fonte oficial da informação (ex: Prefeitura de Jaboatão, Governo de PE, etc.)
  legalReference?: string; // Referência legal (ex: Lei Municipal nº 1.247/2015, etc.)
  responsible?: string; // Responsável pela execução
  targetPeriod?: 'HISTORICO_2026' | 'PLANEJAMENTO_2027' | 'FUTUROS';
  campaign: string;
  theme: string;
  format: ContentFormat;
  objective: string;
  funnelStage: FunnelStage;
  contentType: ContentType;
  contentIdea: string;
  caption: string;
  cta: string;
  channels: string[];
  status: ContentStatus;
  suggestedTime: string;
  notes: string;
  visualBrief: string;
}

export interface StoriesCadence {
  dayOfWeek: string;
  theme: string;
  description: string;
  interactiveSticker: string;
  bestTime: string;
  exampleHook: string;
}

export interface WhatsAppCampaignTemplate {
  id: string;
  title: string;
  category: string;
  targetAudience: string;
  objective: string;
  triggerEvent: string;
  messageText: string;
  recommendedCta: string;
}

export interface MarketingKPIs {
  total: number;
  published: number;
  inProduction: number;
  approved: number;
  planned: number;
  ideas: number;
  reels: number;
  posts: number;
  carousels: number;
  stories: number;
  whatsapp: number;
  commercial: number;
  educational: number;
  institutional: number;
  relationship: number;
  funnelAttraction: number;
  funnelEducation: number;
  funnelConversion: number;
  funnelRelationship: number;
  holidaysCount: number;
}
