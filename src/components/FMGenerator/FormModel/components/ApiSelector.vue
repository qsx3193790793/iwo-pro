<template>
  <div class="ApiSelector">
    <el-input v-model="value" disabled>
      <template #append>
        <el-button v-if="!root.vm.disabled" icon="el-icon-search" @click="modelIsShow=!0"/>
      </template>
    </el-input>
    <MDialog v-model="modelIsShow" title="接口查询" width="80%" onScreen>
      <InterfaceManager v-if="modelIsShow" type="FormModel" @onSelect="onSelect"></InterfaceManager>
    </MDialog>
  </div>
</template>

<script setup>
import MDialog from '@/components/MDialog';
import {getCurrentInstance, ref} from "vue";
import InterfaceManager from "@/pages/iwos/views/layout/views/system/interface/index/index.vue";

const {proxy} = getCurrentInstance();

const props = defineProps({
  isShow: {type: Boolean, default: false},
  value: {type: String, default: ''},//v-model绑定
  valueKey: {type: String, default: ''},//v-model绑定 所在数据key 如果没有就不进行双向绑定 通过onConfirm自己赋值
  title: {type: String, default: ''},
  root: {type: Object, default: () => ({})},
});

const modelIsShow = ref(false);

function onSelect(row) {
  props.valueKey && proxy.$emit('input', row[props.valueKey]);
  proxy.$emit('onConfirm', row);
  modelIsShow.value = false;
}

</script>
<style lang="scss" scoped>
</style>
