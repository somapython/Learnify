import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { listenForForegroundMessages } from "@/firebase/messaging";

import './assets/main.css'
// Register the service worker
if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/firebase-messaging-sw.js")
      .then((registration) => {
        console.log("Service Worker registered with scope:", registration.scope);
      })
      .catch((err) => {
        console.error("Service Worker registration failed:", err);
      });
  }

// Start listening for notifications in the foreground
listenForForegroundMessages();

createApp(App).use(router).mount('#app')

