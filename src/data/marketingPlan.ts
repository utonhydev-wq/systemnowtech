import { ContentItem, MarketingKPIs } from '../types/marketing';
import { octoberPlan } from './octoberPlan';
import { novemberPlan } from './novemberPlan';
import { decemberPlan } from './decemberPlan';
import { plan2027 } from './plan2027';

export const masterMarketingPlan: ContentItem[] = [
  ...octoberPlan,
  ...novemberPlan,
  ...decemberPlan,
  ...plan2027
];

export function calculateKPIs(items: ContentItem[]): MarketingKPIs {
  const kpis: MarketingKPIs = {
    total: items.length,
    published: 0,
    inProduction: 0,
    approved: 0,
    planned: 0,
    ideas: 0,
    reels: 0,
    posts: 0,
    carousels: 0,
    stories: 0,
    whatsapp: 0,
    commercial: 0,
    educational: 0,
    institutional: 0,
    relationship: 0,
    funnelAttraction: 0,
    funnelEducation: 0,
    funnelConversion: 0,
    funnelRelationship: 0,
    holidaysCount: 0
  };

  for (const item of items) {
    // Status
    if (item.status === 'PUBLICADO') kpis.published++;
    else if (item.status === 'EM PRODUÇÃO') kpis.inProduction++;
    else if (item.status === 'APROVADO') kpis.approved++;
    else if (item.status === 'PLANEJADO') kpis.planned++;
    else if (item.status === 'IDEIA') kpis.ideas++;

    // Format
    if (item.format === 'Reels') kpis.reels++;
    else if (item.format === 'Post') kpis.posts++;
    else if (item.format === 'Carrossel') kpis.carousels++;
    else if (item.format === 'Stories') kpis.stories++;
    else if (item.format === 'WhatsApp') kpis.whatsapp++;

    // Content Type
    if (item.contentType === 'Comercial') kpis.commercial++;
    else if (item.contentType === 'Educativo') kpis.educational++;
    else if (item.contentType === 'Institucional') kpis.institutional++;
    else if (item.contentType === 'Relacionamento') kpis.relationship++;

    // Funnel Stage
    if (item.funnelStage === 'Atração') kpis.funnelAttraction++;
    else if (item.funnelStage === 'Educação') kpis.funnelEducation++;
    else if (item.funnelStage === 'Conversão') kpis.funnelConversion++;
    else if (item.funnelStage === 'Relacionamento') kpis.funnelRelationship++;

    // Holidays
    if (item.holiday) kpis.holidaysCount++;
  }

  return kpis;
}

export interface NextMilestones {
  nextPublication: ContentItem | null;
  nextHoliday: ContentItem | null;
  nextCampaign: {
    name: string;
    startDate: string;
    description: string;
  };
  planningStatus: {
    label: string;
    scorePercent: number;
    badgeColor: string;
  };
}

export function getNextMilestones(items: ContentItem[], currentDate = '2026-10-08'): NextMilestones {
  const sorted = [...items].sort((a, b) => a.date.localeCompare(b.date));
  
  // Next publication on or after current date
  const nextPub = sorted.find(i => i.date >= currentDate && i.status !== 'PUBLICADO') || sorted[0] || null;

  // Next holiday on or after current date
  const nextHol = sorted.find(i => i.date >= currentDate && Boolean(i.holiday)) || 
                  sorted.find(i => Boolean(i.holiday)) || null;

  // Determine next big campaign dynamically
  let nextCamp = {
    name: nextPub?.campaign || 'Presença Regional & Educação Financeira',
    startDate: nextPub?.date || '08/10/2026',
    description: nextPub?.theme || 'Fortalecimento da marca no Nordeste e quebra de objeções sobre conta alta.'
  };

  if (currentDate >= '2026-10-29' && currentDate < '2026-11-16') {
    nextCamp = {
      name: 'Aquecimento Black Friday Solar (Fase 1)',
      startDate: '16/11/2026',
      description: 'Geração de expectativa, enquetes, captação para Lista VIP de WhatsApp.'
    };
  } else if (currentDate >= '2026-11-16' && currentDate < '2026-11-27') {
    nextCamp = {
      name: 'BLACK FRIDAY SOLAR NOWTECH (Fase 3)',
      startDate: '27/11/2026',
      description: 'Principal campanha comercial do trimestre! Conversão máxima com condições de fábrica.'
    };
  } else if (currentDate >= '2026-11-28' && currentDate <= '2026-11-30') {
    nextCamp = {
      name: 'Cyber Monday — Encerramento Oficial',
      startDate: '30/11/2026',
      description: 'Última oportunidade para fechar contratos com a tabela de Black Friday.'
    };
  } else if (nextPub?.campaign) {
    nextCamp = {
      name: nextPub.campaign,
      startDate: nextPub.date,
      description: nextPub.theme || 'Campanha estratégica ativa para o período.'
    };
  }

  // Calculate planning health
  const total = items.length;
  const readyOrApproved = items.filter(i => ['APROVADO', 'PUBLICADO', 'EM PRODUÇÃO', 'PLANEJADO'].includes(i.status)).length;
  const score = total > 0 ? Math.round((readyOrApproved / total) * 100) : 100;

  return {
    nextPublication: nextPub,
    nextHoliday: nextHol,
    nextCampaign: nextCamp,
    planningStatus: {
      label: score >= 90 ? 'Estratégia Completa & Pronta' : 'Em Execução',
      scorePercent: score,
      badgeColor: score >= 90 ? 'text-emerald-400 bg-emerald-950/60 border-emerald-800/60' : 'text-amber-400 bg-amber-950/60 border-amber-800/60'
    }
  };
}
