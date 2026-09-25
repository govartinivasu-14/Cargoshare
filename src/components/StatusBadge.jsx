import React from 'react';

/**
 * Stamped rectangular industrial status label (not soft pills)
 * Strict color compliance:
 * - Pending: Amber (#B98900)
 * - Approved/Confirmed/Delivered/Available/Success: Teal (#1D6F64)
 * - Rejected/Cancelled/Closed/Failed: Rust (#B23A1D)
 * - Neutral/Departed: Structural Gray (#5B6670)
 */
export default function StatusBadge({ status, className = '' }) {
  if (!status) return null;

  const normalized = status.toUpperCase().replace(/\s+/g, '_');

  let styleClasses = 'text-port-gray border-port-gray bg-transparent';

  switch (normalized) {
    case 'PENDING':
    case 'PENDING_PAYMENT':
    case 'CREATED':
    case 'FULL':
      styleClasses = 'text-port-amber border-port-amber bg-amber-50/20';
      break;

    case 'APPROVED':
    case 'CONFIRMED':
    case 'DELIVERED':
    case 'IN_TRANSIT':
    case 'AVAILABLE':
    case 'SUCCESS':
    case 'PAYMENT_SUCCESSFUL':
    case 'ACTIVE':
      styleClasses = 'text-port-teal border-port-teal bg-teal-50/20';
      break;

    case 'REJECTED':
    case 'CANCELLED':
    case 'CLOSED':
    case 'FAILED':
      styleClasses = 'text-port-rust border-port-rust bg-red-50/20';
      break;

    case 'DEPARTED':
    case 'INACTIVE':
    default:
      styleClasses = 'text-port-gray border-port-gray bg-gray-100/30';
      break;
  }

  const label = normalized.replace(/_/g, ' ');

  return (
    <span
      className={`inline-flex items-center font-heading font-semibold text-[11px] tracking-wider uppercase px-2 py-0.5 border rounded-[2px] leading-tight select-none ${styleClasses} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-[1px] bg-current mr-1.5 opacity-90"></span>
      {label}
    </span>
  );
}
