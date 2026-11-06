import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'brown';
  isLoading?: boolean;
}

const Button = ({
  children,
  variant = 'primary',
  isLoading = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) => {
  const baseStyles = 'inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition duration-300 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50';

  const variantStyles = {
    primary: 'bg-emerald-500 text-zinc-950 hover:bg-emerald-400',
    secondary: 'bg-zinc-100 text-zinc-800 hover:bg-zinc-200',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    brown: 'bg-[#3b2418] text-white hover:bg-[#563522]',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Chargement...
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
