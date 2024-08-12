<template>
  <div>
    <el-table ref="table" :data="list" max-height="200px" border>
        <el-table-column label="key" prop="key" show-overflow-tooltip resizable></el-table-column>
        <el-table-column label="value" prop="value" show-overflow-tooltip resizable></el-table-column>
        <el-table-column label="label" prop="label"  show-overflow-tooltip resizable>
          <template slot-scope="scope">
            <span v-show="isEdit">  {{ scope.row.label }}</span>
            <el-input v-show="!isEdit" v-model="scope.row.label" placeholder="请输入内容"></el-input>
          </template>
        </el-table-column>
        <el-table-column >
          <template #header="{ row }">
            <el-button :disabled="list.length<=0" class="quote-trigger" type="text" @click="editLabel" icon="el-icon-document-copy">{{ isEdit ? '填写' : '保存' }}</el-button>
            <el-button :disabled="!props.root.vm.formData.requestJsonStr" class="quote-trigger" type="text" @click="testApi" icon="el-icon-document-copy">解析</el-button>
            <!-- <el-button class="quote-trigger" v-show="props.root.vm.formData.interfaceMethod==='GET'" type="text" @click="addRequstParams" icon="el-icon-document-copy">添加入参</el-button> -->
          </template>
        </el-table-column>
    
    </el-table>
  </div>
</template>

<script setup lang='ts'>
import { ref, computed,getCurrentInstance} from 'vue'
const { proxy } = getCurrentInstance();
const isEdit=ref(true)
const props = defineProps({
  root: {type: Object, default: null},
  value: {type: Array, default: () => []},
});
 const list = computed({
  get: () => {
    console.log(props.value);
    return props.value
  },
  set: v => {
    console.log(v);
    proxy.$emit('input', v)
  }
});
function editLabel(){
  if(!isEdit.value){
    if(list.value.some(item => item.label === "")) {
      proxy.$$Dialog.confirm('您有尚未填写的label，请确认全部填写再保存！')
      proxy.$emit('requstHasEdit',  isEdit.value)
      return 
    }
  }
  isEdit.value=!isEdit.value
  proxy.$emit('requstHasEdit',  isEdit.value)
}
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
    props.root.vm.formData.responseParam=flattenObject(res)
    props.root.vm.formData.responseJsonStr= JSON.stringify(res)
    list.value=flattenObject(JSON.parse(props.root.vm.formData.requestJsonStr)) 
}
function addRequstParams(){}
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
function objectToQueryString(obj) {  
  return Object.keys(obj).reduce((acc, key, index, array) => {  
    const value = obj[key];  
    const encodedKey = encodeURIComponent(key);  
    const encodedValue = encodeURIComponent(value.toString()); // 确保值是字符串  
    // 如果是最后一个元素，就不加'&'，否则加上  
    return acc + `${encodedKey}=${encodedValue}${index < array.length - 1 ? '&' : ''}`;  
  }, '');  
} 

</script>

<style scoped>

</style>