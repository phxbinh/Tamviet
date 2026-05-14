'use client';

import { useChat } from '@ai-sdk/react';
import { useEffect, useRef } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { SendHorizontal } from 'lucide-react';

// Chạy ổn
//import { ChatMessage } from './ChatMessage';

// Chạy ổn
//import { ChatMessage } from './ChatMessage_';

import { ChatMessage } from './ChatMessage-TwoTools';

export default function ChatSellPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({ 
    api: '/api/productchatbot/bot-sell' 
  });

  const reversedMessages = [...messages].reverse();

  return (
    <div className="flex flex-col h-[100dvh] max-w-4xl mx-auto bg-background overflow-hidden relative">
      
      {/* HEADER */}
      <header className="h-[70px] px-6 flex justify-between items-center border-b border-border/50 shrink-0 z-10 bg-background/80 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
          <h1 className="font-black tracking-tighter uppercase opacity-90 text-lg">
            Tâm Việt <span className="text-blue-500">Sales Bot</span>
          </h1>
        </div>
      </header>

      {/* DANH SÁCH TIN NHẮN */}
      <div className="flex-1 overflow-y-auto px-4 flex flex-col-reverse custom-scrollbar">
        {/* 1. Khoảng trống sát ô nhập (Đáy) */}
        <div className="h-6 shrink-0" />

        {/* 2. Loading state */}
        {isLoading && (
          <div className="flex items-center gap-3 text-muted-foreground animate-pulse ml-4 mb-8">
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">AI đang trả lời...</span>
          </div>
        )}

        {/* 3. Danh sách tin nhắn đảo ngược */}
        {reversedMessages.map((m) => (
          <div key={m.id} className="mb-8">
            <ChatMessage message={m} />
          </div>
        ))}

        {/* 4. FIX CHÍNH: Thẻ này sẽ chiếm hết khoảng trống còn lại, đẩy tin nhắn lên trên */}
        <div className="flex-1" />

        {/* 5. Trạng thái trống */}
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center opacity-30 py-20">
             <p className="text-sm font-medium">Bạn cần hỗ trợ gì về sản phẩm hôm nay?</p>
          </div>
        )}
      </div>

      {/* INPUT AREA */}
      <div className="p-4 md:p-6 bg-gradient-to-t from-background via-background to-transparent shrink-0">
        <form 
          onSubmit={handleSubmit} 
          className="group relative flex items-end gap-2 p-1.5 bg-card/80 backdrop-blur-2xl border border-border/60 rounded-[26px] shadow-2xl focus-within:border-blue-500/50 transition-all"
        >
          <TextareaAutosize
            value={input}
            onChange={handleInputChange}
            maxRows={5}
            placeholder="Tìm nước sâm, cà phê..."
            className="flex-1 bg-transparent border-none focus:ring-0 px-5 py-3.5 outline-none resize-none min-h-[52px] text-[16px] leading-relaxed"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (input.trim()) handleSubmit(e);
              }
            }}
          />
          
          <button 
            type="submit" 
            disabled={!input.trim() || isLoading} 
            className="h-[48px] w-[48px] flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-all disabled:opacity-20 disabled:grayscale shrink-0 shadow-lg active:scale-95"
          >
            <SendHorizontal size={20} strokeWidth={2.5} />
          </button>
        </form>
        <p className="text-[9px] text-center mt-3 opacity-20 uppercase tracking-[0.2em] font-bold">
          Powered by Tâm Việt AI
        </p>
      </div>

      <style jsx global>{`
        body { overflow: hidden; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { 
          background: rgba(155,155,155,0.15); 
          border-radius: 10px; 
        }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
      `}</style>
    </div>
  );
}







