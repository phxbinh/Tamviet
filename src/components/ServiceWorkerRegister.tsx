'use client';

import { useEffect } from 'react';

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    const registerSW = async () => {
      try {
        const reg = await navigator.serviceWorker.register('/sw.js');
        console.log('Tâm Việt SW: OK');

        // xin persistent storage
        if (navigator.storage && navigator.storage.persist) {
          const granted = await navigator.storage.persist();
          if (granted) {
            console.log('Tâm Việt: Đã chiếm quyền lưu trữ bền vững!');
          }
        }
      } catch (err) {
        console.log('Tâm Việt SW: Lỗi', err);
      }
    };

    window.addEventListener('load', registerSW);

    return () => {
      window.removeEventListener('load', registerSW);
    };
  }, []);

  return null;
}