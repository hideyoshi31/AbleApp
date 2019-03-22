<template>
  <div class="container">
    <v-flex class="container__body">
       <v-card height="600px" flat>
        <template>
          <div class="headline text-xs-center navi-container">
            {{ title }}
            <v-flex style="margin: 16px;" v-if="selectedTab===0">
              <!--  bottomNavigationTab1のフォームを表示 -->
              <v-text-field
                v-model="user.name"
                label="お名前"
                readonly/>
              <v-text-field
                v-model="user.email"
                label="メールアドレス"/>
              <v-text-field
                v-model="user.company"
                label="屋号・社名"/>
              <v-text-field
                v-model="user.url"
                label="ホームページURL"
                type="URL"/>
              <v-text-field
                v-model="user.tel"
                label="TEL"/>
              <v-text-field
                v-model="user.address"
                label="所在地"/>
              <v-btn
                color="blue"
                class="white--text"
                @click="getUserData('b3vEZurlL7OwThJzUzfd1cDwPk42')">
                編集
              </v-btn>
            </v-flex>
          </div>
        </template>
        <!-- https://vuetifyjs.com/en/components/snackbars -->
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
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import firebase from 'firebase/app'

@Component
export default class Profile extends Vue {
  title: string = 'Profile'
  isReadOnly = true

  /**
   * bottom-navigation
   */
  bottomNav: number = 2
  selectedTab: number = 0
  user: any = {
    name: '',
    email: '',
    company: '',
    url: '',
    tel: '',
    address: '',
  }
  /**
   * snakbar
   */
  isSnackbar: boolean = false
  snackbarText: string = ''
  timeout: number = 5000

  onClickEdit() {
    this.isReadOnly = false
  }

  async getUserData(uid: string) {
    const db = firebase.firestore();
    const docRef = db.collection('users').doc(uid);
    const datas = await docRef.get()
    this.user.name = (datas.data() as any).name
    // try {
    //   console.log(datas.data.name)
    // } catch {
    //   console.error();
    // }
    // .then(function(doc) {
    //     if (doc.exists) {
    //         console.log("Document data:", doc.data());
    //     } else {
    //         // doc.data() will be undefined in this case
    //         console.log("No such document!");
    //     }
    // }).catch(function(error) {
    //     console.log("Error getting document:", error);
    // });
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