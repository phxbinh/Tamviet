
const CACHE_NAME = 'tam-viet-trail-v5'; // Đổi v1 thành v2 để iPhone xóa cache cũ
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
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // Nếu có mạng, lưu ngay bản HTML vừa lấy từ SQL vào máy
        if (networkResponse.status === 200) {
          const cacheCopy = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, cacheCopy));
        }
        return networkResponse;
      })
      .catch(async () => {
        // KHI TẮT MẠNG HOẶC TẮT APP MỞ LẠI:
        const cachedResponse = await caches.match(event.request);
        if (cachedResponse) return cachedResponse;
        
        // Nếu trang này chưa từng được cache, mới hiện trang Offline
        if (event.request.mode === 'navigate') {
          return caches.match('/offline');
        }
      })
  );
});

