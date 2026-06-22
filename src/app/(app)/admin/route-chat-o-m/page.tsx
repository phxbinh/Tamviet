'use client';

import { useChat } from 'ai/react';

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    api: '/api/test-tools',
    onError: (err) => console.error('Chat Error:', err),
  });

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">AI Agent Chat - Debug</h1>

      <div className="h-[65vh] overflow-y-auto border rounded-xl p-6 bg-gray-50 space-y-6">
        {messages.map((m, index) => (
          <div key={m.id || index} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-2xl ${m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white border shadow-sm'}`}>
              <strong className="block mb-2 text-sm opacity-75">
                {m.role === 'user' ? 'Bạn' : 'AI Agent'}
              </strong>
              <div className="whitespace-pre-wrap text-[15px]">
                {m.content || (m.role === 'assistant' && isLoading ? 'Đang suy nghĩ...' : 'Không có nội dung')}
              </div>
            </div>
          </div>
        ))}
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