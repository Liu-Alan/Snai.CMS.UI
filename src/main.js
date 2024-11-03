import './assets/main.css'
import './assets/global.css'
import 'ant-design-vue/dist/reset.css';

import { createApp } from 'vue'
import router from './router'

import Antd from 'ant-design-vue';
import App from './App.vue'
import ChangePassword from './components/ChangePassword.vue'

createApp(App).use(router).use(Antd)
  .component('change-password',ChangePassword)
  .mount('#app')
