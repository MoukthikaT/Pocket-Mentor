import React from 'react';

export function Progress({
  value = 0,
  max = 100,
  variant = 'cyan', // cyan | teal | yellow | gradient
  size = 'md', // sm | md | lg
  showLabel = false,
  className = '',
}) {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  const heights = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  const variants = {
    cyan: 'bg-[#2BBBD7]',
    teal: 'bg-[#218DAE]',
    yellow: 'bg-[#FFD758]',
    gradient: 'bg-gradient-to-r from-[#218DAE] via-[#2BBBD7] to-[#FFD758]',
  };

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1.5 text-xs font-semibold text-slate-600">
          <span>Progress</span>
          <span>{percentage}%</span>
        </div>
      )}
      <div className={`w-full bg-slate-100 rounded-full overflow-hidden ${heights[size]}`}>
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${variants[variant] || variants.cyan}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export function ProgressRing({ value = 0, size = 60, strokeWidth = 6, variant = 'cyan' }) {
  const percentage = Math.min(100, Math.max(0, Math.round(value)));
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const color = variant === 'yellow' ? '#FFD758' : variant === 'teal' ? '#218DAE' : '#2BBBD7';

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E2E8F0"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <span className="absolute font-display font-bold text-xs text-slate-800">{percentage}%</span>
    </div>
  );
}

export default Progress;
