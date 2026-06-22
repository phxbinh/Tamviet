'use client';
// Ok ->
import { useChat } from 'ai/react';

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    api: '/api/test-tools',
    onError: (err) => console.error('Chat Error:', err),
  });

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">AI Agent Chat - Debug Tool</h1>

      <div className="h-[65vh] overflow-y-auto border rounded-xl p-6 bg-gray-50 space-y-6">
        {messages.map((m, index) => (
          <div key={m.id || index} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-2xl ${m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white border shadow-sm'}`}>
              <strong className="block mb-2 text-sm opacity-75">
                {m.role === 'user' ? 'Bạn' : 'AI Agent'}
              </strong>

              {/* Nội dung text chính */}
              {m.content && <div className="whitespace-pre-wrap mb-3">{m.content}</div>}

              {/* Hiển thị Tool Calls (rất quan trọng) */}
              {m.toolInvocations && m.toolInvocations.length > 0 && (
                <div className="mt-2 border-l-2 border-blue-500 pl-3 text-sm">
                  <div className="font-medium text-blue-600 mb-1">🔧 Đang gọi Tool:</div>
                  {m.toolInvocations.map((tool, i) => (
                    <div key={i} className="mb-2">
                      <strong>{tool.toolName}</strong>
                      {tool.state === 'result' && tool.result && (
                        <div className="mt-1 p-2 bg-green-50 rounded text-green-800">
                          Kết quả: {typeof tool.result === 'string' ? tool.result : JSON.stringify(tool.result)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

{/*
     {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border p-4 rounded-2xl">
              AI đang suy nghĩ...
            </div>
          </div>
        )}
*/}

{/*
              {!m.content && (!m.toolInvocations || m.toolInvocations.length === 0) && 
                m.role === 'assistant' && <div className="italic text-gray-500">Đang suy nghĩ...</div>}
*/}
            </div>
          </div>
        ))}

     {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border p-4 rounded-2xl">
              AI đang suy nghĩ...
            </div>
          </div>
        )}

      </div>

      {error && <p className="text-red-600 mt-3">Lỗi: {error.message}</p>}

      <form onSubmit={handleSubmit} className="mt-6 flex gap-3">
        <input
          className="flex-1 border p-4 rounded-xl text-base"
          value={input}
          onChange={handleInputChange}
          placeholder="Mấy giờ rồi?"
          disabled={isLoading}
        />
        <button 
          type="submit" 
          disabled={isLoading}
          className="bg-blue-600 text-white px-8 rounded-xl font-medium"
        >
          Gửi
        </button>
      </form>
    </div>
  );
}