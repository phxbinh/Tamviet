'use client';

import { useEffect, useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

import { ProductCard } from './ProductCard_';
import { ProductModal } from './_modal-product-card/ProductModal';
import { CategoryCTA } from './CategoryCTA';

//

//src/app/chatbot-sell-v1/_modal-product-card/ButtonViewDetail.tsx
import { ViewDetailButton } from './_modal-product-card/ButtonViewDetail';

export function ChatMessage({ message }: { message: any }) {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

  // =========================
  // TEXT FROM PARTS (IMPORTANT)
  // =========================
  const text = useMemo(() => {
    if (message.parts?.length) {
      return message.parts
        .filter((p: any) => p.type === 'text')
        .map((p: any) => p.text)
        .join('');
    }

    return message.content ?? '';
  }, [message.parts, message.content]);

  // =========================
  // TOOL TRIGGER (SAFE EFFECT)
  // =========================
  useEffect(() => {
    const tool = message.toolInvocations?.find(
      (t: any) =>
        t.toolName === 'openProductDetail' &&
        t.state === 'result'
    );

    if (tool?.result?.slug) {
      setSelectedSlug(tool.result.slug);
    }
  }, [message.toolInvocations]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const hasText = text?.trim()?.length > 0;

  return (
    <div
      className={`flex flex-col ${
        message.role === 'user' ? 'items-end' : 'items-start'
      } animate-in fade-in slide-in-from-bottom-3 duration-300`}
    >
      {/* =========================
          TEXT MESSAGE
      ========================= */}
      {hasText && (
        <div
          className={`max-w-[85%] px-6 py-4 shadow-2xl border backdrop-blur-md ${
            message.role === 'user'
              ? 'bg-blue-600 text-white border-transparent rounded-[28px] rounded-tr-none'
              : 'bg-card text-foreground border-border/50 rounded-[28px] rounded-tl-none'
          }`}
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            className="prose dark:prose-invert prose-sm max-w-none break-words"
            components={{
              code({ inline, className, children, ...props }: any) {
                const match = /language-(\w+)/.exec(className || '');

                if (!inline && match) {
                  return (
                    <div className="my-4 rounded-xl overflow-hidden border border-white/5">
                      <div className="flex items-center justify-between px-4 py-2 bg-black/40 border-b border-white/5">
                        <span className="text-[10px] text-gray-400">
                          {match[1]}
                        </span>

                        <button
                          onClick={() =>
                            copyToClipboard(String(children))
                          }
                          className="text-[10px] text-blue-400"
                        > {/*text-gray-400 hover:text-white"*/}
                          Copy
                        </button>
                      </div>

                      <SyntaxHighlighter
                        style={vscDarkPlus}
                        language={match[1]}
                        PreTag="div"
                        customStyle={{
                          margin: 0,
                          padding: '1rem',
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
                  <code className="bg-black/10 px-1.5 py-0.5 rounded text-blue-400">
                    {children}
                  </code>
                );
              },
            }}
          >
            {text}
          </ReactMarkdown>
        </div>
      )}

      {/* =========================
          TOOL RENDERING
      ========================= */}
      {message.toolInvocations?.map((tool: any) => {
        const key = `${tool.toolName}-${tool.toolCallId}`;

        // -------------------------
        // PRODUCT CARDS
        // -------------------------
        if (
          tool.toolName === 'showProductCards' &&
          tool.state === 'result'
        ) {
          return (
            <div key={key} className="w-full mt-4 flex flex-col gap-4">
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
        }

        // -------------------------
        // CATEGORY CTA
        // -------------------------
        if (
          tool.toolName === 'openCategoryPage' &&
          tool.state === 'result'
        ) {
          return (
            <div key={key} className="mt-4 w-full">
              <CategoryCTA
                category={tool.result.category}
                page={tool.result.page}
                message={tool.result.message}
                label={tool.result.ctaLabel}
              />
            </div>
          );
        }

        // Xem lại chi tiết sau khi tắt modal
        if (
          tool.toolName === 'openProductDetail' &&
          tool.state === 'result'
        ) {
          return (
            <div key={tool.result.slug} className="mt-4 w-full">
{/* Trả content từ AI Agent */}
              {tool.result.message}
              <ViewDetailButton
                slug={tool.result.slug}
                title={tool.result.title}
                onOpen={setSelectedSlug}
              />
            </div>
          );
        }

        return null;
      })}

      {/* =========================
          MODAL
      ========================= */}
      <ProductModal
        slug={selectedSlug}
        open={!!selectedSlug}
        onClose={() => setSelectedSlug(null)}
      />
    </div>
  );
}