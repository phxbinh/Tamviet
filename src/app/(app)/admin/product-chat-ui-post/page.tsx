// app/page.tsx


// Chạy được test -> tra cứu mã tài chính 
//*
'use client';

import { useChat } from 'ai/react';

export default function AgentChat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/AI-agent-tools',
  });

  return (
    <main className="max-w-2xl mx-auto p-6 min-h-screen flex flex-col justify-between bg-zinc-50 text-zinc-900">
      
      <div className="space-y-6 flex-1 overflow-y-auto mb-4 pr-2">
        {messages.map((m) => (
          <div key={m.id} className="flex flex-col gap-2">
            
            {m.content && (
              <div className={`p-4 rounded-2xl max-w-[85%] text-sm ${
                m.role === 'user' 
                  ? 'bg-zinc-900 text-white ml-auto rounded-br-none shadow-sm' 
                  : 'bg-white border border-zinc-200/80 mr-auto rounded-bl-none shadow-sm'
              }`}>
                <p className="font-bold text-[10px] uppercase tracking-wider mb-1 opacity-40">
                  {m.role === 'user' ? 'Bạn' : 'Trợ lý'}
                </p>
                <div className="whitespace-pre-wrap leading-relaxed">{m.content}</div>
              </div>
            )}
            
            {m.toolInvocations && m.toolInvocations.map((ti) => {
              const { toolCallId, toolName, state } = ti;

              if (state === 'call') {
                return (
                  <div key={toolCallId} className="text-xs text-zinc-400 italic flex items-center gap-2 px-4">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                    Đang đồng bộ dữ liệu hệ thống từ [{toolName}]...
                  </div>
                );
              }

              if (state === 'result') {
                const data = ti.result;

                // 1. Kiểm tra an toàn xem dữ liệu trả về có bị lỗi không
                if (!data || data.error) {
                  return (
                    <div key={toolCallId} className="p-3 bg-red-50 text-red-600 border border-red-100 rounded-xl text-xs max-w-[85%] mr-auto">
                      ⚠️ {data?.error || 'Dữ liệu trả về bị lỗi cấu trúc bất thường.'}
                    </div>
                  );
                }

                // 2. Render UI Tùy biến cho công cụ 'getAssetData'
                if (toolName === 'getAssetData' && data.type === 'financial_card') {
                  
                  // Chống crash nếu thiếu hoặc sai trường category
                  const category = (data.category || 'commodity') as 'metal' | 'crypto' | 'commodity';
                  const theme = {
                    metal: 'border-amber-200 bg-amber-50/20 text-amber-950',
                    crypto: 'border-violet-200 bg-violet-50/20 text-violet-950',
                    commodity: 'border-zinc-300 bg-zinc-100/40 text-zinc-900',
                  }[category] || 'border-zinc-200 bg-white';

                  // Ép kiểu số an toàn
                  const price = Number(data.price || 0);
                  const change = Number(data.change || 0);
                  const sparkline: number[] = Array.isArray(data.sparkline) ? data.sparkline : [];

                  return (
                    <div key={toolCallId} className={`mr-auto w-full max-w-sm border p-5 rounded-2xl shadow-sm transition-all hover:shadow-md ${theme}`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-sm tracking-tight">{data.name || 'Tài sản không tên'}</h4>
                          <span className="inline-block mt-1.5 px-2 py-0.5 bg-zinc-900 text-white rounded-md font-mono text-[10px] font-bold tracking-widest">
                            {data.code || 'UNKNOWN'}
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="font-mono font-bold text-lg">
                            ${price >= 1 ? price.toLocaleString(undefined, { minimumFractionDigits: 2 }) : price}
                          </p>
                          <p className={`text-xs font-semibold mt-0.5 ${change >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {change >= 0 ? '▲' : '▼'} {Math.abs(change).toFixed(2)}%
                          </p>
                        </div>
                      </div>

                      {sparkline.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-zinc-200/60 flex items-center justify-between text-[11px] opacity-60">
                          <span>Biến động phiên:</span>
                          <span className="font-mono tracking-tighter">
                            {sparkline.map((v) => (typeof v === 'number' && !isNaN(v) ? v.toFixed(1) : '0')).join(' → ')}
                          </span>
                        </div>
                      )}

                      <div className="mt-1 text-[9px] opacity-40 text-right">
                        Cập nhật: {data.lastUpdated || 'Vừa xong'}
                      </div>
                    </div>
                  );
                }
              }
              return null;
            })}
          </div>
        ))}
        
        {isLoading && (
          <div className="flex items-center gap-2 text-zinc-400 text-xs px-4 animate-pulse">
            <div className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce" />
            Agent đang phân tích...
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2 sticky bottom-4 bg-white p-2 border border-zinc-200 rounded-2xl shadow-sm focus-within:border-zinc-400 transition-colors">
        <input
          className="flex-1 px-3 py-2 outline-none text-sm bg-transparent"
          value={input}
          placeholder="Ví dụ: Kiểm tra tình hình giá XAUUSD hoặc BTCUSD hiện tại thế nào..."
          onChange={handleInputChange}
        />
        <button type="submit" className="bg-zinc-900 text-white px-5 py-2 rounded-xl text-xs font-medium hover:bg-zinc-800 transition-colors active:scale-95">
          Gửi yêu cầu
        </button>
      </form>
    </main>
  );
}
//*/



// Document O&M
/*
"use client";

import { useState } from "react";

interface ResolveDocumentResponse {
  success: boolean;
  documentId?: string | null;
  error?: string;
}

export default function DocumentResolverPage() {
  const [query, setQuery] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [result, setResult] =
    useState<ResolveDocumentResponse | null>(
      null
    );

  async function handleResolve() {
    const normalized =
      query.trim();

    if (!normalized) return;

    try {
      setLoading(true);
      setResult(null);

      const response =
        await fetch(
          "/api/product-chat-ui-post",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              query: normalized,
            }),
          }
        );

      const json: ResolveDocumentResponse =
        await response.json();

      setResult(json);
    } catch (error) {
      setResult({
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Network error",
      });
    } finally {
      setLoading(false);
    }
  }

  function renderResult() {
    if (!result) return null;

    if (
      result.success &&
      result.documentId
    ) {
      return (
        <div className="border rounded-xl p-4 bg-green-50 border-green-200">
          <p>
            ✅ Tìm thấy tài liệu
          </p>

          <code className="block mt-2">
            {result.documentId}
          </code>
        </div>
      );
    }

    if (result.error) {
      return (
        <div className="border rounded-xl p-4 bg-red-50 border-red-200">
          ❌ {result.error}
        </div>
      );
    }

    return (
      <div className="border rounded-xl p-4 bg-yellow-50 border-yellow-200">
        ⚠ Không tìm thấy tài liệu phù hợp
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <textarea
        value={query}
        onChange={(e) =>
          setQuery(
            e.target.value
          )
        }
        rows={4}
        placeholder="Nhập yêu cầu tìm tài liệu..."
        className="w-full border rounded-xl p-4"
        disabled={loading}
      />

      <button
        onClick={
          handleResolve
        }
        disabled={
          loading ||
          !query.trim()
        }
        className="w-full border rounded-xl p-3"
      >
        {loading
          ? "Đang xử lý..."
          : "Tìm tài liệu"}
      </button>

      {renderResult()}

    {result && (

      <div className="border rounded-xl p-4 bg-gray-50 border-gray-200">

        <h3 className="font-bold mb-2">

          Raw Response

        </h3>

        <pre className="text-sm whitespace-pre-wrap break-all">

          {JSON.stringify(

            result,

            null,

            2

          )}

        </pre>

      </div>

    )}
    </div>
  );
}

//*/






