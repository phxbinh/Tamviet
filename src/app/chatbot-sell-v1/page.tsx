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



//export default 
function ChatSellPage_() {
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
      <div className="py-4 border-t border-border/20">
        {/* <form onSubmit={handleSubmit} className="group relative flex items-center p-2 bg-card/40 backdrop-blur-2xl border border-border/50 rounded-[30px] shadow-xl">
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="Tìm nước sâm, cà phê..."
            className="flex-1 bg-transparent border-none focus:ring-0 px-6 py-4 outline-none"
          />
          <button type="submit" disabled={!input.trim() || isLoading} className="h-14 px-8 bg-blue-600 text-white font-black rounded-[24px]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
          </button>
        </form> */}

<form 
  onSubmit={handleSubmit} 
  className="group relative flex items-end gap-2 p-2 bg-card/40 backdrop-blur-2xl border border-border/50 rounded-[30px] shadow-xl focus-within:border-border transition-all"
>
  <TextareaAutosize
    value={input}
    onChange={handleInputChange}
    maxRows={5} // Giới hạn chiều cao tối đa để không tràn màn hình
    placeholder="Tìm nước sâm, cà phê..."
    className="flex-1 bg-transparent border-none focus:ring-0 px-6 py-4 outline-none resize-none min-h-[56px] py-[18px] leading-relaxed"
    onKeyDown={(e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit(e);
      }
    }}
  />
  
  <button 
    type="submit" 
    disabled={!input.trim() || isLoading} 
    className="h-[56px] w-[56px] flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-all disabled:opacity-50 disabled:grayscale shrink-0"
  >
    <SendHorizontal size={22} strokeWidth={2.5} />
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



// ... trong component của bạn
/*
<form 
  onSubmit={handleSubmit} 
  className="group relative flex items-end gap-2 p-2 bg-card/40 backdrop-blur-2xl border border-border/50 rounded-[30px] shadow-xl focus-within:border-border transition-all"
>
  <TextareaAutosize
    value={input}
    onChange={handleInputChange}
    maxRows={5} // Giới hạn chiều cao tối đa để không tràn màn hình
    placeholder="Tìm nước sâm, cà phê..."
    className="flex-1 bg-transparent border-none focus:ring-0 px-6 py-4 outline-none resize-none min-h-[56px] py-[18px] leading-relaxed"
    onKeyDown={(e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit(e);
      }
    }}
  />
  
  <button 
    type="submit" 
    disabled={!input.trim() || isLoading} 
    className="h-[56px] w-[56px] flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-all disabled:opacity-50 disabled:grayscale shrink-0"
  >
    <SendHorizontal size={22} strokeWidth={2.5} />
  </button>
</form>
*/

/*
'use client';

import { useChat } from '@ai-sdk/react';
import { useEffect, useRef } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { SendHorizontal } from 'lucide-react';
import { ChatMessage } from './ChatMessage-TwoTools';
*/

export default function ChatSellPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({ 
    api: '/api/productchatbot/bot-sell' 
  });

  // Tạo một mảng đảo ngược để dùng với flex-col-reverse
  const reversedMessages = [...messages].reverse();

  return (
    // h-[100dvh] giúp fix lỗi layout trên Safari iOS
    <div className="flex flex-col h-[100dvh] max-w-4xl mx-auto bg-transparent text-foreground font-sans overflow-hidden">
      
      {/* Header - Giữ nguyên nhưng thêm px-4 */}
      <header className="py-4 px-4 flex justify-between items-center border-b border-border/50 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <h1 className="font-black tracking-tighter uppercase opacity-90 text-lg">
            Tâm Việt <span className="text-blue-500">Sales Bot</span>
          </h1>
        </div>
      </header>

      {/* Danh sách tin nhắn - Dùng flex-col-reverse để tự động scroll xuống đáy */}
      <div className="flex-1 overflow-y-auto px-4 custom-scrollbar flex flex-col-reverse">
        {/* Phần tử mồi để tạo khoảng trống dưới cùng */}
        <div className="h-6 shrink-0" />

        {isLoading && (
          <div className="flex items-center gap-3 text-muted-foreground animate-pulse ml-2 mb-4">
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Đang xử lý...</span>
          </div>
        )}

        {/* Render từ mới nhất đến cũ nhất vì class flex-col-reverse */}
        {reversedMessages.map((m) => (
          <div key={m.id} className="mb-6">
            <ChatMessage message={m} />
          </div>
        ))}

        {messages.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center opacity-40 py-20">
             <p className="text-sm">Xin chào! Bạn cần tìm sản phẩm gì?</p>
          </div>
        )}
      </div>

      {/* Input Form - Cố định ở đáy */}
      <div className="p-4 bg-background/80 backdrop-blur-md border-t border-border/20 shrink-0">
        <form 
          onSubmit={handleSubmit} 
          className="group relative flex items-end gap-2 p-1.5 bg-card/60 backdrop-blur-2xl border border-border/50 rounded-[28px] shadow-lg focus-within:border-blue-500/50 transition-all"
        >
          <TextareaAutosize
            value={input}
            onChange={handleInputChange}
            maxRows={4}
            placeholder="Tìm nước sâm, cà phê..."
            className="flex-1 bg-transparent border-none focus:ring-0 px-5 py-3 outline-none resize-none min-h-[48px] text-[16px] leading-relaxed" // text-[16px] để tránh iOS tự động zoom input
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
            className="h-[44px] w-[44px] flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-all disabled:opacity-30 disabled:grayscale shrink-0"
          >
            <SendHorizontal size={20} strokeWidth={2.5} />
          </button>
        </form>
        
        {/* Tip nhỏ cho mobile: Hiển thị dòng chú thích mờ dưới cùng */}
        <p className="text-[10px] text-center mt-2 opacity-30 uppercase tracking-widest">
          Tâm Việt Platform © 2026
        </p>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(155,155,155,0.1); border-radius: 10px; }
        /* Loại bỏ highlight màu xanh khi tap trên mobile */
        * { -webkit-tap-highlight-color: transparent; }
      `}</style>
    </div>
  );
}



