import firebase, { initializeApp } from 'firebase/app'
import 'firebase/auth'
import { ApiClient } from './ApiClient'

export class UserModel {
    uid: string = ''
    name: string = ''
    email: string = ''
    company: string = ''
    url: string = ''
    tel: string = ''
    address: string = ''

    async get(callback: (data: any) => void) {
        const userData = firebase.auth().currentUser
        await console.log(userData)
        if (userData) {
            this.uid = userData.uid
            const api = new ApiClient()
            await api.getUserData(this.uid, (data) => {
                this.name = data.name
                this.email = data.email
                this.company = data.company
                this.url = data.url
                this.tel = data.tel
                this.address = data.address
                callback(data)
            })
        } else {
            console.log('Nothing UserData')
        }
    }
}
