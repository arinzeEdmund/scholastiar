const CACHE_VERSION = 'v1';
const SHELL_CACHE = `scholastiar-shell-${CACHE_VERSION}`;
const STATIC_CACHE = `scholastiar-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `scholastiar-dynamic-${CACHE_VERSION}`;

const SHELL_URLS = [
  '/',
  '/manifest.webmanifest',
];

// Install: pre-cache app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) => cache.addAll(SHELL_URLS))
  );
  self.skipWaiting();
});

// Activate: purge old caches
self.addEventListener('activate', (event) => {
  const current = new Set([SHELL_CACHE, STATIC_CACHE, DYNAMIC_CACHE]);
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => !current.has(k)).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle GET over http(s)
  if (request.method !== 'GET' || !url.protocol.startsWith('http')) return;

  // Never cache: Supabase, API routes, auth callbacks
  const skipPatterns = [
    url.hostname.includes('supabase.co'),
    url.pathname.startsWith('/api/'),
    url.pathname.startsWith('/auth/'),
    url.searchParams.has('sb-'),
  ];
  if (skipPatterns.some(Boolean)) return;

  // Next.js static chunks: cache-first
  if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((res) => {
            const clone = res.clone();
            caches.open(STATIC_CACHE).then((c) => c.put(request, clone));
            return res;
          })
      )
    );
    return;
  }

  // Navigation requests: network-first, fall back to shell
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const clone = res.clone();
          caches.open(DYNAMIC_CACHE).then((c) => c.put(request, clone));
          return res;
        })
        .catch(() =>
          caches.match(request).then((cached) => cached || caches.match('/'))
        )
    );
    return;
  }
});

// Listen for skip-waiting message from PWAUpdateToast
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
});
