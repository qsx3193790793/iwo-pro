<template>
  <DragElement v-bind="$attrs" v-on="$listeners">
    <el-input v-bind.sync="props_bind" disabled>
      <template #append>
        <el-button icon="el-icon-search"/>
      </template>
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
import {commonProps, keysFinder} from "../../config/defaultConfigProps";

export default {
  name: 'FMOrderSalesSelector',
  compType: 'FMComponent',
  title: '订单销售品',
  cId: '',
  type: 'comp',
  z_props: [].concat(
      commonProps(
          ['col', 'key', 'isRequire', 'value', 'name', 'placeholder', 'showCondition', 'relevance', 'reqFields', 'eventsType', 'events', 'eventsFields'],
          {
            events: ['result_init_customerOrderDetail'],
            name: '订单销售品',
          }
      ),

      [
        {sort: -1, name: '组件类型', key: 'typeName', value: 'FMOrderSalesSelector', type: 'input', isDisable: !0, isRequire: !1, col: 24},
        {isHidden: !0, key: 'component', value: 'OrderSalesSelector'},
        {
          sort: 10.1, name: '绑定入参', key: 'reqFields', value: [{label: 'orderId', value: ''}], type: 'component', component: 'OptionSelector', isRequire: !1, col: 24,
          attrs: {
            formPlaceholder: '入参字段', toPlaceholder: '绑定表单字段',
            handleValueKeys({vm}) {
              return [
                {
                  label: '',
                  options: vm.formConfig.fieldsArray
                }
              ]
            },
            handleKeys({vm}) {
              return [
                {label: '订单编号(orderId)', value: 'orderId'}
              ]
            }
          }
        },
      ]
  )
}
</script>
<style lang="scss" scoped>
</style>
