// Service Worker for REEPLS Push Notifications
// Handles Web Push (VAPID) and FCM notifications

const CACHE_NAME = 'reepls-v1';
const STATIC_CACHE_NAME = 'reepls-static-v1';

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
  'publication-article': [150, 50, 150, 50, 150]
};

// Default notification icon and badge
const DEFAULT_ICON = '/icons/notification-icon.png';
const DEFAULT_BADGE = '/icons/badge-icon.png';

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
    icon: notificationData.icon || DEFAULT_ICON,
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
          icon: '/icons/view.svg'
        },
        {
          action: 'dismiss',
          title: 'Dismiss',
          icon: '/icons/close.svg'
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
          icon: '/icons/view.svg'
        },
        {
          action: 'reply',
          title: 'Reply',
          icon: '/icons/reply.svg'
        },
        {
          action: 'dismiss',
          title: 'Dismiss',
          icon: '/icons/close.svg'
        }
      ];
      options.tag = `comment-${notificationPayload.article_id || notificationPayload.articleId || ''}`;
      break;

    case 'follow':
      options.actions = [
        {
          action: 'view-profile',
          title: 'View Profile',
          icon: '/icons/profile.svg'
        },
        {
          action: 'follow-back',
          title: 'Follow Back',
          icon: '/icons/follow.svg'
        },
        {
          action: 'dismiss',
          title: 'Dismiss',
          icon: '/icons/close.svg'
        }
      ];
      options.tag = `follow-${notificationPayload.sender_id || ''}`;
      break;

    case 'article':
      const hasPodcast = notificationPayload.hasPodcast === 'true' || notificationPayload.hasPodcast === true;
      options.actions = [
        {
          action: 'view-post',
          title: 'Read Article',
          icon: '/icons/article.svg'
        },
        ...(hasPodcast ? [{
          action: 'view-podcast',
          title: 'Play Podcast',
          icon: '/icons/podcast.svg'
        }] : []),
        {
          action: 'later',
          title: 'Read Later',
          icon: '/icons/bookmark.svg'
        }
      ];
      options.tag = `article-${notificationPayload.article_id || notificationPayload.articleId || ''}`;
      break;

    case 'post':
      options.actions = [
        {
          action: 'view-post',
          title: 'View Post',
          icon: '/icons/view.svg'
        },
        {
          action: 'later',
          title: 'Read Later',
          icon: '/icons/bookmark.svg'
        }
      ];
      options.tag = `post-${notificationPayload.article_id || notificationPayload.articleId || ''}`;
      break;

    case 'podcast':
      options.actions = [
        {
          action: 'view-podcast',
          title: 'Play Podcast',
          icon: '/icons/podcast.svg'
        },
        {
          action: 'later',
          title: 'Listen Later',
          icon: '/icons/bookmark.svg'
        }
      ];
      options.tag = `podcast-${notificationPayload.podcastId || notificationPayload.podcast_id || ''}`;
      break;

    case 'publication':
      options.actions = [
        {
          action: 'view-publication',
          title: 'View Publication',
          icon: '/icons/article.svg'
        },
        {
          action: 'subscribe',
          title: 'Subscribe',
          icon: '/icons/subscribe.svg'
        },
        {
          action: 'later',
          title: 'Read Later',
          icon: '/icons/bookmark.svg'
        }
      ];
      options.tag = `publication-${notificationPayload.publicationId || notificationPayload.article_id || ''}`;
      break;

    case 'publication-article':
      options.actions = [
        {
          action: 'view-post',
          title: 'Read Article',
          icon: '/icons/article.svg'
        },
        {
          action: 'view-publication',
          title: 'View Publication',
          icon: '/icons/article.svg'
        },
        {
          action: 'later',
          title: 'Read Later',
          icon: '/icons/bookmark.svg'
        }
      ];
      options.tag = `publication-article-${notificationPayload.article_id || notificationPayload.articleId || ''}`;
      break;

    default:
      options.actions = [
        {
          action: 'view',
          title: 'View',
          icon: '/icons/view.svg'
        },
        {
          action: 'dismiss',
          title: 'Dismiss',
          icon: '/icons/close.svg'
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
      url = data.isArticle === 'true' || data.isArticle === true
        ? `/posts/article/slug/${data.slug}`
        : `/posts/post/${data.article_id || data.articleId}`;
    } else if (data.article_id || data.articleId) {
      url = data.isArticle === 'true' || data.isArticle === true
        ? `/posts/article/${data.article_id || data.articleId}`
        : `/posts/post/${data.article_id || data.articleId}`;
    } else if (data.url) {
      url = data.url;
    }
  } else if (action === 'view-podcast') {
    // Navigate to podcast
    if (data.podcastId || data.podcast_id) {
      url = `/podcasts/${data.podcastId || data.podcast_id}`;
    } else if (data.url) {
      url = data.url;
    }
  } else if (action === 'view-publication') {
    // Navigate to publication
    if (data.url) {
      url = data.url;
    } else if (data.publicationId) {
      url = `/publications/${data.publicationId}`;
    } else if (data.article_id && notificationType === 'publication') {
      // Only use article_id for publication type, not publication-article
      url = `/publications/${data.article_id}`;
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
    // Navigate to post with comment focus
    if (data.slug) {
      url = `/posts/article/slug/${data.slug}?comment=${data.parentCommentId || data.commentId || ''}`;
    } else if (data.article_id || data.articleId) {
      url = `/posts/article/${data.article_id || data.articleId}?comment=${data.parentCommentId || data.commentId || ''}`;
    }
  } else if (action === 'follow-back') {
    // Navigate to profile and trigger follow
    if (data.sender_name) {
      url = `/profile/${data.sender_name}?action=follow`;
    } else if (data.sender_id) {
      url = `/profile/${data.sender_id}?action=follow`;
    }
  } else if (action === 'subscribe') {
    // Navigate to publication and trigger subscribe
    if (data.publicationId) {
      url = `/publications/${data.publicationId}?action=subscribe`;
    } else if (data.article_id && notificationType === 'publication') {
      url = `/publications/${data.article_id}?action=subscribe`;
    }
  } else if (action === 'later') {
    // Save for later - navigate to saved items or notifications
    url = '/saved';
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
      // Publication notification - navigate to publication
      if (data.url) {
        url = data.url;
      } else if (data.publicationId) {
        url = `/publications/${data.publicationId}`;
      } else if (data.article_id) {
        url = `/publications/${data.article_id}`;
      }
    } else if (notificationType === 'podcast') {
      // Podcast notification - navigate to podcast
      if (data.url) {
        url = data.url;
      } else if (data.podcastId || data.podcast_id) {
        url = `/podcasts/${data.podcastId || data.podcast_id}`;
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
      // Comment notification - navigate to post
      if (data.slug) {
        url = `/posts/article/slug/${data.slug}`;
      } else if (data.article_id || data.articleId) {
        url = `/posts/article/${data.article_id || data.articleId}`;
      } else if (data.url) {
        url = data.url;
      }
    } else if (notificationType === 'reaction') {
      // Reaction notification - navigate to post
      if (data.slug) {
        url = `/posts/article/slug/${data.slug}`;
      } else if (data.article_id || data.articleId) {
        url = `/posts/article/${data.article_id || data.articleId}`;
      } else if (data.url) {
        url = data.url;
      }
    } else if (notificationType === 'article' || notificationType === 'post') {
      // Article/Post notification - navigate to post
      if (data.slug) {
        url = data.isArticle === 'true' || data.isArticle === true
          ? `/posts/article/slug/${data.slug}`
          : `/posts/post/${data.article_id || data.articleId}`;
      } else if (data.article_id || data.articleId) {
        url = data.isArticle === 'true' || data.isArticle === true
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
});

// Fetch event - serve cached content when offline (optional)
self.addEventListener('fetch', (event) => {
  // Only cache GET requests
  if (event.request.method !== 'GET') {
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

