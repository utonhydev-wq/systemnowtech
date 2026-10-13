import { StoriesCadence } from '../types/marketing';

export const storiesWeeklyCadence: StoriesCadence[] = [
  {
    dayOfWeek: 'Segunda-feira',
    theme: 'Dica de Economia Inteligente',
    description: 'Começar a semana conscientizando sobre desperdício de energia elétrica em casa ou na empresa.',
    interactiveSticker: 'Slider de Reação (ex: "Quantos % sua conta subiu este ano?") ou Enquete de Sim/Não',
    bestTime: '07:30 - 09:00',
    exampleHook: 'Segunda-feira é dia de planejar os custos da semana. Você já reparou no consumo invisível do seu ar-condicionado?'
  },
  {
    dayOfWeek: 'Terça-feira',
    theme: 'Enquete & Termômetro de Conhecimento',
    description: 'Aquecer a audiência com dúvidas reais, mitos sobre energia solar e gerar respostas para a DM.',
    interactiveSticker: 'Enquete com 2 ou 4 opções + Caixa de Perguntas ("Qual sua maior dúvida sobre energia solar?")',
    bestTime: '12:00 - 13:30',
    exampleHook: 'Verdade ou Mito: quando o céu está nublado, o painel solar para de produzir energia?'
  },
  {
    dayOfWeek: 'Quarta-feira',
    theme: 'Curiosidade Tecnológica & Sustentável',
    description: 'Mostrar o poder da tecnologia fotovoltaica, dados do Nordeste e inovação de forma simples.',
    interactiveSticker: 'Quiz com resposta correta ("Quantos anos dura em média um painel solar NowTech?")',
    bestTime: '17:30 - 19:00',
    exampleHook: 'Você sabia que o Nordeste brasileiro tem uma das maiores médias de irradiação solar do planeta?'
  },
  {
    dayOfWeek: 'Quinta-feira',
    theme: 'Case Real / Antes & Depois / TBT de Obra',
    description: 'Apresentar prova social concreta de clientes reais em Pernambuco: conta antes R$ 1.200, conta depois taxa mínima.',
    interactiveSticker: 'Link direto para WhatsApp com mensagem pré-definida de simulação ou Slider de Fogo 🔥',
    bestTime: '11:45 - 13:15',
    exampleHook: 'Quinta de #TBT com essa instalação impecável em Caruaru! De R$ 850 para apenas a taxa básica de R$ 78. Veja os números:'
  },
  {
    dayOfWeek: 'Sexta-feira',
    theme: 'Oferta Comercial / CTA de Final de Semana',
    description: 'Geração direta de leads antes do final de semana. Fazer o seguidor dar o primeiro passo sem burocracia.',
    interactiveSticker: 'Figurinha de Link para WhatsApp ("Quero minha simulação sem compromisso")',
    bestTime: '16:00 - 18:30',
    exampleHook: 'Sextou com a melhor decisão financeira do seu ano: garanta seu estudo de viabilidade gratuito ainda hoje!'
  },
  {
    dayOfWeek: 'Sábado',
    theme: 'Bastidores & Equipe Técnica NowTech',
    description: 'Humanização da marca, técnicos certificados com EPIs em telhados, engenheiros revisando projetos.',
    interactiveSticker: 'Caixinha de apoio / Reação de Aplausos 👏',
    bestTime: '10:00 - 12:00',
    exampleHook: 'Nosso time de engenharia em campo hoje entregando mais um projeto homologado com padrão premium de segurança!'
  },
  {
    dayOfWeek: 'Domingo',
    theme: 'Sustentabilidade Leve & Mensagem Inspiradora',
    description: 'Conexão emocional, natureza, futuro dos filhos e a tranquilidade de quem não se preocupa com bandeira tarifária.',
    interactiveSticker: 'Enquete leve / Frase motivacional para compartilhar',
    bestTime: '18:00 - 20:30',
    exampleHook: 'Domingo é dia de curtir a casa com quem a gente ama, com o ar-condicionado ligado sem peso na consciência. ☀️🌱'
  }
];

export interface CampaignStorySpecial {
  phase: string;
  period: string;
  frequency: string;
  storySequence: string[];
}

export const campaignStoriesSpecials: CampaignStorySpecial[] = [
  {
    phase: 'Aquecimento Black Friday Solar (Fase 1)',
    period: '16/11 a 20/11/2026',
    frequency: '6 a 8 stories/dia',
    storySequence: [
      'Story 1: Teaser enigmático - "Algo histórico para a sua economia vai acontecer em novembro."',
      'Story 2: Enquete - "Quanto você pagou na sua última conta de luz?" (R$ 300 - R$ 700 / R$ 700 - R$ 1.500 / Acima de R$ 1.500)',
      'Story 3: Revelação do benefício - "Imagine trocar esse boleto por uma parcela que cabe no bolso e depois zerar o custo."',
      'Story 4: Contagem regressiva com figurinha nativa do Instagram para ativar lembrete.',
      'Story 5: Caixa de entrada para entrar no Grupo VIP do WhatsApp.'
    ]
  },
  {
    phase: 'Black Friday Oficial NowTech (Fase 3)',
    period: '27/11/2026',
    frequency: '12 a 15 stories ao longo do dia (Manhã, Almoço, Tarde, Noite)',
    storySequence: [
      'Story 1 (07h00): É HOJE! As condições mais agressivas do ano foram liberadas.',
      'Story 2 (09h00): Vídeo rápido da equipe comercial ao vivo com os atendimentos acelerados.',
      'Story 3 (11h30): Exemplo de projeto residencial com condição especial e brinde de monitoramento.',
      'Story 4 (14h00): Aviso de vagas limitadas para homologação com prazo garantido.',
      'Story 5 (17h00): Prova social de contratos fechados no dia.',
      'Story 6 (20h00): Alerta de últimas horas da Black Friday oficial.'
    ]
  },
  {
    phase: 'Campanha "2027 Começa com Economia"',
    period: '01/12 a 31/12/2026',
    frequency: '4 a 6 stories/dia',
    storySequence: [
      'Story 1: Retrospectiva dos gastos com energia do seguidor em 2026.',
      'Story 2: Comparativo: "R$ 10.000 jogados fora na conta da concessionária vs R$ 10.000 investidos no seu patrimônio."',
      'Story 3: Verão chegou: gráfico simples mostrando o pico de radiação solar no Nordeste em dezembro/janeiro.',
      'Story 4: CTA: Comece janeiro de 2027 com os primeiros créditos solares gerados.'
    ]
  }
];
