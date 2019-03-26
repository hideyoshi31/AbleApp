import firebase from 'firebase/app'

export class ApiClient {
    async getUserData(uid: string) {
        try {
            const db = firebase.firestore()
            const docRef = db.collection('users').doc(uid)
            const doc = await docRef.get()
            return doc.exists ? doc.data() : {}
        } catch (error) {
            console.log('Error getting document:', error)
        }
    }
}
