import React from 'react';
import { Link } from 'react-router-dom';
import {
  IconShip,
  IconTrain,
  IconTruck,
  IconPlane,
  IconArrowRight,
  IconCalendar,
  IconShieldCheck,
  IconSparkles
} from '@tabler/icons-react';
import CapacityBar from './CapacityBar';
import StatusBadge from './StatusBadge';

export default function ContainerCard({ container, isTrader = true }) {
  const getModeIcon = (mode) => {
    switch (mode) {
      case 'RAIL':
        return <IconTrain size={18} className="text-port-grayLight" />;
      case 'ROAD':
        return <IconTruck size={18} className="text-port-grayLight" />;
      case 'AIR':
        return <IconPlane size={18} className="text-port-grayLight" />;
      case 'SEA':
      default:
        return <IconShip size={18} className="text-port-grayLight" />;
    }
  };

  const formattedDep = new Date(container.departureDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
  const formattedArr = new Date(container.arrivalDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  const isBestMatch = container.matchScore && container.matchScore >= 90;

  return (
    <div
      className={`ledger-row border bg-white rounded-[2px] p-4 transition-all duration-150 mb-2 relative ${
        isBestMatch
          ? 'border-port-teal/80 shadow-[0_1px_3px_rgba(29,111,100,0.12)]'
          : 'border-[#D8D1C3]'
      }`}
    >
      {/* Best Match Ribbon if score >= 90 */}
      {isBestMatch && (
        <div className="absolute top-0 right-4 -translate-y-1/2 bg-port-teal text-white text-[10px] font-heading font-bold px-2 py-0.5 rounded-[2px] flex items-center gap-1 shadow-sm uppercase tracking-wider">
          <IconSparkles size={11} />
          <span>Match: {container.matchScore}%</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
        {/* Col 1-4: Route Line (Origin -> Mode Line -> Destination) */}
        <div className="lg:col-span-4">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-1 bg-[#F3EFE6] rounded-[2px] border border-port-gray/30" title={`Mode: ${container.mode}`}>
              {getModeIcon(container.mode)}
            </span>
            <span className="font-heading font-semibold text-xs text-port-dark tracking-wide">
              {container.containerNumber}
            </span>
            <StatusBadge status={container.status} />
          </div>

          {/* Industrial Route Vector */}
          <div className="flex items-center gap-2 text-xs">
            <div className="flex-1 min-w-0">
              <span className="block text-[10px] uppercase font-mono text-port-gray tracking-wider">
                Origin
              </span>
              <span className="font-semibold text-port-dark truncate block" title={container.origin}>
                {container.origin}
              </span>
            </div>

            <div className="flex flex-col items-center px-2">
              <div className="text-[10px] font-mono text-port-teal font-semibold">
                {container.mode}
              </div>
              <div className="flex items-center text-port-teal">
                <span className="w-5 h-[2px] bg-port-teal inline-block"></span>
                <IconArrowRight size={14} className="-ml-1" />
              </div>
            </div>

            <div className="flex-1 min-w-0 text-right">
              <span className="block text-[10px] uppercase font-mono text-port-gray tracking-wider">
                Destination
              </span>
              <span className="font-semibold text-port-dark truncate block" title={container.destination}>
                {container.destination}
              </span>
            </div>
          </div>

          <div className="mt-2 text-[11px] text-port-gray flex items-center gap-2">
            <span className="truncate">{container.providerName}</span>
            {container.providerStatus === 'APPROVED' && (
              <span className="text-port-teal inline-flex items-center gap-0.5 text-[10px] font-medium" title="Vetted Carrier">
                <IconShieldCheck size={12} /> Vetted
              </span>
            )}
          </div>
        </div>

        {/* Col 5-7: Availability Capacity Bar */}
        <div className="lg:col-span-3 border-t lg:border-t-0 lg:border-l lg:border-r border-[#E7E2D6] py-2 lg:py-0 lg:px-4">
          <CapacityBar
            total={container.totalCapacity}
            available={container.availableCapacity}
            height="h-3"
          />
          <div className="flex justify-between items-center text-[10px] text-port-gray mt-2 font-mono">
            <span>Cutoff: {container.cutoffDate ? new Date(container.cutoffDate).toLocaleDateString() : 'TBD'}</span>
            <span className="text-port-dark font-medium">{container.temperatureControlled ? '❄ Temp Controlled' : 'Dry Box'}</span>
          </div>
        </div>

        {/* Col 8-10: Dates & Transit Schedule */}
        <div className="lg:col-span-2 text-xs">
          <div className="flex items-center gap-1.5 text-port-gray mb-1">
            <IconCalendar size={14} />
            <span className="font-heading uppercase text-[10px] tracking-wider">Schedule</span>
          </div>
          <div className="font-mono text-xs">
            <span className="text-port-dark font-medium">{formattedDep}</span>
            <span className="text-port-gray mx-1">→</span>
            <span className="text-port-dark font-medium">{formattedArr}</span>
          </div>
          <div className="text-[10px] text-port-grayLight mt-1 truncate" title={container.vesselFlightTrain}>
            {container.vesselFlightTrain}
          </div>
        </div>

        {/* Col 11-12: Price & Booking Action */}
        <div className="lg:col-span-3 text-right flex flex-col justify-between items-end border-t lg:border-t-0 pt-2 lg:pt-0">
          <div>
            <span className="block text-[10px] uppercase font-mono text-port-gray tracking-wider">
              Rate per CBM
            </span>
            <div className="font-heading font-bold text-lg text-port-dark tabular-nums">
              ${container.pricePerCbm.toFixed(2)}
              <span className="text-[10px] font-normal text-port-gray ml-1">/ CBM</span>
            </div>
          </div>

          <div className="mt-3 flex gap-2">
            <Link
              to={`/trader/containers/${container.id}`}
              className="px-3 py-1.5 text-xs font-heading font-semibold text-port-dark border border-port-gray hover:bg-[#E7E2D6] rounded-[2px] transition-colors"
            >
              Specs
            </Link>
            {isTrader && container.status === 'AVAILABLE' && container.availableCapacity > 0 ? (
              <Link
                to={`/trader/book/${container.id}`}
                className="px-4 py-1.5 text-xs font-heading font-semibold text-white bg-port-orange hover:bg-port-orangeHover rounded-[2px] transition-colors shadow-sm tracking-wide uppercase"
              >
                Book Space
              </Link>
            ) : (
              <button
                disabled
                className="px-3 py-1.5 text-xs font-heading font-semibold text-port-gray bg-gray-100 rounded-[2px] cursor-not-allowed uppercase"
              >
                {container.status === 'FULL' ? 'Fully Booked' : 'Unavailable'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
