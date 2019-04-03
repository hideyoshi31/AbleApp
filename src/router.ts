import Vue from 'vue'
import Router from 'vue-router'
import TopPage from './views/TopPage.vue'
import EmailAuthPage from '@/views/EmailAuthPage.vue'
import SignInFinishPage from '@/views/SignInFinishPage.vue'
import Home from '@/views/Home.vue'
import Post from '@/views/Post.vue'
import Account from '@/views/Account.vue'
import PostHistory from '@/views/PostHistory.vue'
import NotFoundPage from '@/views/vuerouter/NotFoundPage.vue'
import AdminTop from '@/admin/AdminTop.vue'
import AdminHome from '@/admin/AdminHome.vue'
import AdminUsers from '@/admin/AdminUsers.vue'
import UserDetail from '@/admin/UserDetail.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    /**
     * Topページ
     */
    {
      path: '/',
      component: TopPage,
      children: [
        {
          path: '/',
          name: 'home',
          component: Home,
        },
        {
          path: '/post',
          name: 'post',
          component: Post,
        },
        {
          path: '/account',
          name: 'account',
          component: Account,
        },
        {
          path: '/postHistory',
          name: 'postHistory',
          component: PostHistory,
        },
        // {
        //   path: '/vue_store_top_page',
        //   name: 'vue_store_top_page',
        //   component: VueStoreTopPage,
        // },
      ],
    },
    /**
     * SignInページ
     */
    {
      path: '/email_auth_page',
      name: 'email_auth_page',
      component: EmailAuthPage,
    },
    /**
     * Adminページ
     */
    {
      path: '/admin',
      component: AdminTop,
      children: [
        {
          path: '/',
          name: 'adminHome',
          component: AdminHome,
        },
        {
          path: '/admin/users',
          name: 'adminUsers',
          component: AdminUsers,
        },
        {
          path: '/admin/users/:uid',
          name: 'UserDetail',
          component: UserDetail,
        },
      ],
    },
    /**
     * SignInFinishページ
     */
    {
      path: '/sign_in_finish_page',
      name: 'sign_in_finish_page',
      component: SignInFinishPage,
    },
    {
      path: 'not_found_page',
      name: 'not_found_page',
      component: NotFoundPage,
    },
    /**
     * 該当しないパスは全てnot_found_pageにリダイレクトする。
     */
    {
      path: '*',
      redirect: { name: 'not_found_page' },
    },
  ],
})
