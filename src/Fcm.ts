import firebase from 'firebase/app'
import { Vue } from 'vue-property-decorator'

export default class Fcm extends Vue{
    // Firebase のSDKを利用し、SenderIDを設定して初期化
    messaging = firebase.messaging()
    config = {
        messagingSenderId: '280433767930'
    }

    mounted () {
        firebase.initializeApp(this.config)
        this.messaging.usePublicVapidKey('BDDHtA_KUmxRo4oJCORIxau_rebMB71CnYlyrChFKSb80Z7Kw3WVqFS2FyOdOBjJmIp8glppTKWyQrcvufli6Ko')
        // Service Worker ファイルを登録し、ボタン表示を行う
        this.registSW();
    }
  
    // トークンが未取得の場合 = プッシュ通知を未購読の場合、プッシュ通知の登録許可を行う
    // すでに購読済みの場合、取得済みのFirebase用トークンを表示
    async getSubscription() {
        try {
            const token = await this.messaging.getToken()
            if (!token) {
                this.getNotification();
            } else {
                this.displayToken();
            }
        } catch (err) {
        console.log('An error occurred while retrieving token. ', err);
        }
    }
  
    //  Firebase のSDKを使い、プッシュ通知の購読処理を行う
    async getNotification() {
        try {
            await this.messaging.requestPermission()
            console.log('Notification permission granted.');
            this.displayToken();
        } catch (err) {
            console.log('Unable to get permission to notify.', err);
        }
    }
  
    //　トークン表示
    async displayToken() {
        try {
            const token = await this.messaging.getToken()
            if (token) {
                console.log(token);
            } else {
                console.log('No Instance ID token available. Request permission to generate one.');
            }
        } catch (err) {
          console.log('An error occurred while retrieving token. ', err);
        }
    }

    //　Service Worker ファイルを登録
    registSW() {
        // Service Worker ファイル「firebaes-messaging-sw.js」を登録する
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', function () {
                navigator.serviceWorker.register('/firebase-messaging-sw.js').then(function (registration) {
                    console.log('firebase-messaging-sw.js registration successful with scope: ', registration.scope);
                }, function (err) {
                    console.log('firebase-messaging-sw.js registration failed: ', err);
                });
            });
        }
    }
}