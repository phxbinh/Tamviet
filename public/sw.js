const CACHE_NAME = 'tam-viet-v1';
const OFFLINE_URL = '/offline';

const ASSETS_TO_CACHE = [
  '/',
  '/offline',
  '/manifest.json',
  '/icon-512.png',
  '/apple-icon.png', // Nên thêm icon này để hiển thị đúng trên iPhone
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Dùng {invite: true} để không làm hỏng quá trình cài đặt nếu thiếu 1 file
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

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
  // Giúp SW kiểm soát các trang ngay lập tức mà không cần load lại
  self.clients.claim(); 
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Chiến lược: Ưu tiên Cache, không có thì gọi mạng, rồi lưu vào cache luôn
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        // Lưu bản sao vào cache để lần sau nhanh hơn (Dynamic Caching)
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        // Nếu mất mạng hoàn toàn và là trang web, hiện trang offline
        if (event.request.mode === 'navigate') {
          return caches.match(OFFLINE_URL);
        }
      });

      return cachedResponse || fetchPromise;
    })
  );
});
