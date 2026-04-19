'use client';

import { useChat } from '@ai-sdk/react';
import { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function PolicyChatPage() {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
  } = useChat({ api: '/api/seed-policy' });

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const lastMessage = messages[messages.length - 1];

  // Scroll mượt khi có message mới
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  // Auto focus input
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto px-4 bg-transparent text-foreground">
      
      {/* Header */}
      <header className="py-6 flex justify-between items-center border-b border-border/50">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse" />
          <h1 className="font-black tracking-tighter uppercase opacity-90 text-xl">
            Policy AI <span className="text-blue-500">Bot</span>
          </h1>
        </div>
        <div className="px-3 py-1 rounded-full bg-secondary/50 border border-border text-[10px] font-mono opacity-60">
          NEON-VECTOR-ENABLED
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar py-8 space-y-8">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-40 space-y-4">
            <div className="p-6 rounded-full bg-secondary/20 border border-dashed border-border">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            </div>
            <p className="text-sm font-medium">
              Hỏi tôi bất cứ điều gì về chính sách công ty...
            </p>
          </div>
        )}

        {messages.map((m, idx) => {
          const isLast = idx === messages.length - 1;
          const isStreamingMsg = isLoading && m.role === 'assistant' && isLast;

          return (
            <div
              key={m.id}
              className={`flex ${
                m.role === 'user' ? 'justify-end' : 'justify-start'
              } animate-in fade-in slide-in-from-bottom-3 duration-500`}
            >
              <div
                className={`max-w-[85%] px-5 py-4 shadow-2xl border backdrop-blur-md ${
                  m.role === 'user'
                    ? 'bg-blue-600 text-white border-transparent rounded-3xl rounded-tr-none'
                    : 'bg-card text-foreground border-border rounded-3xl rounded-tl-none'
                }`}
              >
                {isStreamingMsg ? (
                  <p className="whitespace-pre-wrap text-sm">
                    {m.content}
                    <span className="inline-block w-2 h-4 ml-1 bg-blue-500 animate-pulse" />
                  </p>
                ) : (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    className="prose dark:prose-invert prose-sm max-w-none break-words"
                    components={{
                      code({ inline, className, children, ...props }: any) {
                        const match = /language-(\w+)/.exec(className || '');

                        if (!inline && match) {
                          return (
                            <div className="relative my-4 rounded-xl overflow-hidden border border-white/5 shadow-2xl">
                              <div className="flex items-center justify-between px-4 py-2 bg-black/40 border-b border-white/5">
                                <span className="text-[10px] font-mono text-gray-400">
                                  {match[1]}
                                </span>
                                <button
                                  onClick={() => copyToClipboard(String(children))}
                                  className="text-[10px] text-gray-500 hover:text-white transition-colors"
                                >
                                  Copy
                                </button>
                              </div>

                              <SyntaxHighlighter
                                style={vscDarkPlus}
                                language={match[1]}
                                PreTag="div"
                                customStyle={{
                                  margin: 0,
                                  padding: '1.25rem',
                                  fontSize: '13px',
                                  background: 'transparent',
                                }}
                                {...props}
                              >
                                {String(children).replace(/\n$/, '')}
                              </SyntaxHighlighter>
                            </div>
                          );
                        }

                        return (
                          <code
                            className="bg-black/10 dark:bg-white/10 px-1.5 py-0.5 rounded text-blue-400 font-mono"
                            {...props}
                          >
                            {children}
                          </code>
                        );
                      },
                    }}
                  >
                    {m.content}
                  </ReactMarkdown>
                )}
              </div>
            </div>
          );
        })}

        {/* Loading */}
        {isLoading && lastMessage?.role !== 'assistant' && (
          <div className="flex items-center gap-3 text-muted-foreground animate-pulse ml-2">
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-50">
              AI đang tra cứu...
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="py-6 border-t border-border/30">
        <form
          onSubmit={handleSubmit}
          className="group relative flex items-center p-1.5 bg-card/80 backdrop-blur-lg border border-border rounded-[26px] shadow-2xl focus-within:border-blue-500/50 transition-all duration-300"
        >
          <input
            ref={inputRef}
            value={input}
            onChange={handleInputChange}
            placeholder="Nhập câu hỏi về quy định công ty..."
            className="flex-1 bg-transparent border-none focus:ring-0 px-5 py-3 text-[15px] placeholder:opacity-30 outline-none"
          />

          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="h-12 px-6 bg-blue-600 text-white font-bold rounded-[20px] hover:scale-[1.02] active:scale-95 disabled:opacity-20 transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2"
          >
            <span className="hidden sm:inline">Gửi</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="m22 2-7 20-4-9-9-4Z"/>
              <path d="M22 2 11 13"/>
            </svg>
          </button>
        </form>

        <p className="text-[9px] text-center mt-3 opacity-30 uppercase tracking-[0.2em]">
          Dữ liệu được truy vấn từ hệ thống nội bộ
        </p>
      </div>
    </div>
  );
}