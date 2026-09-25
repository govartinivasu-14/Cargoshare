import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import ChatWindow from '../../components/ChatWindow';
import { IconMessage2, IconShip, IconTrain, IconTruck } from '@tabler/icons-react';

export default function TraderChat() {
  const { user } = useAuth();
  const [partners, setPartners] = useState([]);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => {
    api.get('/bookings/my').then(r => {
      const rows = r.data
        .filter(b => b.providerId)
        .map(b => ({
          id: b.providerId,
          name: b.providerContactName?.trim() || b.providerName?.trim() || 'Provider',
          company: b.providerName?.trim() || 'Logistics provider',
          mode: b.mode,
          bookingId: b.id,
          containerId: b.containerId,
          spaceBooked: b.spaceRequired + ' CBM',
        }));
      setPartners(rows); setSelectedPartner(rows[0] || null);
    }).catch(() => setError('Unable to load conversations. Please retry.'));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-left space-y-6">
      <div className="border-b border-[#D8D1C3] pb-3">
        <span className="text-[10px] font-mono uppercase tracking-widest text-port-gray block">
          STOMP Real-Time Telematics
        </span>
        <h1 className="font-heading font-black text-2xl uppercase tracking-tight text-port-dark">
          Carrier Direct Coordination Channel
        </h1>
        <p className="text-xs text-port-gray font-mono mt-0.5">
          Private operational thread between cargo consignor and vetted carrier
        </p>
      </div>

      {error && <p role="alert">{error}</p>}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Thread Selector List */}
        <div className="lg:col-span-4 bg-white border border-[#D8D1C3] rounded-[2px] shadow-sm overflow-hidden flex flex-col h-[520px]">
          <div className="bg-[#FAF8F5] px-4 py-3 border-b border-[#E7E2D6] font-heading font-bold text-xs uppercase tracking-wider text-port-dark flex items-center gap-2">
            <IconMessage2 size={16} className="text-port-teal" />
            <span>Active Carrier Channels</span>
          </div>

          <div className="divide-y divide-[#E7E2D6] overflow-y-auto flex-1">
            {partners.map((p) => {
              const isSelected = selectedPartner?.id === p.id;
              return (
                <button
                  key={p.bookingId}
                  onClick={() => setSelectedPartner(p)}
                  className={`w-full text-left p-4 transition-colors flex flex-col gap-1 ${
                    isSelected ? 'bg-[#FAF8F5] border-l-4 border-port-orange' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-heading font-bold text-xs text-port-dark">
                      {p.company}
                    </span>
                    <span className="text-[10px] font-mono text-port-teal font-semibold">
                      {p.mode}
                    </span>
                  </div>

                  <div className="text-[11px] text-port-gray font-mono">
                    Rep: {p.name}
                  </div>

                  <div className="text-[10px] font-mono text-port-grayLight flex items-center gap-1 mt-1">
                    <span>Manifest: {p.bookingId}</span>
                    <span>• {p.containerId}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Chat Window */}
        <div className="lg:col-span-8">
          {selectedPartner ? (
            <ChatWindow
              partnerId={selectedPartner.id}
              partnerName={`${selectedPartner.name} (${selectedPartner.company})`}
              bookingId={selectedPartner.bookingId}
              containerId={selectedPartner.containerId}
            />
          ) : (
            <div className="bg-white border border-[#D8D1C3] h-[520px] rounded-[2px] flex items-center justify-center font-mono text-xs text-port-gray">
              Select a carrier channel to establish secure WebSocket connection.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
