import { createWebHistory, createRouter } from 'vue-router'

import Home from './components/Home.vue'
import Admins from './components/Admins.vue'
import Modules from './components/Modules.vue'
import Roles from './components/Roles.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/admins', component: Admins },
  { path: '/modules', component: Modules },
  { path: '/roles', component: Roles },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router