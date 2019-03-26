<template>
  <div class="container">
    <v-flex class="container__body">
       <v-card height="600px" flat>
        <template>
          <div class="headline text-xs-center navi-container">
            {{ title }}
            <v-flex style="margin: 16px;">
              <!--  bottomNavigationTab1のフォームを表示 -->
              <v-text-field
                v-model="user.name"
                label="お名前"
                v-bind:readonly="readOnlyStatus"/>
              <v-text-field
                v-model="user.email"
                label="メールアドレス"
                v-bind:readonly="readOnlyStatus"/>
              <v-text-field
                v-model="user.company"
                label="屋号・社名"
                v-bind:readonly="readOnlyStatus"/>
              <v-text-field
                v-model="user.url"
                label="ホームページURL"
                type="URL"
                v-bind:readonly="readOnlyStatus"/>
              <v-text-field
                v-model="user.tel"
                label="TEL"
                v-bind:readonly="readOnlyStatus"/>
              <v-text-field
                v-model="user.address"
                label="所在地"
                v-bind:readonly="readOnlyStatus"/>
              <v-btn
                color="green"
                class="white--text"
                v-show="editModeStatus"
                @click="startEditMode">
                編集
              </v-btn>
              <v-btn
                color="blue"
                class="white--text"
                v-show="saveModeStatus"
                @click="onClick">
                保存
              </v-btn>
            </v-flex>
          </div>
          <v-btn
            color="black"
            class="white--text"
            @click="onClickSignOut">
            サインアウト
          </v-btn>
        </template>
        <v-snackbar
          v-model="isSnackbar"
          color="blue"
          multi-line
          :timeout="timeout">
          <div v-html="snackbarText"/>
          <v-btn dark flat
            @click="isSnackbar = false">
            閉じる
          </v-btn>
        </v-snackbar>
      </v-card>
    </v-flex>
    <v-dialog
      v-model="isDialog"
      width="500">
      <v-card>
        <v-card-title>
          保存確認
        </v-card-title>
        <v-card-text>
          アカウントを保存してもよいですか？
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            flat
            @click="onDialogAction(0)">
            はい
          </v-btn>
          <v-btn
            color="primary"
            flat
            @click="onDialogAction(1)">
            いいえ
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="isSignOutDialog"
      width="500">
      <v-card>
        <v-card-title>
          サインアウト確認
        </v-card-title>
        <v-card-text>
          サインアウトしてもよいですか？
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            flat
            @click="onSignOutDialogAction(0)">
            はい
          </v-btn>
          <v-btn
            color="primary"
            flat
            @click="onSignOutDialogAction(1)">
            いいえ
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import firebase from 'firebase/app'
import 'firebase/auth'
import { UserModel } from '../UserModel'

@Component
export default class Account extends Vue {
  title: string = 'Account'
  isSnackbar: boolean = false
  isDialog: boolean = false
  isSignOutDialog: boolean = false
  timeout: number = 5000
  snackbarText: string =  ''
  uid: string = this.$store.getters.uid

  user: any = {
    name: '',
    email: '',
    company: '',
    url: '',
    tel: '',
    address: '',
  }

  readOnlyStatus: boolean = true
  editModeStatus: boolean = true
  saveModeStatus: boolean = false

  startEditMode() {
    this.readOnlyStatus = false
    this.editModeStatus = false
    this.saveModeStatus = true
  }

  async saveUserData() {
    try {
      console.log(this.uid)
      const db = firebase.firestore();
      const docRef = db.collection('users').doc(this.uid).set({
        name: this.user.name,
        email: this.user.email,
        company: this.user.company,
        url: this.user.url,
        tel: this.user.tel,
        address: this.user.address,
      });
      this.readOnlyStatus = true
      this.editModeStatus = true
      this.saveModeStatus = false
    } catch (error) {
      console.error('firebase error: ', error.message)
    }
  }

  async getUserData(uid: string) {
    try {
      const userModel = new UserModel()
      const data = await userModel.get(uid)
      if (data !== undefined) {
        this.user.name = data.name
        this.user.email = data.email
        this.user.company = data.company
        this.user.url = data.url
        this.user.tel = data.tel
        this.user.address = data.address
      }
    } catch (error) {
      console.error('firebase error: ', error.message);
    }
  }

  onClick() {
    this.isDialog = true
  }

  onClickSignOut() {
    this.isSignOutDialog = true
  }

  onDialogAction(selectedId: number) {
    this.isDialog = false
    if (selectedId === 0) {
      this.saveUserData()
    }
  }

  onSignOutDialogAction(selectedId: number) {
    this.isSignOutDialog = false
    if (selectedId === 0) {
      this.signOut()
    }
  }

  mounted() {
    this.getUserData(this.uid)
  }

  signOut() {
    firebase.auth().signOut().then(() => {
      // Sign-out successful.
      console.log('signOut')
      this.$router.push({ name: 'email_auth_page' })
    }).catch((error) => {
      // An error happened.
      console.error('signOut error: ', error.message)
    })
  }
}
</script>
<style lang="stylus">
.container
  text-align left 
  margin 0 auto
  width 100%
  &__body
    margin-top 24px

.navi-container
  margin-top 60px

</style>