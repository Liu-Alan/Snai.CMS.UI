<script setup>
import { ref, onBeforeMount, createVNode } from 'vue';
import axios from 'axios';

import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { message, Modal } from 'ant-design-vue';

import { storage } from '@/utils/storage';
import { apiurl,rescode } from '@/utils/globalconst';

import AddAdmin from './AddAdmin.vue'

const props = defineProps({
  routerUrl: String
})

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

const onSelectChange = selectedRowKeys => {
  selectedStatKeys.value = selectedRowKeys;
};

const onAlter = id => {
  console.log(id);
};

const onDelete = id => {
  console.log(id);
};

const onEnable = id => {
  console.log(id);
};

const onDisable = id => {
  console.log(id);
};

const onUnlock = id => {
  console.log(id);
};

const onBottomDelete = () => {
  if(selectedStatKeys.value.length<=0){
    message.warning('您没有选择任何列');
  }else{
    Modal.confirm({
      icon: createVNode(ExclamationCircleOutlined),
      content: '您确定要删除选择的列吗',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        console.log(selectedStatKeys.value);
      },
      onCancel() {},
    });
  }
};

const onBottomeEnable = () => {
  console.log(selectedStatKeys.value);
};

const onBottomDisable = () => {
  console.log(selectedStatKeys.value);
};

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

const showAddAdminModal = () => {
  openAddAdminModal.value = true;
};
  
const closeAddAdminModal = () => {
  openAddAdminModal.value = false;
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
      <template v-if="column.dataIndex === 'lock_state'">
        <a-tag v-show="record.lock_state==1" color="green">未锁定</a-tag>
        <a-tag v-show="record.lock_state==2" color="orange">锁定</a-tag>
      </template>
      <template v-else-if="column.dataIndex === 'operation'">
        <a><a-tag color="blue"  @click="onAlter(record.id)" style="cursor: pointer;">修改</a-tag></a>
        <a-popconfirm
          title="确定删除吗?" ok-text="确定" cancel-text="取消"
          @confirm="onDelete(record.id)"
        >
          <a><a-tag color="red" style="cursor: pointer;">删除</a-tag></a>
        </a-popconfirm>
        <a-popconfirm v-if="record.state==2"
          title="确定启用吗?" ok-text="确定" cancel-text="取消"
          @confirm="onEnable(record.id)"
        >
          <a><a-tag color="green" style="cursor: pointer;">启用</a-tag></a>
        </a-popconfirm>
        <a-popconfirm v-else
          title="确定禁用吗?" ok-text="确定" cancel-text="取消"
          @confirm="onDisable(record.id)"
        >
          <a><a-tag color="orange" style="cursor: pointer;">禁用</a-tag></a>
        </a-popconfirm>
        <a-popconfirm v-if="record.lock_state==2"
          title="确定解锁吗?" ok-text="确定" cancel-text="取消"
          @confirm="onUnlock(record.id)"
        >
          <a><a-tag color="cyan" style="cursor: pointer;">解锁</a-tag></a>
        </a-popconfirm>
        <a-tag v-else style="color: #999;">解锁</a-tag>
      </template>
    </template>
  </a-table>
  <a-row>
    <a-col :span="9" style="margin-top: 8px;">
      <a-button type="ghost" class="button-color-daybreak" style="margin-right: 5px;" @click="showAddAdminModal">添加</a-button>
      <a-button type="ghost" class="button-color-volcano" style="margin-right: 5px;" @click="onBottomDelete">删除</a-button>
      <a-button type="ghost" class="button-color-green" style="margin-right: 5px;" @click="onBottomeEnable">启用</a-button>
      <a-button type="ghost" class="button-color-sunset" style="margin-right: 5px;" @click="onBottomDisable">禁用</a-button>
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
</template>
<style scoped src="../assets/admins.css"></style>