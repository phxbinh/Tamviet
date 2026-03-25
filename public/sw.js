const CACHE_NAME = 'tam-viet-v2'; // Đổi v1 thành v2 để iPhone xóa cache cũ
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

// 3. Xử lý yêu cầu (QUAN TRỌNG NHẤT)
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Nếu có mạng, hãy tải mới và cập nhật vào cache
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        // Chỉ cache những phản hồi thành công (status 200)
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        // KHI MẤT MẠNG THỰC SỰ:
        // Nếu là trang web (navigate), trả về trang Offline nếu không có cache
        if (event.request.mode === 'navigate') {
          return caches.match(OFFLINE_URL);
        }
      });

      // Ưu tiên trả về Cache ngay lập tức để App mở nhanh, 
      // đồng thời chạy fetchPromise ngầm để cập nhật dữ liệu từ Neon
      return cachedResponse || fetchPromise;
    })
  );
});
