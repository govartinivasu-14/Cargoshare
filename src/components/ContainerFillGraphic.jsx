import React from 'react';

/**
 * ContainerFillGraphic
 * Illustrative ISO shipping container silhouette showing occupied vs available space
 * Replaces generic stock gradients with an authentic maritime container visual.
 */
export default function ContainerFillGraphic({
  totalCbm = 68,
  occupiedCbm = 44,
  showSpecs = true,
  className = '',
}) {
  const safeTotal = Math.max(totalCbm, 1);
  const safeOccupied = Math.min(Math.max(occupiedCbm, 0), safeTotal);
  const freeCbm = Math.max(0, safeTotal - safeOccupied);
  const occupiedPct = Math.round((safeOccupied / safeTotal) * 100);
  const freePct = 100 - occupiedPct;

  return (
    <div className={`relative border border-port-gray/30 bg-[#0A121F] p-5 rounded-[4px] text-[#F3EFE6] font-mono select-none ${className}`}>
      {/* Container Header Stencil */}
      <div className="flex justify-between items-center text-[10px] text-port-grayLight border-b border-port-gray/30 pb-2 mb-3 tracking-widest font-heading uppercase">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 bg-port-orange rounded-[1px]"></span>
          <span>ISO 668 40FT HIGH CUBE — FRACTIONAL ALLOCATION</span>
        </div>
        <span className="text-port-teal font-semibold">MAX CBM: {safeTotal.toFixed(1)}</span>
      </div>

      {/* SVG Container Silhouette */}
      <div className="relative w-full h-32 bg-[#09111D] border-2 border-port-gray/50 rounded-[3px] overflow-hidden flex shadow-inner">
        {/* Container corrugated ridges background */}
        <div className="absolute inset-0 pointer-events-none opacity-25 bg-[repeating-linear-gradient(90deg,#000,#000_6px,#223348_7px,#223348_14px)] z-10" />

        {/* Occupied Portion (Dark / Cargo Packed) */}
        <div
          className="h-full bg-port-dark/95 border-r-2 border-port-orange/80 transition-all duration-700 relative flex flex-col justify-between p-2"
          style={{ width: `${occupiedPct}%` }}
        >
          <div className="z-20 text-[9px] font-heading uppercase tracking-wider text-port-grayLight">
            Occupied
          </div>
          <div className="z-20">
            <span className="text-xl font-heading font-bold text-white tabular-nums">
              {safeOccupied.toFixed(1)}
            </span>
            <span className="text-[10px] text-port-grayLight ml-1">CBM</span>
            <div className="text-[9px] text-port-grayLight/80">{occupiedPct}% LOADED</div>
          </div>
        </div>

        {/* Free Space Portion (Teal / Open Slot) */}
        <div
          className="h-full bg-port-teal/30 border-l border-port-teal/50 transition-all duration-700 relative flex flex-col justify-between p-2"
          style={{ width: `${freePct}%` }}
        >
          <div className="z-20 text-[9px] font-heading uppercase tracking-wider text-port-teal flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-port-teal animate-pulse rounded-[1px]"></span>
            Available For Booking
          </div>
          <div className="z-20">
            <span className="text-2xl font-heading font-bold text-white tabular-nums text-emerald-400">
              {freeCbm.toFixed(1)}
            </span>
            <span className="text-[10px] text-teal-200 ml-1">CBM</span>
            <div className="text-[9px] text-teal-200/90 font-semibold">{freePct}% UNRESERVED</div>
          </div>
        </div>

        {/* Container Corner Castings & Stencil Marks */}
        <div className="absolute top-1 left-1 border-t-2 border-l-2 border-white/40 w-3 h-3 pointer-events-none z-20" />
        <div className="absolute top-1 right-1 border-t-2 border-r-2 border-white/40 w-3 h-3 pointer-events-none z-20" />
        <div className="absolute bottom-1 left-1 border-b-2 border-l-2 border-white/40 w-3 h-3 pointer-events-none z-20" />
        <div className="absolute bottom-1 right-1 border-b-2 border-r-2 border-white/40 w-3 h-3 pointer-events-none z-20" />
      </div>

      {showSpecs && (
        <div className="grid grid-cols-3 gap-2 mt-3 pt-2 border-t border-port-gray/20 text-[10px]">
          <div>
            <span className="text-port-grayLight block">Internal Volume</span>
            <span className="font-semibold text-white">76.2 CBM</span>
          </div>
          <div>
            <span className="text-port-grayLight block">Tare Weight</span>
            <span className="font-semibold text-white">3,800 KG</span>
          </div>
          <div>
            <span className="text-port-grayLight block">Standard Payload</span>
            <span className="font-semibold text-white">28,680 KG</span>
          </div>
        </div>
      )}
    </div>
  );
}
