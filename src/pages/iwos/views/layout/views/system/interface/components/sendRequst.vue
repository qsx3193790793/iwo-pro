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
    requestParam: props.root.vm.formData.requestJsonStr,
    interfaceMethod:props.root.vm.formData.interfaceMethod,
    interfaceNormType:props.root.vm.formData.interfaceNormType
  }
  const {res, err} =await proxy.$$api.interface.testApi({data:testData})
    if(err) return  
    if (res.hasOwnProperty('reqOuterData'))  delete res.reqOuterData;
    if (res.hasOwnProperty('msg'))  delete res.msg;
    if (res.hasOwnProperty('resultCode'))  delete res.resultCode;
    if (res.hasOwnProperty('resultMsg'))  delete res.resultMsg;
    props.root.vm.formData.responseJsonStr= JSON.stringify(res)
    if(props.root.vm.formData.interfaceMethod==="GET"){
     props.root.vm.formData.stagingrequest= replaceLabels(convertQueryParamsToArray(props.root.vm.formData.requestJsonStr),props.root.vm.formData.requestParam)      
    }else{
     props.root.vm.formData.stagingrequest= replaceLabels(flattenObject(JSON.parse(props.root.vm.formData.requestJsonStr)),props.root.vm.formData.requestParam)      
    }
    props.root.vm.formData.stagingresponse= replaceLabels(flattenObject(res),props.root.vm.formData.responseParam)
    proxy.$$Toast({message: `接口发送成功`, type: 'success'});
}
//保存label值
function replaceLabels(arr1, arr2) {
  // 遍历arr1中的每个对象
  arr1.forEach(obj1 => {
    // 遍历arr2中的每个对象
    arr2.forEach(obj2 => {
      // 检查两个对象的key值是否相等
      if (obj1.key === obj2.key) {
        // 如果相等，‌将arr2中的label值替换到arr1中的对象上
        obj1.label = obj2.label;
      }
    });
  });

  // 返回修改后的arr1
  return arr1;
}
//将string格式化为list
function convertQueryParamsToArray(query) {
  return query.split('&').map(param => {
    let [key, value] = param.split('=');
    return { key, value, label: '' };
  });
}
//将对象格式化为list
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