<template>
  <DragElement v-bind="$attrs" v-on="$listeners">
    <el-input-number v-bind.sync="props_bind" :disabled="props_bind?.isDisable" :controls="!0"/>
  </DragElement>
</template>
<script setup>
import DragElement from "../DragElement.vue";
import {computed, getCurrentInstance, useAttrs} from "vue";
import {getProps} from "../../config";

const {proxy} = getCurrentInstance();

const props_bind = computed(() => getProps(useAttrs().props));

</script>
<script>
import {getProps} from "../../config";
import {commonProps} from "../../config/defaultConfigProps";

export default {
  name: 'FMNumber',
  compType: 'FMNumber',
  title: '数字框',
  cId: '',
  type: 'comp',
  z_props: [].concat(commonProps(), [
    {sort: -1, name: '组件类型', key: 'type', value: 'FMNumber', type: 'input', isDisable: !0, isRequire: !1, col: 24},
    {sort: 5.1, name: '最小值', key: 'min', value: 0, type: 'number', isRequire: !1, col: 24},
    {sort: 5.2, name: '最大值', key: 'max', value: 0, type: 'number', isRequire: !1, col: 24},
  ])
}
</script>
<style lang="scss" scoped>
</style>
