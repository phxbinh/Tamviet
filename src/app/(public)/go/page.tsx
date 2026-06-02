'use client';

import { useState } from 'react';

interface ApiResponse {
  message: string;
  status: number;
}

export default function Home() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchGoApi = async () => {
    setLoading(true);
    try {
      // Vercel tự động map file api/hello.go thành endpoint /api/hello
      const res = await fetch('/api-go/hello?name=Tâm Việt');
      const result: ApiResponse = await res.json();
      setData(result);
    } catch (error) {
      console.error('Lỗi gọi API Go:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'system-ui' }}>
      <h1>Next.js + Golang Serverless</h1>
      <button 
        onClick={fetchGoApi}
        disabled={loading}
        style={{ padding: '10px 20px', cursor: 'pointer' }}
      >
        {loading ? 'Đang gọi...' : 'Kích hoạt hàm Go'}
      </button>

      {data && (
        <div style={{ marginTop: '20px', padding: '15px', background: '#f5f5f5', borderRadius: '5px' }}>
          <p><strong>Kết quả từ Serverless Go:</strong></p>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
