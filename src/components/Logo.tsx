

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

  return (
    <div className={`${sizes[size]} ${className} relative flex items-center justify-center`}>
      <img 
        src={logo} 
        alt="UCsmile Logo" 
        className="w-full h-full object-contain mix-blend-multiply filter contrast-[1.1] brightness-[1.05]"
        referrerPolicy="no-referrer"
      />
    </div>
  );
}
