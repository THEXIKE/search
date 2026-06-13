// sw.js - 动态缓存策略，首次访问后离线可用
const CACHE_NAME = 'homepage-cache-v1';

// 安装时直接激活，不预缓存任何资源
self.addEventListener('install', event => {
  self.skipWaiting();
});

// 激活时清理旧缓存
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
    )).then(() => self.clients.claim())
  );
});

// 拦截请求：网络优先，失败时返回缓存
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  // 仅处理本站资源
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.open(CACHE_NAME).then(cache => {
      return fetch(event.request).then(response => {
        if (response.status === 200) {
          cache.put(event.request, response.clone());
        }
        return response;
      }).catch(() => {
        return cache.match(event.request).then(cached => {
          if (cached) return cached;
          // 无缓存时静默失败
          return new Response('', { status: 408, statusText: 'Offline' });
        });
      });
    })
  );
});