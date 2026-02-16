// Service Worker for REEPLS Push Notifications
// Handles Web Push (VAPID) and FCM notifications

// Import Firebase SDKs (using compat version for service workers)
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js');

const CACHE_NAME = 'reepls-v1';
const STATIC_CACHE_NAME = 'reepls-static-v1';

// Firebase configuration - will be set via message from main app
let firebaseConfig = null;
let messaging = null;

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  self.skipWaiting(); // Activate immediately
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME && name !== STATIC_CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  return self.clients.claim(); // Take control of all pages immediately
});

// Vibration patterns for different notification types
const vibrationPatterns = {
  'follow': [100, 50, 100],
  'reaction': [100, 30, 100, 30, 100],
  'comment': [200, 100, 200],
  'comment-reply': [200, 50, 100, 50, 200],
  'article': [100, 50, 100, 50, 100],
  'post': [150, 50, 150],
  'podcast': [150, 75, 150, 75, 150],
  'publication': [150, 50, 150, 50, 150],
  'publication-article': [150, 50, 150, 50, 150],
  'stream': [150, 50, 150, 50, 150]
};

// Default notification icon and badge
const DEFAULT_ICON = '/favicon.png';
const DEFAULT_BADGE = '/favicon.png';

// Helper function to parse boolean values from strings
function parseBoolean(value) {
  if (typeof value === 'string') {
    return value === 'true' || value === '1';
  }
  return Boolean(value);
}

// Initialize Firebase with config received from main app
function initializeFirebase(config) {
  if (!config || firebaseConfig) {
    return; // Already initialized or no config
  }

  try {
    firebaseConfig = config;
    firebase.initializeApp(config);
    messaging = firebase.messaging();
    
    console.log('[Service Worker] Firebase initialized successfully');
    
    // Set up background message handler for FCM
    messaging.onBackgroundMessage((payload) => {
      console.log('[Service Worker] FCM background message received:', payload);
      
      // Extract notification data
      const notificationData = extractNotificationData(payload);
      const data = payload.data || {};
      
      // Build notification options
      const options = buildNotificationOptions(notificationData, data);
      
      // Show notification
      return self.registration.showNotification(
        notificationData.title || 'New Notification',
        options
      );
    });
    
    console.log('[Service Worker] FCM background message handler registered');
  } catch (error) {
    console.error('[Service Worker] Firebase initialization error:', error);
  }
}

// Helper function to extract notification data from different payload formats
function extractNotificationData(payload) {
  // Handle Web Push (VAPID) format - payload is a JSON string
  if (typeof payload === 'string') {
    try {
      const parsed = JSON.parse(payload);
      return {
        title: parsed.title,
        body: parsed.body,
        icon: parsed.icon,
        image: parsed.image,
        data: parsed.data || parsed
      };
    } catch (e) {
      console.error('[SW] Error parsing payload:', e);
      return { title: 'New Notification', body: payload, data: {} };
    }
  }
  
  // Handle FCM format - payload is an object with notification and data
  if (payload.notification) {
    return {
      title: payload.notification.title,
      body: payload.notification.body,
      icon: payload.notification.icon || payload.notification.imageUrl,
      image: payload.notification.image || payload.notification.imageUrl,
      data: payload.data || {}
    };
  }
  
  // Handle direct object format
  return {
    title: payload.title || 'New Notification',
    body: payload.body || payload.message || '',
    icon: payload.icon,
    image: payload.image,
    data: payload.data || payload
  };
}

// Helper function to get notification type
function getNotificationType(data) {
  return data?.type || 
         data?.data?.type || 
         data?.contentType || 
         data?.data?.contentType || 
         'default';
}

// Helper function to build notification options
function buildNotificationOptions(notificationData, data) {
  const notificationType = getNotificationType(data);
  const options = {
    body: notificationData.body,
    icon:  DEFAULT_ICON,
    badge: DEFAULT_BADGE,
    image: notificationData.image,
    tag: `notification-${notificationType}-${Date.now()}`,
    requireInteraction: false,
    silent: false,
    vibrate: vibrationPatterns[notificationType] || [100, 50, 100],
    data: data || notificationData.data || {},
    timestamp: Date.now()
  };

  // Add action buttons based on notification type
  const notificationPayload = data?.data || data || notificationData.data || {};
  
  switch (notificationType) {
    case 'reaction':
      options.actions = [
        {
          action: 'view-post',
          title: 'View Post',
          icon: '/favicon.png'
        },
        {
          action: 'dismiss',
          title: 'Dismiss',
          icon: '/favicon.png'
        }
      ];
      options.tag = `reaction-${notificationPayload.article_id || notificationPayload.articleId || ''}`;
      break;

    case 'comment':
    case 'comment-reply':
      options.actions = [
        {
          action: 'view-post',
          title: 'View Post',
          icon: '/favicon.png'
        },
        {
          action: 'reply',
          title: 'Reply',
          icon: '/favicon.png'
        },
        {
          action: 'dismiss',
          title: 'Dismiss',
          icon: '/favicon.png'
        }
      ];
      options.tag = `comment-${notificationPayload.article_id || notificationPayload.articleId || ''}`;
      break;

    case 'follow':
      options.actions = [
        {
          action: 'view-profile',
          title: 'View Profile',
          icon: '/favicon.png'
        },
        {
          action: 'follow-back',
          title: 'Follow Back',
          icon: '/favicon.png'
        },
        {
          action: 'dismiss',
          title: 'Dismiss',
          icon: '/favicon.png'
        }
      ];
      options.tag = `follow-${notificationPayload.sender_id || ''}`;
      break;

    case 'article':
      const hasPodcast = parseBoolean(notificationPayload.hasPodcast);
      options.actions = [
        {
          action: 'view-post',
          title: 'Read Article',
          icon: '/favicon.png'
        },
        ...(hasPodcast ? [{
          action: 'view-podcast',
          title: 'Play Podcast',
          icon: '/favicon.png'
        }] : []),
        {
          action: 'later',
          title: 'Read Later',
          icon: '/favicon.png'
        }
      ];
      options.tag = `article-${notificationPayload.article_id || notificationPayload.articleId || ''}`;
      break;

    case 'post':
      options.actions = [
        {
          action: 'view-post',
          title: 'View Post',
          icon: '/favicon.png'
        },
        {
          action: 'later',
          title: 'Read Later',
          icon: '/favicon.png'
        }
      ];
      options.tag = `post-${notificationPayload.article_id || notificationPayload.articleId || ''}`;
      break;

    case 'podcast':
      options.actions = [
        {
          action: 'view-podcast',
          title: 'Play Podcast',
          icon: '/favicon.png'
        },
        {
          action: 'later',
          title: 'Listen Later',
          icon: '/favicon.png'
        }
      ];
      options.tag = `podcast-${notificationPayload.podcastId || notificationPayload.podcast_id || ''}`;
      break;

    case 'publication':
      options.actions = [
        {
          action: 'view-publication',
          title: 'View Stream',
          icon: '/favicon.png'
        },
        {
          action: 'subscribe',
          title: 'Subscribe',
          icon: '/favicon.png'
        },
        {
          action: 'later',
          title: 'Read Later',
          icon: '/favicon.png'
        }
      ];
      options.tag = `publication-${notificationPayload.streamId || notificationPayload.stream_id || notificationPayload.publicationId || notificationPayload.article_id || ''}`;
      break;

    case 'publication-article':
      options.actions = [
        {
          action: 'view-post',
          title: 'Read Article',
          icon: '/favicon.png'
        },
        {
          action: 'view-publication',
          title: 'View Stream',
          icon: '/favicon.png'
        },
        {
          action: 'later',
          title: 'Read Later',
          icon: '/favicon.png'
        }
      ];
      options.tag = `publication-article-${notificationPayload.article_id || notificationPayload.articleId || ''}`;
      break;

    case 'stream':
      options.actions = [
        {
          action: 'view-publication',
          title: 'View Stream',
          icon: '/favicon.png'
        },
        {
          action: 'subscribe',
          title: 'Subscribe',
          icon: '/favicon.png'
        },
        {
          action: 'later',
          title: 'Read Later',
          icon: '/favicon.png'
        }
      ];
      options.tag = `stream-${notificationPayload.streamId || notificationPayload.stream_id || ''}`;
      break;

    default:
      options.actions = [
        {
          action: 'view',
          title: 'View',
          icon: '/favicon.png'
        },
        {
          action: 'dismiss',
          title: 'Dismiss',
          icon: '/favicon.png'
        }
      ];
  }

  return options;
}

// Push event - handle incoming push notifications
self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push event received:', event);
  
  let notificationData;
  let data;

  try {
    // Handle different payload formats
    if (event.data) {
      const payload = event.data.json();
      const extracted = extractNotificationData(payload);
      notificationData = extracted;
      data = extracted.data || payload.data || payload;
    } else {
      notificationData = {
        title: 'New Notification',
        body: 'You have a new notification',
        data: {}
      };
      data = {};
    }

    console.log('[Service Worker] Notification data:', notificationData);
    console.log('[Service Worker] Notification payload:', data);

    const options = buildNotificationOptions(notificationData, data);
    
    event.waitUntil(
      self.registration.showNotification(notificationData.title || 'New Notification', options)
    );
  } catch (error) {
    console.error('[Service Worker] Error handling push event:', error);
    // Show a fallback notification
    event.waitUntil(
      self.registration.showNotification('New Notification', {
        body: 'You have a new notification',
        icon: DEFAULT_ICON,
        badge: DEFAULT_BADGE,
        tag: 'fallback-notification',
        data: {}
      })
    );
  }
});

// Notification click event - handle user interaction
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Notification clicked:', event);
  
  event.notification.close();
  
  const action = event.action;
  const data = event.notification.data || {};
  const notificationType = getNotificationType(data);
  
  let url = '/notifications'; // Default fallback
  
  // Handle action buttons
  if (action === 'view-post' || action === 'view') {
    // Navigate to article/post
    if (data.slug) {
      url = parseBoolean(data.isArticle)
        ? `/posts/article/slug/${data.slug}`
        : `/posts/post/${data.article_id || data.articleId}`;
    } else if (data.article_id || data.articleId) {
      url = parseBoolean(data.isArticle)
        ? `/posts/article/${data.article_id || data.articleId}`
        : `/posts/post/${data.article_id || data.articleId}`;
    } else if (data.url) {
      url = data.url;
    }
  } else if (action === 'view-podcast') {
    // Navigate to podcast
    if (data.podcastId || data.podcast_id) {
      url = `/podcast/${data.podcastId || data.podcast_id}`;
    } else if (data.url) {
      url = data.url;
    }
  } else if (action === 'view-publication') {
    // Navigate to stream
    if (data.url) {
      url = data.url;
    } else if (data.streamId || data.stream_id) {
      url = `/stream/${data.streamId || data.stream_id}`;
    } else if (data.publicationId) {
      url = `/stream/${data.publicationId}`;
    } else if (data.article_id && notificationType === 'publication') {
      // Only use article_id for publication type, not publication-article
      url = `/stream/${data.article_id}`;
    }
  } else if (action === 'view-profile') {
    // Navigate to user profile
    if (data.url) {
      url = data.url;
    } else if (data.sender_name) {
      url = `/profile/${data.sender_name}`;
    } else if (data.sender_id) {
      url = `/profile/${data.sender_id}`;
    }
  } else if (action === 'reply') {
    // Navigate to the article or post where the comment was made, with comment focus
    if (data.slug) {
      // If slug exists, check if it's an article or post
      url = parseBoolean(data.isArticle)
        ? `/posts/article/slug/${data.slug}?comment=${data.parentCommentId || data.commentId || ''}`
        : `/posts/post/${data.article_id || data.articleId}?comment=${data.parentCommentId || data.commentId || ''}`;
    } else if (data.article_id || data.articleId) {
      // Determine if it's an article or post based on isArticle flag
      url = parseBoolean(data.isArticle)
        ? `/posts/article/${data.article_id || data.articleId}?comment=${data.parentCommentId || data.commentId || ''}`
        : `/posts/post/${data.article_id || data.articleId}?comment=${data.parentCommentId || data.commentId || ''}`;
    }
  } else if (action === 'follow-back') {
    // Navigate to profile and trigger follow
    if (data.sender_name) {
      url = `/profile/${data.sender_name}?action=follow`;
    } else if (data.sender_id) {
      url = `/profile/${data.sender_id}?action=follow`;
    }
  } else if (action === 'subscribe') {
    // Navigate to stream and trigger subscribe
    if (data.streamId || data.stream_id) {
      url = `/stream/${data.streamId || data.stream_id}?action=subscribe`;
    } else if (data.publicationId) {
      url = `/stream/${data.publicationId}?action=subscribe`;
    } else if (data.article_id && notificationType === 'publication') {
      url = `/stream/${data.article_id}?action=subscribe`;
    }
  } else if (action === 'later') {
    // Save for later - navigate to bookmarks
    url = '/bookmarks';
  } else if (action === 'dismiss') {
    // Just close the notification, don't navigate
    return;
  } else {
    // Default click behavior - navigate based on notification type
    if (notificationType === 'publication-article') {
      // Article added to publication - navigate to article
      if (data.slug) {
        url = `/posts/article/slug/${data.slug}`;
      } else if (data.article_id || data.articleId) {
        url = `/posts/article/${data.article_id || data.articleId}`;
      }
    } else if (notificationType === 'publication') {
      // Publication/Stream notification - navigate to stream
      if (data.url) {
        url = data.url;
      } else if (data.streamId || data.stream_id) {
        url = `/stream/${data.streamId || data.stream_id}`;
      } else if (data.publicationId) {
        url = `/stream/${data.publicationId}`;
      } else if (data.article_id) {
        url = `/stream/${data.article_id}`;
      }
    } else if (notificationType === 'podcast') {
      // Podcast notification - navigate to podcast
      if (data.url) {
        url = data.url;
      } else if (data.podcastId || data.podcast_id) {
        url = `/podcast/${data.podcastId || data.podcast_id}`;
      }
    } else if (notificationType === 'follow') {
      // Follow notification - navigate to profile
      if (data.url) {
        url = data.url;
      } else if (data.sender_name) {
        url = `/profile/${data.sender_name}`;
      } else if (data.sender_id) {
        url = `/profile/${data.sender_id}`;
      }
    } else if (notificationType === 'comment' || notificationType === 'comment-reply') {
      // Comment notification - navigate to the article or post where the comment was made
      if (data.slug) {
        // If slug exists, check if it's an article or post
        url = parseBoolean(data.isArticle)
          ? `/posts/article/slug/${data.slug}`
          : `/posts/post/${data.article_id || data.articleId}`;
      } else if (data.article_id || data.articleId) {
        // Determine if it's an article or post based on isArticle flag
        url = parseBoolean(data.isArticle)
          ? `/posts/article/${data.article_id || data.articleId}`
          : `/posts/post/${data.article_id || data.articleId}`;
      } else if (data.url) {
        url = data.url;
      }
    } else if (notificationType === 'reaction') {
      // Reaction notification - navigate to the article or post where the reaction was made
      if (data.slug) {
        // If slug exists, check if it's an article or post
        url = parseBoolean(data.isArticle)
          ? `/posts/article/slug/${data.slug}`
          : `/posts/post/${data.article_id || data.articleId}`;
      } else if (data.article_id || data.articleId) {
        // Determine if it's an article or post based on isArticle flag
        url = parseBoolean(data.isArticle)
          ? `/posts/article/${data.article_id || data.articleId}`
          : `/posts/post/${data.article_id || data.articleId}`;
      } else if (data.url) {
        url = data.url;
      }
    } else if (notificationType === 'stream') {
      // Stream notification - navigate to stream
      if (data.url) {
        url = data.url;
      } else if (data.streamId || data.stream_id) {
        url = `/stream/${data.streamId || data.stream_id}`;
      } else if (data.publicationId) {
        url = `/stream/${data.publicationId}`;
      }
    } else if (notificationType === 'article' || notificationType === 'post') {
      // Article/Post notification - navigate to post
      if (data.slug) {
        url = parseBoolean(data.isArticle)
          ? `/posts/article/slug/${data.slug}`
          : `/posts/post/${data.article_id || data.articleId}`;
      } else if (data.article_id || data.articleId) {
        url = parseBoolean(data.isArticle)
          ? `/posts/article/${data.article_id || data.articleId}`
          : `/posts/post/${data.article_id || data.articleId}`;
      } else if (data.url) {
        url = data.url;
      }
    } else if (data.url) {
      // Fallback to URL in data
      url = data.url;
    }
  }

  // Ensure URL is relative (starts with /)
  if (!url.startsWith('/')) {
    url = '/' + url;
  }

  // Ensure URL doesn't start with // (double slash)
  url = url.replace(/^\/\//, '/');

  console.log('[Service Worker] Opening URL:', url);

  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    }).then((clientList) => {
      // Check if there's already a window/tab open with the target URL
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url.includes(url.split('?')[0]) && 'focus' in client) {
          return client.focus();
        }
      }
      // If no existing window, open a new one
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});

// Notification close event (optional - for analytics)
self.addEventListener('notificationclose', (event) => {
  console.log('[Service Worker] Notification closed:', event);
  // You can send analytics here if needed
});

// Message event - handle messages from the main app
self.addEventListener('message', (event) => {
  console.log('[Service Worker] Message received:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_URLS') {
    event.waitUntil(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.addAll(event.data.urls);
      })
    );
  }
  
  // Handle Firebase config initialization
  if (event.data && event.data.type === 'FIREBASE_CONFIG') {
    initializeFirebase(event.data.config);
  }
});

// Fetch event - serve cached content when offline (optional)
self.addEventListener('fetch', (event) => {
  // Only cache GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Never cache navigation/document requests so the app always loads the latest index.html and entry point
  if (event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request));
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached version or fetch from network
      return response || fetch(event.request).then((response) => {
        // Don't cache non-successful responses
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        // Clone the response
        const responseToCache = response.clone();

        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return response;
      });
    })
  );
});

