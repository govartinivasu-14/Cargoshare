import React from 'react';
import { IconBoxSeam, IconArrowRight } from '@tabler/icons-react';
import { Link } from 'react-router-dom';

export default function EmptyState({
  title = 'No Container Manifest Records Found',
  description = 'There are currently no active freight slots or manifest entries matching this criteria.',
  actionText = '',
  actionLink = '',
  onAction = null,
  icon: Icon = IconBoxSeam,
}) {
  return (
    <div className="border border-dashed border-port-gray/40 bg-white/70 rounded-[2px] p-8 text-center max-w-lg mx-auto my-6">
      <div className="w-12 h-12 mx-auto mb-3 bg-[#F3EFE6] border border-port-gray/30 rounded-[2px] flex items-center justify-center text-port-gray">
        <Icon size={24} />
      </div>

      <h4 className="font-heading font-bold text-sm uppercase tracking-wider text-port-dark mb-1">
        {title}
      </h4>

      <p className="text-xs text-port-gray max-w-sm mx-auto mb-4 font-mono leading-relaxed">
        {description}
      </p>

      {actionText && (
        <div>
          {actionLink ? (
            <Link
              to={actionLink}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-port-dark text-white hover:bg-port-darker text-xs font-heading font-semibold rounded-[2px] uppercase tracking-wider transition-colors"
            >
              <span>{actionText}</span>
              <IconArrowRight size={14} />
            </Link>
          ) : (
            <button
              onClick={onAction}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-port-dark text-white hover:bg-port-darker text-xs font-heading font-semibold rounded-[2px] uppercase tracking-wider transition-colors"
            >
              <span>{actionText}</span>
              <IconArrowRight size={14} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
