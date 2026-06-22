'use client';

import { useChat } from 'ai/react';

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    api: '/api/test-tools',
    onError: (err) => console.error('Chat error:', err),
  });

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">AI Agent Chat Test</h1>

      <div className="h-[65vh] overflow-y-auto border rounded-xl p-6 bg-gray-50 space-y-6">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-4 rounded-2xl ${m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white border'}`}>
              <strong className="block mb-1">{m.role === 'user' ? 'Bạn' : 'AI Agent'}</strong>
              <div className="whitespace-pre-wrap">{m.content}</div>
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

      {error && <p className="text-red-500 mt-2">Lỗi: {error.message}</p>}

      <form onSubmit={handleSubmit} className="mt-6 flex gap-3">
        <input
          className="flex-1 border border-gray-300 p-4 rounded-xl focus:outline-none focus:border-blue-500"
          value={input}
          onChange={handleInputChange}
          placeholder="Ví dụ: Mấy giờ rồi? hoặc Thời tiết Hà Nội?"
          disabled={isLoading}
        />
        <button 
          type="submit" 
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-medium disabled:opacity-50"
        >
          Gửi
        </button>
      </form>
    </div>
  );
}