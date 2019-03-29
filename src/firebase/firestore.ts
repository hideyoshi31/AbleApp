import firebase from 'firebase'

const config = {
    apiKey: 'AIzaSyB_VccGIxfHehOZv1tJq4dk8RxkfabLuuc',
    authDomain: 'ableapp-ed7f6.firebaseapp.com',
    databaseURL: 'https://ableapp-ed7f6.firebaseio.com',
    projectId: 'ableapp-ed7f6',
    storageBucket: 'ableapp-ed7f6.appspot.com',
    messagingSenderId: '280433767930',
};
console.log('ddd')
firebase.initializeApp(config);
const messaging = firebase.messaging();
messaging.usePublicVapidKey("BDDHtA_KUmxRo4oJCORIxau_rebMB71CnYlyrChFKSb80Z7Kw3WVqFS2FyOdOBjJmIp8glppTKWyQrcvufli6Ko"); // 1で取得した鍵ペア

// 通知の受信許可
messaging.requestPermission().then(() => {
  console.log('Notification permission granted.');

  // トークン取得
  messaging.getToken().then((token) => {
    console.log(token)
  })
}).catch((err) => {
  console.log('Unable to get permission to notify.', err);
});

export default firebase
