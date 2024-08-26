<template>
  <div class="DisputeChannelSelector">
    <el-input v-model="value" disabled>
      <template #append>
        <el-button v-if="!root.vm.disabled" icon="el-icon-search" @click="modelIsShow=!0"/>
      </template>
    </el-input>
    <MDialog v-model="modelIsShow" :title="title" width="30%" height="1rem" @opened="init">
      <div class="container">
        <el-cascader v-model="cascaderValue" ref="cascaderRef" class="cascader" :options="options" placeholder="请选择" clearable filterable collapse-tags collapse-tags-tooltip></el-cascader>
        <el-button class="btn" type="primary" @click="confirm">确认</el-button>
      </div>
    </MDialog>
  </div>
</template>

<script setup>
import MDialog from '@/components/MDialog';
import {getCurrentInstance, ref} from "vue";

const {proxy} = getCurrentInstance();

const props = defineProps({
  isShow: {type: Boolean, default: false},
  value: {type: String, default: ''},//v-model绑定
  valueKey: {type: String, default: ''},//v-model绑定 所在数据key 如果没有就不进行双向绑定 通过onConfirm自己赋值
  title: {type: String, default: '选择争议渠道'},
  options: {type: Array, default: () => []},
  root: {type: Object, default: () => ({})},
});

const modelIsShow = ref(false);
const cascaderRef = ref();
const cascaderValue = ref([]);

function confirm() {
  if (!cascaderValue.value.length) return proxy.$emit('onConfirm', null), modelIsShow.value = false;
  const getCheckedNodes = cascaderRef.value.getCheckedNodes()?.[0];
  const row = {
    pathLabels: getCheckedNodes.pathLabels, path: getCheckedNodes.path,
    fullPathLabel: getCheckedNodes.pathLabels?.join(' / ') || '', fullPath: getCheckedNodes.path?.join(' / ') || ''
  };
  props.valueKey && proxy.$emit('input', row[props.valueKey]);
  proxy.$emit('onConfirm', row);
  modelIsShow.value = false;
}

function init() {
}

</script>
<style lang="scss" scoped>
.container {
  display: flex;
  justify-content: flex-start;
  align-items: center;

  & > .cascader {
    flex-grow: 1;
  }

  & > .btn {
    flex-grow: 0;
    flex-shrink: 0;
    margin-left: 16px;
  }
}
</style>
