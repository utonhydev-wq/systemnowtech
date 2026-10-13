import { WhatsAppCampaignTemplate } from '../types/marketing';

export const whatsappCampaigns: WhatsAppCampaignTemplate[] = [
  {
    id: 'wa-1-simulacao',
    title: 'Simulação Rápida de Economia Solar',
    category: 'Conversão / Captação',
    targetAudience: 'Leads frios ou contatos que baixaram e-book / interagiram nas redes sociais',
    objective: 'Fazer o lead enviar a foto da conta de luz para gerar proposta personalizada',
    triggerEvent: 'Primeiro contato ou reativação de base',
    messageText: `Olá, [Nome]! Tudo bem? Aqui é o [Consultor], especialista da NowTech Solar. ☀️

Vi que você tem interesse em diminuir os custos com energia elétrica aqui em Pernambuco.

Sabia que em menos de 10 minutos nossa engenharia consegue simular exatamente quantos reais você pode economizar todo mês gerando sua própria energia?

📸 Basta me enviar uma foto ou PDF da sua conta de luz mais recente (pode cobrir seus dados pessoais se preferir).

Podemos fazer sua simulação gratuita agora mesmo?`,
    recommendedCta: 'Responder com a foto da conta de luz'
  },
  {
    id: 'wa-2-orcamento-express',
    title: 'Orçamento Personalizado Sem Compromisso',
    category: 'Conversão Direta',
    targetAudience: 'Leads mornos que solicitaram contato pelo formulário ou direct',
    objective: 'Agendar ligação explicativa e apresentar projeto dimensionado',
    triggerEvent: 'Lead preencheu formulário no site ou Instagram',
    messageText: `Olá, [Nome]! Muito obrigado pelo seu contato com a NowTech Solar! 🚀

Já calculamos a média de irradiação solar para a sua região e preparamos uma pré-análise do seu potencial de geração fotovoltaica.

Com a NowTech você tem:
✅ Painéis solares de alta eficiência com garantia de até 25 anos
✅ Engenharia própria e homologação 100% cuidada por nós
✅ Economia de até 95% na sua fatura todo mês

Qual o melhor horário para uma ligação rápida de 3 minutos hoje: pela manhã ou no início da tarde?`,
    recommendedCta: 'Informar melhor horário para contato'
  },
  {
    id: 'wa-3-aquecimento-bf',
    title: 'Lista VIP — Aquecimento Black Friday Solar',
    category: 'Black Friday (Fase 1 e 2)',
    targetAudience: 'Base de leads dos últimos 6 meses que não fecharam por questão de preço ou momento',
    objective: 'Gerar senso de exclusividade e antecipar negociações',
    triggerEvent: 'Disparo entre 16/11 e 24/11/2026',
    messageText: `[Nome], notícia exclusiva em primeira mão da NowTech Solar! ⚡

Estamos preparando a maior **BLACK FRIDAY SOLAR** da nossa história para o dia 27/11, e abrimos uma Lista VIP com vagas limitadas.

Quem estiver na lista terá:
⭐ Acesso antecipado aos kits solares com desconto direto de fábrica
⭐ Condições de financiamento exclusivas com carência estendida
⭐ Homologação prioritária na concessionária

Quer garantir seu nome na Lista VIP antes de liberarmos para o público geral? Responda com "QUERO VIP". ☀️`,
    recommendedCta: 'Responder "QUERO VIP"'
  },
  {
    id: 'wa-4-bf-oficial',
    title: 'BLACK FRIDAY OFICIAL — Chegou o Grande Dia',
    category: 'Black Friday (Fase 3)',
    targetAudience: 'Toda a base de clientes potenciais e Lista VIP',
    objective: 'Conversão imediata com gatilho de oportunidade única do ano',
    triggerEvent: 'Disparo em 27/11/2026 às 08h30',
    messageText: `🚨 CHEGOU O MOMENTO: BLACK FRIDAY NOWTECH SOLAR É HOJE! 🚨

Olá, [Nome]! As condições mais vantajosas de 2026 acabaram de ser liberadas no nosso sistema:

🔥 Descontos especiais na aquisição do sistema completo
🔥 Parcelas que cabem no valor que você já gasta na conta de luz atual
🔥 Sistema de monitoramento digital pelo smartphone gratuito

Atenção: o lote promocional é limitado pela cota de inversores disponíveis.

👉 Me dê um "OK" aqui para eu calcular seu projeto com o desconto da Black Friday aplicado agora!`,
    recommendedCta: 'Responder "OK" para cálculo com desconto'
  },
  {
    id: 'wa-5-ultima-chance',
    title: 'Última Oportunidade / Cyber Monday',
    category: 'Black Friday (Fase 4)',
    targetAudience: 'Contatos que receberam a oferta da Black Friday mas não finalizaram',
    objective: 'Resgate de última hora antes do fechamento das tabelas comerciais',
    triggerEvent: 'Disparo em 30/11/2026 (Cyber Monday)',
    messageText: `[Nome], passando para um aviso urgente! ⏳

Hoje é o último dia da nossa ação de Black Friday & Cyber Monday na NowTech Solar.

Às 23h59 o sistema volta aos valores normais de tabela e os lotes promocionais serão encerrados.

Se você ainda quer começar o próximo ano sem o peso da conta de luz alta, essa é literalmente sua última chance de travar a condição especial.

Podemos finalizar os detalhes da sua proposta agora à tarde?`,
    recommendedCta: 'Confirmar interesse para segurar a condição'
  },
  {
    id: 'wa-6-case-depoimento',
    title: 'Case de Sucesso: Prova Social da Sua Cidade',
    category: 'Autoridade & Nutrição',
    targetAudience: 'Leads em dúvida sobre retorno financeiro ou funcionamento',
    objective: 'Eliminar insegurança demonstrando o caso de um vizinho ou comércio local',
    triggerEvent: 'Disparo periódico de nutrição',
    messageText: `Olá, [Nome]! Veja que resultado incrível acabamos de documentar aqui em Pernambuco: 📊

O Seu Marcelo, empresário do comércio local, pagava em média R$ 2.400 de energia todo mês. 

Instalamos o sistema NowTech Solar em menos de 3 dias e na fatura seguinte a conta dele caiu para R$ 115! Uma economia anual de mais de R$ 27.000 direto no bolso dele.

💡 O seu imóvel tem exatamente o mesmo potencial de economia.

Gostaria de ver uma estimativa realista para a sua residência ou empresa?`,
    recommendedCta: 'Solicitar estimativa personalizada'
  },
  {
    id: 'wa-7-pos-venda-indicacao',
    title: 'Pós-Venda & Programa Amigo Solar',
    category: 'Relacionamento & Pós-Venda',
    targetAudience: 'Clientes com sistema já instalado e operando há 30 a 90 dias',
    objective: 'Validar satisfação do cliente e coletar indicações qualificadas (Member Get Member)',
    triggerEvent: 'Mensal pós-ativação do sistema',
    messageText: `Olá, [Nome]! Como está a geração do seu sistema solar NowTech este mês? ☀️

Esperamos que você esteja aproveitando a sensação de ver o relógio girando a seu favor e a conta vindo no valor mínimo!

Criamos uma campanha especial: se você indicar um amigo, parente ou vizinho que também fechar energia solar conosco, você recebe uma bonificação especial em dinheiro ou cashback!

Tem alguém na sua família ou trabalho que também reclama da conta de luz alta? Envie o contato dele por aqui que cuidaremos de tudo com o mesmo carinho que cuidamos de você!`,
    recommendedCta: 'Indicar contatos de amigos ou familiares'
  },
  {
    id: 'wa-8-2027-economia',
    title: 'Campanha: 2027 Começa com Economia',
    category: 'Campanha de Fim de Ano',
    targetAudience: 'Todos os clientes potenciais mapeados no segundo semestre',
    objective: 'Fechamento em dezembro para início de geração no Verão 2027',
    triggerEvent: 'Disparo entre 08/12 e 22/12/2026',
    messageText: `Olá, [Nome]! Dezembro chegou e todo mundo começa a traçar as metas para o ano novo. 🎯

Uma pergunta rápida: quanto você calcula que deixou na conta da concessionária de energia ao longo de todo o ano de 2026?

R$ 6.000? R$ 12.000? R$ 25.000?

Com a campanha **"2027 Começa com Economia"** da NowTech Solar, nós aprovamos o seu projeto ainda em dezembro para você iniciar o ano novo produzindo sua própria energia limpa e investindo esse dinheiro no que realmente importa.

Vamos colocar o sol para trabalhar para você em 2027? Me avise aqui para receber a proposta! ☀️`,
    recommendedCta: 'Receber proposta de fim de ano'
  }
];
