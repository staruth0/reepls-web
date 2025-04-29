// Listen for the 'push' event triggered when a notification is received
self.addEventListener("push", (event) => {
  const data = event.data.json(); // Extract the payload sent from the backend
  console.log('Push event received:', data);

  // Display the notification to the user
  self.registration.showNotification(data.title, {
    body: data.body, // Notification body text
    icon: `/Logo.svg`, // Icon for the notification (optional)
    data: { url: data.url }, // Store a URL in the notification for later use (e.g., redirection)
  });
});

// Handle the 'notificationclick' event when the user clicks on the notification
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const notificationData = event.notification.data;

  if (notificationData && notificationData.url) {
    let finalUrl = notificationData.url;

    // If the URL does not start with http or https, assume it's relative
    if (!/^https?:\/\//i.test(finalUrl)) {
      finalUrl = self.location.origin + finalUrl;
    }

    // Open the absolute URL
    event.waitUntil(clients.openWindow(finalUrl));
  }
});
