import axios from "axios";
import { getToken } from "firebase/messaging";
import { messaging } from "./firebase";

export const requestNotificationPermission = async (userId) => {
  try {
    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      const registration = await navigator.serviceWorker.register(
        "/firebase-messaging-sw.js",
      );

      await navigator.serviceWorker.ready;

      const token = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
        serviceWorkerRegistration: registration,
      });

      await axios.post(`${import.meta.env.VITE_API_URL}/save-fcm-token/`, {
        user_id: userId,
        token: token,
      });

      return token;
    }
  } catch (err) {
    console.error("FCM error:", err);
  }
};
