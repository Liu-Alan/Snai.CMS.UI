<script setup>
import { ref, onBeforeMount, createVNode } from 'vue';
import axios from 'axios';

import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { message, Modal } from 'ant-design-vue';

import { storage } from '@/utils/storage';
import { apiurl,rescode } from '@/utils/globalconst';

import AddAdmin from './AddAdmin.vue'
import UpdateAdmin from './UpdateAdmin.vue'
import OtpCode from './OtpCode.vue'

const props = defineProps({
  routerUrl: String,
  menuActs: Map
})

const adminID = ref(0);
const adminUserName = ref('');

const columns = [
  {
    title: 'id',
    dataIndex: 'id',
  },
  {
    title: '用户名',
    dataIndex: 'user_name',
  },
  {
    title: '角色',
    dataIndex: 'role',
  },
  {
    title: '状态',
    dataIndex: 'state',
  },
  {
    title: '锁定',
    dataIndex: 'lock_state',
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
const openAddAdminModal = ref(false);
const openUpdateAdminModal = ref(false);
const openOtpCodeModal = ref(false);

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

const showUpdateAdminModal = id => {
  adminID.value = id;
  openUpdateAdminModal.value = true;
};

const closeUpdateAdminModal = () => {
  openUpdateAdminModal.value = false;
  onPageChange(currentRef.value,pageSizeRef.value);
};

const onDeleteAdmin = id => {
  let token=String(storage.get('token'))
  if (typeof token == "undefined" || token == null || token == ""){
      message.warning('没有权限或已过期', 2, ()=>{ window.location.href = '/logon/' });
  }else{
      let resdata;
      axios({
          method: 'get',
          url: apiurl+'/api/admin/delete',
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

const onEnableAdmin = id => {
  let token=String(storage.get('token'))
  if (typeof token == "undefined" || token == null || token == ""){
      message.warning('没有权限或已过期', 2, ()=>{ window.location.href = '/logon/' });
  }else{
      let resdata;
      axios({
          method: 'post',
          url: apiurl+'/api/admin/endisable',
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

const onDisableAdmin = id => {
  let token=String(storage.get('token'))
  if (typeof token == "undefined" || token == null || token == ""){
      message.warning('没有权限或已过期', 2, ()=>{ window.location.href = '/logon/' });
  }else{
      let resdata;
      axios({
          method: 'post',
          url: apiurl+'/api/admin/endisable',
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

const onUnlockAdmin = id => {
  let token=String(storage.get('token'))
  if (typeof token == "undefined" || token == null || token == ""){
      message.warning('没有权限或已过期', 2, ()=>{ window.location.href = '/logon/' });
  }else{
      let resdata;
      axios({
          method: 'get',
          url: apiurl+'/api/admin/unlock',
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

const onBatchDeleteAdmin = () => {
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
                url: apiurl+'/api/admin/batchdelete',
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

const onBatchEnableAdmin = () => {
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
                url: apiurl+'/api/admin/batchendisable',
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

const onBatchDisableAdmin = () => {
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
                url: apiurl+'/api/admin/batchendisable',
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

const showAddAdminModal = () => {
  openAddAdminModal.value = true;
};
  
const closeAddAdminModal = () => {
  openAddAdminModal.value = false;
  onPageChange(currentRef.value,pageSizeRef.value);
};

const showOtpCodeModal = (id,userName) => {
  adminID.value = id;
  adminUserName.value = userName;
  openOtpCodeModal.value = true;
};
  
const closeOtpCodeModal = () => {
  openOtpCodeModal.value = false;
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
      <template v-if="column.dataIndex === 'lock_state'">
        <a-tag v-show="record.lock_state==1" color="green">未锁定</a-tag>
        <a-tag v-show="record.lock_state==2" color="orange">锁定</a-tag>
      </template>

      <template v-else-if="column.dataIndex === 'operation'">
        <a v-if="props.menuActs.has('updateadmin')"><a-tag color="blue"  @click="showUpdateAdminModal(record.id)" style="cursor: pointer;">修改</a-tag></a>

        <a-popconfirm v-if="props.menuActs.has('deleteadmin')"
          title="确定删除吗?" ok-text="确定" cancel-text="取消"
          @confirm="onDeleteAdmin(record.id)"
        >
          <a><a-tag color="red" style="cursor: pointer;">删除</a-tag></a>
        </a-popconfirm>

        <a-popconfirm v-if="record.state==2 && props.menuActs.has('endisableadmin')"
          title="确定启用吗?" ok-text="确定" cancel-text="取消"
          @confirm="onEnableAdmin(record.id)"
        >
          <a><a-tag color="green" style="cursor: pointer;">启用</a-tag></a>
        </a-popconfirm>

        <a-popconfirm v-else-if="record.state==1 && props.menuActs.has('endisableadmin')"
          title="确定禁用吗?" ok-text="确定" cancel-text="取消"
          @confirm="onDisableAdmin(record.id)"
        >
          <a><a-tag color="orange" style="cursor: pointer;">禁用</a-tag></a>
        </a-popconfirm>

        <a-popconfirm v-if="record.lock_state==2 && props.menuActs.has('unlockadmin')"
          title="确定解锁吗?" ok-text="确定" cancel-text="取消"
          @confirm="onUnlockAdmin(record.id)"
        >
          <a><a-tag color="cyan" style="cursor: pointer;">解锁</a-tag></a>
        </a-popconfirm>
        <a-tag v-else-if="record.lock_state==1 && props.menuActs.has('unlockadmin')" style="color: #999;">解锁</a-tag>

        <a v-if="props.menuActs.has('addadmin')"><a-tag color="geekblue"  @click="showOtpCodeModal(record.id,record.user_name)" style="cursor: pointer;">otp码</a-tag></a>
      </template>
    </template>
  </a-table>
  <a-row>
    <a-col :span="9" style="margin-top: 8px;">
      <a-button v-if="props.menuActs.has('addadmin')" type="ghost" class="button-color-daybreak" style="margin-right: 5px;" @click="showAddAdminModal">添加</a-button>
      <a-button v-if="props.menuActs.has('deleteadmin')" type="ghost" class="button-color-volcano" style="margin-right: 5px;" @click="onBatchDeleteAdmin">删除</a-button>
      <a-button v-if="props.menuActs.has('endisableadmin')" type="ghost" class="button-color-green" style="margin-right: 5px;" @click="onBatchEnableAdmin">启用</a-button>
      <a-button v-if="props.menuActs.has('endisableadmin')" type="ghost" class="button-color-sunset" style="margin-right: 5px;" @click="onBatchDisableAdmin">禁用</a-button>
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
    <a-modal v-model:open="openAddAdminModal" width="400px" title="添加用户" :footer="null" :maskClosable="false">
      <add-admin @closeAddAdminModal="closeAddAdminModal"></add-admin>
    </a-modal>
  </template>
  <template>
    <a-modal v-model:open="openUpdateAdminModal" width="400px" title="修改用户" :footer="null" :maskClosable="false">
      <update-admin :adminID="adminID" @closeUpdateAdminModal="closeUpdateAdminModal"></update-admin>
    </a-modal>
  </template>
  <template>
    <a-modal v-model:open="openOtpCodeModal" width="280px" :title="adminUserName+'二维码'" :footer="null" :maskClosable="false">
      <otp-code :adminID="adminID" @closeOtpCodeModal="closeOtpCodeModal"></otp-code>
    </a-modal>
  </template>
</template>
<style scoped src="../assets/table.css"></style>