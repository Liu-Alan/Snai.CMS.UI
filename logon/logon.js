import '../src/assets/logon.css'
import 'ant-design-vue/dist/reset.css';

import { createApp } from 'vue'
import router from '../src/router'

import Antd from 'ant-design-vue';
import App from '../src/page/Logon.vue'

createApp(App).use(router).use(Antd).mount('#app')
