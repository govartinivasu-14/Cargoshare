import React from 'react';
import {
  IconShieldCheck,
  IconScale,
  IconClock,
  IconFileCertificate,
  IconCalculator,
  IconBuildingWarehouse
} from '@tabler/icons-react';
import ContainerFillGraphic from '../../components/ContainerFillGraphic';

export default function About() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 text-left">
      {/* Header */}
      <div className="border-b border-[#D8D1C3] pb-6">
        <span className="text-xs font-mono uppercase text-port-gray tracking-wider block mb-1">
          Marketplace Architecture
        </span>
        <h1 className="font-heading font-black text-3xl uppercase tracking-tight text-port-dark">
          Maritime Efficiency Through Fractional Container Allocation
        </h1>
        <p className="text-sm text-port-gray max-w-3xl mt-2 font-body leading-relaxed">
          Traditional international shipping forces small-to-medium enterprises (SMEs) to choose between paying exorbitant Full Container Load (FCL) rates for empty space or dealing with opaque freight forwarder consolidation delays. CargoShare digitizes fractional container capacity into an open, live-cleared manifest exchange.
        </p>
      </div>

      {/* Visual Component: Container Anatomy */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white border border-[#D8D1C3] p-6 rounded-[2px]">
        <div>
          <h2 className="font-heading font-bold text-lg uppercase tracking-wider text-port-dark mb-3">
            Democratizing CBM Slot Allotment
          </h2>
          <p className="text-xs text-port-gray leading-relaxed mb-3">
            In standard maritime logistics, a 40ft High Cube container contains approximately 76 CBM of volume. When an exporter has 5 to 15 CBM of crated machinery or specialty cargo, traditional carriers leave the remaining 60 CBM vacant or charge punitive dead-freight fees.
          </p>
          <p className="text-xs text-port-gray leading-relaxed">
            CargoShare connects verified operators holding scheduled bookings with traders requiring partial space. Real-time telemetry via STOMP WebSockets guarantees live capacity tracking, eliminating overbooking.
          </p>
        </div>
        <div>
          <ContainerFillGraphic totalCbm={76} occupiedCbm={52} showSpecs={false} />
        </div>
      </div>

      {/* Vetting & Trust Architecture */}
      <div>
        <div className="mb-4">
          <span className="text-xs font-mono uppercase text-port-gray tracking-wider block">
            Compliance Framework
          </span>
          <h2 className="font-heading font-bold text-xl uppercase tracking-tight text-port-dark">
            The Port Administrator Vetting Standard
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-[#D8D1C3] p-4 rounded-[2px]">
            <div className="flex items-center gap-2 text-port-teal mb-2">
              <IconFileCertificate size={20} />
              <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-port-dark">
                License & Bond Verification
              </h3>
            </div>
            <p className="text-xs text-port-gray leading-relaxed">
              Every logistics provider is subjected to manual compliance vetting. Operating authorities must verify active FMC, NVOCC, or CMR international freight licenses.
            </p>
          </div>

          <div className="bg-white border border-[#D8D1C3] p-4 rounded-[2px]">
            <div className="flex items-center gap-2 text-port-orange mb-2">
              <IconScale size={20} />
              <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-port-dark">
                Rigid Capacity Enforcement
              </h3>
            </div>
            <p className="text-xs text-port-gray leading-relaxed">
              Our automated booking gate strictly checks available volume at the millisecond of reservation. If only 4.2 CBM remains, a trader cannot book 4.3 CBM.
            </p>
          </div>

          <div className="bg-white border border-[#D8D1C3] p-4 rounded-[2px]">
            <div className="flex items-center gap-2 text-port-teal mb-2">
              <IconShieldCheck size={20} />
              <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-port-dark">
                Transparent Escrow Payments
              </h3>
            </div>
            <p className="text-xs text-port-gray leading-relaxed">
              Payments are recorded with unique manifest transaction hashes. Funds are tracked from reservation to terminal handover and delivery.
            </p>
          </div>
        </div>
      </div>

      {/* CBM Calculation Guide */}
      <div className="bg-[#FAF8F5] border border-port-gray/30 p-6 rounded-[2px]">
        <div className="flex items-center gap-2 text-port-dark mb-2">
          <IconCalculator size={22} className="text-port-orange" />
          <h2 className="font-heading font-bold text-base uppercase tracking-wider">
            Operational CBM Calculation Standard
          </h2>
        </div>
        <p className="text-xs text-port-gray mb-4 font-mono">
          CBM (Cubic Meters) represents the 3D volume of your shipment:
        </p>
        <div className="bg-white p-3 border border-port-gray/30 rounded-[2px] font-mono text-xs text-port-dark inline-block mb-3">
          <strong>CBM</strong> = Length (m) × Width (m) × Height (m) × Total Crates
        </div>
        <div className="text-xs text-port-gray leading-relaxed">
          Standard Euro-pallets (1.2m × 0.8m × 1.4m height) occupy roughly <strong>1.34 CBM</strong> each. An SME shipping 6 pallets requires approximately <strong>8.1 CBM</strong> of space, fitting comfortably into fractional container allotments.
        </div>
      </div>
    </div>
  );
}
