import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, X, ArrowUpCircle, MessageSquare, Clock } from 'lucide-react';

const chatList = [
  { id: 'C001', customer: 'Rahul Sharma', lastMsg: 'My order still hasn\'t arrived', time: '2m ago', unread: 3, issue: 'Order Delay', ref: 'Order #1024', status: 'active' },
  { id: 'C002', customer: 'Priya Patel', lastMsg: 'I received the wrong item', time: '8m ago', unread: 1, issue: 'Wrong Item', ref: 'Order #1022', status: 'active' },
  { id: 'C003', customer: 'Vikram Nair', lastMsg: 'When will I get my refund?', time: '25m ago', unread: 0, issue: 'Refund', ref: 'Order #1019', status: 'waiting' },
  { id: 'C004', customer: 'Kiran Mehta', lastMsg: 'Driver was very rude', time: '1h ago', unread: 0, issue: 'Driver Behavior', ref: 'Ride #2104', status: 'waiting' },
  { id: 'C005', customer: 'Sneha Reddy', lastMsg: 'Thank you for resolving!', time: '2h ago', unread: 0, issue: 'Order Issue', ref: 'Order #1018', status: 'closed' },
];

type Message = { from: 'customer' | 'agent'; text: string; time: string };

const initialMessages: Record<string, Message[]> = {
  C001: [
    { from: 'customer', text: 'Hi, I placed an order 1 hour ago and it still hasn\'t arrived.', time: '10:02 AM' },
    { from: 'agent', text: 'Hello Rahul! I understand your frustration. Let me check the status of your order right away.', time: '10:04 AM' },
    { from: 'customer', text: 'It\'s been way too long. I need help immediately.', time: '10:05 AM' },
  ],
  C002: [
    { from: 'customer', text: 'I ordered chicken burger but received a veg burger.', time: '09:50 AM' },
    { from: 'agent', text: 'I\'m sorry to hear that, Priya. I\'ll contact the vendor right away and arrange a replacement.', time: '09:52 AM' },
  ],
  C003: [
    { from: 'customer', text: 'I cancelled my order 2 days ago. When will I get my refund?', time: '09:30 AM' },
  ],
  C004: [
    { from: 'customer', text: 'The driver was very rude and refused to follow the GPS route.', time: '09:00 AM' },
  ],
  C005: [
    { from: 'customer', text: 'There was a payment error on my order.', time: '08:00 AM' },
    { from: 'agent', text: 'I\'ve processed a full refund for you. It will reflect in 3-5 business days.', time: '08:10 AM' },
    { from: 'customer', text: 'Thank you for resolving! Great support!', time: '08:15 AM' },
  ],
};

const statusColor: Record<string, string> = {
  active: 'bg-green-500',
  waiting: 'bg-amber-500',
  closed: 'bg-slate-500',
};

export const CustomerChat: React.FC = () => {
  const [selected, setSelected] = useState(chatList[0]);
  const [messages, setMessages] = useState<Record<string, Message[]>>(initialMessages);
  const [draft, setDraft] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selected]);

  const sendMessage = () => {
    if (!draft.trim()) return;
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages(prev => ({
      ...prev,
      [selected.id]: [...(prev[selected.id] || []), { from: 'agent', text: draft.trim(), time: now }],
    }));
    setDraft('');
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const currentMessages = messages[selected.id] || [];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-white text-2xl font-bold">Customer Chat</h1>
        <p className="text-slate-400 text-sm mt-1">Handle live support conversations</p>
      </div>

      <div className="flex bg-slate-900 border border-slate-800 rounded-xl overflow-hidden" style={{ height: '62vh' }}>
        {/* Chat List */}
        <div className="w-72 border-r border-slate-800 flex flex-col flex-shrink-0">
          <div className="p-3 border-b border-slate-800">
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Active Chats ({chatList.filter(c => c.status !== 'closed').length})</p>
          </div>
          <div className="flex-1 overflow-y-auto">
            {chatList.map(c => (
              <button
                key={c.id}
                onClick={() => setSelected(c)}
                className={`w-full text-left p-4 border-b border-slate-800 transition-colors ${selected.id === c.id ? 'bg-slate-800' : 'hover:bg-slate-800/50'}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {c.customer.charAt(0)}
                      </div>
                      <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 ${statusColor[c.status]} rounded-full border border-slate-900`} />
                    </div>
                    <span className="text-slate-200 text-sm font-medium">{c.customer}</span>
                  </div>
                  {c.unread > 0 && (
                    <span className="w-5 h-5 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center">{c.unread}</span>
                  )}
                </div>
                <p className="text-slate-500 text-xs truncate pl-10">{c.lastMsg}</p>
                <div className="flex items-center justify-between pl-10 mt-1">
                  <span className="text-blue-400 text-xs">{c.issue}</span>
                  <span className="text-slate-600 text-xs">{c.time}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Window */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                {selected.customer.charAt(0)}
              </div>
              <div>
                <p className="text-white font-semibold text-sm">{selected.customer}</p>
                <p className="text-slate-400 text-xs">{selected.issue} · {selected.ref}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-white text-xs rounded-lg transition-all">
                <ArrowUpCircle className="w-3.5 h-3.5" /> Escalate
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs rounded-lg transition-all">
                <X className="w-3.5 h-3.5" /> Close Chat
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div className="text-center">
              <span className="text-slate-600 text-xs bg-slate-800 px-3 py-1 rounded-full">Today</span>
            </div>
            {currentMessages.map((m, i) => (
              <div key={i} className={`flex gap-3 ${m.from === 'agent' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${m.from === 'customer' ? 'bg-blue-600' : 'bg-green-600'} text-white`}>
                  {m.from === 'customer' ? selected.customer.charAt(0) : 'A'}
                </div>
                <div className={`max-w-sm rounded-2xl px-4 py-2.5 ${m.from === 'agent' ? 'bg-blue-600 text-white rounded-tr-sm' : 'bg-slate-800 text-slate-200 rounded-tl-sm'}`}>
                  <p className="text-sm">{m.text}</p>
                  <p className={`text-xs mt-1 ${m.from === 'agent' ? 'text-blue-200' : 'text-slate-500'}`}>{m.time}</p>
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="px-4 py-3 border-t border-slate-800 flex items-end gap-3">
            <button className="text-slate-500 hover:text-slate-300 transition-colors mb-2">
              <Paperclip className="w-5 h-5" />
            </button>
            <div className="flex-1">
              <textarea
                value={draft}
                onChange={e => setDraft(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Type a message... (Enter to send)"
                rows={2}
                className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-500 resize-none"
              />
            </div>
            <button
              onClick={sendMessage}
              disabled={!draft.trim()}
              className="w-10 h-10 bg-blue-500 hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl flex items-center justify-center transition-colors flex-shrink-0 mb-1"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
