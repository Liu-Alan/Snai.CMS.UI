import { createWebHistory, createRouter } from 'vue-router'

import Home from './components/Home.vue'
import Admins from './components/Admins.vue'
import Modules from './components/Modules.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/admins', component: Admins },
  { path: '/modules', component: Modules },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router