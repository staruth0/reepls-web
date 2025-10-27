// Enhanced Service Worker for Professional Push Notifications

const CACHE_NAME = 'reepls-v1';
const OFFLINE_URL = '/offline.html';

// Install event - cache resources for offline support
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll([OFFLINE_URL]))
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Handle push notifications with rich content and actions
self.addEventListener('push', event => {
  try {
    const data = event.data ? event.data.json() : {};
    
    // Default notification options
    const options = {
      body: data.body || data.message || 'New notification',
      icon: data.icon || '/favicon.png',
      badge: '/favicon.png',
      image: data.image || undefined, // Large image for rich notifications
      requireInteraction: data.requireInteraction || false,
      silent: data.silent || false,
      data: data.data || {},
      tag: data.tag || `notification-${Date.now()}`, // Group notifications
      renotify: data.renotify || false,
      timestamp: Date.now(),
      vibrate: [],
      actions: [],
      dir: data.dir || 'auto',
      lang: data.lang || 'en-US'
    };

    // Set vibration patterns based on notification type
    if (data.data && data.data.type) {
      const vibrationPatterns = {
        'follow': [100, 50, 100],
        'reaction': [100, 30, 100, 30, 100],
        'comment': [200, 100, 200],
        'comment-reply': [200, 50, 100, 50, 200],
        'article': [100, 50, 100, 50, 100],
        'post': [150, 50, 150]
      };
      
      options.vibrate = vibrationPatterns[data.data.type] || [100, 50, 100];
    }

    // Add action buttons based on notification type
    if (data.data && data.data.type) {
      switch (data.data.type) {
        case 'follow':
          options.actions = [
            {
              action: 'view-profile',
              title: 'View Profile',
              icon: '/icons/user.svg'
            },
            {
              action: 'dismiss',
              title: 'Dismiss',
              icon: '/icons/close.svg'
            }
          ];
          options.tag = `follow-${data.data.sender_id}`;
          break;
          
        case 'reaction':
          options.actions = [
            {
              action: 'view-post',
              title: 'View Post',
              icon: '/icons/heart.svg'
            },
            {
              action: 'view-profile',
              title: 'View User',
              icon: '/icons/user.svg'
            }
          ];
          options.tag = `reaction-${data.data.article_id}`;
          break;
          
        case 'comment':
        case 'comment-reply':
          options.actions = [
            {
              action: 'view-post',
              title: 'View Post',
              icon: '/icons/comment.svg'
            },
            {
              action: 'reply',
              title: 'Reply',
              icon: '/icons/reply.svg'
            }
          ];
          options.tag = `comment-${data.data.article_id}`;
          break;
          
        case 'article':
        case 'post':
          options.actions = [
            {
              action: 'view-post',
              title: 'Read Now',
              icon: '/icons/article.svg'
            },
            {
              action: 'later',
              title: 'Read Later',
              icon: '/icons/bookmark.svg'
            }
          ];
          options.tag = `${data.data.type}-${data.data.article_id}`;
          break;
      }
    }

    // Show the notification
    event.waitUntil(
      self.registration.showNotification(data.title || 'New Notification', options)
    );
  } catch (error) {
    console.error('Error handling push notification:', error);
  }
});

// Handle notification clicks with improved navigation
self.addEventListener('notificationclick', event => {
  try {
    const notification = event.notification;
    const data = notification.data;
    const action = event.action;
    
    // Close the notification
    notification.close();
    
    let url = '/';
    
    // Handle action buttons
    if (action === 'view-profile' && data?.sender_id) {
      url = `/profile/${data.sender_id}`;
    } else if (action === 'view-post' && data) {
      if (data.slug) {
        url = `/posts/article/slug/${data.slug}`;
      } else if (data.article_id) {
        url = `/posts/post/${data.article_id}`;
      }
    } else if (action === 'reply' && data) {
      if (data.slug) {
        url = `/posts/article/slug/${data.slug}`;
      } else if (data.article_id) {
        url = `/posts/post/${data.article_id}`;
      }
      // Scroll to comment section if needed
      url += data.comment_id ? `?focusComment=${data.comment_id}` : '';
    } else if (action === 'later' && data) {
      // Handle "Read Later" action
      url = `/bookmarks`;
    } else if (action === 'dismiss') {
      // User dismissed the notification
      return;
    } else {
      // Default click behavior
      if (data?.type === 'follow' && data.sender_id) {
        url = `/profile/${data.sender_id}`;
      } else if (data?.slug) {
        url = `/posts/article/slug/${data.slug}`;
      } else if (data?.article_id) {
        url = `/posts/post/${data.article_id}`;
      } else {
        url = '/notifications';
      }
    }
    
    // Open or focus the appropriate page
    event.waitUntil(
      clients.matchAll({ 
        type: 'window', 
        includeUncontrolled: true 
      }).then(clientList => {
        // Try to find an existing window with the app
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i];
          
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            // Focus existing window and navigate
            return client.focus().then(() => {
              client.postMessage({ type: 'navigate', url });
            });
          }
        }
        
        // No existing window found, open new one
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
    );
  } catch (error) {
    console.error('Error handling notification click:', error);
    // Fallback: open home page
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Handle notification close event
self.addEventListener('notificationclose', event => {
  const notification = event.notification;
  const data = notification.data;
  
  // Track notification close for analytics
  if (data) {
    console.log('Notification closed:', {
      type: data.type,
      timeToClose: Date.now() - notification.timestamp,
      tag: notification.tag
    });
  }
});

// Fetch event for offline support
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') {
    return;
  }
  
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Cache successful responses
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // Return cached version or offline page
        return caches.match(event.request)
          .then(response => {
            if (response) {
              return response;
            }
            return caches.match(OFFLINE_URL);
          });
      })
  );
});
