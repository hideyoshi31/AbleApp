<template>
  <v-layout row style="margin-top: 60px;">
    <v-flex xs12 sm6 offset-sm3>
      <v-card>
        

        <v-list two-line>
          <template v-for="(item, index) in items">
            <v-list-tile
              :key="item.id"
              avatar
              ripple
              @click="edit(item.id)"
            >
              <v-list-tile-content>
                <v-list-tile-title>{{ get_date(item.createdAt.seconds) }}</v-list-tile-title>
                <v-list-tile-sub-title class="text--primary">{{ item.message }}</v-list-tile-sub-title>
              </v-list-tile-content>

              <v-list-tile-action>
                <v-list-tile-action-text>{{ item.category }}</v-list-tile-action-text>
              </v-list-tile-action>

            </v-list-tile>
            <v-divider
              v-if="index + 1 < items.length"
              :key="index"
            ></v-divider>
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
        </v-list>
      </v-card>
    </v-flex>
    <v-dialog
      v-model="isDialog"
      width="600">
      <v-card>
        <v-card-title>
          投稿編集
        </v-card-title>
          <v-textarea
          v-model="message"
          full-width=""
          height="400"
          >
          </v-textarea>
        <v-card-text>
          投稿を保存してもよいですか？
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
  </v-layout>
</template>


<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import firebase, { storage } from 'firebase/app'
import { format } from 'date-fns'
import { ApiClient } from '@/ApiClient'
import App from '@/App.vue'

@Component({
  name: 'PostHistory',
  filters: {
    dateFormat(date: Date) {
      return format(date, 'YYYY/MM/DD HH:mm:ss');
    },
  },
})
export default class PostHistory extends Vue {
  isDialog = false
  items: any[] = []
  title: string = 'PostHistory'
  uid: string =  ''
  isSnackbar: boolean = false
  snackbarText: string = ''
  timeout: number = 5000
  postId: string = ''
  message: string = ''
  api = new ApiClient()

  async edit(postId: string) {
    this.message = ''
    this.postId = postId
    const data = await this.api.getPostData(this.uid, postId)
    if ( data !== undefined ) {
      this.message = data.message
    }
    this.isDialog = true
  }

  onDialogAction(selectedId: number) {
    this.isDialog = false
    if (selectedId === 0) {
      this.api.updatePostData(this.uid, this.postId, this.message)
      this.snackbarText = '編集を保存しました'
      this.isSnackbar = true
      this.getItems()
    }
  }

  mounted() {
    this.getItems()
    this.sort()
  }

  /**
   * 取得
   */
  async getItems() {
    console.log('getItems')
    await this.readFirestore()
  }

  /**
   * Firestoreからデータを取得
   */
  async readFirestore() {
    try {
      this.items = []
      const db: firebase.firestore.Firestore = firebase.firestore()
      const items: firebase.firestore.QuerySnapshot = await db.collection(`postData/${this.uid}/posts`).get()
      console.log('ittte', items)
      items.docs.forEach((item: firebase.firestore.QueryDocumentSnapshot) => {
        if (item.exists) {
          const data = item.data()
          data.id = item.id
          console.log('data', data)
          this.items.push(data)
        }
      })
      console.log('before sorted', this.items)
    } catch (error) {
      console.error('firebase error', error)
    }
  }

  sort() {
    console.log('aaaaaaaa', this.items.length)
    this.items.sort((a, b) => {
      console.log('a.createdAt.seconds', a.createdAt.seconds)
      if ( a.createdAt.seconds < b.createdAt.seconds ) { return -1 }
      if ( a.createdAt.seconds > b.createdAt.seconds ) { return 1 }
      return 0
    })
    console.log('sorted', this.items)
  }

  get_date(timestamp: number) {
    const D = timestamp ? new Date(timestamp * 1000) : new Date();
    const Y = D.getFullYear()
    const m = ('0' + (D.getMonth() + 1)).slice(-2)
    const d = ('0' + D.getDate()).slice(-2)
    const H = ('0' + D.getHours()).slice(-2)
    const i = ('0' + D.getMinutes()).slice(-2)
    const s = ('0' + D.getSeconds()).slice(-2)

    return `${Y}/${m}/${d} ${H}:${i}:${s}`
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