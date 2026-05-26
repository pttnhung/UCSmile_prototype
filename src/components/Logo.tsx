import React, { useState } from 'react';
import logoImg from '../logo.png';

interface LogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'icon' | 'full';
}

export default function Logo({ className = '', size = 'md', variant = 'full' }: LogoProps) {
  const [hasError, setHasError] = useState(false);

  // Sizing heights for the logo
  const heights = {
    xs: 'h-6',
    sm: 'h-10',
    md: 'h-14 sm:h-16',
    lg: 'h-24',
    xl: 'h-36'
  };

  // Icon sizing for fallbacks
  const iconSizes = {
    xs: 'w-5 h-5',
    sm: 'w-7 h-7',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  // Text sizing for fallbacks
  const textSizes = {
    xs: 'text-xs tracking-wider',
    sm: 'text-sm tracking-wider',
    md: 'text-lg sm:text-xl tracking-widest',
    lg: 'text-2xl tracking-widest',
    xl: 'text-4xl tracking-widest'
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {!hasError && logoImg ? (
        <img 
          src={logoImg} 
          alt="UCSMILE Logo" 
          className={`${heights[size]} w-auto object-contain`}
          referrerPolicy="no-referrer"
          onError={() => setHasError(true)}
        />
      ) : (
        <div className="flex items-center gap-2">
          {/* Beaming smile sparkling tooth icon */}
          <svg 
            className={`${iconSizes[size]} text-[#FFB800]`} 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M7 10c.5-2 2.5-3.5 5-3.5s4.5 1.5 5 3.5" />
            <path d="M5 20c1.5-2.5 4-4 7-4s5.5 1.5 7 4" />
            <path d="M12 2v4" />
            <path d="M12 11v1" />
            <path d="m19 4-1.5 1.5" />
            <path d="m5 4 1.5 1.5" />
          </svg>
          {variant === 'full' && (
            <span className={`${textSizes[size]} font-serif font-black text-[#1a1c1e] uppercase`}>
              UC<span className="text-[#FFB800]">Smile</span>
            </span>
          )}
        </div>
      )}
    </div>
  );
}

