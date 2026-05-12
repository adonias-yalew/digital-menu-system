const CACHE_NAME = 'digital-menu-v1';
const IMAGE_CACHE_NAME = 'digital-menu-images-v1';

// Assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json'
];

// Image assets that should be cached aggressively
const IMAGE_ASSETS = [
  '/src/assets/burger-double.jpg',
  '/src/assets/burger-single.jpg',
  '/src/assets/burger-spicy.jpg',
  '/src/assets/burger-bacon.jpg',
  '/src/assets/side-rings.jpg',
  '/src/assets/side-loaded.jpg',
  '/src/assets/side-fries.jpg',
  '/src/assets/drink-shake.jpg',
  '/src/assets/drink-cola.jpg',
  '/src/assets/hero-burger.jpg',
  '/src/assets/cbe-qr.png'
];

// Install event - cache static assets and images
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .then(() => caches.open(IMAGE_CACHE_NAME))
      .then((cache) => cache.addAll(IMAGE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== IMAGE_CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Handle image requests with cache-first strategy
  if (request.destination === 'image' || url.pathname.includes('/assets/')) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          // Return cached version immediately
          return cachedResponse;
        }

        // If not in cache, fetch and cache
        return fetch(request).then((response) => {
          // Only cache successful responses
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone the response since it can only be consumed once
          const responseToCache = response.clone();
          
          caches.open(IMAGE_CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });

          return response;
        });
      })
    );
    return;
  }

  // Handle other requests with network-first strategy
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      // Try network first
      return fetch(request).then((response) => {
        // Cache successful responses
        if (response.status === 200) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
        }
        return response;
      }).catch(() => {
        // If network fails, return cached version
        return cachedResponse;
      });
    })
  );
});

// Background sync for updating cached images
self.addEventListener('sync', (event) => {
  if (event.tag === 'update-images') {
    event.waitUntil(updateImageCache());
  }
});

// Function to update image cache
async function updateImageCache() {
  try {
    const cache = await caches.open(IMAGE_CACHE_NAME);
    const requests = await cache.keys();
    
    // Re-fetch and update all cached images
    await Promise.all(
      requests.map(async (request) => {
        try {
          const response = await fetch(request);
          if (response.ok) {
            await cache.put(request, response);
          }
        } catch (error) {
          console.log('Failed to update image:', request.url);
        }
      })
    );
  } catch (error) {
    console.log('Failed to update image cache:', error);
  }
}
