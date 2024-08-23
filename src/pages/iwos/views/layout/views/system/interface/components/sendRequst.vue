<template>
  <div>
    <el-button type="primary" @click="testApi" >发送</el-button>
  </div>
</template>

<script setup >
import { ref, getCurrentInstance } from 'vue'
const { proxy } = getCurrentInstance();
const props = defineProps({
  root: {type: Object, default: null},
});
async function testApi(){
  const testData={
    interfaceUrl:props.root.vm.formData.interfaceUrl,
    appId:props.root.vm.formData.appId,
    appKey:props.root.vm.formData.appKey,
    requestParam:props.root.vm.formData.interfaceMethod==='GET' ? objectToQueryString(JSON.parse(props.root.vm.formData.requestJsonStr)): props.root.vm.formData.requestJsonStr ,
    interfaceMethod:props.root.vm.formData.interfaceMethod,
    interfaceNormType:props.root.vm.formData.interfaceNormType
  }
  const {res, err} =await proxy.$$api.interface.testApi({data:testData})
    if (res.hasOwnProperty('reqOuterData'))  delete res.reqOuterData;
    if (res.hasOwnProperty('msg'))  delete res.msg;
    if (res.hasOwnProperty('resultCode'))  delete res.resultCode;
    if (res.hasOwnProperty('resultMsg'))  delete res.resultMsg;
    props.root.vm.formData.responseJsonStr= JSON.stringify(res)
    props.root.vm.formData.stagingresponse=flattenObject(res)
    props.root.vm.formData.stagingrequest=flattenObject(JSON.parse(props.root.vm.formData.requestJsonStr)) 
}

function objectToQueryString(obj) {  
  return Object.keys(obj).reduce((acc, key, index, array) => {  
    const value = obj[key];  
    const encodedKey = encodeURIComponent(key);  
    const encodedValue = encodeURIComponent(value.toString()); // 确保值是字符串  
    // 如果是最后一个元素，就不加'&'，否则加上  
    return acc + `${encodedKey}=${encodedValue}${index < array.length - 1 ? '&' : ''}`;  
  }, '');  
} 
function flattenObject(obj, path = '', result = []) {  
    for (let [key, value] of Object.entries(obj)) {  
        const currentPath = path ? `${path}.${key}` : key;  
        if (Array.isArray(value)) {  
            // 如果值是数组，只取第一个元素进行递归  
            if (value.length > 0) {  
                flattenObject(value[0], `${currentPath}[0]`, result);  
            }  
        } else if (value && typeof value === 'object') {  
            // 如果值是对象，递归处理  
            flattenObject(value, currentPath, result);  
        } else {  
            // 如果值是基本类型，添加到结果数组  
            result.push({ key: currentPath, value: value, label: '' });  
        }  
    }  
    return result;  
} 
</script>

<style scoped>

</style>