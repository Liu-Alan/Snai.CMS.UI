<script setup>
import { ref, onBeforeMount, createVNode } from 'vue';
import { useRouter } from 'vue-router'
import axios from 'axios';

import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { message, Modal } from 'ant-design-vue';

import { storage } from '@/utils/storage';
import { apiurl,rescode } from '@/utils/globalconst';

import AddRole from './AddRole.vue'
import UpdateRole from './UpdateRole.vue'
import AssignPerm from './AssignPerm.vue'

const router = useRouter();

const props = defineProps({
  routerUrl: String,
  menuActs: Map
})

const roleID = ref(0);

const columns = [
  {
    title: 'id',
    dataIndex: 'id',
  },
  {
    title: '名称',
    dataIndex: 'title',
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
const openAddRoleModal = ref(false);
const openUpdateRoleModal = ref(false);
const openAssignPermModal = ref(false);

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

const showUpdateRoleModal = id => {
  roleID.value = id;
  openUpdateRoleModal.value = true;
};

const closeUpdateRoleModal = () => {
  openUpdateRoleModal.value = false;
  onPageChange(currentRef.value,pageSizeRef.value);
};

const showAssignPermModal = id => {
  roleID.value = id;
  openAssignPermModal.value = true;
};

const closeAssignPermModal = () => {
  openAssignPermModal.value = false;
  router.go(0);
};

const onDeleteRole = id => {
  let token=String(storage.get('token'))
  if (typeof token == "undefined" || token == null || token == ""){
      message.warning('没有权限或已过期', 2, ()=>{ window.location.href = '/logon/' });
  }else{
      let resdata;
      axios({
          method: 'get',
          url: apiurl+'/api/role/delete',
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

const onEnableRole = id => {
  let token=String(storage.get('token'))
  if (typeof token == "undefined" || token == null || token == ""){
      message.warning('没有权限或已过期', 2, ()=>{ window.location.href = '/logon/' });
  }else{
      let resdata;
      axios({
          method: 'post',
          url: apiurl+'/api/role/endisable',
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

const onDisableRole = id => {
  let token=String(storage.get('token'))
  if (typeof token == "undefined" || token == null || token == ""){
      message.warning('没有权限或已过期', 2, ()=>{ window.location.href = '/logon/' });
  }else{
      let resdata;
      axios({
          method: 'post',
          url: apiurl+'/api/role/endisable',
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

const onBatchDeleteRole = () => {
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
                url: apiurl+'/api/role/batchdelete',
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

const onBatchEnableRole = () => {
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
                url: apiurl+'/api/role/batchendisable',
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

const onBatchDisableRole = () => {
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
                url: apiurl+'/api/role/batchendisable',
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

const showAddRoleModal = () => {
  openAddRoleModal.value = true;
};
  
const closeAddRoleModal = () => {
  openAddRoleModal.value = false;
  onPageChange(currentRef.value,pageSizeRef.value);
};
</script>

<template>
  <a-table bordered :data-source="dataSource" :columns="columns" :pagination="false" 
    :row-selection="{ selectedRowKeys: selectedStatKeys, onChange: onSelectChange }">
    <template #bodyCell="{ column, record }">
      <template v-if="column.dataIndex === 'state'">
        <a-tag v-show="record.state==1" color="green">启用</a-tag>
        <a-tag v-show="record.state==2" color="orange">禁用</a-tag>
      </template>

      <template v-else-if="column.dataIndex === 'operation'">
        <a v-if="props.menuActs.has('updaterole')"><a-tag color="blue"  @click="showUpdateRoleModal(record.id)" style="cursor: pointer;">修改</a-tag></a>

        <a-popconfirm v-if="props.menuActs.has('deleterole')"
          title="确定删除吗?" ok-text="确定" cancel-text="取消"
          @confirm="onDeleteRole(record.id)"
        >
          <a><a-tag color="red" style="cursor: pointer;">删除</a-tag></a>
        </a-popconfirm>

        <a-popconfirm v-if="record.state==2 && props.menuActs.has('endisablerole')"
          title="确定启用吗?" ok-text="确定" cancel-text="取消"
          @confirm="onEnableRole(record.id)"
        >
          <a><a-tag color="green" style="cursor: pointer;">启用</a-tag></a>
        </a-popconfirm>

        <a-popconfirm v-else-if="record.state==1 && props.menuActs.has('endisablerole')"
          title="确定禁用吗?" ok-text="确定" cancel-text="取消"
          @confirm="onDisableRole(record.id)"
        >
          <a><a-tag color="orange" style="cursor: pointer;">禁用</a-tag></a>
        </a-popconfirm>

        <a v-if="props.menuActs.has('assignperm')"><a-tag color="cyan"  @click="showAssignPermModal(record.id)" style="cursor: pointer;">权限</a-tag></a>
      </template>
    </template>
  </a-table>
  <a-row>
    <a-col :span="9" style="margin-top: 8px;">
      <a-button v-if="props.menuActs.has('addrole')" type="ghost" class="button-color-daybreak" style="margin-right: 5px;" @click="showAddRoleModal">添加</a-button>
      <a-button v-if="props.menuActs.has('deleterole')" type="ghost" class="button-color-volcano" style="margin-right: 5px;" @click="onBatchDeleteRole">删除</a-button>
      <a-button v-if="props.menuActs.has('endisablerole')" type="ghost" class="button-color-green" style="margin-right: 5px;" @click="onBatchEnableRole">启用</a-button>
      <a-button v-if="props.menuActs.has('endisablerole')" type="ghost" class="button-color-sunset" style="margin-right: 5px;" @click="onBatchDisableRole">禁用</a-button>
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
    <a-modal v-model:open="openAddRoleModal" width="400px" title="添加角色" :footer="null" :maskClosable="false">
      <add-role @closeAddRoleModal="closeAddRoleModal"></add-role>
    </a-modal>
  </template>
  <template>
    <a-modal v-model:open="openUpdateRoleModal" width="400px" title="修改角色" :footer="null" :maskClosable="false">
      <update-role :roleID="roleID" @closeUpdateRoleModal="closeUpdateRoleModal"></update-role>
    </a-modal>
  </template>
  <template>
    <a-modal v-model:open="openAssignPermModal" width="570px" title="分配权限" :footer="null" :maskClosable="false">
      <assign-perm :roleID="roleID" @closeAssignPermModal="closeAssignPermModal"></assign-perm>
    </a-modal>
  </template>
</template>
<style scoped src="../assets/table.css"></style>