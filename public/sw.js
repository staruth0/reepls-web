// Listen for the 'push' event triggered when a notification is received
self.addEventListener("push", (event) => {
  try {
    const data = event.data.json(); // Extract the payload sent from the backend
    console.log('Push event received:', data);
    
    // Display the notification to the user
    event.waitUntil(
      self.registration.showNotification(data.title, {
        body: data.body, // Notification body text
        icon: `/Logo.svg`, // Icon for the notification
        data: { url: data.url }, // Store a URL in the notification for later use
        badge: '/badge-icon.png', // Small icon for Android
        vibrate: [100, 50, 100], // Vibration pattern for devices that support it
      })
    );
  } catch (error) {
    console.error('Error processing push notification:', error);
  }
});

// Handle the 'notificationclick' event when the user clicks on the notification
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  try {
    const notificationData = event.notification.data;
    console.log('Notification clicked with data:', notificationData);
    
    if (notificationData && notificationData.url) {
      let finalUrl = notificationData.url;
      
      // The backend might be sending an object instead of a string due to missing quotes
      // Check if the URL isn't a string and convert it to a string
      if (typeof finalUrl !== 'string') {
        console.warn('URL is not a string:', finalUrl);
        finalUrl = String(finalUrl);
      }
      
      // Clean up any extra spaces that might be in the URL
      finalUrl = finalUrl.trim();
      
      // If the URL contains template variables (${...}) that weren't processed
      // Just extract the base path as a fallback
      if (finalUrl.includes('${')) {
        console.warn('Unprocessed template variables found in URL:', finalUrl);
        // Extract just the base path before the template variable
        finalUrl = finalUrl.split('${')[0];
        // Remove trailing slash if present
        finalUrl = finalUrl.endsWith('/') ? finalUrl.slice(0, -1) : finalUrl;
      }
      
      // If the URL does not start with http or https, assume it's relative
      if (!/^https?:\/\//i.test(finalUrl)) {
        // Ensure we don't have double slashes in the path
        if (finalUrl.startsWith('/')) {
          finalUrl = self.location.origin + finalUrl;
        } else {
          finalUrl = self.location.origin + '/' + finalUrl;
        }
      }
      
      console.log('Opening URL:', finalUrl);
      
      // Open the URL in an existing window if available, or open a new one
      event.waitUntil(
        clients.matchAll({type: 'window'}).then(clientList => {
          // If there's any open window, navigate it to the URL
          for (const client of clientList) {
            if ('navigate' in client && 'focus' in client) {
              return client.navigate(finalUrl).then(client => client.focus());
            }
          }
          
          // If no window is open or navigation failed, open a new one
          return clients.openWindow(finalUrl);
        }).catch(err => {
          console.error('Error handling notification click:', err);
          // Fallback: just try to open a new window
          return clients.openWindow(finalUrl);
        })
      );
    } else {
      console.warn('Notification clicked but no URL was provided in the data');
      
      // If no URL in notification, at least focus on the app
      event.waitUntil(
        clients.matchAll({type: 'window'}).then(clientList => {
          for (const client of clientList) {
            if ('focus' in client) {
              return client.focus();
            }
          }
          // If no client to focus, open the root of the app
          return clients.openWindow(self.location.origin);
        })
      );
    }
  } catch (error) {
    console.error('Error in notification click handler:', error);
    // Fallback - open the root app
    event.waitUntil(clients.openWindow(self.location.origin));
  }
});