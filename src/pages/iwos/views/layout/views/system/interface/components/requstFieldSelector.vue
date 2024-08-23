<template>
  <div>
    <el-table ref="table" :data="list" max-height="200px" border>
        <el-table-column label="key" prop="key" show-overflow-tooltip resizable></el-table-column>
        <el-table-column label="value" prop="value" show-overflow-tooltip resizable></el-table-column>
        <el-table-column label="label(描述)" prop="label"  show-overflow-tooltip resizable>
          <template slot-scope="scope">
            <span v-show="isEdit">  {{ scope.row.label }}</span>
            <el-input v-show="!isEdit" v-model="scope.row.label" placeholder="请输入内容"></el-input>
          </template>
        </el-table-column>
    </el-table>
  </div>
</template>

<script setup >
import { ref, computed,getCurrentInstance} from 'vue'
const { proxy } = getCurrentInstance();
const props = defineProps({
  root: {type: Object, default: null},
  value: {type: Array, default: () => []},
  isEdit:{type: Boolean, default: true}
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
</script>

<style scoped>

</style>