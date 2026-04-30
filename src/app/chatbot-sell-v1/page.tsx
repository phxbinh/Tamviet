'use client';

import { useChat } from '@ai-sdk/react';
import { useEffect, useRef } from 'react';
import { ChatMessage } from './ChatMessage';

export default function ChatSellPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({ 
    api: '/api/productchatbot/bot-sell' 
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto px-4 bg-transparent text-foreground font-sans">
      
      {/* Header - Có thể tách tiếp nếu muốn */}
      <header className="py-6 flex justify-between items-center border-b border-border/50">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse" />
          <h1 className="font-black tracking-tighter uppercase opacity-90 text-xl">
            Tâm Việt <span className="text-blue-500">Sales Bot</span>
          </h1>
        </div>
      </header>

      {/* Danh sách tin nhắn */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar py-8 space-y-10">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center opacity-40">
             <p>Xin chào! Bạn cần tìm sản phẩm gì?</p>
          </div>
        )}

        {messages.map((m) => (
          <ChatMessage key={m.id} message={m} />
        ))}

        {isLoading && (
          <div className="flex items-center gap-3 text-muted-foreground animate-pulse ml-2">
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Tâm Việt AI đang xử lý</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="py-8 border-t border-border/20">
        <form onSubmit={handleSubmit} className="group relative flex items-center p-2 bg-card/40 backdrop-blur-2xl border border-border/50 rounded-[30px] shadow-xl">
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="Tìm nước sâm, cà phê..."
            className="flex-1 bg-transparent border-none focus:ring-0 px-6 py-4 outline-none"
          />
          <button type="submit" disabled={!input.trim() || isLoading} className="h-14 px-8 bg-blue-600 text-white font-black rounded-[24px]">
            GỬI NGAY
          </button>
        </form>
      </div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(155,155,155,0.1); border-radius: 10px; }
      `}</style>
    </div>
  );
}
