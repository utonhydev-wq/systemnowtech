import React from 'react';
import { X, Download, Share, PlusSquare, Smartphone, CheckCircle2, ArrowRight } from 'lucide-react';
import { NowTechLogo } from './NowTechLogo';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  isIOS: boolean;
  onInstallAndroid: () => void;
  canInstallDirect: boolean;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({
  isOpen,
  onClose,
  isIOS,
  onInstallAndroid,
  canInstallDirect,
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-sm p-0 sm:p-4 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="w-full sm:max-w-md bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <NowTechLogo size="sm" variant="icon" />
            <div>
              <h3 className="text-base font-bold text-white leading-tight">Instalar NowTech Solar</h3>
              <p className="text-xs text-slate-400">Aplicativo Oficial para Colaboradores</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Benefits cards */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span className="text-slate-300">Acesso rápido direto da tela inicial</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span className="text-slate-300">Modo app sem barras de navegador</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
            <span className="text-slate-300">Navegação offline do calendário</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <span className="text-slate-300">Carregamento instantâneo e leve</span>
          </div>
        </div>

        {/* Instructions depending on platform */}
        {isIOS ? (
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
              <Smartphone className="w-4 h-4" />
              <span>Instalação no iPhone / iPad (Safari)</span>
            </div>

            <ol className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-950/50 border border-slate-800/80">
                <span className="w-5 h-5 rounded-full bg-amber-400/20 text-amber-300 font-bold flex items-center justify-center shrink-0 text-[11px]">
                  1
                </span>
                <div className="flex-1">
                  Toque no botão <strong>Compartilhar</strong> <Share className="w-3.5 h-3.5 inline mx-1 text-sky-400" /> na barra inferior do Safari.
                </div>
              </li>
              <li className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-950/50 border border-slate-800/80">
                <span className="w-5 h-5 rounded-full bg-amber-400/20 text-amber-300 font-bold flex items-center justify-center shrink-0 text-[11px]">
                  2
                </span>
                <div className="flex-1">
                  Role a lista para baixo e toque em <strong>"Adicionar à Tela de Início"</strong> <PlusSquare className="w-3.5 h-3.5 inline mx-1 text-emerald-400" />.
                </div>
              </li>
              <li className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-950/50 border border-slate-800/80">
                <span className="w-5 h-5 rounded-full bg-amber-400/20 text-amber-300 font-bold flex items-center justify-center shrink-0 text-[11px]">
                  3
                </span>
                <div className="flex-1">
                  Toque em <strong>"Adicionar"</strong> no canto superior direito. Pronto! O ícone da NowTech Solar estará no seu celular.
                </div>
              </li>
            </ol>

            <button
              onClick={onClose}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors min-h-[44px]"
            >
              Entendi, obrigado!
            </button>
          </div>
        ) : (
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
              <Smartphone className="w-4 h-4" />
              <span>Instalação no Android / Chrome</span>
            </div>

            {canInstallDirect ? (
              <button
                onClick={() => {
                  onInstallAndroid();
                  onClose();
                }}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 min-h-[48px]"
              >
                <Download className="w-4 h-4 stroke-[2.5]" />
                <span>Instalar Aplicativo Agora</span>
              </button>
            ) : (
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 space-y-1.5">
                <p>
                  No seu navegador, abra o menu (<strong>três pontinhos ⋮</strong> no canto superior direito) e selecione:
                </p>
                <p className="font-semibold text-amber-300">
                  📲 "Instalar aplicativo" ou "Adicionar à tela inicial"
                </p>
              </div>
            )}

            <button
              onClick={onClose}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors min-h-[44px]"
            >
              Fechar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
