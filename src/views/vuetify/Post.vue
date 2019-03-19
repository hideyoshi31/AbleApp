<template>
  <div class="container">
    <v-flex class="container__body">
       <v-card height="600px" flat>
        <template>
          <div class="headline text-xs-center navi-container">
            {{ title }}
            <v-flex style="margin: 16px;">
              <!--  bottomNavigationTab1のフォームを表示 -->
              <select v-model="postData.category">
                <option selected disabled>▼選択してください</option>
                <option>施術について</option>
                <option>集客について</option>
                <option>従業員について</option>
                <option>その他</option>
              </select>
              <textarea
               v-model="postData.message"
                label="メッセージ"
                outline
                placeholder="メッセージを送信してください">
              </textarea><br>
              <v-btn
                color="blue"
                class="white--text"
                @click="sendItem">
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
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import firebase from '@/firebase/firestore'
import vSelect from 'vue-select'
Vue.component('v-select', vSelect)

@Component
export default class Post extends Vue {
  title: string = 'Able Post Sample'
  isSnackbar: boolean = false
  timeout: number = 5000
  snackbarText: string =  ''

  postData: any = {
    message: '',
    category: '▼選択してください',
  }

  async sendItem() {
    const now = new Date()
    const colref = firebase.firestore().collection('postData');
    // 保存用JSONデータを作成
    const saveData: any = {
      category: this.postData.category,
      message: this.postData.message,
      createdAt: now,
    };

    // addの引数に保存したいデータを渡す
    try {
      const result = await colref.add(saveData)
      this.snackbarText = 'メッセージを送信しました'
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
select
  width: 100%;
  margin-top: 10px;
  border: 1px solid rgba(60,60,60,0.26) !important;
  border-radius: 5px;
  padding: 5px !important;
textarea
  width: 100%;
  height: 200px;
  margin-top: 10px;
  border: 1px solid rgba(60,60,60,.26) !important;
  border-radius: 5px;
  padding: 5px !important;
</style>