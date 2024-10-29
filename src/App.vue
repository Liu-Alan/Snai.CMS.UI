<script lang="ts" setup>
  import { ref, onMounted, onBeforeMount } from 'vue';
  import { useRouter } from 'vue-router'

  import { message } from 'ant-design-vue';
  import {
    UserOutlined,
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    DownOutlined,
  } from '@ant-design/icons-vue';
  import axios from 'axios';

  import { storage } from '@/utils/storage';
  import { apiurl,rescode } from '@/utils/globalconst';

  const router = useRouter()

  const openKeys = ref<string[]>(['sub0']);
  const collapsed = ref<boolean>(false);
  const user_name = ref(storage.get('user_name'));
  var menuPas = ref([]);
  var menuSubs = ref([]);
  var menuActs = ref([]);

  const isMobile = () => {
    let flag = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
    return flag;
  }

  onBeforeMount(()=>{
    let token=String(storage.get('token'))
    if (typeof token == "undefined" || token == null || token == ""){
        message.warning('没有权限或已过期', 2, ()=>{ window.location.href = '/' });
    }else{
        let resdata;
        axios({
            method: 'get',
            url: apiurl+'/api/home/menu',
            headers: {'Authorization': 'Bearer ' + token }
          })
          .then(response =>{
            resdata = response.data;
            if(resdata.code == rescode.success){
                resdata.result.forEach(menu => {
                    if(menu.menu == 1 && menu.parent_id==0){
                        menuPas.value.push(menu);
                    }
                    if(menu.menu == 1 && menu.parent_id>0){
                        menuSubs.value.push(menu);
                    }
                    if(menu.menu == 2){
                        menuActs.value.push(menu);
                    }
                });;
            }
            else{
                message.warning(resdata.msg);
            }
          })
          .catch(error=>{
            if(error.response){
                resdata = error.response.data;
                if(resdata.code >= rescode.authcheckfail && resdata.code <= rescode.authformatfail){
                    message.warning(resdata.msg, 2, ()=>{ window.location.href = '/logon/' });
                }
                else{
                    message.warning(resdata.msg);
                }
            }else if (error.request) {
                message.warning("网络有问题，请稍后重试");
            } else {
                message.warning("网络有问题，请稍后重试");
            }
          });
    }
  })

  onMounted(() => {
    if (isMobile()) {
      collapsed.value = true
      } else {
        collapsed.value = false
      }
  })

  const changeMenu = (route) =>{
    router.push(route)
  }

</script>

<template>
  <a-layout class="layout-main">
    <a-layout-sider v-model:collapsed="collapsed" :trigger="null" collapsible>
      <div class="logo">管 理 后 台</div>
      <a-menu v-model:openKeys="openKeys" theme="dark" mode="inline">
        <a-sub-menu v-for="(menuP,indexP) in menuPas" :key="'sub'+indexP">
          <template #title>
            <span>
              <user-outlined v-show="menuP.name=='manage'" />
              <span>{{ menuP.title }}</span>
            </span>
          </template>
          <template v-for="(menuS,indexS) in menuSubs">
            <a-menu-item v-if="menuS.parent_id==menuP.id" :key="indexP+'-'+indexS" @click="changeMenu(menuS.ui_router)">{{ menuS.title }}</a-menu-item>
          </template>
        </a-sub-menu>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header style="background: #fff; padding: 0">
        <a-row>
          <a-col :span="1">
            <menu-unfold-outlined
              v-if="collapsed"
              class="trigger"
              @click="() => (collapsed = !collapsed)"
            />
            <menu-fold-outlined v-else class="trigger" @click="() => (collapsed = !collapsed)" />
          </a-col>
          <a-col :span="9" :offset="14" class="header-right">
            <a-dropdown>
              <a class="ant-dropdown-link" @click.prevent>
                {{ user_name }}
                <DownOutlined />
              </a>
              <template #overlay>
                <a-menu>
                  <a-menu-item>
                    <a href="javascript:;">修改密码</a>
                  </a-menu-item>
                  <a-menu-item>
                    <a href="javascript:;">退出</a>
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </a-col>
        </a-row>
      </a-layout-header>
      <a-layout-content
        :style="{ margin: '24px 16px', padding: '24px', background: '#fff', minHeight: '280px' }"
      >
        <RouterView />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>