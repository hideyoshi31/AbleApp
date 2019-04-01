import firebase from 'firebase'

const config = {
    apiKey: 'AIzaSyB_VccGIxfHehOZv1tJq4dk8RxkfabLuuc',
    authDomain: 'ableapp-ed7f6.firebaseapp.com',
    databaseURL: 'https://ableapp-ed7f6.firebaseio.com',
    projectId: 'ableapp-ed7f6',
    storageBucket: 'ableapp-ed7f6.appspot.com',
    messagingSenderId: '280433767930',
};
firebase.initializeApp(config);
// プッシュ通知使えない
// const messaging = firebase.messaging();
// messaging.usePublicVapidKey("BDDHtA_KUmxRo4oJCORIxau_rebMB71CnYlyrChFKSb80Z7Kw3WVqFS2FyOdOBjJmIp8glppTKWyQrcvufli6Ko"); // 1で取得した鍵ペア

export default firebase
