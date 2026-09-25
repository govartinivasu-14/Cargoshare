import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
const WS_URL = import.meta.env.VITE_WS_URL || '/ws';
const numericId = value => Number(String(value).replace(/\D/g, ''));
export function getChatThreadTopic(a, b) {
  const ids = [numericId(a), numericId(b)].sort((x, y) => x - y);
  return ids.every(id => id > 0) ? `/topic/chat/${ids.join('_')}` : null;
}
class WebSocketService {
  client = null;
  subscriptions = new Set();
  get connected() { return Boolean(this.client?.connected); }
  connect() {
    if (this.client?.active) return;
    const client = new Client({
      webSocketFactory: () => new SockJS(WS_URL),
      connectHeaders: { Authorization: `Bearer ${localStorage.getItem('cargoshare_token')}` },
      reconnectDelay: 4000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      onConnect: () => {
        if (this.client !== client) return;
        this.subscriptions.forEach(sub => this.attach(sub));
      },
      onWebSocketClose: () => {
        if (this.client !== client) return;
        this.subscriptions.forEach(sub => { sub.stomp = null; });
      },
      onStompError: frame => console.warn('Live connection error:', frame.headers.message),
    });
    this.client = client;
    client.activate();
  }
  disconnect() {
    const client = this.client;
    this.client = null;
    this.subscriptions.forEach(sub => { sub.stomp = null; });
    client?.deactivate();
  }
  attach(sub) {
    if (!this.connected || sub.stomp) return;
    sub.stomp = this.client.subscribe(sub.destination, message => sub.callback(JSON.parse(message.body)));
  }
  subscribe(destination, callback) {
    if (!destination) return () => {};
    const sub = { destination, callback, stomp: null };
    this.subscriptions.add(sub);
    this.attach(sub);
    return () => {
      this.subscriptions.delete(sub);
      if (this.connected && sub.stomp) sub.stomp.unsubscribe();
    };
  }
  subscribeToContainer(id, callback) { return this.subscribe(`/topic/containers/${id}`, callback); }
  subscribeToChat(a, b, callback) { return this.subscribe(getChatThreadTopic(a, b), callback); }
}
export const wsService = new WebSocketService();
