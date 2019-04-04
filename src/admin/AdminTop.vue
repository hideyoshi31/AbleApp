<template>
  <div>
    <v-app>
      <!-- ナビゲーションバー https://vuetifyjs.com/en/components/navigation-drawers#navigation-drawer -->
      <v-navigation-drawer
        fixed
        clipped
        app
        dark
        v-model="isDrawer"
        class="black lighten-3">
        <v-container
          fluid
          style="min-height: 0;"
          grid-list-lg>
          <v-list>
            <v-layout wrap column>
              <v-flex>
                <template
                  v-for='(menu, index) in menuList'>
                  <v-list-tile :key="index" @click="onClickNavigationItem(menu)">
                    <v-list-tile-action>
                      <v-icon>{{ menu.icon }}</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                      <v-list-tile-title><b>{{ menu.label }}</b></v-list-tile-title>
                    </v-list-tile-content>
                  </v-list-tile>
                </template>
              </v-flex>
            </v-layout>
          </v-list>
        </v-container>
      </v-navigation-drawer>
      <!-- ここまで -->
      <!-- ツールバー https://vuetifyjs.com/en/components/toolbars#toolbar -->
      <v-toolbar
        dark
        color="black"
        fixed
        clipped-left
        app>
        <v-toolbar-side-icon @click.stop="isDrawer = !isDrawer"></v-toolbar-side-icon>
        <v-toolbar-title>{{ toolberTitle }}</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
      <!-- ここまで -->
      <!-- メインページ -->
      <v-container class="bgWhite">
        <v-fade-transition mode="out-in">
          <router-view/>
        </v-fade-transition>
      </v-container>
      <!-- ここまで-->
      <!-- フッター https://vuetifyjs.com/en/components/footer#footer -->
      <v-footer
        color='gray'
        app>
        <span class="footer-copy">&copy; {{ footerTitle }}</span>
      </v-footer>
      <!-- ここまで -->
    </v-app>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import firebase from '@/firebase/firestore'
import 'firebase/app'
import 'firebase/auth'
import LocalForage from '@/LocalForage'
import { ApiClient } from '@/ApiClient'

@Component
export default class TopPage extends Vue {
  toolberTitle: string = 'ADMIN'
  footerTitle: string = 'AbleApp'
  isDrawer: boolean = false
  localForage = new LocalForage()
  apiClient = new ApiClient()
  menuList: any[] = [
    {
      to: 'adminHome',
      label: 'HOME',
      icon: 'home',
    },
    {
      to: 'adminUsers',
      label: '従業員一覧',
      icon: 'account_box',
    },
  ]
  mounted() {
    this.fetchAdminAuthState()
  }
  onClickNavigationItem(menu: any) {
    this.$router.push({name: menu.to})
  }

  async fetchAdminAuthState() {
    const users = await this.apiClient.getUsers()
    const adminUids: any[] = []
    console.log(users)
    if (users !== undefined) {
      users.forEach( (user) => {
        if (user.isAdmin) { adminUids.push(user.uid) }
      })
    }
    firebase.auth().onAuthStateChanged( (user) => {
      let isAdmin: boolean = false
      if (user) {
        // User is signed in.
        adminUids.forEach( (adminUid) => {
          if (user.uid === adminUid) {
            isAdmin = true
            console.log('Admin')
          } else {
            console.log('Not Admin')
          }
          if (isAdmin === false) { this.$router.push({ name: 'home' }) }
        })
      } else {
        this.$router.push({ name: 'email_auth_page' })
      }
    })
  }
}
</script>
<style lang="stylus">
.top
  margin 10px

.container
  text-align left

.bgWhite
  background #ffffff

.footer-copy
  display: block;
  width: 100%;
  margin: 0 auto;
</style>