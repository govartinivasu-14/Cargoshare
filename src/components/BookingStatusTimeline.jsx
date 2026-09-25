import React from 'react';
import {
  IconCheck,
  IconClock,
  IconAlertTriangle,
  IconTruckDelivery,
  IconCash,
  IconFileCheck,
  IconMapPin
} from '@tabler/icons-react';

export default function BookingStatusTimeline({ timeline = [], currentStatus = '' }) {
  const steps = [
    { key: 'PENDING_PAYMENT', label: 'Booking Placed', icon: IconClock },
    { key: 'PAYMENT_SUCCESSFUL', label: 'Payment Settled', icon: IconCash },
    { key: 'CONFIRMED', label: 'Space Confirmed', icon: IconFileCheck },
    { key: 'IN_TRANSIT', label: 'In Transit', icon: IconTruckDelivery },
    { key: 'DELIVERED', label: 'Port Delivered', icon: IconMapPin },
  ];

  if (currentStatus === 'CANCELLED') {
    return (
      <div className="p-4 bg-red-50 border border-port-rust/30 rounded-[2px] text-port-rust flex items-center gap-3">
        <IconAlertTriangle size={20} />
        <div>
          <div className="font-heading font-bold text-sm uppercase">Booking Cancelled</div>
          <div className="text-xs">This cargo allocation reservation was voided and released back to available inventory.</div>
        </div>
      </div>
    );
  }

  const getStepIndex = (key) => steps.findIndex((s) => s.key === key);
  const currentIndex = getStepIndex(currentStatus);

  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between relative">
        {/* Background track */}
        <div className="absolute top-1/2 left-0 w-full h-[2px] bg-[#D8D1C3] -translate-y-1/2 z-0" />

        {/* Progress track */}
        <div
          className="absolute top-1/2 left-0 h-[2px] bg-port-teal -translate-y-1/2 z-0 transition-all duration-500"
          style={{
            width: `${Math.max(0, (Math.min(currentIndex, steps.length - 1) / (steps.length - 1)) * 100)}%`,
          }}
        />

        {steps.map((step, idx) => {
          const isCompleted = idx <= currentIndex;
          const isCurrent = idx === currentIndex;
          const StepIcon = step.icon;
          const timelineItem = timeline.find((t) => t.step === step.key);

          return (
            <div key={step.key} className="flex flex-col items-center relative z-10">
              <div
                className={`w-9 h-9 rounded-[2px] flex items-center justify-center border-2 transition-all ${
                  isCurrent
                    ? 'bg-port-teal border-port-dark text-white ring-4 ring-port-teal/20'
                    : isCompleted
                    ? 'bg-port-teal border-port-teal text-white'
                    : 'bg-white border-port-gray/40 text-port-gray'
                }`}
              >
                {isCompleted ? <IconCheck size={18} stroke={2.5} /> : <StepIcon size={16} />}
              </div>

              <div className="mt-2 text-center">
                <div
                  className={`font-heading text-[11px] font-bold uppercase tracking-wider ${
                    isCurrent ? 'text-port-teal' : isCompleted ? 'text-port-dark' : 'text-port-gray'
                  }`}
                >
                  {step.label}
                </div>
                {timelineItem?.timestamp && (
                  <div className="text-[10px] font-mono text-port-grayLight mt-0.5">
                    {new Date(timelineItem.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
