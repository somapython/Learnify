// importScripts("https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js");
// importScripts("https://www.gstatic.com/firebasejs/9.6.10/firebase-messaging.js");

// importScripts('https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js');
// importScripts('https://www.gstatic.com/firebasejs/11.2.0/firebase-messaging.js');
try {
  importScripts("https://www.gstatic.com/firebasejs/9.21.0/firebase-app-compat.js");
  console.log("firebase-app.js loaded successfully.");
  importScripts("https://www.gstatic.com/firebasejs/9.21.0/firebase-messaging-compat.js");
  console.log("firebase-messaging.js loaded successfully.");
  firebase.initializeApp({
    apiKey: "AIzaSyBR8nz544OF_Wb0CdCbn-MSXKLvq_1wt3E",
    authDomain: "edutech-b196d.firebaseapp.com",
    projectId: "edutech-b196d",
    storageBucket: "edutech-b196d.firebasestorage.app",
    messagingSenderId: "1017328857890",
    appId: "1:1017328857890:web:3f5bbcaf8cdfd715a4ab7b"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("Received background message: ", payload);
//   const notificationTitle = payload.notification.title;
//   const notificationOptions = {
//     body: payload.notification.body,
//     icon: payload.notification.icon,
//   };
const notificationTitle = payload.notification.title || "Background Notification";
const notificationOptions = {
  body: payload.notification.body || "Background message body",
  icon: "/favicon.ico", // Replace with your app icon
};

  self.registration.showNotification(notificationTitle, notificationOptions);
});  
} catch (error) {
  console.error("Error loading Firebase scripts:", error);
}

