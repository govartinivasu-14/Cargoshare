import React from 'react';

export default function DashboardStatCard({
  title,
  value,
  unit = '',
  change = '',
  icon: Icon,
  variant = 'default', // 'default', 'teal', 'orange', 'amber'
  subtext = '',
}) {
  let accentBorder = 'border-l-4 border-port-gray';
  if (variant === 'teal') accentBorder = 'border-l-4 border-port-teal';
  if (variant === 'orange') accentBorder = 'border-l-4 border-port-orange';
  if (variant === 'amber') accentBorder = 'border-l-4 border-port-amber';

  return (
    <div className={`bg-white border border-[#D8D1C3] ${accentBorder} rounded-[2px] p-4 text-left shadow-sm`}>
      <div className="flex items-center justify-between text-port-gray mb-1.5">
        <span className="font-heading font-bold text-xs uppercase tracking-wider text-port-gray">
          {title}
        </span>
        {Icon && <Icon size={18} className="text-port-grayLight" />}
      </div>

      <div className="flex items-baseline gap-1.5">
        <span className="font-heading text-2xl lg:text-3xl font-bold text-port-dark tabular-nums tracking-tight">
          {value}
        </span>
        {unit && <span className="font-mono text-xs font-semibold text-port-gray">{unit}</span>}
      </div>

      {(change || subtext) && (
        <div className="mt-2 text-[11px] font-mono flex items-center justify-between text-port-gray">
          <span>{subtext}</span>
          {change && (
            <span className={change.startsWith('+') ? 'text-port-teal font-semibold' : 'text-port-rust'}>
              {change}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
