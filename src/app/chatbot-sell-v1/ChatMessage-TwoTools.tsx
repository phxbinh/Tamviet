// /chatbot-sell-v1/ChatMessage.tsx
'use client';

import { useState } from 'react';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

import { ProductCard } from './ProductCard_';
import { ProductModal } from './_modal-product-card/ProductModal';
//src/app/chatbot-sell-v1/_modal-product-card
import { CategoryCTA } from './CategoryCTA';



export function ChatMessage({ message }: { message: any }) {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Đã sao chép!');
  };

  return (
    <div
      className={`flex flex-col ${
        message.role === 'user' ? 'items-end' : 'items-start'
      } animate-in fade-in slide-in-from-bottom-3 duration-500`}
    >
      {message.content?.trim() && (
        <div
          className={`max-w-[85%] px-6 py-4 shadow-2xl border backdrop-blur-md ${
            message.role === 'user'
              ? 'bg-blue-600 text-white border-transparent rounded-[28px] rounded-tr-none'
              : 'bg-card text-foreground border-border/50 rounded-[28px] rounded-tl-none'
          }`}
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            className="prose dark:prose-invert prose-sm max-w-none break-words leading-relaxed"
            components={{
              code({ inline, className, children, ...props }: any) {
                const match = /language-(\w+)/.exec(className || '');

                return !inline && match ? (
                  <div className="relative my-4 rounded-xl overflow-hidden border border-white/5 shadow-2xl">
                    <div className="flex items-center justify-between px-4 py-2 bg-black/40 border-b border-white/5">
                      <span className="text-[10px] font-mono text-gray-400">
                        {match[1]}
                      </span>

                      <button
                        onClick={() =>
                          copyToClipboard(String(children))
                        }
                        className="text-[10px] text-gray-500 hover:text-white"
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
                ) : (
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
            {message.content}
          </ReactMarkdown>
        </div>
      )}

      {/* Render Tools (Product Cards) */}
{/*
      {message.toolInvocations?.map((tool: any) => {
        if (
          tool.toolName !== 'showProductCards' ||
          tool.state !== 'result'
        ) {
          return null;
        }

        return (
          <div
            key={tool.toolCallId}
            className="w-full mt-4 flex flex-col gap-4"
          >
            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
              {tool.result.products?.map((p: any) => (
                <ProductCard
                  key={p.slug}
                  product={p}
                  onViewDetail={() => setSelectedSlug(p.slug)}
                />
              ))}
            </div>

            {!!tool.result.crossSell?.length && (
              <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                {tool.result.crossSell.map((p: any) => (
                  <ProductCard
                    key={p.slug}
                    product={p}
                    onViewDetail={() => setSelectedSlug(p.slug)}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}
*/}

{/* Render Tools */}
{message.toolInvocations?.map((tool: any) => {

  // ==============================
  // PRODUCT CARDS
  // ==============================
  if (
    tool.toolName === 'showProductCards' &&
    tool.state === 'result'
  ) {
    return (
      <div
        key={tool.toolCallId}
        className="w-full mt-4 flex flex-col gap-4"
      >
        {/* Main Products */}
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
          {tool.result.products?.map((p: any) => (
            <ProductCard
              key={p.slug}
              product={p}
              onViewDetail={() =>
                setSelectedSlug(p.slug)
              }
            />
          ))}
        </div>

        {/* Cross Sell */}
        {!!tool.result.crossSell?.length && (
          <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
            {tool.result.crossSell.map((p: any) => (
              <ProductCard
                key={p.slug}
                product={p}
                onViewDetail={() =>
                  setSelectedSlug(p.slug)
                }
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  // ==============================
  // CATEGORY CTA
  // ==============================
  if (
    tool.toolName === 'openCategoryPage' &&
    tool.state === 'result'
  ) {
    return (
      <CategoryCTA
        key={tool.toolCallId}
        category={tool.result.category}
        page={tool.result.page}
        label={tool.result.ctaLabel}
      />
    );
  }

  return null;
})}


      {/* Modal */}
      <ProductModal
        slug={selectedSlug}
        open={!!selectedSlug}
        onClose={() => setSelectedSlug(null)}
      />
    </div>
  );
}