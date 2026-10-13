import React from 'react';

interface NowTechLogoProps {
  className?: string;
  variant?: 'full' | 'compact' | 'icon';
  size?: 'sm' | 'md' | 'lg';
}

export const NowTechLogo: React.FC<NowTechLogoProps> = ({
  className = '',
  variant = 'full',
  size = 'md',
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-2xl',
  };

  const subTextSizes = {
    sm: 'text-[9px]',
    md: 'text-[11px]',
    lg: 'text-xs',
  };

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Solar Crest Symbol */}
      <div
        className={`${iconSizes[size]} relative flex items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 shadow-md shadow-amber-500/25 shrink-0 overflow-hidden group`}
      >
        {/* Subtle photovoltaic grid pattern in background */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:4px_4px]" />
        
        {/* Vector Solar Geometry */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5 text-slate-950 relative z-10"
        >
          {/* Central sun core */}
          <circle cx="12" cy="12" r="4.2" fill="currentColor" />
          
          {/* Photovoltaic ray facets */}
          <path
            d="M12 2V5M12 19V22M2 12H5M19 12H22M4.93 4.93L7.05 7.05M16.95 16.95L19.07 19.07M4.93 19.07L7.05 16.95M16.95 7.05L19.07 4.93"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          {/* Energy core beam */}
          <circle cx="12" cy="12" r="1.8" fill="#FFF" opacity="0.9" />
        </svg>
      </div>

      {/* Brand Typography */}
      {variant !== 'icon' && (
        <div className="flex flex-col text-left">
          <div className={`font-extrabold tracking-tight text-slate-900 dark:text-white leading-none ${textSizes[size]}`}>
            <span>NowTech</span>
            <span className="text-amber-500 dark:text-amber-400 ml-1">SOLAR</span>
          </div>
          {variant === 'full' && (
            <span
              className={`font-semibold tracking-wider uppercase text-slate-500 dark:text-slate-400 font-mono mt-0.5 ${subTextSizes[size]}`}
            >
              Energia Fotovoltaica
            </span>
          )}
        </div>
      )}
    </div>
  );
};
