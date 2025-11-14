// Firebase Cloud Messaging Service Worker
// This file is required by Firebase to handle background messages
// It delegates to the main service worker for push notifications

// Import the main service worker script
importScripts('/sw.js');

// Firebase will automatically use this file for background message handling
// The main sw.js handles all push events including FCM messages
