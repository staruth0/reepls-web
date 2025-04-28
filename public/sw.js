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
  event.notification.close(); // Close the notification popup
  const notificationData = event.notification.data; // Access stored data (e.g., URL)
  if (notificationData && notificationData.url) {
    // Open the URL stored in the notification
    clients.openWindow(`${notificationData.url}`);
  }
});