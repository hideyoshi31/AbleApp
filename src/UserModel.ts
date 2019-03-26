import firebase, { initializeApp } from 'firebase/app'
import 'firebase/auth'
import { ApiClient } from './ApiClient'

export class UserModel {
    name: string = ''
    email: string = ''
    company: string = ''
    url: string = ''
    tel: string = ''
    address: string = ''

    async get(uid: string) {
        const userData = firebase.auth().currentUser
        if (userData) {
            const api = new ApiClient()
            const data = await api.getUserData(uid)
            if (data !== undefined) {
                this.name = data.name
                this.email = data.email
                this.company = data.company
                this.url = data.url
                this.tel = data.tel
                this.address = data.address
            }
            return data
        } else {
            console.log('Nothing UserData')
        }
    }
}
