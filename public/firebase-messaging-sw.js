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
  console.log('🔔 NOTIFICATION CLICKED:', event);
  event.notification.close();

  const targetUrl = event.notification.data?.url || 'https://aqraply.com';
  console.log('🎯 Target URL:', targetUrl);

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      console.log('📱 Window clients found:', windowClients.length);
      
      for (let client of windowClients) {
        console.log('Checking client:', client.url);
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          console.log('✅ Focusing existing client');
          client.navigate(targetUrl);
          return client.focus();
        }
      }
      
      console.log('🚀 Opening new window with URL:', targetUrl);
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    }).catch((error) => {
      console.error('❌ Error in notificationclick handler:', error);
    })
  );
});