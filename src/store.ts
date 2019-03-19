import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
/**
 * storeでアプリ全体の状態管理を行う。
 * 定義されたデータはアプリが消えるまで保持する（シングルトンのようなもの）
 */
export default new Vuex.Store({
  /**
   * stateで管理するデータを定義
   */
  state: {
    title: 'VueStoreTopPage',
    isLoading: false,
    successMessages: [] as string[],
    errorMessages: [] as string[],
  },
  /**
   * getters内でstateのデータを取得できるようにする。
   */
  getters: {
    title: (state) => state.title,
    isLoading: (state) => state.isLoading,
    successMessages: (state) => state.successMessages,
    errorMessages: (state) => state.errorMessages,
  },
  /**
   * mutationsで実行処理を行う。データの変更を行う。
   */
  mutations: {
    setTitle(state, title) {
      document.title = title
      state.title = title
    },
    startLoading(state) {
      state.isLoading = true
    },
    stopLoading(state) {
      state.isLoading = false
    },
    success(state, message) {
      if (!Array.isArray(message)) {
        state.successMessages = [message]
        return
      }
      state.successMessages = message
    },
    error(state, message) {
      if (!Array.isArray(message)) {
        state.errorMessages = [message]
        return
      }
      state.errorMessages = message
    },
  },
  /**
   * actionsでmutationsをラップして実行。
   */
  actions: {
    doTitle({ commit }, value: string) {
      commit('setTitle', value)
    },
    doLoading({ commit }, value: boolean) {
      if (value === true) {
        commit('startLoading')
      } else {
        commit('stopLoading')
      }
    },
    doSuccessMessages({ commit }, value: string) {
      commit('success', value)
    },
    doErrorMessages({ commit }, value: string) {
      commit('error', value)
    },
  },
})
