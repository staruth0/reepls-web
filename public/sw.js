// Handle push notifications
self.addEventListener('push', event => {
  try {
    const data = event.data.json();
    
    const options = {
      body: data.body,
      icon: `/favicon.png`, // Add your app icon
      data: data.data || {} // Pass through all the data from the payload
    };

    // Add vibration pattern for different notification types
    if (data.data && data.data.type) {
      switch (data.data.type) {
        case 'follow':
          options.vibrate = [100, 50, 100];
          break;
        case 'reaction':
          options.vibrate = [100, 30, 100, 30, 100];
          break;
        case 'comment':
        case 'comment-reply':
          options.vibrate = [200, 100, 200];
          break;
        default:
          options.vibrate = [100, 50, 100];
      }
    }

    // You can customize notification appearance based on type
    if (data.data) {
      // Add actions based on notification type
      
      switch (data.data.type) {
        case 'follow':
          options.actions = [
            {
              action: 'view-profile',
              title: 'View Profile'
            }
          ];
          break;
        case 'reaction':
        case 'comment':
        case 'comment-reply':
          options.actions = [
            {
              action: 'view-post',
              title: 'View Post'
            }
          ];
          break;
      }
    }

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  } catch (error) {
    void error;
  }
});

// Handle notification click
self.addEventListener('notificationclick', event => {
  try {
    const notification = event.notification;
    const data = notification.data;
    const action = event.action;
    
    // Close the notification
    notification.close();
    
    // Determine the URL to open based on the notification type and action
    let url = '/';
    
    // Fix the URL format - the URLs in your payloads are missing quotes and need to be treated as template strings
    const fixUrl = (urlString) => {
      if (!urlString) return '/';
      
      // Handle template string formats like /posts/article/slug/${article.slug}
      if (urlString.includes('${')) {
        // For demonstration, extract the path pattern before the variable
        const pathPattern = urlString.split('${')[0];
        // Extract the variable name inside ${}
        const varNameWithEnd = urlString.split('${')[1];
        const varName = varNameWithEnd ? varNameWithEnd.split('}')[0] : '';
        
        // Use the corresponding data property if available
        if (data[varName]) {
          return `${pathPattern}${data[varName]}`;
        } else if (varName.includes('.') && varName.split('.').length === 2) {
          // Handle nested properties like article.slug
          const [obj, prop] = varName.split('.');
          if (data[obj] && data[obj][prop]) {
            return `${pathPattern}${data[obj][prop]}`;
          }
        }
      }
      
      // If the URL doesn't need processing or we can't process it, return as is
      return urlString;
    };
    
    // Make sure we have data
    if (data) {
      // Handle specific actions if clicked
      if (action === 'view-profile' && data.type === 'follow') {
        url = fixUrl(data.url);
      } else if (action === 'view-post' && (data.type === 'reaction' || data.type === 'comment' || data.type === 'comment-reply')) {
        url = fixUrl(data.url);
      } else {
        // Default click behavior based on notification type
        switch (data.type) {
          case 'follow':
            url = fixUrl(data.url); // Format: /profile/${sender_name}
            break;
            
          case 'reaction':
            // Handle the URL correctly based on whether it's an article or post
            if (data.url) {
              url = fixUrl(data.url); // URL could be either /posts/article/slug/${article.slug} or /posts/post/${article._id}
            } else if (data.articleSlug) {
              url = `/posts/article/slug/${data.articleSlug}`;
            } else if (data.articleId) {
              url = `/posts/post/${data.articleId}`;
            }
            
            if (data.commentId) {
              url += `#comment-${data.commentId}`;
            }
            break;
            
          case 'comment':
            // Handle the URL correctly based on whether it's an article or post
            if (data.url) {
              url = fixUrl(data.url); // URL could be either /posts/article/slug/${article.slug} or /posts/post/${article._id}
            } else if (data.articleSlug) {
              url = `/posts/article/slug/${data.articleSlug}`;
            } else if (data.articleId) {
              url = `/posts/post/${data.articleId}`;
            }
            break;
            
          case 'comment-reply':
            // Handle the URL correctly based on whether it's an article or post
            if (data.url) {
              url = fixUrl(data.url); // URL could be either /posts/article/slug/${article.slug} or /posts/post/${article._id}
            } else if (data.articleSlug) {
              url = `/posts/article/slug/${data.articleSlug}`;
            } else if (data.articleId) {
              url = `/posts/post/${data.articleId}`;
            }
            
            if (data.parentCommentId) {
              url += `#comment-${data.parentCommentId}`;
            }
            break;
            
          default:
            // For new article posts or unspecified types
            if (data.url) {
              url = fixUrl(data.url); // URL could be either /posts/article/slug/${article.slug} or /posts/post/${article._id}
            } else if (data.articleSlug) {
              url = `/posts/article/slug/${data.articleSlug}`;
            } else if (data.articleId) {
              url = `/posts/post/${data.articleId}`;
            }
            break;
        }
      }

      // If the URL was not properly processed or is missing, provide a fallback
      if (!url || url === '/') {
        if (data.articleSlug) {
          url = `/posts/article/slug/${data.articleSlug}`;
        } else if (data.articleId) {
          url = `/posts/post/${data.articleId}`;
        }
      }
    }
    
    // Ensure the URL starts with a slash for proper routing
    if (url && !url.startsWith('/') && !url.startsWith('http')) {
      url = `/${url}`;
    }
    
    // Open the specific page when notification is clicked
    event.waitUntil(
      clients.matchAll({type: 'window'}).then(clientList => {
        // Check if there's already a window/tab open with the target URL
        for (const client of clientList) {
          // Strip origin from client.url for comparison
          const clientUrl = new URL(client.url).pathname;
          // Remove leading slash for comparison if present
          const normalizedClientUrl = clientUrl.startsWith('/') ? clientUrl.substring(1) : clientUrl;
          const normalizedTargetUrl = url.startsWith('/') ? url.substring(1) : url;
          
          if (normalizedClientUrl.includes(normalizedTargetUrl) && 'focus' in client) {
            return client.focus();
          }
        }
        
        // If no window/tab is open with the URL, open a new one
        if (clients.openWindow) {
          // Make sure the URL is valid and prepend origin if it's a relative path
          if (url.startsWith('http')) {
            return clients.openWindow(url);
          } else {
            // For relative URLs, we need to make them absolute
            // Use self.registration.scope to get the base URL
            const baseUrl = self.registration.scope;
            // Remove leading slash if it exists to avoid double slashes
            const relativeUrl = url.startsWith('/') ? url.substring(1) : url;
            return clients.openWindow(`${baseUrl}${relativeUrl}`);
          }
        }
      })
    );
  } catch (error) {
    void error;
    // Fallback to opening the homepage
    event.waitUntil(clients.openWindow('/'));
  }
});

// Handle notification action buttons (optional)
self.addEventListener('notificationclose', event => {
  // You could track notification close events here if desired
});

// Handle the installation of the service worker
self.addEventListener('install', event => {
  self.skipWaiting();
});

// Handle the activation of the service worker
self.addEventListener('activate', event => {
  event.waitUntil(clients.claim());
});