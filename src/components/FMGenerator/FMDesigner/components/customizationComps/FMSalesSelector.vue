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
import {commonProps} from "../../config/defaultConfigProps";

export default {
  name: 'FMSalesSelector',
  compType: 'FMComponent',
  title: '销售品',
  cId: '',
  type: 'comp',
  z_props: [].concat(
      commonProps(
          ['col', 'key', 'isRequire', 'value', 'name', 'placeholder', 'showCondition', 'relevance', 'eventsType', 'events', 'eventsFields'],
          {
            events: ['result_init_getpromInfo', 'crm_offer'],
            name: '销售品',
          }
      ),
      [
        {sort: -1, name: '组件类型', key: 'typeName', value: 'FMSalesSelector', type: 'input', isDisable: !0, isRequire: !1, col: 24},
        {isHidden: !0, key: 'component', value: 'SalesSelector'},
      ]
  )
}
</script>
<style lang="scss" scoped>
</style>
