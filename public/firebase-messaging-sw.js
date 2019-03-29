importScripts('https://www.gstatic.com/firebasejs/5.5.6/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/5.5.6/firebase-messaging.js');

firebase.initializeApp({
  'messagingSenderId': '280433767930'
});

const messaging = firebase.messaging();

// messaging.setBackgroundMessageHandler(function (payload) {
//   console.log('[firebase-messaging-sw.js] Received background message ', payload);
//   // Customize notification here
//   let notificationTitle = 'Background Message Title';
//   let notificationOptions = {
//     body: 'Background Message body.',
//   };

//   return self.registration.showNotification(notificationTitle,
//     notificationOptions);
// });