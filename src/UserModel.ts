import firebase from 'firebase/app'
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

    async set(uid: string, name: string, email: string, company: string, url: string, tel: string, address: string) {
        try {
            const api = new ApiClient()
            const data = await api.setUserData(uid, name, email, company, url, tel, address)
            return data
        } catch (error) {
            console.log('firebase error: ', error.message)
        }
    }
}
