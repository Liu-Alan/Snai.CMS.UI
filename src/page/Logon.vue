<script setup>
    import { reactive  } from 'vue';
    import { message } from 'ant-design-vue';
    import { UserOutlined, LockOutlined } from '@ant-design/icons-vue';
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
    <div class="title-logon">管 理 后 台</div>
    <a-form
      :model="formState"
      name="basic"
      autocomplete="off"
      @finish="onFinish"
      @finishFailed="onFinishFailed"
      style="min-width: 320px; max-width: 450px;"
    >
      <a-form-item
        name="user_name"
        :rules="[{ required: true, message: '请输入用户名!' }]"
      >
        <a-input v-model:value="formState.user_name" placeholder="用户名" size="large">
          <template #prefix>
            <UserOutlined class="site-form-item-icon" />
          </template>
        </a-input>
      </a-form-item>
  
      <a-form-item
        name="password"
        :rules="[{ required: true, message: '请输入密码!' }]"
      >
        <a-input-password v-model:value="formState.password" placeholder="密码" size="large" style="margin-top: 5px;">
          <template #prefix>
            <LockOutlined class="site-form-item-icon" />
          </template>
        </a-input-password>
      </a-form-item>
      <a-row justify="center">
        <a-form-item style="margin-top: 5px;">
            <a-button type="primary" html-type="submit" size="large">登 录</a-button>
        </a-form-item>
      </a-row>
    </a-form>
</template>