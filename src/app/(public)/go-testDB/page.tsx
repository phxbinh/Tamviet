import React from 'react';

// 1. Định nghĩa Interface cho dữ liệu trả về từ API Go
interface Category {
  id: string;   // UUID từ Go truyền qua dạng string
  name: string;
  slug: string;
}

// 2. Hàm fetch dữ liệu (Chạy ở phía Server)
async function getCategories(): Promise<Category[]> {
  // Thay url này bằng đường dẫn thực tế tới API Go của bạn
  // Ví dụ: 'https://api.yourdomain.com/api/categories' hoặc '/api/categories' nếu cùng domain Vercel
  const res = await fetch('https://tamviet.vercel.app/api/categories/getCategories', {
    // no-store giúp Next.js luôn lấy dữ liệu mới nhất từ API mỗi khi user load trang (SSR)
    cache: 'no-store', 
  });

  if (!res.ok) {
    // Next.js sẽ tự động kích hoạt file error.tsx gần nhất nếu có lỗi
    throw new Error('Không thể tải danh sách danh mục');
  }

  return res.json();
}

// 3. Server Component Page chính
export default async function CategoriesPage() {
  // Gọi hàm fetch dữ liệu trực tiếp bằng `await` nhờ từ khóa `async` ở function
  const categories = await getCategories();

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
        Danh Sách Danh Mục
      </h1>

      {categories.length === 0 ? (
        <p>Không có danh mục nào được tìm thấy.</p>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {categories.map((category) => (
            <div 
              key={category.id} 
              style={{
                border: '1px solid #ccc',
                padding: '1rem',
                borderRadius: '8px',
                backgroundColor: '#f9f9f9'
              }}
            >
              <h2 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>{category.name}</h2>
              <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>
                <strong>Slug:</strong> {category.slug}
              </p>
              <small style={{ color: '#999', display: 'block', marginTop: '0.5rem' }}>
                ID: {category.id}
              </small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
