'use client';

import { useChat } from 'ai/react';

export default function AgentChat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/AI-agent-tools',
  });

  return (
    <main className="max-w-2xl mx-auto p-6 min-h-screen flex flex-col justify-between bg-zinc-50 text-zinc-900">
      
      {/* Khung hiển thị nội dung hội thoại */}
      <div className="space-y-6 flex-1 overflow-y-auto mb-4 pr-2">
        {messages.map((m) => (
          <div key={m.id} className="flex flex-col gap-2">
            
            {/* Tin nhắn văn bản thông thường của User / Agent */}
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
            
            {/* Xử lý Render UI từ kết quả của Công cụ (Tools) */}
            {m.toolInvocations && m.toolInvocations.map((ti) => {
              const { toolCallId, toolName, state } = ti;

              // Trạng thái 1: Khi Agent đang gọi hàm ngầm (Đang tải dữ liệu)
              if (state === 'call') {
                return (
                  <div key={toolCallId} className="text-xs text-zinc-400 italic flex items-center gap-2 px-4">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                    Đang đồng bộ dữ liệu hệ thống từ công cụ [{toolName}]...
                  </div>
                );
              }

              // Trạng thái 2: Khi đã có kết quả (Thực thi thành công)
              if (state === 'result') {
                const data = ti.result;

                // Nếu có lỗi từ phía backend trả về
                if (data.error) {
                  return (
                    <div key={toolCallId} className="p-3 bg-red-50 text-red-600 border border-red-100 rounded-xl text-xs max-w-[85%]">
                      ⚠️ {data.error}
                    </div>
                  );
                }

                // Render UI Tùy biến cho công cụ 'getAssetData'
                if (toolName === 'getAssetData' && data.type === 'financial_card') {
                  return (
                    <div key={toolCallId} className="mr-auto w-full max-w-sm bg-white border border-zinc-200 p-5 rounded-2xl shadow-sm transition-all hover:shadow-md">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-zinc-900 text-sm">{data.name}</h4>
                          <span className="inline-block mt-1 px-2 py-0.5 bg-zinc-100 text-zinc-600 rounded-md font-mono text-xs font-semibold tracking-wider">
                            {data.code}
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="font-mono font-bold text-xl text-zinc-900">
                            ${data.price?.toLocaleString()}
                          </p>
                          <p className={`text-xs font-medium mt-0.5 ${data.change >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {data.change >= 0 ? '▲' : '▼'} {Math.abs(data.change)}%
                          </p>
                        </div>
                      </div>

                      {/* Render một đồ thị mini đơn giản mô phỏng biến động */}
                      <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-400">
                        <span>Đồ thị xu hướng gần đây:</span>
                        <span className="font-mono text-zinc-500">[{data.sparkline?.join(' → ')}]</span>
                      </div>

                      <div className="mt-2 text-[10px] text-zinc-400 text-right">
                        Cập nhật lúc: {data.lastUpdated}
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

      {/* Form nhập liệu tinh giản */}
      <form onSubmit={handleSubmit} className="flex gap-2 sticky bottom-4 bg-white p-2 border border-zinc-200 rounded-2xl shadow-sm focus-within:border-zinc-400 transition-colors">
        <input
          className="flex-1 px-3 py-2 outline-none text-sm bg-transparent"
          value={input}
          placeholder="Ví dụ: Kiểm tra tình hình giá XAUUSD hiện tại thế nào..."
          onChange={handleInputChange}
        />
        <button type="submit" className="bg-zinc-900 text-white px-5 py-2 rounded-xl text-xs font-medium hover:bg-zinc-800 transition-colors active:scale-95">
          Gửi yêu cầu
        </button>
      </form>
    </main>
  );
}