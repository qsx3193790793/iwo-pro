<template>
  <DragElement v-bind="$attrs" v-on="$listeners">
    <el-input v-bind.sync="props_bind" :disabled="props_bind?.isDisable">
      <template v-if="props_bind?.suffix" slot="append">{{ props_bind?.suffix }}</template>
    </el-input>
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
  name: 'FMInput',
  compType: 'FMInput',
  title: '文本框',
  cId: '',
  type: 'comp',
  z_props: [].concat(commonProps(), [
    {sort: -1, name: '组件类型', key: 'type', value: 'FMInput', type: 'input', isDisable: !0, isRequire: !1, col: 24},
    {sort: 8.5, name: '后缀', key: 'suffix', value: '', type: 'input', isDisable: !1, isRequire: !1, col: 24},
  ])
}
</script>
<style lang="scss" scoped>
</style>
