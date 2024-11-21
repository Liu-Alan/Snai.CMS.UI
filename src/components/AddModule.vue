<script setup>
    import { reactive,ref,onBeforeMount } from 'vue';
    import { message } from 'ant-design-vue';
    import axios from 'axios';

    import { storage } from '@/utils/storage';
    import { apiurl,rescode } from '@/utils/globalconst';

    var menuPas = ref([]);
    
    const formState = reactive({
      title: '',
      name: '',
      parent_id: 0,
      router: '',
      ui_router: '',
      sort: 1,
      menu: 2,
      state: 1,
    });

    const emits = defineEmits(['closeAddModuleModal']);

    const initFormData = () =>{
      formState.title = '';
      formState.name = '';
      formState.parent_id = 0;
      formState.router = '';
      formState.ui_router = '';
      formState.sort = 1;
      formState.menu = 2;
      formState.state = 1;
    }

    const rules = {
        title: [
            {
              required: true,
              message: '请输入名称',
              trigger: 'change',
            },
            {
              min: 2,
              max: 32,
              message: '名称长度为2到32位',
              trigger: 'blur',
            },
        ],
        menu: [
            {
              required: true,
              message: '请选择是否菜单',
              trigger: 'change',
            },
        ],
        state: [
            {
              required: true,
              message: '请选择状态',
              trigger: 'change',
            },
        ]
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
                        if(menu.menu == 1){
                            menuPas.value.push(menu);
                        }
                    });
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

    const onFinish = values => {
      let token=String(storage.get('token'));
      if (typeof token == "undefined" || token == null || token == ""){
        message.warning('没有权限或已过期', 2, ()=>{ window.location.href = '/logon/' });
      }else{
        let resdata;
        axios({
          method: 'post',
          url: apiurl+'/api/module/add',
          data: values,
          headers: {
            'Content-Type': 'multipart/form-data;',
            'Authorization': 'Bearer ' + token 
          }
        })
        .then(response =>{
          resdata = response.data;
          if(resdata.code == rescode.success){
            message.success(resdata.msg, 1, ()=>{ 
              initFormData();
              emits("closeAddModuleModal"); 
            });
          }
          else{
            message.warning(resdata.msg);
          }
        })
        .catch(error=>{
          if(error.response){
            resdata = error.response.data;
            if(resdata.code==rescode.validparamserror){
              message.warning(resdata.result);
            }else{
              message.warning(resdata.msg);
            }
          }else if (error.request) {
            message.warning("网络有问题，请稍后再试");
          } else {
            message.warning("网络有问题，请稍后再试");
          }
        });
      }
    };

    const onFinishFailed = errorInfo => {
    };
</script>

<template>
  <div>
    <a-form
      :model="formState"
      name="basic"
      :rules="rules"
      @finish="onFinish"
      @finishFailed="onFinishFailed"
      :label-col="{ span: 5 }"
      :wrapper-col="{ span: 19 }"
    >
      <a-form-item
        label="名称"
        name="title"
        style="margin-top: 20px;"
      >
        <a-input v-model:value="formState.title" placeholder="名称" />
      </a-form-item>
  
      <a-form-item
        label="前端名称"
        name="name"
        style="margin-top: 5px;"
      >
        <a-input v-model:value="formState.name" placeholder="前端名称" />
      </a-form-item>

      <a-form-item label="父模块" name="parent_id">
        <a-select v-model:value="formState.parent_id" placeholder="请选择父模块">
            <a-select-option :value="0">--</a-select-option>
            <a-select-option v-for="menuP in menuPas" :value="menuP.id"><span v-if="menuP.parent_id>0">-- </span>{{ menuP.title }}</a-select-option>
            <a-select-option :value="-1"><span style="color: #999;">不验证权限</span></a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item
        label="api路由"
        name="router"
        style="margin-top: 5px;"
      >
        <a-input v-model:value="formState.router" placeholder="api路由" />
      </a-form-item>

      <a-form-item
        label="前端路由"
        name="ui_router"
        style="margin-top: 5px;"
      >
        <a-input v-model:value="formState.ui_router" placeholder="前端路由" />
      </a-form-item>

      <a-form-item
        label="排序"
        name="sort"
        style="margin-top: 5px;"
      >
        <a-input v-model:value="formState.sort" placeholder="排序" />
      </a-form-item>

      <a-form-item label="菜单" name="menu">
        <a-radio-group v-model:value="formState.menu">
            <a-radio :value="1">是</a-radio>
            <a-radio :value="2">否</a-radio>
        </a-radio-group>
      </a-form-item>

      <a-form-item label="状态" name="state">
        <a-radio-group v-model:value="formState.state">
            <a-radio :value="1">启用</a-radio>
            <a-radio :value="2">禁用</a-radio>
        </a-radio-group>
      </a-form-item>

      <a-row justify="center">
        <a-form-item style="margin-top: 5px;">
            <a-button type="primary" html-type="submit">添 加</a-button>
        </a-form-item>
      </a-row>
    </a-form>
  </div>
</template>