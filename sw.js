// ARENA_HUB_v5 Service Worker
// Provides offline support, caching strategies, and PWA functionality

const CACHE_NAME = 'arena-hub-v5-cache-v1';
const CACHE_VERSION = 'v5.0.0';

// Files to pre-cache during service worker installation
const PRECACHE_FILES = [
  './index.html',
  './student-hub.html',
  './parent-home.html',
  './admin-batching.html',
  './manifest.json',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Rajdhani:wght@600;700&family=Source+Sans+3&display=swap'
];

// Install Event: Cache all pre-defined static assets
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing Arena Hub v5...');

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Pre-caching static assets');
        return cache.addAll(PRECACHE_FILES);
      })
      .then(() => {
        console.log('[Service Worker] Pre-cache complete');
        // Skip waiting ensures new service worker takes over immediately
        self.skipWaiting();
      })
      .catch((error) => {
        console.error('[Service Worker] Install failed:', error);
      })
  );
});

// Activate Event: Clean up old caches and claim clients
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating Arena Hub v5...');

  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            // Delete any cache that doesn't match current CACHE_NAME
            if (cacheName !== CACHE_NAME) {
              console.log('[Service Worker] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[Service Worker] Activation complete');
        // Claim all clients immediately without waiting for page reload
        self.clients.claim();
      })
  );
});

// Fetch Event: Intelligent caching strategy based on request type
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Strategy 1: Network First with Cache Fallback for HTML Navigations
  // Prioritizes fresh content but falls back to cached version when offline
  if (request.mode === 'navigate' && request.headers.get('accept')?.includes('text/html')) {
    console.log('[Service Worker] Network First strategy for HTML:', request.url);

    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful responses for offline use
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Fall back to cache if network request fails
          return caches.match(request)
            .then((cachedResponse) => {
              if (cachedResponse) {
                console.log('[Service Worker] Serving from cache (offline):', request.url);
                return cachedResponse;
              }
              // Return offline fallback page if neither network nor cache available
              return createOfflineResponse();
            });
        })
    );
    return;
  }

  // Strategy 2: Network Only for Google Apps Script API Calls
  // Live data should never be cached to ensure data integrity and real-time updates
  if (url.hostname.includes('script.google.com') || url.hostname.includes('run.app')) {
    console.log('[Service Worker] Network Only strategy for GAS API:', request.url);

    event.respondWith(
      fetch(request)
        .catch(() => {
          // If API unavailable, inform user via console (no offline fallback for APIs)
          console.warn('[Service Worker] GAS API unreachable:', request.url);
          return createOfflineResponse('API Unavailable');
        })
    );
    return;
  }

  // Strategy 3: Cache First for Static Assets (CSS, Fonts, Images)
  // Prioritizes cached versions for faster loading and offline support
  if (request.destination === 'style' ||
      request.destination === 'font' ||
      request.destination === 'image') {
    console.log('[Service Worker] Cache First strategy for static asset:', request.url);

    event.respondWith(
      caches.match(request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            console.log('[Service Worker] Serving from cache:', request.url);
            return cachedResponse;
          }
          // Not in cache, fetch from network
          return fetch(request)
            .then((response) => {
              // Cache new static assets for future use
              if (response.ok) {
                const responseClone = response.clone();
                caches.open(CACHE_NAME).then((cache) => {
                  cache.put(request, responseClone);
                });
              }
              return response;
            })
            .catch(() => {
              console.log('[Service Worker] Static asset unavailable (offline):', request.url);
              // Return generic offline asset fallback
              return createOfflineAssetResponse();
            });
        })
    );
    return;
  }

  // Strategy 4: Network First with Cache Fallback for Everything Else
  // General purpose strategy for dynamic content and API calls (except GAS)
  console.log('[Service Worker] Network First strategy for other requests:', request.url);

  event.respondWith(
    fetch(request)
      .then((response) => {
        // Cache successful responses
        if (response.ok && request.method === 'GET') {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // Fall back to cache if network fails
        return caches.match(request)
          .then((cachedResponse) => {
            if (cachedResponse) {
              console.log('[Service Worker] Serving from cache (offline):', request.url);
              return cachedResponse;
            }
            // Return offline fallback if no cache available
            return createOfflineResponse();
          });
      })
  );
});

/**
 * Creates an offline fallback HTML response
 * Displays friendly message with Navy background and Gold text
 * @param {string} message - Optional custom message
 * @returns {Response} HTML response with offline styling
 */
function createOfflineResponse(message = null) {
  const offlineHTML = `
    <!DOCTYPE html>
    <html lang="en-GB">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Arena Hub - Offline</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          background-color: #1B263B;
          color: #FFD700;
          font-family: 'Source Sans 3', sans-serif;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          padding: 20px;
        }
        .offline-container {
          text-align: center;
          max-width: 500px;
        }
        h1 {
          font-size: 2.5rem;
          margin-bottom: 20px;
          font-family: 'Rajdhani', sans-serif;
          font-weight: 700;
        }
        p {
          font-size: 1.1rem;
          line-height: 1.6;
          margin-bottom: 30px;
        }
        .status-icon {
          font-size: 4rem;
          margin-bottom: 20px;
          opacity: 0.9;
        }
      </style>
    </head>
    <body>
      <div class="offline-container">
        <div class="status-icon">⚠️</div>
        <h1>You're Offline</h1>
        <p>${message || 'Arena Hub will reconnect when your network is restored.'}</p>
        <p style="font-size: 0.95rem; opacity: 0.8;">
          Some features may be limited or unavailable while offline. Please check your internet connection.
        </p>
      </div>
    </body>
    </html>
  `;

  return new Response(offlineHTML, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  });
}

/**
 * Creates a fallback response for unavailable static assets
 * Returns a minimal placeholder to prevent broken images/styles
 * @returns {Response} Generic asset response
 */
function createOfflineAssetResponse() {
  // For images, return transparent 1x1 PNG placeholder
  const transparentPixel = new Uint8Array([
    0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D,
    0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
    0x08, 0x06, 0x00, 0x00, 0x00, 0x1F, 0x15, 0xC4, 0x89, 0x00, 0x00, 0x00,
    0x0A, 0x49, 0x44, 0x41, 0x54, 0x78, 0x9C, 0x63, 0x00, 0x01, 0x00, 0x00,
    0x05, 0x00, 0x01, 0x0D, 0x0A, 0x2D, 0xB4, 0x00, 0x00, 0x00, 0x00, 0x49,
    0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
  ]);

  return new Response(transparentPixel, {
    headers: { 'Content-Type': 'image/png' }
  });
}

console.log('[Service Worker] Arena Hub v5 Service Worker loaded successfully');
