'use client';

import { useChat } from 'ai/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function OMAgentChat() {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    data
  } = useChat({
    api: '/api/route-chat-o-m'
  });

  return (
    <main className="max-w-3xl mx-auto p-6 min-h-screen flex flex-col justify-between bg-zinc-50 text-zinc-900">
      
      <div className="space-y-6 flex-1 overflow-y-auto mb-4 pr-2">
        {messages.map((m) => (
          <div key={m.id} className="flex flex-col gap-2">

            {m.content && (
              <div
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

                <div className="prose prose-sm max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {m.content}
                  </ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Debug context block (optional) */}
        {data?.context && (
          <div className="mr-auto w-full max-w-md bg-white border border-zinc-200 p-4 rounded-2xl shadow-sm space-y-3">
            <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
              📁 Context nội bộ:
            </p>

            <pre className="text-xs whitespace-pre-wrap text-zinc-600 overflow-x-auto">
              {JSON.stringify(data.context, null, 2)}
            </pre>
          </div>
        )}

        {/* Loading state */}
        {isLoading && (
          <div className="flex items-center gap-2 text-zinc-400 text-xs px-4 animate-pulse">
            <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-bounce" />
            Đang phân tích intent, truy xuất tri thức và tổng hợp phản hồi...
          </div>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex gap-2 sticky bottom-4 bg-white p-2 border border-zinc-200 rounded-2xl shadow-sm focus-within:border-zinc-400 transition-colors"
      >
        <input
          className="flex-1 px-3 py-2 outline-none text-sm bg-transparent"
          value={input}
          placeholder="Ví dụ: Quy trình khởi động bể Aerotank khi gặp sự cố bùn trào..."
          onChange={handleInputChange}
        />

        <button
          type="submit"
          className="bg-zinc-900 text-white px-5 py-2 rounded-xl text-xs font-medium hover:bg-zinc-800 transition-colors active:scale-95"
        >
          Gửi lệnh
        </button>
      </form>
    </main>
  );
}