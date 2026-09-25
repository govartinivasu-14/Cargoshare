import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { wsService } from '../services/websocket';
import api from '../services/api';
import { IconSend, IconMessage2, IconWifi, IconFileInvoice } from '@tabler/icons-react';

export default function ChatWindow({
  partnerId,
  partnerName,
  bookingId,
  containerId,
}) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [wsConnected, setWsConnected] = useState(false);
  const [sendError, setSendError] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Fetch chat history & subscribe
  useEffect(() => {
    if (!user?.id || !partnerId) {
      return;
    }

    let isMounted = true;
    const fetchHistory = async (initial = false) => {
      if (initial) setLoading(true);
      try {
        const res = await api.get(`/chat/history?withUserId=${partnerId}&bookingId=${bookingId || ''}`);
        if (isMounted) {
          setMessages(res.data || []);
        }
      } catch (err) {
        console.warn('Failed to load chat history:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchHistory(true);
    const refresh = setInterval(() => { setWsConnected(wsService.connected); fetchHistory(); }, 5000);

    // Subscribe to STOMP topic for this thread only when both user IDs are present
    const unsubscribe = wsService.subscribeToChat(user.id, partnerId, (newMsg) => {
      if (bookingId && newMsg.bookingId !== bookingId) return;
      setMessages((prev) => {
        if (prev.some((m) => m.id === newMsg.id || (m.timestamp === newMsg.timestamp && (m.content || m.message) === (newMsg.content || newMsg.message)))) {
          return prev;
        }
        return [...prev, newMsg];
      });
    });

    return () => {
      clearInterval(refresh);
      isMounted = false;
      unsubscribe();
    };
  }, [partnerId, bookingId, user?.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || !user?.id || !partnerId) return;

    const messageData = {
      senderId: user.id,
      senderName: user.name,
      receiverId: partnerId,
      recipientId: partnerId,
      bookingId: bookingId || null,
      containerId: containerId || null,
      message: inputText.trim(),
      content: inputText.trim(),
    };

    setSending(true); setSendError('');
    try {
      const { data: sent } = await api.post('/chat/messages', { ...messageData, receiverId: Number(String(partnerId).replace(/\D/g, '')) });
      setMessages(prev => prev.some(m => m.id === sent.id) ? prev : [...prev, sent]);
      setInputText('');
    } catch(e) { setSendError(e.response?.data?.message || 'Message was not sent. Please retry.'); }
    finally { setSending(false); }

  };

  return (
    <div className="flex flex-col h-[520px] bg-white border border-[#D8D1C3] rounded-[2px] shadow-sm overflow-hidden">
      {/* Thread Header */}
      <div className="bg-[#0F1B2E] text-[#F3EFE6] px-4 py-3 flex items-center justify-between border-b border-port-gray/40">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-port-teal animate-pulse" />
            <span className="font-heading font-bold text-xs uppercase tracking-wider">
              {partnerName || 'Logistics Partner'}
            </span>
          </div>
          {bookingId && (
            <div className="text-[10px] font-mono text-port-grayLight flex items-center gap-1.5 mt-0.5">
              <IconFileInvoice size={12} />
              <span>Manifest Reference: {bookingId}</span>
              {containerId && <span>• Unit: {containerId}</span>}
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 text-[10px] font-mono text-port-teal bg-port-darker px-2 py-0.5 rounded-[2px] border border-port-teal/30">
          <IconWifi size={12} />
          <span>{wsConnected ? 'LIVE' : 'RECONNECTING'}</span>
        </div>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 p-4 overflow-y-auto bg-[#F9F7F2] space-y-3">
        {loading ? (
          <div className="flex justify-center items-center h-full text-xs font-mono text-port-gray">
            Connecting to secure manifest channel...
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-port-gray p-4">
            <IconMessage2 size={32} className="mb-2 opacity-50" />
            <p className="font-heading text-xs uppercase tracking-wider font-semibold text-port-dark">
              Manifest Communication Channel Open
            </p>
            <p className="text-[11px] font-mono mt-1 max-w-xs">
              Directly coordinate cargo crating, pallet dimensions, customs documentation, and gate arrivals.
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            const rawSenderNum = String(msg.senderId || '').replace(/\D/g, '');
            const rawUserNum = String(user?.id || '').replace(/\D/g, '');
            const isMe = (rawSenderNum && rawUserNum && rawSenderNum === rawUserNum) || msg.senderId === user?.id;
            return (
              <div
                key={msg.id || msg.timestamp}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div className="text-[10px] font-mono text-port-gray mb-0.5">
                  {isMe ? 'You' : msg.senderName} •{' '}
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>

                <div
                  className={`max-w-[80%] rounded-[2px] px-3.5 py-2 text-xs leading-relaxed border ${
                    isMe
                      ? 'bg-[#0F1B2E] text-white border-port-dark shadow-sm'
                      : 'bg-white text-port-dark border-[#D8D1C3] shadow-sm'
                  }`}
                >
                  {msg.content || msg.message}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {sendError && <p role="alert" className="text-red-700 p-2">{sendError}</p>}
      {/* Input Form */}
      <form onSubmit={handleSend} className="p-3 bg-white border-t border-[#D8D1C3] flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Transmit operational instructions, crating queries, or BOL notes..."
          className="flex-1 text-xs border border-port-gray/40 rounded-[2px] px-3 py-2 focus:border-port-teal focus:outline-none bg-[#FAF8F5] font-sans"
        />
        <button
          type="submit"
          disabled={sending || !inputText.trim()}
          className="px-4 py-2 bg-port-orange hover:bg-port-orangeHover disabled:opacity-50 text-white text-xs font-heading font-bold uppercase tracking-wider rounded-[2px] flex items-center gap-1.5 transition-colors"
        >
          <span>Transmit</span>
          <IconSend size={14} />
        </button>
      </form>
    </div>
  );
}
