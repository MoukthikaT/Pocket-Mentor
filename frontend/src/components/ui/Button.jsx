import React from 'react';

export function Button({
  children,
  variant = 'primary', // primary | secondary | cyan | accent | outline | text | danger
  size = 'md', // sm | md | lg
  className = '',
  icon: Icon,
  loading = false,
  disabled = false,
  type = 'button',
  onClick,
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none';
  
  const variants = {
    primary: 'bg-gradient-to-r from-[#218DAE] to-[#1B7692] text-white shadow-md shadow-[#218DAE]/20 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#218DAE]/30 focus:ring-2 focus:ring-[#2BBBD7]',
    secondary: 'border border-slate-200 bg-white text-slate-700 shadow-sm hover:-translate-y-0.5 hover:border-[#2BBBD7]/40 hover:bg-[#2BBBD7]/5 hover:text-[#218DAE] focus:ring-2 focus:ring-[#2BBBD7]/30',
    cyan: 'bg-[#2BBBD7] text-white shadow-md shadow-[#2BBBD7]/25 hover:-translate-y-0.5 hover:bg-[#1AA1BD] focus:ring-2 focus:ring-[#2BBBD7]',
    accent: 'bg-gradient-to-r from-[#FFD758] to-[#FCE59A] text-slate-900 font-bold shadow-gold hover:-translate-y-0.5 hover:shadow-lg focus:ring-2 focus:ring-[#FFD758]/50',
    outline: 'border-2 border-[#218DAE] text-[#218DAE] hover:bg-[#218DAE] hover:text-white focus:ring-2 focus:ring-[#218DAE]',
    text: 'text-slate-600 hover:text-[#218DAE] hover:bg-slate-100/60',
    danger: 'bg-rose-600 text-white shadow-sm hover:bg-rose-700 hover:-translate-y-0.5 focus:ring-2 focus:ring-rose-500',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 rounded-lg gap-1.5',
    md: 'text-sm px-4 py-2.5 rounded-xl gap-2',
    lg: 'text-base px-6 py-3.5 rounded-xl gap-2.5 font-bold',
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : Icon ? (
        <Icon className={size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'} />
      ) : null}
      {children}
    </button>
  );
}

export default Button;
