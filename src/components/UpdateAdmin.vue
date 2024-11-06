<script setup>
    import { reactive,ref,onBeforeMount,onMounted,onUpdated } from 'vue';
    import { message } from 'ant-design-vue';
    import axios from 'axios';

    import { storage } from '@/utils/storage';
    import { apiurl,rescode } from '@/utils/globalconst';

    const props = defineProps({
      adminID: Number
    })

    const formState = reactive({
      id: 0,
      user_name: '',
      password: '******',
      password2: '******',
      role_id: undefined,
      state: 1,
    });

    const emits = defineEmits(['closeAddAdminModal']);
    const roles = ref([]);

    const checkRePassword = (_, value) => {
      if (value == '') {
        return Promise.reject(new Error('请输入确认密码'));
      }else if(value !== formState.password){
        return Promise.reject(new Error('确认密码与密码不一致'));
      }else{
        return Promise.resolve();
      }
    };

    const rules = {
        user_name: [
            {
              required: true,
              message: '请输入用户名',
              trigger: 'change',
            },
            {
              min: 4,
              max: 32,
              message: '用户名长度为4到32位',
              trigger: 'blur',
            },
        ],
        password: [
            {
              min: 6,
              max: 20,
              message: '密码长度为6到20位',
              trigger: 'blur',
            },
        ],
        password2: [
            {
              validator: checkRePassword,
              trigger: 'change',
            },
        ],
        role_id: [
            {
              required: true,
              message: '请选择角色',
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
        let token=String(storage.get('token'));
        if (typeof token == "undefined" || token == null || token == ""){
            message.warning('没有权限或已过期', 2, ()=>{ window.location.href = '/logon/' });
        }else{
            let resdata;
            axios({
                method: 'get',
                url: apiurl+'/api/home/role',
                headers: {'Authorization': 'Bearer ' + token }
            })
            .then(response =>{
                resdata = response.data;
                if(resdata.code == rescode.success){
                    roles.value = resdata.result;
                }else{
                    message.warning(resdata.msg);
                }
            })
            .catch(error=>{
                if(error.response){
                    resdata = error.response.data;
                    if(resdata.code >= rescode.authcheckfail && resdata.code <= rescode.authformatfail){
                        message.warning(resdata.msg, 2, ()=>{ window.location.href = '/logon/' });
                    }else{
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

    const GetAdmin = (id) =>{
        let token=String(storage.get('token'));
        if (typeof token == "undefined" || token == null || token == ""){
            message.warning('没有权限或已过期', 2, ()=>{ window.location.href = '/logon/' });
        }else{
            let resdata;
            axios({
                method: 'get',
                url: apiurl+'/api/admin/get',
                headers: {'Authorization': 'Bearer ' + token },
                params: {
                  id: id
                },
            })
            .then(response =>{
                resdata = response.data;
                if(resdata.code == rescode.success){
                    formState.user_name = resdata.result.user_name;
                    formState.role_id = resdata.result.role_id;
                    formState.state = resdata.result.state;
                }else{
                    message.warning(resdata.msg);
                }
            })
            .catch(error=>{
                if(error.response){
                    resdata = error.response.data;
                    if(resdata.code >= rescode.authcheckfail && resdata.code <= rescode.authformatfail){
                        message.warning(resdata.msg, 2, ()=>{ window.location.href = '/logon/' });
                    }else{
                        message.warning(resdata.msg);
                    }
                }else if (error.request) {
                    message.warning("网络有问题，请稍后重试");
                } else {
                    message.warning("网络有问题，请稍后重试");
                }
            });
        }
    }

    onMounted(()=>{
        formState.id=props.adminID;
        GetAdmin(props.adminID);
    })

    onUpdated(()=>{
        formState.id=props.adminID;
        GetAdmin(props.adminID);
    })

    const onFinish = values => {
      let token=String(storage.get('token'));
      if (typeof token == "undefined" || token == null || token == ""){
        message.warning('没有权限或已过期', 2, ()=>{ window.location.href = '/logon/' });
      }else{
        let resdata;
        axios({
          method: 'post',
          url: apiurl+'/api/admin/update',
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
              emits("closeUpdateAdminModal"); 
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
            message.warning("原密码错误，请稍后再试");
          } else {
            message.warning("原密码错误，请稍后再试");
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
      <a-form-item v-show="false"
        name="id"
      >
        <a-input v-model:value="formState.id" :disabled="true" />
      </a-form-item>

      <a-form-item
        label="用户名"
        name="user_name"
        style="margin-top: 20px;"
      >
        <a-input v-model:value="formState.user_name" placeholder="用户名" />
      </a-form-item>
  
      <a-form-item
        label="密码"
        name="password"
        style="margin-top: 5px;"
      >
        <a-input-password v-model:value="formState.password" placeholder="密码" />
      </a-form-item>
      <a-form-item
        label="确认密码"
        name="password2"
        style="margin-top: 5px;"
      >
        <a-input-password v-model:value="formState.password2" placeholder="确认密码" />
      </a-form-item>
      <a-form-item label="角色" name="role_id">
        <a-select v-model:value="formState.role_id" placeholder="请选择角色">
            <a-select-option v-for="role in roles" :value="role.id">{{ role.title }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="状态" name="state">
        <a-radio-group v-model:value="formState.state">
            <a-radio :value="1">启用</a-radio>
            <a-radio :value="2">禁用</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-row justify="center">
        <a-form-item style="margin-top: 5px;">
            <a-button type="primary" html-type="submit">修 改</a-button>
        </a-form-item>
      </a-row>
    </a-form>
  </div>
</template>