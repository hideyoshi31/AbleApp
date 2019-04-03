import firebase from '@/firebase/firestore'
import 'firebase/app'

export class ApiClient {

    /**
     * ユーザーデータを作成する。
     */
    async createUser(userId: string) {
        try {
            const db: firebase.firestore.Firestore = firebase.firestore()
            const batch: firebase.firestore.WriteBatch = db.batch()
            const ref: firebase.firestore.DocumentReference = db.collection('users').doc(userId)
            batch.set(ref, {
            uid: userId,
            createdAt: new Date(),
            updatedAt: new Date(),
            name: 'ゲスト',
            email: '',
            company: '',
            url: '',
            tel: '',
            address: '',
            }, { merge: true} )
            await batch.commit()
        } catch (error) {
            console.error('firebase error', error)
        }
    }

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
        const updatedAt = new Date()
        await db.collection('users').doc(uid).update({ name, email, company, url, tel, address, updatedAt });
    }

    async sendPostData(uid: string, saveData: any) {
        try {
            const today = new Date()
            const year = today.getFullYear().toString()
            const month = ('0' + (today.getMonth() + 1)).slice(-2)
            const day = ('0' + today.getDate()).slice(-2)
            const db = firebase.firestore()
            const result = await db.collection(`users/${uid}/posts`).doc(year + month + day).update(saveData)
            return result
        } catch (error) {
            return error
        }
    }

    async getPostData(uid: string, postId: string) {
        try {
            const db: firebase.firestore.Firestore = firebase.firestore()
            const docRef = db.collection(`users/${uid}/posts`).doc(postId)
            const doc = await docRef.get()
            return doc.exists ? doc.data() : {}
        } catch (error) {
            console.log('Error getting document:', error)
        }
    }

    async updatePostData(uid: string, postId: string, message: string) {
        try {
            const db = firebase.firestore();
            const result = db.collection(`users/${uid}/posts`).doc(postId).update({message})
            return result
        } catch (error) {
            console.log('Error getting document:', error)
        }
    }

    async workStart(uid: string) {
        try {
            const today = new Date()
            const year = today.getFullYear().toString()
            const month = ('0' + (today.getMonth() + 1)).slice(-2)
            const day = ('0' + today.getDate()).slice(-2)
            const db = firebase.firestore();
            const result = await db.collection(`users/${uid}/posts`).doc(year + month + day).set({
                category: '',
                message: '',
                startedAt: today,
                finishedAt: today,
                isPosted: false,
            })
            return result
        } catch (error) {
            return error
        }
    }

    async getTodayPost(uid: string) {
        try {
            const today = new Date()
            const year = today.getFullYear().toString()
            const month = ('0' + (today.getMonth() + 1)).slice(-2)
            const day = ('0' + today.getDate()).slice(-2)
            const db = firebase.firestore()
            const docRef = db.collection(`users/${uid}/posts`).doc(year + month + day)
            const doc = await docRef.get()
            return doc.exists ? doc.data() : undefined
        } catch (error) {
            console.log('Error getting document:', error)
        }
    }

    async sendMail(destination: string, subject: string, text: string) {
        try {
            const functions = firebase.functions()
            const sendMail = functions.httpsCallable('sendMail')
            const resulut = await sendMail({destination, subject, text })
            return resulut
        } catch (error) {
            return error
        }
    }
}
