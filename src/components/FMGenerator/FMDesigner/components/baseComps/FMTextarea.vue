<template>
  <DragElement v-bind="$attrs" v-on="$listeners" class="FMTextarea">
    <el-input v-bind.sync="props_bind" type="textarea" :show-word-limit="!!props_bind?.maxlength"/>
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
  name: 'FMTextarea',
  compType: 'FMTextarea',
  title: '文本域',
  cId: '',
  type: 'comp',
  z_props: [].concat(commonProps(), [
    {sort: -1, name: '组件类型', key: 'type', value: 'FMTextarea', type: 'input', isDisable: !0, isRequire: !1, col: 24},
    {sort: 5.1, name: '行数', key: 'rows', min: 2, value: 2, type: 'number', isRequire: !1, col: 24},
    {sort: 5.2, name: '最大字数', key: 'maxlength', min: 0, value: 100, type: 'number', isRequire: !1, col: 24},
    {sort: 5.3, name: '可调整高度', key: 'resize', value: 'none', type: 'radio', options: [{label: '是', value: 'vertical'}, {label: '否', value: 'none'}], isRequire: !1, col: 24},
  ])
}
</script>
<style lang="scss" scoped>
</style>
