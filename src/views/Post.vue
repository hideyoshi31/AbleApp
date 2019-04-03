<template>
  <div class="container">
    <v-flex class="container__body">
       <v-card height="600px" flat>
        <template>
          <div class="headline text-xs-center navi-container paddingTop15px">
            {{ title }}
            <v-flex style="margin: 16px;">
              <!--  bottomNavigationTab1のフォームを表示 -->
              <v-combobox
                style="margin-top: 10px;"
                v-model="postData.select"
                :items="postData.items"
                label = "カテゴリを選択してください"
                ></v-combobox>
              <v-textarea
               v-model="postData.message"
                label="メッセージ"
                >
              </v-textarea><br>
              <p v-show="showFinishTextStatus">本日の終了時刻は{{ finisheTime.hour }}時{{ finisheTime.min }}分{{ finisheTime.sec }}秒です。</p>
              <v-btn
                color="blue"
                class="white--text"
                v-bind:disabled="!canPost"
                @click="onClick">
                送信
              </v-btn>
            </v-flex>
          </div>
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
          投稿確認
        </v-card-title>
        <v-card-text>
          投稿してもよいですか？
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
      v-model="todayPermissionCheck"
      width="500">
      <v-card>
        <v-card-title>
          就業確認
        </v-card-title>
        <v-card-text>
          本日の就業を開始しますか？
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            flat
            @click="workCheck(0)">
            はい
          </v-btn>
          <v-btn
            color="primary"
            flat
            @click="workCheck(1)">
            いいえ
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="isTodayWorkFinished"
      :persistent="true"
      width="500">
      <v-card>
        <v-card-title>
          勤務終了
        </v-card-title>
        <v-card-text>
          本日の勤務は終了しました。修正は履歴からお願いします。
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            flat
            @click="toHistory()">
            投稿履歴へ
          </v-btn>
          <v-btn
            color="primary"
            flat
            @click="toTop()">
            TOPページへ
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import firebase from '@/firebase/firestore'
import vSelect from 'vue-select'
import App from '@/App.vue'
import LocalForage from '@/LocalForage';
import { ApiClient } from '@/ApiClient'

Vue.component('v-select', vSelect)

@Component
export default class Post extends Vue {
  title: string = 'Able Post Sample'
  isSnackbar: boolean = false
  isDialog: boolean = false
  canPost: boolean | undefined = true
  timeToPost: number = 1
  todayPermissionCheck: boolean = false
  isTodayWorkFinished: boolean = false
  timeout: number = 5000
  snackbarText: string =  ''
  localForage = new LocalForage()
  apiClient = new ApiClient()
  uid: string = ''
  showFinishTextStatus: boolean = false

  postData: any = {
    message: '',
    select: '選択してください',
    items: [
        '施術について',
        '集客について',
        '人材育成について',
        'その他',
      ],
  }

  finisheTime: any = {
    hour: 0,
    min: 0,
    sec: 0,
  }

  onClick() {
    this.isDialog = true
  }

  onDialogAction(selectedId: number) {
    this.isDialog = false
    if (selectedId === 0) {
      this.sendItem()
    }
  }

  toHistory() {
    this.$router.push({name: 'postHistory'})
  }

  toTop() {
    this.$router.push({name: 'home'})
  }

  async workCheck(selectedId: number) {
    this.todayPermissionCheck = false
    if (selectedId === 0) {
      const result = await this.apiClient.workStart(this.uid)
      const todayPostFinisheTimeToData = await this.getTodayPostFinisheTimeToData()
      this.finisheTime.hour = todayPostFinisheTimeToData[0]
      this.finisheTime.min = todayPostFinisheTimeToData[1]
      this.finisheTime.sec = todayPostFinisheTimeToData[2]
      this.showFinishTextStatus = true
      this.canPost = await this.canPostCheck()
      console.log(result)
    } else if (selectedId === 1) {
      this.$router.push({ name: 'home' });
    }
  }

  async mounted() {
    const uid = await this.localForage.readUid()
    if (uid) { this.uid = uid }
    const getTodayPost = await this.apiClient.getTodayPost(this.uid)
    const isPosted = getTodayPost !== undefined ? getTodayPost.isPosted : false
    if (isPosted) {
      this.isTodayWorkFinished = true
    } else {
      const todayPostStartedTime = await this.getTodayPostStartedTime()
      if (todayPostStartedTime === 0) {
        this.todayPermissionCheck = true
      }
      this.canPost = await this.canPostCheck()
      if ( this.canPost ) {
        this.showFinishTextStatus = false
      } else {
        const todayPostFinisheTimeToData = await this.getTodayPostFinisheTimeToData()
        this.finisheTime.hour = todayPostFinisheTimeToData[0]
        this.finisheTime.min = todayPostFinisheTimeToData[1]
        this.finisheTime.sec = todayPostFinisheTimeToData[2]
        this.showFinishTextStatus = true
      }
    }
  }

  async canPostCheck() {
    try {
      const date = new Date()
      const nowTimeStamp = Math.floor(date.getTime() / 1000)
      const canPostTimeStamp = await this.getTodayPostFinisheTime()
      const canPost = canPostTimeStamp < nowTimeStamp
      console.log('投稿できる？', canPost)
      return canPost
    } catch ( error ) {
      console.log('canPostCheck', error)
    }
  }

  async getTodayPostStartedTime() {
      const getTodayPost = await this.apiClient.getTodayPost(this.uid)
      console.log(getTodayPost)
      const todayPostStartedTime = getTodayPost !== undefined ? getTodayPost.startedAt.seconds : 0
      return todayPostStartedTime
  }

  async getTodayPostFinisheTime() {
    const todayPostStartedTime = await this.getTodayPostStartedTime()
    const canPostTimeStamp: number = todayPostStartedTime + 60 * this.timeToPost
    return canPostTimeStamp
  }

  async getTodayPostFinisheTimeToData() {
    const todayPostFinisheTime = await this.getTodayPostFinisheTime()
    console.log(todayPostFinisheTime)
    const d = new Date( todayPostFinisheTime * 1000 );
    const hour = d.getHours()
    const min  = d.getMinutes()
    const sec   = d.getSeconds()
    return ([hour, min, sec])
  }

  async sendItem() {
    const now = new Date()
    // 保存用JSONデータを作成
    const saveData: any = {
      category: this.postData.select,
      message: this.postData.message,
      finishedAt: now,
      isPosted: true,
    };

    // addの引数に保存したいデータを渡す
    try {
      const result = await this.apiClient.sendPostData(this.uid, saveData)
      this.snackbarText = 'メッセージを送信しました'
      this.$router.push({name: 'postHistory'})
    } catch (error) {
      this.snackbarText = 'メッセージを送信できませんでした' + error.message
    }
    this.isSnackbar = true
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

.paddingTop5px
  padding-top 15px
</style>