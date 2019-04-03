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

    async getUsers() {
        try {
            const db = firebase.firestore()
            const docRef = db.collection('users')
            const document = await docRef.get()
            const datas: any[] = []
            document.forEach( (doc) => {
                const data: any = []
                data.uid = doc.data().uid
                data.address = doc.data().address
                data.company = doc.data().company
                data.createdAt = doc.data().createdAt
                data.email = doc.data().email
                data.name = doc.data().name
                data.tel = doc.data().tel
                data.updatedAt = doc.data().updatedAt
                data.url = doc.data().url
                datas.push(data)
            })
            return datas
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
            const updateAt = new Date()
            const result = db.collection(`users/${uid}/posts`).doc(postId).update({message, updateAt})
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
                updateAt: today,
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

    async getPosts(uid: string) {
        try {
            const datas: any = []
            const db: firebase.firestore.Firestore = firebase.firestore()
            const items: firebase.firestore.QuerySnapshot = await db.collection(`users/${uid}/posts`).get()
            items.docs.forEach((item: firebase.firestore.QueryDocumentSnapshot) => {
                if (item.exists) {
                    const data: any = {}
                    data.category = item.data().category
                    data.finishedAt = item.data().finishedAt.seconds
                    data.message = item.data().message
                    data.id = item.id
                    data.startedAt = item.data().startedAt
                    data.updateAt = item.data().updateAt
                    datas.push(data)
                }
            })
            return datas
        } catch (error) {
            console.error('firebase error', error)
        }
    }
}
