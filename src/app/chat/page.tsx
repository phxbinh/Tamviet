// app/chat/page.tsx
/* Chạy được
'use client';

import { useChat } from '@ai-sdk/react';

export default function ChatPage() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: '/api/chat',
  });

  return (
    <div>
      <h1>Chat</h1>

      {messages.length === 0 && <div>Chưa có message</div>}

      {messages.map((m) => (
        <div key={m.id}>
          {m.role}: {m.content}
        </div>
      ))}

      <form onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Nhập câu hỏi..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
*/

/*
'use client';

import { useChat } from '@ai-sdk/react';
import { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function ChatPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      api: '/api/chat',
    });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // auto scroll khi có message mới
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-full max-w-3xl mx-auto p-4">

      <div className="flex-1 overflow-y-auto space-y-6 pb-6">

        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${
              m.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] rounded-xl px-4 py-3 text-sm leading-relaxed shadow-sm
              ${
                m.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800'
              }`}
            >
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {m.content}
              </ReactMarkdown>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="text-gray-500 text-sm">AI đang suy nghĩ...</div>
        )}

        <div ref={messagesEndRef} />
      </div>

  
      <form
        onSubmit={handleSubmit}
        className="border-t pt-4 flex gap-3"
      >
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Hỏi gì cũng được..."
          className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900"
        />

        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          Gửi
        </button>
      </form>
    </div>
  );
}
*/



/* 🟢🟢
'use client';

import { useChat } from '@ai-sdk/react';
import { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function ChatPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({ api: '/api/chat' });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto px-4 sm:px-6 bg-transparent">
      
    
      <header className="py-6 flex justify-between items-center border-b border-border/50">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-neon-cyan animate-pulse" />
          <h1 className="font-bold tracking-tight opacity-90">GEMINI AI</h1>
        </div>
        <span className="text-[10px] opacity-40 font-mono">v3.0.0-flash</span>
      </header>

      
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar py-8 space-y-8">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-3 duration-500`}
          >
            <div
              className={`max-w-[90%] sm:max-w-[80%] px-5 py-4 shadow-xl border backdrop-blur-sm
              ${
                m.role === 'user'
                  ? 'bg-primary text-white border-transparent rounded-3xl rounded-tr-none shadow-primary/10'
                  : 'bg-card text-foreground border-border rounded-3xl rounded-tl-none shadow-black/5'
              }`}
            >
              
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                className="prose dark:prose-invert prose-sm max-w-none break-words"
                components={{
                  // Tinh chỉnh hiển thị Code Block
                  code({ node, inline, className, children, ...props }: any) {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (
                      <div className="relative my-4 rounded-lg overflow-hidden border border-white/10 shadow-2xl">
                        <div className="flex items-center justify-between px-4 py-2 bg-[#1e1e1e] border-b border-white/5">
                           <span className="text-[10px] font-mono text-gray-400 uppercase">{match[1]}</span>
                           <button className="text-[10px] text-gray-500 hover:text-white transition-colors">Copy</button>
                        </div>
                        <SyntaxHighlighter
                          style={vscDarkPlus}
                          language={match[1]}
                          PreTag="div"
                          customStyle={{ margin: 0, padding: '1.25rem', fontSize: '13px', background: '#1e1e1e' }}
                          {...props}
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      </div>
                    ) : (
                      <code className="bg-black/10 dark:bg-white/10 px-1.5 py-0.5 rounded text-neon-cyan font-mono" {...props}>
                        {children}
                      </code>
                    );
                  },
                  // Tinh chỉnh list và link
                  ul: ({children}) => <ul className="list-disc ml-4 space-y-1">{children}</ul>,
                  a: ({children, href}) => <a href={href} target="_blank" className="text-neon-cyan hover:underline">{children}</a>
                }}
              >
                {m.content}
              </ReactMarkdown>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-3 text-muted-foreground animate-pulse">
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
            <span className="text-xs font-medium italic opacity-60">AI is generating...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      
      <div className="py-6 border-t border-border/30">
        <form
          onSubmit={handleSubmit}
          className="group relative flex items-center p-1.5 bg-card/80 backdrop-blur-md border border-border rounded-[22px] shadow-2xl focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/10 transition-all duration-300"
        >
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="Type your message..."
            className="flex-1 bg-transparent border-none focus:ring-0 px-4 py-3 text-[15px] placeholder:opacity-40"
          />

          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="h-11 px-6 bg-primary text-white font-bold rounded-[16px] hover:scale-[1.02] active:scale-95 disabled:opacity-20 disabled:grayscale transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
          >
            <span>Gửi</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
          </button>
        </form>
      </div>
    </div>
  );
}*/



'use client';

import { useChat } from '@ai-sdk/react';
import { useEffect, useRef, memo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

// Tạo một component riêng cho Message để tối ưu performance
const ChatMessage = memo(({ message }: { message: any }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-3 duration-500`}>
      <div className={`max-w-[90%] sm:max-w-[80%] px-5 py-4 shadow-xl border backdrop-blur-sm
        ${isUser 
          ? 'bg-primary text-white border-transparent rounded-3xl rounded-tr-none' 
          : 'bg-card text-foreground border-border rounded-3xl rounded-tl-none'}`}>
        
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          // Thêm class prose-stream để kích hoạt animation mượt
          className={`prose dark:prose-invert prose-sm max-w-none break-words ${!isUser ? 'prose-stream' : ''}`}
          components={{
            code({ node, inline, className, children, ...props }: any) {
              const match = /language-(\w+)/.exec(className || '');
              return !inline && match ? (
                <div className="relative my-4 rounded-lg overflow-hidden border border-white/5 shadow-2xl">
                  <div className="flex items-center justify-between px-4 py-2 bg-[#1e1e1e]/80 border-b border-white/5">
                    <span className="text-[10px] font-mono text-gray-400 uppercase">{match[1]}</span>
                  </div>
                  <SyntaxHighlighter
                    style={vscDarkPlus}
                    language={match[1]}
                    PreTag="div"
                    customStyle={{ margin: 0, padding: '1.25rem', fontSize: '13px', background: '#1e1e1e' }}
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                </div>
              ) : (
                <code className="bg-primary/10 text-primary dark:text-neon-cyan px-1.5 py-0.5 rounded font-mono" {...props}>
                  {children}
                </code>
              );
            }
          }}
        >
          {message.content}
        </ReactMarkdown>
      </div>
    </div>
  );
});

ChatMessage.displayName = 'ChatMessage';

export default function ChatPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
    // Cấu hình quan trọng: Tăng độ mượt của stream bằng cách ép UI cập nhật ổn định
    onFinish: () => {
        // Có thể thêm rung nhẹ hoặc âm thanh khi xong
    }
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll mượt nhưng không quá gắt
  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto px-4 sm:px-6 bg-transparent">
      <header className="py-6 flex justify-between items-center border-b border-border/50 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-neon-cyan shadow-[0_0_10px_#22d3ee]" />
          <h1 className="font-bold tracking-tighter opacity-90 text-xl">GEMINI</h1>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar py-8 space-y-8">
        {messages.map((m) => (
          <ChatMessage key={m.id} message={m} />
        ))}

        {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
           <div className="flex items-center gap-2 text-primary animate-pulse ml-2">
             <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce [animation-delay:-0.3s]" />
             <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce [animation-delay:-0.15s]" />
             <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" />
           </div>
        )}
        <div ref={messagesEndRef} className="h-4" />
      </div>

      <div className="py-6 bg-gradient-to-t from-background via-background to-transparent">
{/*
        <form
          onSubmit={handleSubmit}
          className="group relative flex items-center p-1.5 bg-card/50 backdrop-blur-xl border border-border rounded-[24px] shadow-2xl focus-within:border-primary transition-all duration-500"
        >
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="Nhập câu hỏi tại đây..."
            className="flex-1 bg-transparent border-none focus:ring-0 px-5 py-3 text-[15px]"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="h-11 w-11 flex items-center justify-center bg-primary text-white rounded-full hover:scale-105 active:scale-90 disabled:opacity-20 transition-all shadow-lg"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
          </button>
        </form>
*/}

<form
  onSubmit={handleSubmit}
  /* 1. Xóa 'focus-within:ring' để bỏ viền xanh mặc định */
  className="group relative flex items-center p-1.5 bg-card/50 backdrop-blur-xl border border-border rounded-[24px] shadow-2xl transition-all duration-500"
>
  <input
    value={input}
    onChange={handleInputChange}
    placeholder="Nhập câu hỏi tại đây..."
    /* 2. Thêm 'focus:ring-0' và 'outline-none' để tắt hoàn toàn highlight */
    className="flex-1 bg-transparent border-none outline-none focus:ring-0 focus:outline-none px-5 py-3 text-[15px] placeholder:opacity-30"
  />
  
  <button
    type="submit"
    disabled={!input.trim() || isLoading}
    className="h-11 w-11 flex items-center justify-center bg-primary text-white rounded-full hover:scale-105 active:scale-95 disabled:opacity-20 transition-all shadow-lg"
  >
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>
    </svg>
  </button>
</form>






      </div>
    </div>
  );
}







