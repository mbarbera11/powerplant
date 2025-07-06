const CACHE_NAME = "powerplant-v2"
const STATIC_CACHE = "powerplant-static-v2"
const DYNAMIC_CACHE = "powerplant-dynamic-v2"
const API_CACHE = "powerplant-api-v2"

const urlsToCache = [
  "/",
  "/onboarding",
  "/recommendations",
  "/nurseries",
  "/manifest.json",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
  "/placeholder-logo.png",
  "/placeholder.jpg",
  "/placeholder.svg",
]

// Install event
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(urlsToCache)
    }),
  )
  self.skipWaiting()
})

// Activate event
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [STATIC_CACHE, DYNAMIC_CACHE, API_CACHE]
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName)
          }
        }),
      )
    }),
  )
  self.clients.claim()
})

// Fetch event with advanced caching strategies
self.addEventListener("fetch", (event) => {
  const { request } = event
  const url = new URL(request.url)

  // API requests - Network first, fallback to cache
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          // Cache successful API responses
          if (response.ok) {
            const responseClone = response.clone()
            caches.open(API_CACHE).then(cache => {
              cache.put(request, responseClone)
            })
          }
          return response
        })
        .catch(() => {
          // Return cached version if network fails
          return caches.match(request)
        })
    )
    return
  }

  // Image optimization - Cache first, then network
  if (request.destination === 'image') {
    event.respondWith(
      caches.match(request).then(response => {
        if (response) {
          return response
        }
        return fetch(request).then(response => {
          if (response.ok) {
            const responseClone = response.clone()
            caches.open(DYNAMIC_CACHE).then(cache => {
              cache.put(request, responseClone)
            })
          }
          return response
        })
      })
    )
    return
  }

  // Static assets - Cache first
  if (url.pathname.includes('.') && (url.pathname.includes('.js') || url.pathname.includes('.css'))) {
    event.respondWith(
      caches.match(request).then(response => {
        return response || fetch(request)
      })
    )
    return
  }

  // Navigation requests - Network first, fallback to cache
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(response => {
          // Cache successful navigation responses
          if (response.ok) {
            const responseClone = response.clone()
            caches.open(DYNAMIC_CACHE).then(cache => {
              cache.put(request, responseClone)
            })
          }
          return response
        })
        .catch(() => {
          // Return cached version or offline fallback
          return caches.match(request).then(response => {
            return response || caches.match('/')
          })
        })
    )
    return
  }

  // Default: Cache first, then network
  event.respondWith(
    caches.match(request).then(response => {
      return response || fetch(request)
    })
  )
})

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Handle queued actions when back online
      handleBackgroundSync()
    )
  }
})

// Handle background sync
async function handleBackgroundSync() {
  try {
    // Process any queued offline actions
    const offlineActions = await getOfflineActions()
    for (const action of offlineActions) {
      await processOfflineAction(action)
    }
    await clearOfflineActions()
  } catch (error) {
    console.error('Background sync failed:', error)
  }
}

// Get offline actions from IndexedDB
async function getOfflineActions() {
  // Implementation would depend on IndexedDB setup
  return []
}

// Process individual offline action
async function processOfflineAction(action) {
  // Implementation for processing queued actions
  console.log('Processing offline action:', action)
}

// Clear processed offline actions
async function clearOfflineActions() {
  // Implementation for clearing processed actions
  console.log('Clearing offline actions')
}

// Push notification handler
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json()
    const options = {
      body: data.body,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-72x72.png',
      data: data,
      tag: 'powerplant-notification',
      renotify: true,
    }

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    )
  }
})

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  
  event.waitUntil(
    clients.openWindow(event.notification.data.url || '/')
  )
})