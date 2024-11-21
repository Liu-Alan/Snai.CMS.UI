<script setup>
    import { ref, reactive, onMounted, onUpdated, onBeforeMount } from 'vue';
    import { message } from 'ant-design-vue';
    import axios from 'axios';

    import { storage } from '@/utils/storage';
    import { apiurl,rescode } from '@/utils/globalconst';

    const props = defineProps({
      roleID: Number
    })

    const formState = reactive({
      role_id: 0,
      module_ids: [],
    });

    var menuPas = ref([]);
    var menuSubs = ref([]);
    var menuActs = ref([]);

    const emits = defineEmits(['closeAssignPermModal']);

    onBeforeMount(()=>{
        let token=String(storage.get('token'));
        if (typeof token == "undefined" || token == null || token == ""){
            message.warning('没有权限或已过期', 2, ()=>{ window.location.href = '/logon/' });
        }else{
            let resdata;
            axios({
                method: 'get',
                url: apiurl+'/api/module/getlist',
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
                        if(menu.menu == 2 && menu.name !==''){
                            menuActs.value.push(menu);
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

    const GetRoleModules = (roleID) =>{
        let token=String(storage.get('token'));
        if (typeof token == "undefined" || token == null || token == ""){
            message.warning('没有权限或已过期', 2, ()=>{ window.location.href = '/logon/' });
        }else{
            let resdata;
            axios({
                method: 'get',
                url: apiurl+'/api/role/rolemodules',
                headers: {'Authorization': 'Bearer ' + token },
                params: {
                    role_id: roleID
                },
            })
            .then(response =>{
                resdata = response.data;
                if(resdata.code == rescode.success){
                    formState.role_id = roleID;
                    formState.module_ids = resdata.result;
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
        formState.role_id=props.roleID;
        GetRoleModules(props.roleID);
    })

    onUpdated(()=>{
        formState.role_id=props.roleID;
        GetRoleModules(props.roleID);
    })

    const onFinish = values => {
      let token=String(storage.get('token'));
      if (typeof token == "undefined" || token == null || token == ""){
        message.warning('没有权限或已过期', 2, ()=>{ window.location.href = '/logon/' });
      }else{
        let resdata;
        axios({
          method: 'post',
          url: apiurl+'/api/role/assignperm',
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
              emits("closeAssignPermModal"); 
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
      @finish="onFinish"
      @finishFailed="onFinishFailed"
    >
      <a-form-item v-show="false"
        name="role_id"
      >
        <a-input v-model:value="formState.role_id" :disabled="true" />
      </a-form-item>
  
      <a-form-item name="module_ids">
        <a-checkbox-group v-model:value="formState.module_ids">
          <a-card v-for="menuP in menuPas">
            <a-checkbox :value="menuP.id" name="module_ids">{{menuP.title}}</a-checkbox>
            <br />
            <template v-for="menuS in menuSubs">
              <a-checkbox v-if="menuS.parent_id==menuP.id" :value="menuS.id" name="module_ids" style="margin-left: 10px;">{{menuS.title}}</a-checkbox>
              <br />
              <div style="margin-left: 20px;">
                <template v-for="menuA in menuActs">
                    <a-checkbox v-if="menuA.parent_id==menuS.id" :value="menuA.id" name="module_ids">{{menuA.title}}</a-checkbox>   
                </template>
              </div>
            </template>
          </a-card>
        </a-checkbox-group>
      </a-form-item>
      
      <a-row justify="center">
        <a-form-item style="margin-top: 5px;">
            <a-button type="primary" html-type="submit">提 交</a-button>
        </a-form-item>
      </a-row>
    </a-form>
  </div>
</template>