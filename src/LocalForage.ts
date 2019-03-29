import localforage from 'localforage'
import { Vue } from 'vue-property-decorator'

export default class LocalForage extends Vue {
  localforageKey: string = 'local-forage'  // 保存するデータベースのkey

  /** 保存 */
  async writeUid(uid: string) {
    try {
      await localforage.setItem(this.localforageKey, uid)
    } catch (error) {
      console.error('database error', error)
    }
  }

  /** 取得 */
  async readUid() {
    try {
      const result = await localforage.getItem(this.localforageKey)
      const uid = result ? result as string : ''
      return uid
    } catch (error) {
      console.error('database error', error)
    }
  }

   /** 削除 */
  async remove() {
    try {
      const result = await localforage.removeItem(this.localforageKey)
      console.log(result)
    } catch (error) {
      console.error('database error', error)
    }
  }
}
