import firebase from 'firebase'
import axios from 'axios'

export default class SendNotifications {
    messaging = firebase.messaging()
    async push() {
        try {
            // 通知の受信許可
            await this.messaging.requestPermission()
            console.log('Notification permission granted.');

            // トークン取得
            const token = await this.messaging.getToken()
            console.log('token', token)
            const title = 'タイトル'
            const body = '本文'
            const result = await axios.get(`https://asia-northeast1-ableapp-ed7f6.cloudfunctions.net/sendNotifications?token=${token}&title=${title}&body=${body}`)
            console.log(result)
        } catch (err) {
            console.log('Unable to get permission to notify.', err)
        }
    }
}
