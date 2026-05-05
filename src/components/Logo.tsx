

import { useState } from 'react';
import logo from '../logo.png';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function Logo({ className = '', size = 'md' }: LogoProps) {
  const sizes = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-48 h-48'
  };

  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  return (
    <div className={`${sizes[size]} ${className} relative flex items-center justify-center overflow-hidden`}>
      {!error && (
        <img 
          src={logo} 
          alt="UCsmile Logo" 
          onLoad={() => setLoading(false)}
          onError={() => { setError(true); setLoading(false); }}
          className={`w-full h-full object-contain mix-blend-multiply filter contrast-[1.1] brightness-[1.05] transition-opacity duration-300 ${loading ? 'opacity-0' : 'opacity-100'}`}
          referrerPolicy="no-referrer"
        />
      )}
      {(error || (loading && !logo)) && (
        <div className="absolute inset-0 bg-brand-primary/10 rounded-full flex items-center justify-center border border-brand-primary/20">
          <span className="text-brand-primary font-black text-[10px] sm:text-xs">UC</span>
        </div>
      )}
    </div>
  );
}
