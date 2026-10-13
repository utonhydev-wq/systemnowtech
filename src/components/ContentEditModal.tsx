import React, { useState, useEffect } from 'react';
import { X, Save, Calendar, Sparkles } from 'lucide-react';
import { ContentItem, ContentStatus, ContentFormat, FunnelStage, ContentType, EventCategory } from '../types/marketing';

interface ContentEditModalProps {
  initialItem?: ContentItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: ContentItem) => void;
}

export const ContentEditModal: React.FC<ContentEditModalProps> = ({
  initialItem,
  isOpen,
  onClose,
  onSave,
}) => {
  if (!isOpen) return null;

  const [date, setDate] = useState(initialItem?.date || '2027-01-01');
  const [theme, setTheme] = useState(initialItem?.theme || '');
  const [format, setFormat] = useState<ContentFormat>(initialItem?.format || 'Post');
  const [holiday, setHoliday] = useState(initialItem?.holiday || '');
  const [category, setCategory] = useState<EventCategory>(initialItem?.category || 'Publicação de marketing');
  const [targetPeriod, setTargetPeriod] = useState<'HISTORICO_2026' | 'PLANEJAMENTO_2027' | 'FUTUROS'>(
    initialItem?.targetPeriod || (initialItem?.date?.startsWith('2026') ? 'HISTORICO_2026' : initialItem?.date?.startsWith('2027') ? 'PLANEJAMENTO_2027' : 'PLANEJAMENTO_2027')
  );
  const [source, setSource] = useState(initialItem?.source || '');
  const [legalReference, setLegalReference] = useState(initialItem?.legalReference || '');
  const [responsible, setResponsible] = useState(initialItem?.responsible || 'Williams Antonio (Marketing)');
  const [campaign, setCampaign] = useState(initialItem?.campaign || '2027 começa com economia.');
  const [objective, setObjective] = useState(initialItem?.objective || 'Educação do público & autoridade');
  const [funnelStage, setFunnelStage] = useState<FunnelStage>(initialItem?.funnelStage || 'Educação');
  const [contentType, setContentType] = useState<ContentType>(initialItem?.contentType || 'Educativo');
  const [contentIdea, setContentIdea] = useState(initialItem?.contentIdea || '');
  const [caption, setCaption] = useState(initialItem?.caption || '');
  const [cta, setCta] = useState(initialItem?.cta || '');
  const [status, setStatus] = useState<ContentStatus>(initialItem?.status || 'PLANEJADO');
  const [suggestedTime, setSuggestedTime] = useState(initialItem?.suggestedTime || '12:00');
  const [notes, setNotes] = useState(initialItem?.notes || '');
  const [visualBrief, setVisualBrief] = useState(initialItem?.visualBrief || '');

  // Auto calculate day of week, month and year
  const getDayDetails = (dateStr: string) => {
    const [y, m, d] = dateStr.split('-').map(Number);
    const dateObj = new Date(y, m - 1, d);
    const days = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    const months: Record<number, string> = {
      1: 'Janeiro',
      2: 'Fevereiro',
      3: 'Março',
      4: 'Abril',
      5: 'Maio',
      6: 'Junho',
      7: 'Julho',
      8: 'Agosto',
      9: 'Setembro',
      10: 'Outubro',
      11: 'Novembro',
      12: 'Dezembro',
    };
    return {
      dayOfWeek: days[dateObj.getDay()] || 'Segunda-feira',
      month: months[m] || 'Janeiro',
      year: y || 2027,
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { dayOfWeek, month, year } = getDayDetails(date);

    // Auto classify period if not explicitly changed
    const effectivePeriod = 
      targetPeriod || (year === 2026 ? 'HISTORICO_2026' : year === 2027 ? 'PLANEJAMENTO_2027' : 'FUTUROS');

    const updatedItem: ContentItem = {
      id: initialItem?.id || `nt-${date}-${Date.now().toString().slice(-4)}`,
      date,
      dayOfWeek,
      month,
      year,
      targetPeriod: effectivePeriod,
      category,
      source: source.trim() ? source.trim() : undefined,
      legalReference: legalReference.trim() ? legalReference.trim() : undefined,
      responsible: responsible.trim() ? responsible.trim() : undefined,
      holiday: holiday.trim() ? holiday.trim() : null,
      campaign,
      theme,
      format,
      objective,
      funnelStage,
      contentType,
      contentIdea,
      caption,
      cta,
      channels: ['Instagram', 'Facebook', 'LinkedIn'],
      status,
      suggestedTime,
      notes,
      visualBrief,
    };

    onSave(updatedItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            {initialItem ? 'Editar Planejamento' : 'Criar Novo Conteúdo Estratégico'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
          {/* Row 1: Date, suggested time, status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-400 text-xs mb-1">Data (AAAA-MM-DD) *</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-amber-400 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-400 text-xs mb-1">Horário Sugerido</label>
              <input
                type="text"
                value={suggestedTime}
                placeholder="ex: 12:00, 18:30"
                onChange={(e) => setSuggestedTime(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-amber-400 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-400 text-xs mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ContentStatus)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-amber-400"
              >
                <option value="IDEIA">IDEIA</option>
                <option value="PLANEJADO">PLANEJADO</option>
                <option value="EM PRODUÇÃO">EM PRODUÇÃO</option>
                <option value="APROVADO">APROVADO</option>
                <option value="PUBLICADO">PUBLICADO</option>
              </select>
            </div>
          </div>

          {/* Row 2: Categoria, Período, Responsável */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-400 text-xs mb-1">Categoria Obrigatória *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as EventCategory)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-amber-400"
              >
                <option value="Publicação de marketing">Publicação de marketing</option>
                <option value="Campanha comercial">Campanha comercial</option>
                <option value="Feriado municipal">Feriado municipal (Jaboatão)</option>
                <option value="Feriado estadual">Feriado estadual (PE)</option>
                <option value="Feriado nacional">Feriado nacional (Brasil)</option>
                <option value="Ponto facultativo">Ponto facultativo</option>
                <option value="Data comemorativa">Data comemorativa</option>
                <option value="Aniversário de funcionário">Aniversário de funcionário</option>
                <option value="Evento interno">Evento interno</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 text-xs mb-1">Período Estratégico</label>
              <select
                value={targetPeriod}
                onChange={(e) => setTargetPeriod(e.target.value as 'HISTORICO_2026' | 'PLANEJAMENTO_2027' | 'FUTUROS')}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-amber-400"
              >
                <option value="PLANEJAMENTO_2027">Planejamento de 2027</option>
                <option value="HISTORICO_2026">Histórico de 2026</option>
                <option value="FUTUROS">Próximos anos (2028+)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 text-xs mb-1">Responsável pela Execução</label>
              <input
                type="text"
                value={responsible}
                placeholder="ex: Williams Antonio (Marketing)"
                onChange={(e) => setResponsible(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Row 3: Theme / Title */}
          <div>
            <label className="block text-slate-400 text-xs mb-1">Tema / Pauta do Conteúdo *</label>
            <input
              type="text"
              required
              value={theme}
              placeholder="ex: Quanto você gasta com energia durante um ano? Faça as contas!"
              onChange={(e) => setTheme(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400 text-sm font-medium"
            />
          </div>

          {/* Row 4: Holiday, Campaign, Source, Legal Reference */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="block text-slate-400 text-xs mb-1">Data Comemorativa / Feriado</label>
              <input
                type="text"
                value={holiday}
                placeholder="ex: Santo Amaro, Black Friday..."
                onChange={(e) => setHoliday(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-slate-400 text-xs mb-1">Campanha Vinculada</label>
              <input
                type="text"
                value={campaign}
                placeholder="ex: 2027 começa com economia."
                onChange={(e) => setCampaign(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-slate-400 text-xs mb-1">Fonte / Origem</label>
              <input
                type="text"
                value={source}
                placeholder="ex: Prefeitura de Jaboatão"
                onChange={(e) => setSource(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-slate-400 text-xs mb-1">Base Legal</label>
              <input
                type="text"
                value={legalReference}
                placeholder="ex: Lei Municipal nº 1.247/2015"
                onChange={(e) => setLegalReference(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-amber-400 font-mono text-xs"
              />
            </div>
          </div>

          {/* Row 4: Format, Funnel Stage, Content Type */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-400 text-xs mb-1">Formato</label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as ContentFormat)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-amber-400"
              >
                <option value="Reels">Reels</option>
                <option value="Carrossel">Carrossel</option>
                <option value="Post">Post (Estático)</option>
                <option value="Stories">Stories</option>
                <option value="WhatsApp">WhatsApp</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 text-xs mb-1">Etapa do Funil</label>
              <select
                value={funnelStage}
                onChange={(e) => setFunnelStage(e.target.value as FunnelStage)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-amber-400"
              >
                <option value="Atração">Atração (Novos Públicos)</option>
                <option value="Educação">Educação (Didático Solar)</option>
                <option value="Conversão">Conversão (Vendas/Leads)</option>
                <option value="Relacionamento">Relacionamento (Marca)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 text-xs mb-1">Tipo de Conteúdo</label>
              <select
                value={contentType}
                onChange={(e) => setContentType(e.target.value as ContentType)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-amber-400"
              >
                <option value="Educativo">Educativo</option>
                <option value="Comercial">Comercial</option>
                <option value="Relacionamento">Relacionamento</option>
                <option value="Institucional">Institucional</option>
              </select>
            </div>
          </div>

          {/* Row 5: Objetivo & Ideia */}
          <div>
            <label className="block text-slate-400 text-xs mb-1">Objetivo Estratégico</label>
            <input
              type="text"
              value={objective}
              placeholder="ex: Geração de orçamentos, Autoridade técnica..."
              onChange={(e) => setObjective(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-slate-400 text-xs mb-1">Ideia do Conteúdo / Roteiro</label>
            <textarea
              rows={3}
              value={contentIdea}
              placeholder="Descreva a dinâmica do vídeo ou estrutura das lâminas do carrossel..."
              onChange={(e) => setContentIdea(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-400 text-xs leading-relaxed"
            />
          </div>

          {/* Row 6: Legenda Sugerida */}
          <div>
            <label className="block text-slate-400 text-xs mb-1">Legenda Sugerida Completa (com Hashtags)</label>
            <textarea
              rows={4}
              value={caption}
              placeholder="Texto completo para a legenda do post..."
              onChange={(e) => setCaption(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-400 text-xs leading-relaxed"
            />
          </div>

          {/* Row 7: CTA */}
          <div>
            <label className="block text-slate-400 text-xs mb-1">Chamada para Ação (CTA)</label>
            <input
              type="text"
              value={cta}
              placeholder="ex: Clique no link da bio e faça sua simulação sem compromisso!"
              onChange={(e) => setCta(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Row 8: Orientações de Design e Observações */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 text-xs mb-1">Briefing Visual (Design / Vídeo)</label>
              <textarea
                rows={2}
                value={visualBrief}
                placeholder="Orientações de cores, tomadas, fotos..."
                onChange={(e) => setVisualBrief(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-amber-400 text-xs"
              />
            </div>
            <div>
              <label className="block text-slate-400 text-xs mb-1">Observações da Equipe</label>
              <textarea
                rows={2}
                value={notes}
                placeholder="Orientações operacionais para o time..."
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-amber-400 text-xs"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors shadow-sm shadow-amber-500/20"
            >
              <Save className="w-4 h-4" />
              <span>Salvar no Calendário</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
