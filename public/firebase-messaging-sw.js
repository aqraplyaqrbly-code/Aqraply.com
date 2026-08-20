importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyCZAwUUcQZqC2AFr2aMMJY9fFtA20LTj-E",
  authDomain: "aqraply-a8035.firebaseapp.com",
  projectId: "aqraply-a8035",
  storageBucket: "aqraply-a8035.firebasestorage.app",
  messagingSenderId: "866048841660",
  appId: "1:866048841660:web:f4d062ecc3bc6b4416fdb9",
  measurementId: "G-RS4BN5X6BG"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification?.title || "Aqraply أقربلي";
  const notificationOptions = {
    body: payload.notification?.body,
    icon: '/logo.png', // صوّب المسار حسب أيقونة موقعك
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
