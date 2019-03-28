import firebase from 'firebase/app'
import 'firebase/auth'
import { Vue } from 'vue-property-decorator'
import store from '@/store'
import router from '@/router'

export default class LoginStatus extends Vue {
    uid: string = ''
    async setUid() {
        await firebase.firestore().enablePersistence()
        firebase.auth().onAuthStateChanged( (user) => {
            if (user) {
                // User is signed in.
                store.commit('setUid', user.uid)
                this.uid = store.getters.uid
            } else {
                // No user is signed in.
                store.commit('setUid', null)
                router.push({ name: 'email_auth_page' });
            }
        })
    }
}
