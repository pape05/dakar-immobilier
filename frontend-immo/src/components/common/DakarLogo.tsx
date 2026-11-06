import { Link } from 'react-router-dom';
import logoImage from '../../assets/logo-dakar-immobilier.png';

interface DakarLogoProps {
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
}

const sizeMap = {
  sm: 'h-7 sm:h-8',
  md: 'h-9 sm:h-10',
  lg: 'h-11 sm:h-12',
  xl: 'h-14 sm:h-16',
  '2xl': 'h-28 sm:h-32',
};

const DakarLogo = ({ variant = 'dark', size = 'md', className = '' }: DakarLogoProps) => {
  return (
    <Link to="/" className="group inline-flex shrink-0">
      <img
        src={logoImage}
        alt="Dakar Immobilier"
        className={`${sizeMap[size]} w-auto object-contain transition-transform duration-300 group-hover:scale-[1.03] ${
          variant === 'light' ? 'drop-shadow-[0_1px_3px_rgba(199,148,87,0.4)]' : ''
        } ${className}`}
      />
    </Link>
  );
};

export default DakarLogo;
