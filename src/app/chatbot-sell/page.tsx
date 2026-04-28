/*'use client';

import { useChat } from '@ai-sdk/react';
import { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
*/

'use client';

import { useChat } from '@ai-sdk/react';
import { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { getPublicImageUrl } from '@/lib/supabase/publicUrl';

export default function ChatSellPage() {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading
  } = useChat({ api: '/api/productchatbot/bot-sell' });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Tự động cuộn xuống khi có tin nhắn mới
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Đã sao chép vào bộ nhớ tạm!");
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto px-4 bg-transparent text-foreground font-sans">
      
      {/* Header */}
      <header className="py-6 flex justify-between items-center border-b border-border/50">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse" />
          <h1 className="font-black tracking-tighter uppercase opacity-90 text-xl">
            Tâm Việt <span className="text-blue-500">Sales Bot</span>
          </h1>
        </div>
        <div className="px-3 py-1 rounded-full bg-secondary/50 border border-border text-[10px] font-mono opacity-60 uppercase tracking-widest">
          Hybrid-SQL-Vector
        </div>
      </header>

      {/* Danh sách tin nhắn */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar py-8 space-y-10">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-40 space-y-4">
            <div className="p-8 rounded-[40px] bg-secondary/20 border border-dashed border-border/50">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            </div>
            <p className="text-sm font-medium tracking-tight">Xin chào! Bạn cần tìm sản phẩm gì tại Tâm Việt hôm nay?</p>
          </div>
        )}

        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-3 duration-500`}
          >
            {/* Nội dung Chat chính */}
            <div
              className={`max-w-[85%] px-6 py-4 shadow-2xl border backdrop-blur-md
              ${
                m.role === 'user'
                  ? 'bg-blue-600 text-white border-transparent rounded-[28px] rounded-tr-none'
                  : 'bg-card text-foreground border-border/50 rounded-[28px] rounded-tl-none'
              }`}
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                className="prose dark:prose-invert prose-sm max-w-none break-words leading-relaxed"
                components={{
                  code({ node, inline, className, children, ...props }: any) {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (
                      <div className="relative my-4 rounded-xl overflow-hidden border border-white/5 shadow-2xl">
                        <div className="flex items-center justify-between px-4 py-2 bg-black/40 border-b border-white/5">
                           <span className="text-[10px] font-mono text-gray-400">{match[1]}</span>
                           <button 
                            onClick={() => copyToClipboard(String(children))}
                            className="text-[10px] text-gray-500 hover:text-white transition-colors"
                           >Copy</button>
                        </div>
                        <SyntaxHighlighter
                          style={vscDarkPlus}
                          language={match[1]}
                          PreTag="div"
                          customStyle={{ margin: 0, padding: '1.25rem', fontSize: '13px', background: 'transparent' }}
                          {...props}
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      </div>
                    ) : (
                      <code className="bg-black/10 dark:bg-white/10 px-1.5 py-0.5 rounded text-blue-400 font-mono" {...props}>
                        {children}
                      </code>
                    );
                  }
                }}
              >
                {m.content}
              </ReactMarkdown>
            </div>

            {/* Xử lý Tool Invocations (Product Cards) */}
            {m.toolInvocations?.map((toolInvocation) => {
              const { toolName, toolCallId, state } = toolInvocation;

              if (toolName === 'showProductCards') {
                return (
                  <div key={toolCallId} className="w-full mt-4 flex justify-start pl-2">
                    {state === 'result' ? (
                      <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar max-w-full">
                        {toolInvocation.result.map((product: any) => (
                          <div 
                            key={product.slug} 
                            className="min-w-[220px] max-w-[220px] group bg-card border border-border/60 rounded-[32px] overflow-hidden shadow-sm hover:shadow-2xl hover:border-blue-500/40 transition-all duration-500"
                          >
                            {/* Thumbnail */}
                            <div className="relative h-36 w-full bg-secondary/20 overflow-hidden">
                              <img 
                                src={getPublicImageUrl(product.image)} 
                                alt={product.title} 
                                className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
                              />
                              <div className="absolute top-3 left-3 px-2.5 py-1 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full text-[9px] text-white font-bold uppercase tracking-widest shadow-xl">
                                IN STOCK
                              </div>
                            </div>

                            <div className="p-5 space-y-3">
                              <h4 className="font-bold text-[14px] line-clamp-2 h-10 leading-[1.3] tracking-tight opacity-90 group-hover:text-blue-500 transition-colors">
                                {product.title}
                              </h4>
                              
                              <div className="flex items-center justify-between pt-1">
                                <span className="text-blue-600 dark:text-blue-400 font-black text-[15px]">
                                  {product.price}
                                </span>
                              </div>

                              <a 
                                href={product.url}
                                target="_blank"
                                className="mt-4 block w-full text-center py-3 bg-secondary/50 hover:bg-blue-600 hover:text-white rounded-[18px] text-[11px] font-black transition-all duration-300 uppercase tracking-widest shadow-sm"
                              >
                                Chi tiết
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 py-2 text-[10px] text-muted-foreground font-bold tracking-[0.2em] uppercase animate-pulse">
                         <div className="w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                         Đang tải sản phẩm...
                      </div>
                    )}
                  </div>
                );
              }
              return null;
            })}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-3 text-muted-foreground animate-pulse ml-2">
            <div className="flex gap-1.5">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-50">Tâm Việt AI đang xử lý</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="py-8 border-t border-border/20">
        <form
          onSubmit={handleSubmit}
          className="group relative flex items-center p-2 bg-card/40 backdrop-blur-2xl border border-border/50 rounded-[30px] shadow-xl focus-within:border-blue-500/50 transition-all duration-500"
        >
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="Tìm nước sâm, cà phê, hay dừa tươi..."
            className="flex-1 bg-transparent border-none focus:ring-0 px-6 py-4 text-[15px] placeholder:opacity-30 outline-none font-medium"
          />

          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="h-14 px-8 bg-blue-600 text-white font-black rounded-[24px] hover:scale-[1.03] active:scale-95 disabled:opacity-20 transition-all shadow-xl shadow-blue-500/20 flex items-center gap-2 uppercase text-[11px] tracking-widest"
          >
            Gửi ngay
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
          </button>
        </form>
        <p className="text-[9px] text-center mt-4 opacity-30 uppercase font-black tracking-[0.4em]">
          Powered by Neon Vector & Gemini AI
        </p>
      </div>

      {/* Thêm style để ẩn scrollbar của Product Cards */}
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(155, 155, 155, 0.1);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
