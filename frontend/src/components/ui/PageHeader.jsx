import React from 'react';

export function EmptyState({ icon: Icon, title, description, actionText, onAction, className = '' }) {
  return (
    <div className={`flex flex-col items-center justify-center p-8 md:p-12 text-center rounded-2xl border-2 border-dashed border-slate-200 bg-white/60 ${className}`}>
      {Icon && (
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#2BBBD7]/15 to-[#218DAE]/15 text-[#218DAE] flex items-center justify-center mb-4 shadow-sm">
          <Icon className="w-7 h-7" />
        </div>
      )}
      <h3 className="font-display text-lg font-bold text-slate-800 mb-1.5">{title}</h3>
      {description && <p className="text-sm text-slate-500 max-w-sm mb-6 leading-relaxed">{description}</p>}
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#218DAE] text-white text-sm font-semibold shadow-md hover:bg-[#1B7692] transition"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}

export function LoadingState({ message = 'Loading Pocket Mentor...' }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] p-8 text-center">
      <div className="relative flex items-center justify-center w-14 h-14 mb-4">
        <div className="absolute inset-0 rounded-full border-4 border-[#2BBBD7]/20 border-t-[#218DAE] animate-spin"></div>
        <div className="w-8 h-8 rounded-full bg-[#FCE59A]/60 flex items-center justify-center font-display font-black text-xs text-[#218DAE]">PM</div>
      </div>
      <p className="text-sm font-semibold text-slate-600 animate-pulse">{message}</p>
    </div>
  );
}

export function PageHeader({ title, description, badge, action }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-200/70">
      <div>
        {badge && <div className="mb-2">{badge}</div>}
        <h1 className="font-display text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">{title}</h1>
        {description && <p className="text-sm text-slate-500 mt-1 max-w-2xl">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export default PageHeader;
