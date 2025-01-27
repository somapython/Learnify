
import firebaseApp from "./firebase-init";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const messaging = getMessaging(firebaseApp);

export async function requestNotificationPermission() {
  const permission = await Notification.requestPermission();
  const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");
  console.log("Service Worker registered with scope:", registration.scope);
  if (permission === "granted") {
    // console.log("Notification permission granted.");
    const token = await getToken(messaging, { vapidKey: "BOux5b-A33GBaCHi_GPbllmZCcxVIsuJ6_b0sE0XPZgfeuuFl5yZCK4QbvDlxTcx0zColvozc1o-XgMsH9vlSto", serviceWorkerRegistration: registration, });
    // console.log("FCM Token:", token);
    if (!token) {
      console.error("Failed to generate FCM token.");
      throw new Error("Failed to generate FCM token.");
    }
    return token;
  } else if (permission === "denied") {
    console.error("Notification permission denied.");
    return null;
  } else {
    console.error("Notification permission not granted yet (default).");
    return null;
  }
}

export function listenForForegroundMessages(callback) {
  onMessage(messaging, (payload) => {
    // console.log("Message received in foreground: ", payload);
    // const notificationTitle = payload.notification.title;
    // const notificationOptions = {
    //   body: payload.notification.body,
    //   icon: payload.notification.icon,
    // };
    // new Notification(notificationTitle, notificationOptions);
    if (callback) callback(payload);
  });
}

export default messaging;
