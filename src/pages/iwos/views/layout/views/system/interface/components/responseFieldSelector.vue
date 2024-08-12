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
      proxy.$emit('responseHasEdit',  isEdit.value)
      return 
     }
    }
    isEdit.value=!isEdit.value
    proxy.$emit('responseHasEdit',  isEdit.value)
  }
  </script>
  
  <style scoped>
  
  </style>