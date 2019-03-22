import Vue from 'vue'
import Router from 'vue-router'
import TopPage from './views/TopPage.vue'
import VueRouterTopPage from '@/views/vuerouter/VueRouterTopPage.vue'
import VueRouterAgendaPage from '@/views/vuerouter/VueRouterAgendaPage.vue'
import VueRouterFirstPage from '@/views/vuerouter/VueRouterFirstPage.vue'
import VueRouterSecondPage from '@/views/vuerouter/VueRouterSecondPage.vue'
import VueStoreTopPage from '@/views/vuestore/VueStoreTopPage.vue'
import VuetifyTopPage from '@/views/vuetify/VuetifyTopPage.vue'
import VuetifyChildPage1 from '@/views/vuetify/VuetifyChildPage1.vue'
import VuetifyChildPage2 from '@/views/vuetify/VuetifyChildPage2.vue'
import VuetifyChildPage3 from '@/views/vuetify/VuetifyChildPage3.vue'
import EmailAuthPage from '@/views/EmailAuthPage.vue'
import SignInFinishPage from '@/views/SignInFinishPage.vue'
import Home from '@/views/Home.vue'
import Post from '@/views/Post.vue'
import Profile from '@/views/Profile.vue'
import LocalForageRosterListPage from '@/views/localforage/LocalForageRosterListPage.vue'
import AxiosLesson from '@/views/axios/AxiosLesson.vue'
import DotenvLesson from '@/views/dotenv/DotenvLesson.vue'
import NotFoundPage from '@/views/vuerouter/NotFoundPage.vue'

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
          path: '/profile',
          name: 'profile',
          component: Profile,
        },
      ],
    },
    /**
     * SignInページ
     */
    {
      path: '/email_auth_page',
      component: EmailAuthPage,
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
      path: '/vuetify_top_page',
      name: 'vuetify_top_page',
      component: VuetifyTopPage,
      children: [
        {
          path: '/',
          name: 'vuetify_child_page_1',
          component: VuetifyChildPage1,
        },
        {
          path: 'vuetify_child_page_2',
          name: 'vuetify_child_page_2',
          component: VuetifyChildPage2,
        },
        {
          path: 'vuetify_child_page_3',
          name: 'vuetify_child_page_3',
          component: VuetifyChildPage3,
        },
      ],
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
