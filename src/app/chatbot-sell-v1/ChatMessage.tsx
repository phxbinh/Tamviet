// /chatbot-sell-v1/ChatMessage.tsx
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ProductCard } from './ProductCard';

export function ChatMessage({ message }: { message: any }) {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Đã sao chép!");
  };

  return (
    <div className={`flex flex-col ${message.role === 'user' ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-3 duration-500`}>
      <div className={`max-w-[85%] px-6 py-4 shadow-2xl border backdrop-blur-md ${
        message.role === 'user' ? 'bg-blue-600 text-white border-transparent rounded-[28px] rounded-tr-none' : 'bg-card text-foreground border-border/50 rounded-[28px] rounded-tl-none'
      }`}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          className="prose dark:prose-invert prose-sm max-w-none break-words leading-relaxed"
          components={{
            code({ inline, className, children, ...props }: any) {
              const match = /language-(\w+)/.exec(className || '');
              return !inline && match ? (
                <div className="relative my-4 rounded-xl overflow-hidden border border-white/5 shadow-2xl">
                  <div className="flex items-center justify-between px-4 py-2 bg-black/40 border-b border-white/5">
                    <span className="text-[10px] font-mono text-gray-400">{match[1]}</span>
                    <button onClick={() => copyToClipboard(String(children))} className="text-[10px] text-gray-500 hover:text-white">Copy</button>
                  </div>
                  <SyntaxHighlighter style={vscDarkPlus} language={match[1]} PreTag="div" customStyle={{ margin: 0, padding: '1.25rem', fontSize: '13px', background: 'transparent' }} {...props}>
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                </div>
              ) : (
                <code className="bg-black/10 dark:bg-white/10 px-1.5 py-0.5 rounded text-blue-400 font-mono" {...props}>{children}</code>
              );
            }
          }}
        >
          {message.content}
        </ReactMarkdown>
      </div>

      {/* Render Tools (Product Cards) */}
      {message.toolInvocations?.map((tool: any) => (
        <div key={tool.toolCallId} className="w-full mt-4 flex justify-start pl-2">
          {tool.toolName === 'showProductCards' && tool.state === 'result' ? (
            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar max-w-full">
              {tool.result.products.map((p: any) => <ProductCard key={p.slug} product={p} />)}
            </div> 
          ) : tool.state !== 'result' && (
            <div className="flex items-center gap-3 py-2 text-[10px] text-muted-foreground font-bold uppercase animate-pulse">
               <div className="w-2 h-2 bg-blue-500 rounded-full" /> Đang tải sản phẩm...
            </div>
          )}
        </div>
      ))}

      {/* Render Tools (Related Product) */}
      {message.toolInvocations?.map((tool: any) => (
        <div key={tool.toolCallId} className="w-full mt-4 flex justify-start pl-2">
          {tool.toolName === 'showProductCards' && tool.state === 'result' ? (
            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar max-w-full">
              {tool.result.related.map((p: any) => <ProductCard key={p.slug} product={p} />)}
            </div>
          ) : tool.state !== 'result' && (
            <div className="flex items-center gap-3 py-2 text-[10px] text-muted-foreground font-bold uppercase animate-pulse">
               <div className="w-2 h-2 bg-blue-500 rounded-full" /> Đang tải sản phẩm...
            </div>
          )}
        </div>
      ))}
    </div>
  );
}


/*
      {message.toolInvocations?.map((tool: any) => (
        <div key={tool.toolCallId} className="w-full mt-4 flex justify-start pl-2">
          {tool.toolName === 'showProductCards' && tool.state === 'result' ? (
            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar max-w-full">
              {tool.result.related.map((p: any) => <ProductCard key={p.slug} product={p} />)}
            </div>
          ) : tool.state !== 'result' && (
            <div className="flex items-center gap-3 py-2 text-[10px] text-muted-foreground font-bold uppercase animate-pulse">
               <div className="w-2 h-2 bg-blue-500 rounded-full" /> Đang tải sản phẩm...
            </div>
          )}
        </div>
      ))}*/
