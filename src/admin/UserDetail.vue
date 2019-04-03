<template>
  <div class="usersTop">
    <v-flex>
        <v-card class="container">
          <v-flex>
            <h3>投稿一覧</h3>
            <div style="margin: 8px;">
                <p style="color: gray;">従業員名：　{{ this.userName }}</p>
            </div>
            <v-btn
                color="blue"
                class="white--text right"
                :to="{ name: 'adminUsers' }"
            >
            一覧に戻る
            </v-btn>
            <v-flex style="margin: 24px;">
              <v-data-table
                :headers="headers"
                :items="items"
                :pagination.sync="pagination"
                no-data-text="">
                <template 
                  slot="items"
                  slot-scope="props">
                  <tr @click="onClick(props.item.uid)">
                    <td>{{ props.item.category }}</td>
                    <td>{{ props.item.message }}</td>
                    <td>{{ get_date(props.item.finishedAt.seconds) }}</td>
                  </tr>
                </template>
              </v-data-table>
            </v-flex>
          </v-flex>
        </v-card>
    </v-flex>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { ApiClient } from '@/ApiClient'
import localforage from 'localforage'
import { format } from 'date-fns'

@Component({
  name: 'UsersPost',
  filters: {
    dateFormat(date: Date) {
      return format(date, 'YYYY/MM/DD HH:mm:ss');
    },
  },
})
export default class UsersPost extends Vue {
  apiClient = new ApiClient()
  userName: string = ''

  /**
   * ローディングフラグ
   */
  isLoading: boolean = false

  /**
   * 登録データ
   */
  name: string = 'ゲスト'
  age: number = 20
  sex: string = '男性'

  /**
   * 登録一覧
   */
  items: any[] = []

  /**
   * select
   */
  pages: number[] = [5, 10, 20, 50, 100]

  /**
   * v-data-table
   */
  headers: any[] = [
    { text: 'カテゴリー', value: 'category' },
    { text: '投稿内容', value: 'message' },
    { text: '投稿日時', value: 'finishedAt' },
  ]

  /**
   * data
   */
  selectItem: any = undefined
  isUpdate: boolean = false
  selectRowsPerPage: number = 5
  publishedLabel: string = '公開する'
  queryPublishedLabel: string = '公開する'

  pagination: any = {
    sortBy: 'createdAt',
    descending: true,
    rowsPerPage: this.selectRowsPerPage,
  }

  @Watch('selectRowsPerPage')
  onChangeSelectRowsPerPage(newVal: number) {
    this.pagination.rowsPerPage = newVal
  }

  created() {
    /**
     * localforageを用いてブラウザ上にデータを保存する。
     * [Chrome]
     * ブラウザを右クリック -> 検証 -> Application -> Storageから確認できる。
     *
     * 保存するデータベース種別を設定
     * LOCALSTORAGE
     * WEBSQL
     * INDEXEDDB
     * -> 今回はデフォルトで設定されるINDEXEDDBを利用する。
     *
     * [注意]
     * ブラウザからキャッシュやその他のストレージを削除してしまうとローカルストレージのデータが全て消去されるので注意してください。
     */
    localforage.setDriver(localforage.INDEXEDDB)
  }

  async mounted() {
    await this.getItems()
    await this.getUserName()
  }

  /**
   * 登録・更新
   */
  async onRegist() {
    this.isLoading = true
    if (this.isUpdate === true) {
      await this.update(this.selectItem.uid)
    } else {
      await this.write()
    }
    this.clear()
    this.isLoading = false
  }

  /**
   * 取得
   */
  async getItems() {
    this.isLoading = true
    await this.read()
    this.isLoading = false
  }


  /**
   * 削除
   */
  async onDelete() {
    this.isLoading = true
    await this.delete(this.selectItem.uid)
    this.clear()
    this.isLoading = false
  }

  /**
   * データリストを要素をクリック処理
   */
  onClick(uid: string) {
    // this.$router.push({ name: 'UserDetail', params: { uid: uid } })
  }

  /**
   * フォームにセット
   */
  setFormData(item: any) {
    this.name = item.name
    this.age = item.age
    this.sex = item.sex
  }

  /**
   * フォームをクリア
   */
  clear() {
    this.name = 'ゲスト'
    this.age = 20
    this.sex = '男性'
    this.selectItem = undefined
    this.isUpdate = false
  }

  /**
   * 登録ラベルを取得
   */
  get getRegistLabel(): string {
    return this.isUpdate === true ? '更新' : '登録'
  }

  /**
   * LocalStorageへデータを書き込む
   * １つのkeyに対してデータを保存する仕様。
   * 配列ごと保存する。
   */
  async write() {
    try {
      const data = {
        uid: this.getDataUid(),
        createdAt: new Date(),
        updatedAt: new Date(),
        name: this.name,
        age: Number(this.age),  // v-text-fieldで入力するとString型になるためNumber型へ変換
        sex: this.sex,
      }
      this.items.push(data)
      console.log('data', this.items)
    } catch (error) {
      console.error('database error', error)
    }
  }

  /**
   * LocalStorageからデータを取得
   */
  async read() {
    try {
      const result = await this.apiClient.getPosts(this.$route.params.uid)
      if (result) {
        this.items = result as any[]
      }
      this.items.sort((a: any, b: any) => {
        if ( a.finishedAt > b.finishedAt ) { return -1 }
        if ( a.finishedAt < b.finishedAt ) { return 1 }
        return 0
      })
    } catch (error) {
      console.error('database error', error)
    }
  }

  async getUserName() {
    const userData = await this.apiClient.getUserData(this.$route.params.uid)
    this.userName = userData !== undefined ? userData.name : ''
  }

  /**
   * LocalStorageのデータを更新
   */
  async update(id: string) {
    try {
      this.items = this.items.map((item: any) => {
        if (item.uid === id) {
          const data: any = item
          data.updatedAt = new Date()
          data.name = this.name
          data.age = Number(this.age)
          data.sex = this.sex
          return data
        }
        return item
      })
    } catch (error) {
      console.error('database error', error)
    }
  }

  /**
   * LocalStorageのデータを削除
   * Keyに紐づくデータを全て削除する関数removeItemだが、
   * 中身の細かいデータを削除する場合は削除対象のデータを除いたものを保存する必要がある。
   */
  async delete(id: string) {
    try {
      this.items = this.items.filter((item: any) => item.uid !== id)
    } catch (error) {
      console.error('database error', error)
    }
  }

  /**
   * データのuidを取得
   */
  getDataUid(): number {
    if (this.items) {
      let maxNumber = 0
      this.items.forEach((item: any) => {
        if (maxNumber < item.uid) { maxNumber = item.uid }
      })
      return maxNumber + 1
    } else {
      return 0
    }
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

  /**
   * uidからデータを取得
   */
  // getDataFromUid(uid: string): any {
  //   if (this.items) {
  //     return this.items.filter((element, index, array) => uid === element.uid)[0]
  //   } else {
  //     return undefined
  //   }
  // }
}
</script>
<style lang="stylus">

.usersTop
  margin-top 70px

.container
  text-align left 
  margin-top 20px

.subtitle
  padding-left 12px

</style>