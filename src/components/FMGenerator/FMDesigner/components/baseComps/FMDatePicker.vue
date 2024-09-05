<template>
  <DragElement v-bind="$attrs" v-on="$listeners">
    <el-date-picker type="date" :editable="!1" :disabled="props_bind?.isDisable"></el-date-picker>
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
  name: 'FMDatePicker',
  compType: 'FMDatePicker',
  title: '日期选择',
  cId: '',
  type: 'comp',
  z_props: [].concat(commonProps(), [
    {sort: -1, name: '组件类型', key: 'type', value: 'FMDatePicker', type: 'input', isDisable: !0, isRequire: !1, col: 24},
    {
      sort: 5.1, name: '选择限制', key: 'limit', value: '无限制', type: 'select', clearable: !1, isRequire: !1, col: 24,
      options: [
        {label: '无限制', value: '无限制'},
        {label: '只能选当前日期之前', value: '之前'},
        {label: '只能选当前日期之后', value: '之后'},
      ],
    },
    {sort: 5.2, name: '格式化', key: 'format', value: 'yyyy-MM-dd', type: 'input', isRequire: !1, col: 24},
    {
      sort: 5.3, name: '选择类型', key: 'dateType', value: 'FMDatePicker', type: 'select', isRequire: !1, col: 24, clearable: !1,
      options: [
        {label: '年月日', value: 'FMDatePicker', format: 'yyyy-MM-dd'},
        {label: '年月日范围', value: 'FMDateRangePicker', format: 'yyyy-MM-dd'},
        {label: '年月日时分秒', value: 'FMDateTimePicker', format: 'yyyy-MM-dd HH:mm:ss'},
        {label: '年月日时分秒范围', value: 'FMDateTimeRangePicker', format: 'yyyy-MM-dd HH:mm:ss'},
        {label: '月份', value: 'FMMonthPicker', format: 'yyyy-MM'},
        {label: '月份范围', value: 'FMMonthRangePicker', format: 'yyyy-MM'},
        {label: '年份', value: 'FMYearPicker', format: 'yyyy'},
        {label: '多个日期', value: 'FMDatesPicker', format: 'yyyy-MM-dd'},
        {label: '多个月份', value: 'FMMonthsPicker', format: 'yyyy-MM'},
        {label: '多个年份', value: 'FMYearsPicker', format: 'yyyy'},
      ],
      onChange({vm, item}) {
        vm.formData.format = item?.options?.find(o => o.value === vm.formData.dateType)?.format ?? '';
      }
    },
  ])
}
</script>
<style lang="scss" scoped>
</style>
