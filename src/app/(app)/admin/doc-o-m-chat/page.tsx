// app/page.tsx
'use client';

import { useChat } from 'ai/react';
import ReactMarkdown from "react-markdown";

import remarkGfm from "remark-gfm";


export default function OMAgentChat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/doc-o-m-chat',
  });

  return (
    <main className="max-w-3xl mx-auto p-6 min-h-screen flex flex-col justify-between bg-zinc-50 text-zinc-900">
      
 
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
                  {m.role === 'user' ? 'Kỹ thuật viên' : 'Hệ thống Trợ lý O&M'}
                </p>
{/*
                <div className="whitespace-pre-wrap leading-relaxed">{m.content}</div>
*/}
<div className="prose prose-sm max-w-none">
  <ReactMarkdown remarkPlugins={[remarkGfm]}>
    {m.content}
  </ReactMarkdown>
</div>
              </div>
            )}
            
       
            {m.toolInvocations && m.toolInvocations.map((ti) => {
              const { toolCallId, toolName, state } = ti;

              if (state === 'call') {
                return (
                  <div key={toolCallId} className="text-xs text-zinc-400 italic flex items-center gap-2 px-4">
                    <span className="w-2 h-2 rounded-full bg-zinc-400 animate-ping" />
                    Hệ thống đang truy xuất dữ liệu từ [{toolName}]...
                  </div>
                );
              }

              if (state === 'result') {
                const data = ti.result;

                if (!data || data.error) {
                  return (
                    <div key={toolCallId} className="p-3 bg-red-50 text-red-600 border border-red-100 rounded-xl text-xs max-w-[85%] mr-auto">
                      ⚠️ {data?.error || 'Lỗi bất thường khi kết nối DB.'}
                    </div>
                  );
                }

                // Render giao diện khi tìm thấy danh sách Assets thiết bị
                if (toolName === 'searchAssets' && data.type === 'asset_results') {
                  const assetList = data.data || [];
                  if (assetList.length === 0) return null;
                  return (
                    <div key={toolCallId} className="mr-auto w-full max-w-md bg-white border border-zinc-200 p-4 rounded-2xl shadow-sm space-y-3">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">📁 Thiết bị / Quy trình tìm thấy:</p>
                      {assetList.map((asset: any) => (
                        <div key={asset.id} className="text-xs pb-2 border-b border-zinc-100 last:border-0 last:pb-0">
                          <div className="flex justify-between items-center">
                            <span className="font-semibold text-zinc-800">{asset.name}</span>
                            <span className="px-1.5 py-0.5 bg-zinc-100 rounded font-mono text-[10px] font-medium text-zinc-600 uppercase">{asset.assetType}</span>
                          </div>
                          {asset.code && <p className="text-[10px] font-mono text-zinc-400 mt-0.5">Code: {asset.code}</p>}
                        </div>
                      ))}
                    </div>
                  );
                }

                // Render log hiển thị số lượng chunks RAG tìm thấy (Giữ sạch giao diện, tránh quá dài)
                if (toolName === 'searchKnowledgeBase' && data.type === 'vector_rag_results') {
                  const count = data.chunks?.length || 0;
                  return (
                    <div key={toolCallId} className="text-[11px] text-emerald-600 font-medium italic flex items-center gap-1.5 px-4">
                      ✅ Đã trích xuất thành công {count} phân đoạn tri thức liên quan từ kho tài liệu.
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
            <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-bounce" />
            Agent đang tổng hợp câu trả lời O&M...
          </div>
        )}
      </div>

 
      <form onSubmit={handleSubmit} className="flex gap-2 sticky bottom-4 bg-white p-2 border border-zinc-200 rounded-2xl shadow-sm focus-within:border-zinc-400 transition-colors">
        <input
          className="flex-1 px-3 py-2 outline-none text-sm bg-transparent"
          value={input}
          placeholder="Ví dụ: Quy trình khởi động bể Aerotank khi gặp sự cố bùn trào..."
          onChange={handleInputChange}
        />
        <button type="submit" className="bg-zinc-900 text-white px-5 py-2 rounded-xl text-xs font-medium hover:bg-zinc-800 transition-colors active:scale-95">
          Gửi lệnh
        </button>
      </form>
    </main>
  );
}

/*
'use client';

import { useChat } from 'ai/react';

export default function OMAgentChat() {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading
  } = useChat({
    api: '/api/doc-o-m-chat',
  });

  return (
    <main className="max-w-3xl mx-auto p-6 min-h-screen flex flex-col justify-between bg-zinc-50 text-zinc-900">


      <div className="space-y-6 flex-1 overflow-y-auto mb-4 pr-2">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`p-4 rounded-2xl max-w-[85%] text-sm ${
              m.role === 'user'
                ? 'bg-zinc-900 text-white ml-auto rounded-br-none shadow-sm'
                : 'bg-white border border-zinc-200/80 mr-auto rounded-bl-none shadow-sm'
            }`}
          >
            <p className="font-bold text-[10px] uppercase tracking-wider mb-1 opacity-40">
              {m.role === 'user'
                ? 'Kỹ thuật viên'
                : 'Hệ thống Trợ lý O&M'}
            </p>

            <div className="whitespace-pre-wrap leading-relaxed">
              {m.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-zinc-400 text-xs px-4 animate-pulse">
            <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-bounce" />
            Đang phân tích yêu cầu và truy xuất tài liệu O&M...
          </div>
        )}
      </div>

  
      <form
        onSubmit={(e) => {
          if (!input.trim()) return;
          handleSubmit(e);
        }}
        className="flex gap-2 sticky bottom-4 bg-white p-2 border border-zinc-200 rounded-2xl shadow-sm focus-within:border-zinc-400 transition-colors"
      >
        <input
          className="flex-1 px-3 py-2 outline-none text-sm bg-transparent"
          value={input}
          placeholder="Ví dụ: Quy trình khởi động bể Aerotank khi gặp sự cố bùn trào..."
          onChange={handleInputChange}
          disabled={isLoading}
        />

        <button
          type="submit"
          disabled={isLoading}
          className="bg-zinc-900 text-white px-5 py-2 rounded-xl text-xs font-medium hover:bg-zinc-800 transition-colors active:scale-95 disabled:opacity-50"
        >
          Gửi lệnh
        </button>
      </form>
    </main>
  );
}
*/





