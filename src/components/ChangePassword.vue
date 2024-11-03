<script setup>
    import { reactive  } from 'vue';
    import { message } from 'ant-design-vue';
    import axios from 'axios';

    import { storage } from '@/utils/storage';
    import { apiurl,rescode } from '@/utils/globalconst';

    const formState = reactive({
      user_name: '',
      password: '',
    });
    const onFinish = values => {
      let resdata;
      axios({
          method: 'post',
          url: apiurl+'/api/home/login',
          data: values,
          headers: {"Content-Type": "multipart/form-data;" }
        })
        .then(response =>{
          resdata = response.data;
          if(resdata.code == rescode.success){
            storage.set('token',resdata.result.token)
            storage.set('user_name',resdata.result.user_name)
            message.success('登录成功', 1, ()=>{ window.location.href = '/' });
          }
          else{
            message.warning(resdata.msg);
          }
        })
        .catch(error=>{
          message.warning('账号或密码错误，请稍后再试');
        });
    };

    const onFinishFailed = errorInfo => {
    };
</script>

<template>
  <div>
    <a-form
      :model="formState"
      name="basic"
      autocomplete="off"
      @finish="onFinish"
      @finishFailed="onFinishFailed"
      style="min-width: 290px; max-width: 350px;"
    >
      <a-form-item
        label="原密码"
        name="user_name"
        :rules="[{ required: true, message: '请输入原密码!' }]"
        style="margin-top: 20px;"
      >
        <a-input-password v-model:value="formState.user_name" placeholder="原密码" />
      </a-form-item>
  
      <a-form-item
        label="新密码"
        name="password"
        :rules="[{ required: true, message: '请输入新密码!' }]"
        style="margin-top: 5px;"
      >
        <a-input-password v-model:value="formState.password" placeholder="新密码" />
      </a-form-item>
      <a-row justify="center">
        <a-form-item style="margin-top: 5px;">
            <a-button type="primary" html-type="submit">登 录</a-button>
        </a-form-item>
      </a-row>
    </a-form>
  </div>
</template>