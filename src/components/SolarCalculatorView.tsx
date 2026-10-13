import React, { useState } from 'react';
import { 
  Calculator, 
  Sun, 
  TrendingDown, 
  Zap, 
  TreePine, 
  Copy, 
  Check, 
  Sparkles,
  MapPin,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';

export const SolarCalculatorView: React.FC = () => {
  const [billValue, setBillValue] = useState<number>(850);
  const [city, setCity] = useState<string>('Recife');
  const [propertyType, setPropertyType] = useState<'Residencial' | 'Comercial'>('Residencial');
  const [copiedText, setCopiedText] = useState(false);

  // Tarifa média em Pernambuco (Neoenergia PE): ~R$ 0,98 / kWh
  const tariff = 0.98;
  const estimatedKwh = Math.round(billValue / tariff);
  
  // Taxa mínima da concessionária (iluminação e disponibilidade monofásica/bifásica/trifásica)
  const minimumFee = propertyType === 'Residencial' ? 65 : 120;
  
  // Economia mensal líquida
  const monthlySavings = Math.max(0, billValue - minimumFee);
  const annualSavings = monthlySavings * 12;
  
  // Economia acumulada em 5 e 25 anos com projeção conservadora de reajuste de 4% a.a.
  const savings5Years = Math.round(annualSavings * 5.4);
  const savings25Years = Math.round(annualSavings * 38.5);

  // Dimensionamento do sistema
  // Irradiação média em Pernambuco: ~5,2 horas de sol pico por dia
  const peakSunHours = city === 'Petrolina' ? 5.8 : city === 'Caruaru' ? 5.4 : 5.1;
  const dailyKwh = estimatedKwh / 30;
  const requiredKwp = Number(((dailyKwh / peakSunHours) * 1.25).toFixed(2));
  const panelCount = Math.max(4, Math.ceil((requiredKwp * 1000) / 580)); // módulos de 580W

  // Benefício ambiental
  const treesEquivalent = Math.round((estimatedKwh * 12 * 0.084) / 10);
  const co2AvoidedTons = ((estimatedKwh * 12 * 0.09) / 1000).toFixed(1);

  // Gerador de copy para o post
  const generatedCopySnippet = `💡 DADOS REAIS PARA SUA POSTAGEM EM PERNAMBUCO (${city}):
📍 Imóvel: ${propertyType}
📉 Conta atual: R$ ${billValue.toLocaleString('pt-BR')},00/mês (~${estimatedKwh} kWh)
✅ Nova fatura estimada com NowTech: apenas a taxa de R$ ${minimumFee.toLocaleString('pt-BR')},00
💰 Economia no 1º ano: R$ ${annualSavings.toLocaleString('pt-BR')},00 direto no bolso!
🛡️ Economia acumulada em 25 anos: mais de R$ ${savings25Years.toLocaleString('pt-BR')},00
🌱 Impacto verde: equivale a ${treesEquivalent} árvores plantadas e ${co2AvoidedTons} toneladas de CO2 a menos no nosso estado!
⚡ Sistema ideal: cerca de ${panelCount} módulos de alta eficiência (~${requiredKwp} kWp).`;

  const handleCopySnippet = () => {
    navigator.clipboard.writeText(generatedCopySnippet);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
            <Calculator className="w-3.5 h-3.5" />
            Ferramenta de Apoio ao Planejamento
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Simulador de Números Reais para Copys e Posts
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Gere dados autênticos de economia e dimensionamento fotovoltaico para enriquecer as legendas, roteiros de Reels e conversas comerciais da NowTech Solar.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Input Form */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-5">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Sun className="w-4 h-4 text-amber-400" />
            Parâmetros da Simulação
          </h3>

          {/* Valor da conta */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <label className="text-slate-300 font-medium">Valor Médio da Fatura:</label>
              <span className="font-mono font-bold text-amber-400 text-sm">
                R$ {billValue.toLocaleString('pt-BR')},00
              </span>
            </div>
            <input
              type="range"
              min={300}
              max={15000}
              step={50}
              value={billValue}
              onChange={(e) => setBillValue(Number(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-500 font-mono">
              <span>R$ 300</span>
              <span>R$ 5.000</span>
              <span>R$ 15.000</span>
            </div>
          </div>

          {/* Cidade em Pernambuco */}
          <div className="space-y-1.5 text-xs">
            <label className="text-slate-300 font-medium">Região em Pernambuco:</label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-amber-400"
            >
              <option value="Recife">Recife e RMR (Litoral)</option>
              <option value="Caruaru">Caruaru e Agreste</option>
              <option value="Petrolina">Petrolina e Sertão (Alto Sol)</option>
              <option value="Olinda">Olinda / Paulista</option>
              <option value="Garanhuns">Garanhuns (Clima Serrano)</option>
            </select>
          </div>

          {/* Tipo de imóvel */}
          <div className="space-y-1.5 text-xs">
            <label className="text-slate-300 font-medium">Tipo de Imóvel:</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPropertyType('Residencial')}
                className={`py-2 text-xs font-semibold rounded-lg border transition-colors ${
                  propertyType === 'Residencial'
                    ? 'bg-amber-400/10 border-amber-500 text-amber-400'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Residencial
              </button>
              <button
                type="button"
                onClick={() => setPropertyType('Comercial')}
                className={`py-2 text-xs font-semibold rounded-lg border transition-colors ${
                  propertyType === 'Comercial'
                    ? 'bg-amber-400/10 border-amber-500 text-amber-400'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Comercial (B2B)
              </button>
            </div>
          </div>

          {/* Preset Buttons */}
          <div className="pt-2 border-t border-slate-800 space-y-1.5">
            <span className="block text-[11px] text-slate-400 uppercase font-semibold">
              Casos Rápidos Prontos:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {[
                { label: 'Casa R$ 500', val: 500, type: 'Residencial' },
                { label: 'Família R$ 1.200', val: 1200, type: 'Residencial' },
                { label: 'Padaria R$ 3.500', val: 3500, type: 'Comercial' },
                { label: 'Clínica R$ 7.000', val: 7000, type: 'Comercial' },
              ].map((p) => (
                <button
                  key={p.label}
                  onClick={() => {
                    setBillValue(p.val);
                    setPropertyType(p.type as 'Residencial' | 'Comercial');
                  }}
                  className="px-2 py-1 text-[11px] bg-slate-950 border border-slate-800 hover:border-amber-400 text-slate-300 rounded"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right 2 Columns: Results & Generated Copy */}
        <div className="lg:col-span-2 space-y-5">
          {/* Key Metric Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
              <span className="text-[11px] text-slate-400 uppercase font-semibold">Economia Mensal</span>
              <div className="text-xl font-bold font-mono text-emerald-400 mt-1">
                R$ {monthlySavings.toLocaleString('pt-BR')}
              </div>
              <span className="text-[10px] text-slate-400">Todo mês sem boleto</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
              <span className="text-[11px] text-slate-400 uppercase font-semibold">Economia no 1º Ano</span>
              <div className="text-xl font-bold font-mono text-amber-400 mt-1">
                R$ {annualSavings.toLocaleString('pt-BR')}
              </div>
              <span className="text-[10px] text-slate-400">Em 12 faturas</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
              <span className="text-[11px] text-slate-400 uppercase font-semibold">Módulos Estimados</span>
              <div className="text-xl font-bold font-mono text-sky-400 mt-1">
                {panelCount} Placas
              </div>
              <span className="text-[10px] text-slate-400 font-mono">~{requiredKwp} kWp de potência</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
              <span className="text-[11px] text-slate-400 uppercase font-semibold">Árvores Salvas</span>
              <div className="text-xl font-bold font-mono text-emerald-400 mt-1">
                {treesEquivalent} Árvores
              </div>
              <span className="text-[10px] text-slate-400">Impacto verde anual</span>
            </div>
          </div>

          {/* Accumulated Long-Term Vision */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
              Projeção Acumulada de Retorno Financeiro
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-850 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 block text-[11px]">Economia em 5 Anos:</span>
                  <span className="text-base font-bold font-mono text-white">
                    R$ {savings5Years.toLocaleString('pt-BR')},00
                  </span>
                </div>
                <span className="text-[11px] text-amber-400 font-semibold bg-amber-400/10 px-2 py-0.5 rounded">
                  Payback Concluído
                </span>
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-850 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 block text-[11px]">Economia em 25 Anos (Garantia):</span>
                  <span className="text-base font-bold font-mono text-emerald-400">
                    R$ {savings25Years.toLocaleString('pt-BR')},00
                  </span>
                </div>
                <span className="text-[11px] text-emerald-400 font-semibold bg-emerald-400/10 px-2 py-0.5 rounded">
                  Patrimônio Próprio
                </span>
              </div>
            </div>
          </div>

          {/* Copy Snippet Generator */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Trecho Pronto para Colar no Roteiro ou Legenda
              </h4>
              <button
                onClick={handleCopySnippet}
                className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-md transition-colors"
              >
                {copiedText ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-950" />
                    <span>Copiado com Sucesso!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar Trecho</span>
                  </>
                )}
              </button>
            </div>

            <pre className="bg-slate-950 border border-slate-850 p-3.5 rounded-lg text-xs text-slate-300 font-mono whitespace-pre-wrap leading-relaxed select-all">
              {generatedCopySnippet}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
