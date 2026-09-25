import api from '../../services/api';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import ChatWindow from '../../components/ChatWindow';
import { IconMessage2, IconUser, IconBox } from '@tabler/icons-react';

export default function ProviderChat() {
  const { user } = useAuth();
  const [traders, setTraders] = useState([]);
  const [selectedTrader, setSelectedTrader] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => {
    api.get('/bookings/provider').then(r => {
      const rows = r.data.map(b => ({ id: b.traderId, name: b.traderName, company: b.traderName, mode: b.mode, bookingId: b.id, containerId: b.containerId, spaceBooked: b.spaceRequired + ' CBM' }));
      setTraders(rows); setSelectedTrader(rows[0] || null);
    }).catch(() => setError('Unable to load conversations. Please retry.'));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-left space-y-6">
      <div className="border-b border-[#D8D1C3] pb-3">
        <span className="text-[10px] font-mono uppercase tracking-widest text-port-gray block">
          Carrier Dispatch Communications
        </span>
        <h1 className="font-heading font-black text-2xl uppercase tracking-tight text-port-dark">
          Trader Inbound Messages
        </h1>
        <p className="text-xs text-port-gray font-mono mt-0.5">
          Real-time coordination on crating, pallet dimensions, customs clearing, and BOL paperwork
        </p>
      </div>

      {error && <p role="alert">{error}</p>}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Trader Conversations Thread List */}
        <div className="lg:col-span-4 bg-white border border-[#D8D1C3] rounded-[2px] shadow-sm overflow-hidden flex flex-col h-[520px]">
          <div className="bg-[#FAF8F5] px-4 py-3 border-b border-[#E7E2D6] font-heading font-bold text-xs uppercase tracking-wider text-port-dark flex items-center gap-2">
            <IconMessage2 size={16} className="text-port-teal" />
            <span>Trader Consignor Threads</span>
          </div>

          <div className="divide-y divide-[#E7E2D6] overflow-y-auto flex-1">
            {traders.map((t) => {
              const isSelected = selectedTrader?.id === t.id;
              return (
                <button
                  key={t.bookingId}
                  onClick={() => setSelectedTrader(t)}
                  className={`w-full text-left p-4 transition-colors flex flex-col gap-1 ${
                    isSelected ? 'bg-[#FAF8F5] border-l-4 border-port-teal' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-heading font-bold text-xs text-port-dark">
                      {t.name}
                    </span>
                    <span className="text-[10px] font-mono text-port-teal font-semibold">
                      {t.spaceBooked}
                    </span>
                  </div>

                  <div className="text-[11px] text-port-gray font-mono truncate">
                    {t.company}
                  </div>

                  <div className="text-[10px] font-mono text-port-grayLight flex items-center gap-1 mt-1">
                    <span>Booking: {t.bookingId}</span>
                    <span>• {t.containerId}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Chat Window */}
        <div className="lg:col-span-8">
          {selectedTrader ? (
            <ChatWindow
              partnerId={selectedTrader.id}
              partnerName={`${selectedTrader.name} (${selectedTrader.company})`}
              bookingId={selectedTrader.bookingId}
              containerId={selectedTrader.containerId}
            />
          ) : (
            <div className="bg-white border border-[#D8D1C3] h-[520px] rounded-[2px] flex items-center justify-center font-mono text-xs text-port-gray">
              Select a trader thread to open the message feed.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
