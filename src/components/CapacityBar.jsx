import React, { useEffect, useState } from 'react';

/**
 * CapacityBar: Displays occupied vs available container volume in CBM.
 * Includes deliberate flash motion when live availability updates.
 */
export default function CapacityBar({
  total,
  available,
  showLabels = true,
  height = 'h-3.5',
  isFlashing = false,
  className = ''
}) {
  const [internalFlash, setInternalFlash] = useState(false);
  const [prevAvailable, setPrevAvailable] = useState(available);

  useEffect(() => {
    if (prevAvailable !== available) {
      setInternalFlash(true);
      setPrevAvailable(available);
      const t = setTimeout(() => setInternalFlash(false), 1800);
      return () => clearTimeout(t);
    }
  }, [available, prevAvailable]);

  const totalCbm = Math.max(Number(total) || 1, 0.1);
  const availCbm = Math.min(Math.max(Number(available) || 0, 0), totalCbm);
  const occupiedCbm = Math.max(0, totalCbm - availCbm);

  const occupiedPct = Math.round((occupiedCbm / totalCbm) * 100);
  const availPct = 100 - occupiedPct;

  const triggerFlash = isFlashing || internalFlash;

  return (
    <div className={`w-full ${className}`}>
      {showLabels && (
        <div className="flex justify-between items-baseline mb-1 text-xs">
          <span className="font-heading font-medium text-port-gray uppercase tracking-wider text-[10px]">
            Space: <span className="text-port-dark font-semibold tabular-nums">{occupiedCbm.toFixed(1)}</span> CBM Booked ({occupiedPct}%)
          </span>
          <span
            className={`font-heading font-semibold text-xs tabular-nums transition-colors duration-300 px-1 rounded-[2px] ${
              triggerFlash
                ? 'bg-port-orange text-white ring-2 ring-port-orange'
                : availCbm < 5
                ? 'text-port-rust'
                : 'text-port-teal'
            }`}
          >
            {availCbm.toFixed(1)} CBM Available
          </span>
        </div>
      )}

      {/* Industrial Segmented Bar */}
      <div className={`w-full ${height} bg-[#D8D1C3] rounded-[2px] border border-port-gray/40 overflow-hidden flex relative`}>
        {/* Occupied volume */}
        <div
          className="bg-port-dark h-full transition-all duration-500 relative"
          style={{ width: `${occupiedPct}%` }}
          title={`Occupied: ${occupiedCbm.toFixed(1)} CBM`}
        >
          {/* Subtle ribbed hatch */}
          <div className="absolute inset-0 opacity-15 bg-[repeating-linear-gradient(45deg,#fff,#fff_2px,transparent_2px,transparent_6px)]" />
        </div>

        {/* Available volume */}
        <div
          className={`h-full transition-all duration-500 relative ${
            triggerFlash
              ? 'bg-port-orange animate-flash-update'
              : 'bg-port-teal'
          }`}
          style={{ width: `${availPct}%` }}
          title={`Available: ${availCbm.toFixed(1)} CBM`}
        >
          {availPct > 15 && (
            <span className="absolute inset-0 flex items-center justify-center text-[9px] font-mono text-white font-bold tracking-tight">
              {availPct}% FREE
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
