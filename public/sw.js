const CACHE_NAME = 'tam-viet-v3'; // Đổi v1 thành v2 để iPhone xóa cache cũ
const OFFLINE_URL = '/offline';

const ASSETS_TO_CACHE = [
  '/',
  '/offline',
  '/test',
  '/testSearchParam',
  '/manifest.json',
  '/icon-512.png',
  '/apple-icon.png', // Nên thêm icon này để hiển thị đúng trên iPhone
];

// 1. Cài đặt các trang tĩnh bắt buộc
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

// 2. Kích hoạt và dọn dẹp
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.map((key) => { if (key !== CACHE_NAME) return caches.delete(key); })
    ))
  );
  self.clients.claim();
});


self.addEventListener('fetch', (event) => {
  // 1. Chỉ xử lý yêu cầu GET
  if (event.request.method !== 'GET') return;

  // 2. Bỏ qua các yêu cầu chrome-extension hoặc telemetry (tránh lỗi log)
  if (event.request.url.startsWith('chrome-extension') || event.request.url.includes('_next/webpack-hmr')) return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Chiến lược: Network First, Fallback to Cache
      // Nghĩa là: Cố gắng lấy data mới từ Neon trước, nếu mất mạng thì mới lôi bản cũ trong máy ra.
      
      return fetch(event.request)
        .then((networkResponse) => {
          // Nếu có mạng và lấy được data thành công
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // KHI MẤT MẠNG:
          if (cachedResponse) return cachedResponse;

          // Nếu không có cả cache lẫn mạng, và đang vào 1 trang (navigation)
          if (event.request.mode === 'navigate') {
            return caches.match('/offline');
          }
        });
    })
  );
});

