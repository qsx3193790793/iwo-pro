<template>
  <DragElement v-bind="$attrs" v-on="$listeners">
    <el-select   v-bind.sync="props_bind" :disabled="props_bind?.isDisable"/>
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
import {commonProps, optionsProps} from "../../config/defaultConfigProps";

export default {
  name: 'FMSelect',
  compType: 'FMSelect',
  title: '下拉框',
  cId: '',
  type: 'comp',
  z_props: [].concat(commonProps(), optionsProps(4.5), [
    {sort: -1, name: '组件类型', key: 'type', value: 'FMSelect', type: 'input', isDisable: !0, isRequire: !1, col: 24},
  ])
}
</script>
<style lang="scss" scoped>
</style>
