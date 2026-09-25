import { useAuth } from '../../context/AuthContext';
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { wsService } from '../../services/websocket';
import CapacityBar from '../../components/CapacityBar';
import ContainerFillGraphic from '../../components/ContainerFillGraphic';
import StatusBadge from '../../components/StatusBadge';
import {
  IconShip,
  IconTrain,
  IconTruck,
  IconPlane,
  IconCalendar,
  IconMapPin,
  IconShieldCheck,
  IconArrowRight,
  IconWifi,
  IconBolt,
  IconReceipt2,
  IconAlertTriangle
} from '@tabler/icons-react';

export default function ContainerDetails() {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [container, setContainer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isLiveFlashing, setIsLiveFlashing] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchContainer = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/containers/${id}`);
        if (isMounted) setContainer(res.data);
      } catch (err) {
        if (isMounted) setError('Container could not be retrieved from manifest registry.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchContainer();

    // Subscribe to real-time STOMP topic: /topic/containers/{containerId}
    const unsubscribe = wsService.subscribeToContainer(id, (updatedContainer) => {
      if (!isMounted) return;
      setContainer((prev) => ({
        ...prev,
        ...updatedContainer,
        bookedCapacity: updatedContainer.bookedCapacity ?? updatedContainer.occupiedCapacity ?? prev?.bookedCapacity,
      }));
      setIsLiveFlashing(true);
      setTimeout(() => setIsLiveFlashing(false), 2000);
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [id]);

  if (loading) {
    return (
      <div className="py-20 text-center font-mono text-xs text-port-gray">
        Opening real-time manifest telematics for Unit {id}...
      </div>
    );
  }

  if (error || !container) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-left">
        <div className="bg-red-50 border border-port-rust/30 p-5 rounded-[2px] text-xs text-port-rust font-mono">
          <div className="font-bold mb-1">Manifest Query Error:</div>
          <div>{error || 'Container record not found.'}</div>
        </div>
      </div>
    );
  }

  const getModeIcon = (mode) => {
    switch (mode) {
      case 'RAIL': return <IconTrain size={20} />;
      case 'ROAD': return <IconTruck size={20} />;
      case 'AIR': return <IconPlane size={20} />;
      case 'SEA':
      default: return <IconShip size={20} />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-left">
      {/* Top Breadcrumb & Live Socket Status */}
      <div className="flex items-center justify-between pb-3 border-b border-[#D8D1C3]">
        <div className="text-xs font-mono text-port-gray flex items-center gap-1.5">
          <Link to="/marketplace" className="hover:underline">Search</Link>
          <span>/</span>
          <span className="text-port-dark font-bold">{container.containerNumber}</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Live WS Pill */}
          <div className="flex items-center gap-1 text-[10px] font-mono text-port-teal bg-teal-50 border border-port-teal/30 px-2 py-0.5 rounded-[2px]">
            <IconWifi size={13} className="animate-pulse" />
            <span>Availability updates automatically</span>
          </div>


        </div>
      </div>

      {/* Main Container Header */}
      <div className="bg-white border border-[#D8D1C3] p-6 rounded-[2px] shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 mb-4 border-b border-[#E7E2D6]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 bg-[#FAF8F5] border border-port-gray/30 rounded-[2px] text-port-dark">
                {getModeIcon(container.mode)}
              </span>
              <h1 className="font-heading font-black text-2xl uppercase text-port-dark">
                {container.containerNumber}
              </h1>
              <StatusBadge status={container.status} />
              {container.temperatureControlled && (
                <span className="text-[11px] font-mono font-semibold px-2 py-0.5 bg-blue-50 text-blue-800 border border-blue-200 rounded-[2px]">
                  ❄ REEFER MONITORED
                </span>
              )}
            </div>
            <div className="text-xs font-mono text-port-gray">
              Carrier: <strong className="text-port-dark">{container.providerName}</strong> • {container.vesselFlightTrain}
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-mono uppercase text-port-gray block">Marketplace Rate</span>
            <div className="font-heading font-black text-2xl text-port-dark tabular-nums">
              ${container.pricePerCbm.toFixed(2)}
              <span className="text-xs font-normal text-port-gray ml-1">/ CBM</span>
            </div>
          </div>
        </div>

        {/* Live Visual Capacity Bar */}
        <div className="mb-6">
          <div className="text-xs font-heading font-bold uppercase tracking-wider text-port-dark mb-2 flex items-center justify-between">
            <span>Container Space Allocation Status</span>
            {isLiveFlashing && (
              <span className="text-[10px] font-mono text-port-orange font-bold uppercase animate-pulse">
                • Telemetry Updated Live Over STOMP
              </span>
            )}
          </div>
          <CapacityBar
            total={container.totalCapacity}
            available={container.availableCapacity}
            height="h-5"
            isFlashing={isLiveFlashing}
          />
        </div>

        {/* Voyage Route & Schedule */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-[#E7E2D6] font-mono text-xs">
          <div className="bg-[#FAF8F5] p-3 rounded-[2px] border border-port-gray/20">
            <span className="text-[10px] uppercase text-port-gray block mb-1">Departure Port</span>
            <div className="font-bold text-port-dark text-sm">{container.origin}</div>
            <div className="text-port-gray mt-1">
              ETD: {new Date(container.departureDate).toLocaleDateString()}
            </div>
          </div>

          <div className="bg-[#FAF8F5] p-3 rounded-[2px] border border-port-gray/20">
            <span className="text-[10px] uppercase text-port-gray block mb-1">Arrival Port</span>
            <div className="font-bold text-port-dark text-sm">{container.destination}</div>
            <div className="text-port-gray mt-1">
              ETA: {new Date(container.arrivalDate).toLocaleDateString()}
            </div>
          </div>

          <div className="bg-[#FAF8F5] p-3 rounded-[2px] border border-port-gray/20">
            <span className="text-[10px] uppercase text-port-gray block mb-1">Gate-in Deadline</span>
            <div className="font-bold text-port-dark text-sm">
              {container.cutoffDate ? new Date(container.cutoffDate).toLocaleDateString() : '72 hrs prior to ETD'}
            </div>
            <div className="text-port-gray mt-1">Customs Clearance Cutoff</div>
          </div>
        </div>
      </div>

      {/* Container Silhouette Visualizer & Booking CTA Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <ContainerFillGraphic
            totalCbm={container.totalCapacity}
            occupiedCbm={container.totalCapacity - container.availableCapacity}
          />

          <div className="mt-4 bg-white border border-[#D8D1C3] p-4 rounded-[2px]">
            <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-port-dark mb-2">
              Cargo Restrictions & Acceptance Policies
            </h3>
            <p className="text-xs text-port-gray font-mono leading-relaxed">
              {container.cargoRestrictions || 'Standard non-hazardous crated and palletized commercial merchandise.'}
            </p>
          </div>
        </div>

        {/* Booking Launcher Sidecard */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-[#D8D1C3] p-5 rounded-[2px] shadow-sm text-left">
            <h3 className="font-heading font-bold text-sm uppercase tracking-wider text-port-dark pb-2 mb-3 border-b border-[#E7E2D6]">
              Reserve Fractional Space
            </h3>

            <div className="space-y-3 text-xs font-mono mb-5">
              <div className="flex justify-between">
                <span className="text-port-gray">Available Space:</span>
                <span className="font-bold text-port-dark">{container.availableCapacity.toFixed(1)} CBM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-port-gray">Unit Rate:</span>
                <span className="font-bold text-port-dark">${container.pricePerCbm.toFixed(2)} / CBM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-port-gray">Carrier Rating:</span>
                <span className="font-bold text-port-teal flex items-center gap-1">
                  <IconShieldCheck size={14} /> 100% Vetted Carrier
                </span>
              </div>
            </div>

            {user?.role === 'TRADER' && container.status === 'AVAILABLE' && container.availableCapacity > 0 ? (
              <Link
                to={`/trader/book/${container.id}`}
                className="w-full py-3 bg-port-orange hover:bg-port-orangeHover text-white font-heading font-bold text-xs uppercase tracking-wider rounded-[2px] shadow-sm flex items-center justify-center gap-2 transition-colors"
              >
                <span>Initiate Space Reservation</span>
                <IconArrowRight size={16} />
              </Link>
            ) : (
              <div className="p-3 bg-red-50 border border-port-rust/30 text-port-rust text-xs font-mono rounded-[2px] text-center">
                This container is fully booked or closed for new cargo allocations.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
