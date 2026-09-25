import React, { useState } from 'react';
import { IconAlertTriangle, IconCheck, IconX } from '@tabler/icons-react';

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm Action',
  confirmVariant = 'orange', // 'orange', 'teal', 'rust'
  requiresReason = false,
  reasonPlaceholder = 'Enter mandatory reason for this operational decision...',
  onConfirm,
  onClose,
}) {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (requiresReason && !reason.trim()) {
      setError('A rationale / reason is mandatory for audit compliance.');
      return;
    }
    setError('');
    onConfirm(reason);
    setReason('');
  };

  let btnColor = 'bg-port-orange hover:bg-port-orangeHover text-white';
  if (confirmVariant === 'teal') btnColor = 'bg-port-teal hover:bg-port-tealDark text-white';
  if (confirmVariant === 'rust') btnColor = 'bg-port-rust hover:bg-red-800 text-white';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white border-2 border-port-dark max-w-md w-full rounded-[2px] shadow-2xl p-5 text-left font-body">
        <div className="flex items-start justify-between pb-3 border-b border-[#D8D1C3]">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-[#FAF8F5] rounded-[2px] border border-port-gray/30 text-port-rust">
              <IconAlertTriangle size={20} />
            </span>
            <h3 className="font-heading font-bold text-sm text-port-dark uppercase tracking-wide">
              {title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-port-gray hover:text-port-dark transition-colors"
          >
            <IconX size={18} />
          </button>
        </div>

        <div className="py-4 text-xs text-port-dark/80 leading-relaxed">
          {message}

          {requiresReason && (
            <div className="mt-3">
              <label className="block text-[10px] font-mono uppercase text-port-gray mb-1 font-semibold">
                Reason / Inspector Notes <span className="text-port-rust">*</span>
              </label>
              <textarea
                rows={3}
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value);
                  if (error) setError('');
                }}
                placeholder={reasonPlaceholder}
                className="w-full text-xs p-2 border border-port-gray/40 rounded-[2px] focus:outline-none focus:border-port-dark bg-[#FAF8F5]"
              />
              {error && <p className="text-[11px] text-port-rust mt-1 font-mono">{error}</p>}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-[#D8D1C3]">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-heading font-semibold text-port-gray hover:text-port-dark border border-port-gray/30 rounded-[2px]"
          >
            Abort
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className={`px-4 py-1.5 text-xs font-heading font-semibold rounded-[2px] uppercase tracking-wider ${btnColor}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
