import firebase from 'firebase/app'

export class ApiClient {
    async getUserData(uid: string, callback: (data: any) => void) {
        const db = firebase.firestore()
        const docRef = await db.collection('users').doc(uid)
        await docRef.get().then((doc) => {
            if (doc.exists) {
                console.log('Document data:', doc.data());
                callback (doc.data())
            } else {
                // doc.data() will be undefined in this case
                console.log('No such document!');
            }
        }).catch((error) => {
            console.log('Error getting document:', error);
        });
    }
}
