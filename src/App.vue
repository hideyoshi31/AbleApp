<template>
  <div id="app">
    <router-view/>
  </div>
</template>
<script lang="ts">
import { Vue } from 'vue-property-decorator'
import LoginStatus from './LoginStatus'
import PostHistory from './views/PostHistory.vue'
export default class App extends Vue {
  loginStatus = new LoginStatus()
  uid: string = ''
  mounted () {
    this.loginStatus.setUid()
    this.uid = this.loginStatus.uid
    console.log(this.uid)
  }
}
</script>
<style lang="stylus">
#app
  font-family 'Avenir', Helvetica, Arial, sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  text-align center
  color #2c3e50

#nav
  padding 30px
  a
    font-weight bold
    color #2c3e50
    &.router-link-exact-active
      color #42b983
</style>
