import logoImg from '../logo.png';

interface LogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'icon' | 'full';
}

export default function Logo({ className = '', size = 'md', variant = 'full' }: LogoProps) {
  // Sizing heights for the logo
  const heights = {
    xs: 'h-6',
    sm: 'h-10 sm:h-12',
    md: 'h-14 sm:h-18 md:h-22',
    lg: 'h-28',
    xl: 'h-44'
  };

  return (
    <div className={`flex items-center ${className}`}>
      <img 
        src={logoImg} 
        alt="UCSMILE Logo" 
        className={`${heights[size]} w-auto object-contain`}
        referrerPolicy="no-referrer"
      />
    </div>
  );
}

