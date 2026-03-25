const CACHE_NAME = 'tam-viet-v1';
const OFFLINE_URL = '/offline';

const ASSETS_TO_CACHE = [
  '/',
  '/offline',
  '/manifest.json',
  '/icon-512.png',
  '/globals.css', // Thêm CSS tổng để giao diện không bị vỡ khi offline
];

// 1. Cài đặt và lưu trữ các file quan trọng
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting(); // Kích hoạt ngay lập tức
});

// 2. Dọn dẹp cache cũ khi bạn đổi CACHE_NAME (ví dụ lên v2)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// 3. Xử lý yêu cầu dữ liệu
self.addEventListener('fetch', (event) => {
  // Chỉ xử lý các yêu cầu GET (tránh lỗi khi gửi Form/POST)
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).catch(() => {
        // Nếu là trang web (navigation), hiện trang offline
        if (event.request.mode === 'navigate') {
          return caches.match(OFFLINE_URL);
        }
      });
    })
  );
});
