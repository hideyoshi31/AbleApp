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

    async setUserData(uid: string, name: string, email: string, company: string, url: string, tel: string, address: string) {
        const db = firebase.firestore();
        await db.collection('users').doc(uid).update({ name, email, company, url, tel, address });
    }

    async getPostData(uid: string, postId: string) {
        try {
            const db: firebase.firestore.Firestore = firebase.firestore()
            const docRef = db.collection(`postData/${uid}/posts`).doc(postId)
            const doc = await docRef.get()
            return doc.exists ? doc.data() : {}
        } catch (error) {
            console.log('Error getting document:', error)
        }
    }

    async updatePostData(uid: string, postId: string, message: string) {
        try {
            const db = firebase.firestore();
            const result = db.collection(`postData/${uid}/posts`).doc(postId).update({message})
            return result
        } catch (error) {
            console.log('Error getting document:', error)
        }
    }
}
