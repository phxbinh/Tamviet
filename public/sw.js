
const CACHE_NAME = 'tam-viet-trail-v6';
const OFFLINE_URL = '/offline';

// Các asset cơ bản
const STATIC_ASSETS = [
  '/',
  '/offline',
  '/test',
  '/testSearchParam',
  '/manifest.json',
  '/icon-512.png',
  '/apple-icon.png',
];

// =======================
// 1. INSTALL
// =======================
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// =======================
// 2. ACTIVATE
// =======================
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// =======================
// 3. FETCH
// =======================
/*
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // =======================
  // ✅ A. HTML (SSR SNAPSHOT)
  // =======================
  if (event.request.mode === 'navigate') {
    event.respondWith(
      caches.match(event.request).then((cachedPage) => {
        const fetchPromise = fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const cacheCopy = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, cacheCopy);
              });
            }
            return networkResponse;
          })
          .catch(() => {
            // mất mạng
            return cachedPage || caches.match(OFFLINE_URL);
          });

        // 🔥 Quan trọng: ưu tiên cache trước
        return cachedPage || fetchPromise;
      })
    );
    return;
  }
*/

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  if (event.request.mode === 'navigate') {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE_NAME);

      const url = new URL(event.request.url);

      // 🔥 QUAN TRỌNG: normalize
      url.search = ''; // bỏ query param

      const normalizedRequest = new Request(url.toString());

      // 👉 tìm cache bằng key đã normalize
      const cached = await cache.match(normalizedRequest);

      if (cached) return cached;

      try {
        const networkResponse = await fetch(event.request);

        if (networkResponse && networkResponse.status === 200) {
          await cache.put(normalizedRequest, networkResponse.clone());
        }

        return networkResponse;
      } catch (err) {
        return cached || cache.match('/');
      }
    })());
  }
});


  // =======================
  // ✅ B. STATIC (JS, CSS, IMAGE)
  // =======================
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;

      return fetch(event.request)
        .then((networkResponse) => {
          // cache lại asset
          if (networkResponse && networkResponse.status === 200) {
            const cacheCopy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, cacheCopy);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // có thể return fallback image nếu muốn
        });
    })
  );
});

