<script setup>
    import { reactive  } from 'vue';
    import { message } from 'ant-design-vue';
    import axios from 'axios';

    import { storage } from '@/utils/storage';
    import { apiurl,rescode } from '@/utils/globalconst';

    const formState = reactive({
      old_password: '',
      password: '',
      password2: '',
    });

    const emits = defineEmits(['closePwdModal']);

    const onFinish = values => {
      let token=String(storage.get('token'));
      if (typeof token == "undefined" || token == null || token == ""){
        message.warning('没有权限或已过期', 2, ()=>{ window.location.href = '/logon/' });
      }else{
        let resdata;
        axios({
          method: 'post',
          url: apiurl+'/api/home/changepassword',
          data: values,
          headers: {
            'Content-Type': 'multipart/form-data;',
            'Authorization': 'Bearer ' + token 
          }
        })
        .then(response =>{
          resdata = response.data;
          if(resdata.code == rescode.success){
            message.success('修改成功', 1, ()=>{ emits("closePwdModal") });
          }
          else{
            message.warning(resdata.msg);
          }
        })
        .catch(error=>{
          if(error.response){
            resdata = error.response.data;
              message.warning(resdata.msg);
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

    const checkRePassword = (_, value) => {
      if (value == '') {
        return Promise.reject(new Error('请输入确认密码'));
      }else if(value !== formState.password){
        return Promise.reject(new Error('确认密码与新密码不一致'));
      }else{
        return Promise.resolve();
      }
    };
</script>

<template>
  <div>
    <a-form
      :model="formState"
      name="basic"
      @finish="onFinish"
      @finishFailed="onFinishFailed"
      :label-col="{ span: 5 }"
      :wrapper-col="{ span: 19 }"
    >
      <a-form-item
        label="原密码"
        name="old_password"
        :rules="[{ required: true, message: '请输入原密码!' }]"
        style="margin-top: 20px;"
      >
        <a-input-password v-model:value="formState.old_password" placeholder="原密码" />
      </a-form-item>
  
      <a-form-item
        label="新密码"
        name="password"
        :rules="[{ required: true, message: '请输入新密码!' }]"
        style="margin-top: 5px;"
      >
        <a-input-password v-model:value="formState.password" placeholder="新密码" />
      </a-form-item>
      <a-form-item
        label="确认密码"
        name="password2"
        :rules="[{ required: true, validator: checkRePassword }]"
        style="margin-top: 5px;"
      >
        <a-input-password v-model:value="formState.password2" placeholder="确认密码" />
      </a-form-item>
      <a-row justify="center">
        <a-form-item style="margin-top: 5px;">
            <a-button type="primary" html-type="submit">修 改</a-button>
        </a-form-item>
      </a-row>
    </a-form>
  </div>
</template>