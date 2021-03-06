<template>
    <div class="top">
        <v-flex xs12 sm6 offset-sm3>
            <h2>メール認証</h2>
            <!--ログインフォーム-->
            <v-card class="container">
                <v-flex style="margin: 20px 0px;">
                    <h3>ログイン</h3>
                    <v-text-field
                        v-model="loginEmail"
                        type="text"
                        required
                        label="メールアドレス"
                        placeholder=""/>
                    <v-text-field
                        v-model="loginPassword"
                        label="パスワード(６文字以上)"
                        min="6"
                        maxlength="32"
                        :append-icon ="isLoginShowPassword ? 'visibility' : 'visibility_off'"
                        @click:append="() => (isLoginShowPassword = !isLoginShowPassword)"
                        :type="isLoginShowPassword ? 'text' : 'password'"
                        required
                        plaeholder=""
                        pattern="[a-zA-Z0-9]*"/>
                    <v-flex>
                        <v-btn
                            color="blue"
                            class="white--text"
                            :loading="isLoading"
                            :disabled="isLoading"
                            @click="onLogin">ログイン</v-btn>
                    </v-flex>
                    <v-flex style="margin: 20px 0px;">
                        <h3>ログインメッセージ</h3>
                        <p style="margin: 10px;" v-html="loginResultMessage"/>
                    </v-flex>
                </v-flex>
            </v-card>
            <!--アカウント作成フォーム-->
            <v-card class="container">
                <v-flex style="margin: 30px 0px;">
                    <h3>アカウント作成</h3>
                    <v-text-field
                        v-model="signUpEmail"
                        label="メールアドレス"
                        type="text"
                        required
                        placeholder=""/>
                    <v-text-field
                        v-model="signUpPassword"
                        label="パスワード(６文字以上)"
                        min="6"
                        counter="6"
                        maxlength="32"
                        :append-icon ="isSignUpShowPassword ? 'visibility' : 'visibility_off'"
                        @click:append="() => (isSignUpShowPassword = !isSignUpShowPassword)"
                        :type="isSignUpShowPassword ? 'text' : 'password'"
                        required
                        pattern="[a-zA-Z0-9]*"/>
                    <v-text-field
                        v-model="signUpConfirmPassword"
                        label="確認用パスワード(６文字以上)"
                        min="6"
                        counter="6"
                        maxlength="32"
                        :append-icon ="isSignUpShowPassword ? 'visibility' : 'visibility_off'"
                        :type="isSignUpShowPassword ? 'text' : 'password'"
                        required
                        pattern="[a-zA-Z0-9]*"/>
                    <v-flex>
                        <v-btn
                            color="blue"
                            class="white--text"
                            :loading="isLoading"
                            :disabled="isLoading"
                            @click="onSignUp">サインアップ</v-btn>
                    </v-flex>
                    <v-flex style="margin: 20px 0px;">
                        <h3>サインアップメッセージ</h3>
                        <p style="margin: 10px;" v-html="signUpResultMessage"/>
                    </v-flex>
                </v-flex>
            </v-card>
        </v-flex>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import firebase from 'firebase/app'
import 'firebase/auth'

@Component({
    name: 'EmailAuthPage',
})
export default class EmailAuthPage extends Vue {
    /**
     * ローディングフラグ
     */
     isLoading: boolean = false
     isLoadingStatus: boolean | null = null

     /**
      * [ログイン用]
      * メールとパスワードとログイン結果
      */
    loginEmail: string = ''
    loginPassword: string = ''
    loginResultMessage: string = ''
    isLoginShowPassword: boolean = false

    /**
     * [アカウント作成用]
     * メールとパスワードとログイン結果
     */
    signUpEmail: string = ''
    signUpPassword: string = ''
    signUpConfirmPassword: string = ''
    signUpResultMessage: string = ''
    isSignUpShowPassword: boolean = false

    mounted() {
        this.getItems()
    }

    getItems() {
        console.log('getItems')
        /**
         * 認証状態を監視する
         * 認証状態が変わると処理される
         */
        firebase.auth().onAuthStateChanged((user) => {
            if (user !== null) {
                this.isLoadingStatus = true
                console.log('user', user.uid)
            } else {
                this.isLoadingStatus = false
            }
        })
    }

    /**
     * ログイン
     */
    async onLogin() {
        this.isLoading = true
        await this.login()
        this.isLoading = false
    }

    /**
     * アカウント作成
     */
    async onSignUp() {
        this.isLoading = true
        await this.signUp()
        this.isLoading = false
    }

    /**
     * ログアウト
     */
    async onLogout() {
        this.isLoading = true
        await this.signOut()
        this.isLoading = false
    }

    /**
     * メール認証でログインする
     */
    async login() {
        try {
            this.loginResultMessage = ''
            await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
            const result = await firebase.auth().signInWithEmailAndPassword(this.loginEmail, this.loginPassword)
            console.log(result)
            const user = firebase.auth().currentUser
            if (user !== null) {
                console.log('user', user.uid)
            }
            this.$router.push({ name: 'home' })
        } catch (error) {
            console.error('firebase error', error)
            this.loginResultMessage = error.message
        }
    }

    /**
     * メール認証でアカウントを作成する
     */
    async signUp() {
        try {
            /**
             * フォームバリデーション
             */
            this.signUpResultMessage = ''
            const messages = this.validationSignUp()
            if (messages.length !== 0) {
                messages.forEach((item) => {
                    this.signUpResultMessage += item + '<br>'
                })
                return
            }

            /**
             * アカウント作成
             */
            const result = await firebase.auth().createUserWithEmailAndPassword(this.signUpEmail, this.signUpPassword)
            console.log(result)
            const user = firebase.auth().currentUser
            if (user !== null) {
                console.log('user', user.uid)
                /** 本人確認メールを送信 */
                await user.sendEmailVerification()
                this.signUpResultMessage = '本人確認メールを送信しました。本人確認をしてログインしてください。'
                /** Firestoreへユーザーデータを保存 */
                await this.createUser(user.uid)
            }
        } catch (error) {
            console.error('firebase error', error)
            this.signUpResultMessage = error.message
        }
    }

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
        }, { merge: true} )
        await batch.commit()
    } catch (error) {
        console.error('firebase error', error)
    }
    }

    validationSignUp(): string[] {
        const messages: string[] = []
        if (this.signUpPassword !== this.signUpConfirmPassword) {
            messages.push('パスワードは６文字以上です。')
        }
        if (this.signUpPassword !== this.signUpConfirmPassword) {
            messages.push('確認用パスワードと一致していません。')
        }
        return messages
    }

    /**
     * ログアウトする
     */
    async signOut() {
        try {
            const result = await firebase.auth().signOut()
            console.log(result)
            this.isLoadingStatus = false
        } catch (error) {
            console.error('firebase error', error)
        }
    }

}
</script>
<style lang="stylus">

.top
    margin 10px

.container
    text-align left
    margin-top 20px

.subtitle
    padding-left 12px

</style>