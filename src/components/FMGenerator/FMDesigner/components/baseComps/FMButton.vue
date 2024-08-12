<template>
  <DragElement v-bind="$attrs" v-on="$listeners">
    <div v-if="props_bind?.verticalAlign!=='top'" class="empty-inline" style="height: 0.28rem;"></div>
    <el-button v-bind.sync="props_bind" :type="props_bind.btnType" :disabled="props_bind?.isDisable">{{ props_bind?.btnName }}</el-button>
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
  name: 'FMButton',
  compType: 'FMButton',
  title: '按钮',
  cId: '',
  type: 'comp',
  z_props: [].concat(commonProps(['isDisable', 'showCondition',  'eventsType','events','eventsFields']), [
    {sort: -1, name: '组件类型', key: 'type', value: 'FMButton', type: 'input', isDisable: !0, isRequire: !1, col: 24},
// {sort: 1, name: '栅格（按钮组内不生效）', key: 'col', value: 6, type: 'slider', min: 1, max: 24, isRequire: !0, col: 24},
    // {sort: 5.1, name: '垂直对齐（按钮组内不生效）', key: 'verticalAlign', value: 'form', type: 'radio', options: [{label: '表单', value: 'form'}, {label: '顶部', value: 'top'}], isRequire: !1, col: 24},
    {sort: 5.2, name: '按钮名称', key: 'btnName', value: '按钮', type: 'input', isRequire: !1, col: 24},
    {
      sort: 5.3, name: '按钮类型', key: 'btnType', value: 'primary', type: 'select', isRequire: !1, col: 24,
      options: [
        {label: 'default（白）', value: 'default'},
        {label: 'primary（蓝）', value: 'primary'},
        {label: 'success（绿）', value: 'success'},
        {label: 'warning（黄）', value: 'warning'},
        {label: 'danger（红）', value: 'danger'},
        {label: 'info（灰）', value: 'info'},
        {label: 'text（文字）', value: 'text'},
      ]
    },
  ])
}
</script>
<style lang="scss" scoped>
</style>
