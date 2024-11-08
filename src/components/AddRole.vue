<script setup>
    import { reactive } from 'vue';
    import { message } from 'ant-design-vue';
    import axios from 'axios';

    import { storage } from '@/utils/storage';
    import { apiurl,rescode } from '@/utils/globalconst';

    const formState = reactive({
      title: '',
      state: 1,
    });

    const emits = defineEmits(['closeAddRoleModal']);
    
    const initFormData = () =>{
      formState.title = '';
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
        state: [
            {
              required: true,
              message: '请选择状态',
              trigger: 'change',
            },
        ]
    }

    const onFinish = values => {
      let token=String(storage.get('token'));
      if (typeof token == "undefined" || token == null || token == ""){
        message.warning('没有权限或已过期', 2, ()=>{ window.location.href = '/logon/' });
      }else{
        let resdata;
        axios({
          method: 'post',
          url: apiurl+'/api/role/add',
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
              emits("closeAddRoleModal"); 
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
      <a-form-item
        label="名称"
        name="title"
        style="margin-top: 20px;"
      >
        <a-input v-model:value="formState.title" placeholder="名称" />
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