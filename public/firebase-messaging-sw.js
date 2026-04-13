importScripts(
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js",
);

firebase.initializeApp({
  apiKey: "AIzaSyBQfr5YWJ3qG7tE40T3bqzbuE7qDFyY-D4",
  authDomain: "item-finder-addf8.firebaseapp.com",
  projectId: "item-finder-addf8",
  storageBucket: "item-finder-addf8.firebasestorage.app",
  messagingSenderId: "378016135258",
  appId: "1:378016135258:web:64617e2f721a76a0f6c063",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
  });
});
