import React from 'react';

interface BenchmarkResult {
  language: string;
  limit: number;
  sum_result: number;
  execution_time_ms: number;
}

// Hàm fetch API (Phải dùng URL tuyệt đối để tránh lỗi SSR)
async function fetchBenchmark(apiPath: string): Promise<BenchmarkResult> {
  const baseUrl_ = process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}` 
    : 'http://localhost:3000';

  const baseUrl = 'https://tamviet.vercel.app';

  const res = await fetch(`${baseUrl}${apiPath}`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Lỗi khi gọi ${apiPath}`);
  return res.json();
}

export default async function BenchmarkPage() {
  // Đo thời gian tổng (bao gồm cả độ trễ mạng từ Next.js tới API)
  const startGo = performance.now();
  const goData = await fetchBenchmark('/api/benchmark-go'); // Đường dẫn tùy bạn cấu hình bên Vercel Go
  const totalGoTime = performance.now() - startGo;

  const startTs = performance.now();
  const tsData = await fetchBenchmark('/api/benchmark-ts');
  const totalTsTime = performance.now() - startTs;

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>So Sánh Hiệu Năng Thực Tế (SSR)</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        
        {/* Kết quả của Go */}
        <div style={{ border: '2px solid #00ADD8', padding: '1.5rem', borderRadius: '10px' }}>
          <h2 style={{ color: '#00ADD8', marginTop: 0 }}>{goData.language}</h2>
          <p><strong>Kết quả tính tổng:</strong> {goData.sum_result.toLocaleString()}</p>
          <p><strong>Thời gian CPU tính toán nội bộ:</strong> <span style={{ color: 'red', fontWeight: 'bold' }}>{goData.execution_time_ms.toFixed(2)} ms</span></p>
          <hr />
          <p style={{ fontSize: '0.9rem', color: '#666' }}>
            <strong>Tổng thời gian cả Network:</strong> {totalGoTime.toFixed(2)} ms
          </p>
        </div>

        {/* Kết quả của TypeScript */}
        <div style={{ border: '2px solid #3178C6', padding: '1.5rem', borderRadius: '10px' }}>
          <h2 style={{ color: '#3178C6', marginTop: 0 }}>{tsData.language}</h2>
          <p><strong>Kết quả tính tổng:</strong> {tsData.sum_result.toLocaleString()}</p>
          <p><strong>Thời gian CPU tính toán nội bộ:</strong> <span style={{ color: 'red', fontWeight: 'bold' }}>{tsData.execution_time_ms.toFixed(2)} ms</span></p>
          <hr />
          <p style={{ fontSize: '0.9rem', color: '#666' }}>
            <strong>Tổng thời gian cả Network:</strong> {totalTsTime.toFixed(2)} ms
          </p>
        </div>

      </div>

      <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#eee', borderRadius: '5px' }}>
        <h3>💡 Thứ bạn cần quan sát khi lên Vercel:</h3>
        <ul>
          <li><strong>Lần load đầu tiên:</strong> Bên nào bị dính "Cold start" (khởi động nguội) lâu hơn? (Thường Go khởi động nguội nhanh hơn do file binary nhẹ).</li>
          <li><strong>Các lần load sau:</strong> Thời gian CPU nội bộ (`execution_time_ms`) của Go sẽ nhanh hơn đáng kể, nhưng hãy xem **Tổng thời gian cả Network** xem khoảng cách có bị thu hẹp lại do độ trễ mạng không nhé!</li>
        </ul>
      </div>
    </div>
  );
}
