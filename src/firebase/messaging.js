
import firebaseApp from "./firebase-init";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const messaging = getMessaging(firebaseApp);

export async function requestNotificationPermission() {
  const permission = await Notification.requestPermission();
  console.log("2222",permission)
const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");
  if (permission === "granted") {
    // console.log("Notification permission granted.");
    const token = await getToken(messaging, { vapidKey: "BOux5b-A33GBaCHi_GPbllmZCcxVIsuJ6_b0sE0XPZgfeuuFl5yZCK4QbvDlxTcx0zColvozc1o-XgMsH9vlSto", serviceWorkerRegistration: registration,   });
    // console.log("FCM Token:", token);
    return token;
  } else {
    console.error("Notification permission denied.");
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
