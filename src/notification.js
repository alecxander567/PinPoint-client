import axios from "axios";
import { getToken } from "firebase/messaging";
import { messaging } from "./firebase";

export const requestNotificationPermission = async (userId) => {
  try {
    const permission = await Notification.requestPermission();
    console.log("Permission:", permission);

    if (permission === "granted") {
      const registration = await navigator.serviceWorker.register(
        "/firebase-messaging-sw.js",
      );

      const token = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
        serviceWorkerRegistration: registration,
      });

      console.log("FCM Token:", token);

      await axios.post("http://localhost:8000/api/users/save-fcm-token/", {
        user_id: userId,
        token: token,
      });

      return token;
    }
  } catch (err) {
    console.error("FCM error:", err);
  }
};
