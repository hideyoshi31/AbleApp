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
              <v-btn
                color="blue"
                class="white--text"
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
  isDialog: boolean = false
  timeout: number = 5000
  snackbarText: string =  ''

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

  onClick() {
    this.isDialog = true
  }

  onDialogAction(selectedId: number) {
    this.isDialog = false
    if (selectedId === 0) {
      this.sendItem()
    }
  }

  async sendItem() {
    const now = new Date()
    const colref = firebase.firestore().collection('postData');
    // 保存用JSONデータを作成
    const saveData: any = {
      category: this.postData.select,
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

.paddingTop5px
  padding-top 15px
</style>