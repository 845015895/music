import Vue from 'vue'
import Router from 'vue-router'
import Music from '../components/music.vue'
import resize from "../tools/resize";


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'music',
      component: Music
    }
  ]
})
