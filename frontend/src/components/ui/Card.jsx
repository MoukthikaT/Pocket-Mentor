import React from 'react';

export function Card({
  children,
  className = '',
  hoverEffect = true,
  glass = false,
  bordered = true,
  onClick,
  ...props
}) {
  return (
    <div
      onClick={onClick}
      className={`
        rounded-2xl p-6 transition-all duration-300
        ${glass ? 'bg-white/80 backdrop-blur-xl border border-white/80 shadow-card' : 'bg-white shadow-card'}
        ${bordered && !glass ? 'border border-slate-100' : ''}
        ${hoverEffect ? 'hover:shadow-card-hover hover:-translate-y-1' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }) {
  return <div className={`flex items-center justify-between pb-4 mb-4 border-b border-slate-100 ${className}`}>{children}</div>;
}

export function CardTitle({ children, className = '', subtitle }) {
  return (
    <div>
      <h3 className={`font-display text-lg font-bold text-slate-900 ${className}`}>{children}</h3>
      {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
    </div>
  );
}

export default Card;
