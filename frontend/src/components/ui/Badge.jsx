import React from 'react';

export function Badge({ children, variant = 'teal', icon: Icon, className = '' }) {
  const variants = {
    teal: 'bg-[#218DAE]/10 text-[#218DAE] border border-[#218DAE]/20',
    cyan: 'bg-[#2BBBD7]/10 text-[#14819A] border border-[#2BBBD7]/20',
    cream: 'bg-[#FCE59A]/40 text-[#7A5B00] border border-[#FCE59A]/80',
    yellow: 'bg-[#FFD758]/25 text-[#8A6700] border border-[#FFD758]/60 font-bold',
    slate: 'bg-slate-100 text-slate-700 border border-slate-200',
    rose: 'bg-rose-50 text-rose-700 border border-rose-200',
    emerald: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium tracking-tight ${variants[variant] || variants.teal} ${className}`}>
      {Icon && <Icon className="w-3.5 h-3.5" />}
      {children}
    </span>
  );
}

export default Badge;
