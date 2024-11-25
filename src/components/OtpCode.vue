<script setup>
    import { ref,onMounted,onUpdated } from 'vue';
    import { message } from 'ant-design-vue';
    import axios from 'axios';

    import { storage } from '@/utils/storage';
    import { apiurl } from '@/utils/globalconst';

    const props = defineProps({
      adminID: Number
    })

    const emits = defineEmits(['closeUpdateAdminModal']);

    const otpUrl = ref('');

    const GetOtpQrcode = (id) =>{
        let token=String(storage.get('token'));
        if (typeof token == "undefined" || token == null || token == ""){
            message.warning('没有权限或已过期', 2, ()=>{ window.location.href = '/logon/' });
        }else{
            axios({
                method: 'get',
                url: apiurl+'/api/admin/qrcode',
                headers: {'Authorization': 'Bearer ' + token },
                responseType: "arraybuffer",
                params: {
                  id: id
                },
            })
            .then(response =>{
                otpUrl.value = 'data:image/*;base64,' + btoa(
                    new Uint8Array(response.data)
                        .reduce((data, byte) => data + String.fromCharCode(byte), ''));
            })
            .catch(error=>{
                if(error.response){
                    message.warning('二维码加载失败，请稍后再试！');
                }else if (error.request) {
                    message.warning("网络有问题，请稍后重试");
                } else {
                    message.warning("网络有问题，请稍后重试");
                }
            });
        }
    }

    onMounted(()=>{
        GetOtpQrcode(props.adminID);
    })

    onUpdated(()=>{
        GetOtpQrcode(props.adminID);
    })

</script>

<template>
  <div>
    <img :src="otpUrl" />
  </div>
</template>