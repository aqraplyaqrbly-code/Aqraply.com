importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

console.log('Service Worker loaded');

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

console.log('Firebase messaging initialized');

// استلام الإشعار في الخلفية وإنشاء إشعار واحد باللوجو
messaging.onBackgroundMessage((payload) => {
  console.log('Background message received:', payload);
  const notificationTitle = payload.data?.title || 'Aqraply';
  const notificationOptions = {
    body: payload.data?.body || '',
    icon: '/logo.png',
    badge: '/logo.png',
    data: {
      url: payload.data?.url || 'https://aqraply.com'
    }
  };
  console.log('Showing notification with options:', notificationOptions);
  self.registration.showNotification(notificationTitle, notificationOptions);
});

// فتح الموقع عند الضغط على الإشعار
self.addEventListener('notificationclick', (event) => {
  event.notification.close(); // إغلاق الإشعار عند الضغط

  // فتح موقع aqraply.com أو تركيز النافذة إذا كانت مفتوحة
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes('aqraply.com') && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('https://www.aqraply.com/orders'); // الرابط المراد فتحه
      }
    })
  );
});