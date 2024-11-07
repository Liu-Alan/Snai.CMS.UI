<script setup>
import { ref, onBeforeMount, createVNode } from 'vue';
import axios from 'axios';

import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { message, Modal } from 'ant-design-vue';

import { storage } from '@/utils/storage';
import { apiurl,rescode } from '@/utils/globalconst';

import AddModule from './AddModule.vue'
import UpdateModule from './UpdateModule.vue'

const props = defineProps({
  routerUrl: String,
  menuActs: Map
})

const moduleID = ref(0);

const columns = [
  {
    title: 'id',
    dataIndex: 'id',
  },
  {
    title: '父模块',
    dataIndex: 'parent_title',
  },
  {
    title: '名称',
    dataIndex: 'title',
  },
  {
    title: '前端名称',
    dataIndex: 'name',
  },
  {
    title: '菜单',
    dataIndex: 'menu',
  },
  {
    title: '状态',
    dataIndex: 'state',
  },
  {
    title: '操作',
    dataIndex: 'operation',
  },
];
const dataSource = ref([]);
const selectedStatKeys = ref([]);

const currentRef = ref(1);
const pageSizeRef = ref(10);
const pageSizeOptions = ref(['10', '20', '50']);
const total = ref(0);
const openAddModuleModal = ref(false);
const openUpdateModuleModal = ref(false);

onBeforeMount(()=>{
    let token=String(storage.get('token'));
    if (typeof token == "undefined" || token == null || token == ""){
        message.warning('没有权限或已过期', 2, ()=>{ window.location.href = '/logon/' });
    }else{
        let resdata;
        axios({
            method: 'get',
            url: apiurl+props.routerUrl,
            headers: {'Authorization': 'Bearer ' + token }
          })
          .then(response =>{
            resdata = response.data;
            if(resdata.code == rescode.success){
              dataSource.value = resdata.result.list;
              total.value = resdata.result.total; 
              currentRef.value = resdata.result.page;
              pageSizeRef.value = resdata.result.page_size;
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

const onPageChange = (page, pageSize) => {
  let token=String(storage.get('token'));
    if (typeof token == "undefined" || token == null || token == ""){
        message.warning('没有权限或已过期', 2, ()=>{ window.location.href = '/' });
    }else{
        let resdata;
        axios({
            method: 'get',
            url: apiurl+props.routerUrl,
            headers: {'Authorization': 'Bearer ' + token },
            params: {
              page: currentRef.value,
              page_size: pageSize
            },
          })
          .then(response =>{
            resdata = response.data;
            if(resdata.code == rescode.success){
              dataSource.value = resdata.result.list;
              total.value = resdata.result.total; 
              currentRef.value = resdata.result.page;
              pageSizeRef.value = resdata.result.page_size;
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
};

const onShowSizeChange = (current, pageSize) => {
  currentRef.value = 1;
};

const onSelectChange = selectedRowKeys => {
  selectedStatKeys.value = selectedRowKeys;
};

const showUpdateModuleModal = id => {
  moduleID.value = id;
  openUpdateModuleModal.value = true;
};

const closeUpdateModuleModal = () => {
  openUpdateModuleModal.value = false;
  onPageChange(currentRef.value,pageSizeRef.value);
};

const onDeleteModule = id => {
  let token=String(storage.get('token'))
  if (typeof token == "undefined" || token == null || token == ""){
      message.warning('没有权限或已过期', 2, ()=>{ window.location.href = '/logon/' });
  }else{
      let resdata;
      axios({
          method: 'get',
          url: apiurl+'/api/module/delete',
          headers: {'Authorization': 'Bearer ' + token },
          params: {
                id: id
              },
        })
        .then(response =>{
          resdata = response.data;
          if(resdata.code == rescode.success){
            message.success(resdata.msg);
            onPageChange(currentRef.value,pageSizeRef.value);
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
              message.warning("网络有问题，请稍后重试");
          } else {
              message.warning("网络有问题，请稍后重试");
          }
        });
    }
};

const onEnableModule = id => {
  let token=String(storage.get('token'))
  if (typeof token == "undefined" || token == null || token == ""){
      message.warning('没有权限或已过期', 2, ()=>{ window.location.href = '/logon/' });
  }else{
      let resdata;
      axios({
          method: 'post',
          url: apiurl+'/api/module/endisable',
          headers: {'Authorization': 'Bearer ' + token },
          params: {
                id: id,
                state: 1
              },
        })
        .then(response =>{
          resdata = response.data;
          if(resdata.code == rescode.success){
            message.success(resdata.msg);
            onPageChange(currentRef.value,pageSizeRef.value);
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
              message.warning("网络有问题，请稍后重试");
          } else {
              message.warning("网络有问题，请稍后重试");
          }
        });
    }
};

const onDisableModule = id => {
  let token=String(storage.get('token'))
  if (typeof token == "undefined" || token == null || token == ""){
      message.warning('没有权限或已过期', 2, ()=>{ window.location.href = '/logon/' });
  }else{
      let resdata;
      axios({
          method: 'post',
          url: apiurl+'/api/module/endisable',
          headers: {'Authorization': 'Bearer ' + token },
          params: {
                id: id,
                state: 2
              },
        })
        .then(response =>{
          resdata = response.data;
          if(resdata.code == rescode.success){
            message.success(resdata.msg);
            onPageChange(currentRef.value,pageSizeRef.value);
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
              message.warning("网络有问题，请稍后重试");
          } else {
              message.warning("网络有问题，请稍后重试");
          }
        });
    }
};

const onBatchDeleteModule = () => {
  if(selectedStatKeys.value.length<=0){
    message.warning('您没有选择任何列');
  }else{
    Modal.confirm({
      icon: createVNode(ExclamationCircleOutlined),
      content: '您确定要删除选择的列吗',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        let token=String(storage.get('token'))
        if (typeof token == "undefined" || token == null || token == ""){
            message.warning('没有权限或已过期', 2, ()=>{ window.location.href = '/logon/' });
        }else{
            let resdata;
            axios({
                method: 'post',
                url: apiurl+'/api/module/batchdelete',
                headers: {
                  'Content-Type': 'multipart/form-data;',
                  'Authorization': 'Bearer ' + token 
                },
                data: {
                      ids:selectedStatKeys.value
                    },
              })
              .then(response =>{
                resdata = response.data;
                if(resdata.code == rescode.success){
                  message.success(resdata.msg);
                  onPageChange(currentRef.value,pageSizeRef.value);
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
                    message.warning("网络有问题，请稍后重试");
                } else {
                    message.warning("网络有问题，请稍后重试");
                }
              });
          }
      },
      onCancel() {},
    });
  }
};

const onBatchEnableModule = () => {
  if(selectedStatKeys.value.length<=0){
    message.warning('您没有选择任何列');
  }else{
    Modal.confirm({
      icon: createVNode(ExclamationCircleOutlined),
      content: '您确定要启用选择的用户吗',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        let token=String(storage.get('token'))
        if (typeof token == "undefined" || token == null || token == ""){
            message.warning('没有权限或已过期', 2, ()=>{ window.location.href = '/logon/' });
        }else{
            let resdata;
            axios({
                method: 'post',
                url: apiurl+'/api/module/batchendisable',
                headers: {
                  'Content-Type': 'multipart/form-data;',
                  'Authorization': 'Bearer ' + token 
                },
                data: {
                      ids:selectedStatKeys.value,
                      state: 1
                    },
              })
              .then(response =>{
                resdata = response.data;
                if(resdata.code == rescode.success){
                  message.success(resdata.msg);
                  onPageChange(currentRef.value,pageSizeRef.value);
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
                    message.warning("网络有问题，请稍后重试");
                } else {
                    message.warning("网络有问题，请稍后重试");
                }
              });
          }
      },
      onCancel() {},
    });
  }
};

const onBatchDisableModule = () => {
  if(selectedStatKeys.value.length<=0){
    message.warning('您没有选择任何列');
  }else{
    Modal.confirm({
      icon: createVNode(ExclamationCircleOutlined),
      content: '您确定要禁用选择的用户吗',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        let token=String(storage.get('token'))
        if (typeof token == "undefined" || token == null || token == ""){
            message.warning('没有权限或已过期', 2, ()=>{ window.location.href = '/logon/' });
        }else{
            let resdata;
            axios({
                method: 'post',
                url: apiurl+'/api/module/batchendisable',
                headers: {
                  'Content-Type': 'multipart/form-data;',
                  'Authorization': 'Bearer ' + token 
                },
                data: {
                      ids:selectedStatKeys.value,
                      state: 2
                    },
              })
              .then(response =>{
                resdata = response.data;
                if(resdata.code == rescode.success){
                  message.success(resdata.msg);
                  onPageChange(currentRef.value,pageSizeRef.value);
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
                    message.warning("网络有问题，请稍后重试");
                } else {
                    message.warning("网络有问题，请稍后重试");
                }
              });
          }
      },
      onCancel() {},
    });
  }
};

const showAddModuleModal = () => {
  openAddModuleModal.value = true;
};
  
const closeAddModuleModal = () => {
  openAddModuleModal.value = false;
  onPageChange(currentRef.value,pageSizeRef.value);
};
</script>

<template>
  <a-table bordered :data-source="dataSource" :columns="columns" :pagination="false" 
    :row-selection="{ selectedRowKeys: selectedStatKeys, onChange: onSelectChange }">
    <template #bodyCell="{ column, record }">
      <template v-if="column.dataIndex === 'menu'">
        <a-tag v-show="record.menu==1" color="green">是</a-tag>
        <a-tag v-show="record.menu==2">否</a-tag>
      </template>
      <template v-if="column.dataIndex === 'state'">
        <a-tag v-show="record.state==1" color="green">启用</a-tag>
        <a-tag v-show="record.state==2" color="orange">禁用</a-tag>
      </template>

      <template v-else-if="column.dataIndex === 'operation'">
        <a v-if="props.menuActs.has('updatemodule')"><a-tag color="blue"  @click="showUpdateModuleModal(record.id)" style="cursor: pointer;">修改</a-tag></a>

        <a-popconfirm v-if="props.menuActs.has('deletemodule')"
          title="确定删除吗?" ok-text="确定" cancel-text="取消"
          @confirm="onDeleteModule(record.id)"
        >
          <a><a-tag color="red" style="cursor: pointer;">删除</a-tag></a>
        </a-popconfirm>

        <a-popconfirm v-if="record.state==2 && props.menuActs.has('endisablemodule')"
          title="确定启用吗?" ok-text="确定" cancel-text="取消"
          @confirm="onEnableModule(record.id)"
        >
          <a><a-tag color="green" style="cursor: pointer;">启用</a-tag></a>
        </a-popconfirm>

        <a-popconfirm v-else-if="record.state==1 && props.menuActs.has('endisablemodule')"
          title="确定禁用吗?" ok-text="确定" cancel-text="取消"
          @confirm="onDisableModule(record.id)"
        >
          <a><a-tag color="orange" style="cursor: pointer;">禁用</a-tag></a>
        </a-popconfirm>

      </template>
    </template>
  </a-table>
  <a-row>
    <a-col :span="9" style="margin-top: 8px;">
      <a-button v-if="props.menuActs.has('addmodule')" type="ghost" class="button-color-daybreak" style="margin-right: 5px;" @click="showAddModuleModal">添加</a-button>
      <a-button v-if="props.menuActs.has('deletemodule')" type="ghost" class="button-color-volcano" style="margin-right: 5px;" @click="onBatchDeleteModule">删除</a-button>
      <a-button v-if="props.menuActs.has('endisablemodule')" type="ghost" class="button-color-green" style="margin-right: 5px;" @click="onBatchEnableModule">启用</a-button>
      <a-button v-if="props.menuActs.has('endisablemodule')" type="ghost" class="button-color-sunset" style="margin-right: 5px;" @click="onBatchDisableModule">禁用</a-button>
    </a-col>
    <a-col :span="15" style="margin-top: 8px; text-align: right;">
      <div>
        <a-pagination @change="onPageChange" @showSizeChange="onShowSizeChange"
          v-model:current="currentRef"
          v-model:page-size="pageSizeRef"
          :page-size-options="pageSizeOptions"
          :total="total"
          :show-total="total => `共 ${total} 条`"
        >
          <template #buildOptionText="props">
            <span>{{ props.value }}条/页</span>
          </template>
        </a-pagination>
      </div>
    </a-col>
  </a-row>
  <template>
    <a-modal v-model:open="openAddModuleModal" width="400px" title="添加模块" :footer="null" :maskClosable="false">
      <add-module @closeAddModuleModal="closeAddModuleModal"></add-module>
    </a-modal>
  </template>
  <template>
    <a-modal v-model:open="openUpdateModuleModal" width="400px" title="修改模块" :footer="null" :maskClosable="false">
      <update-module :moduleID="moduleID" @closeUpdateModuleModal="closeUpdateModuleModal"></update-module>
    </a-modal>
  </template>
</template>
<style scoped src="../assets/table.css"></style>