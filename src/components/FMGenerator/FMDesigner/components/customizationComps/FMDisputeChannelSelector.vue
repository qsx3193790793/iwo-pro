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
import useEvents from "@/components/FMGenerator/FMDesigner/config/events";

export default {
  name: 'FMDisputeChannelSelector',
  compType: 'FMComponent',
  title: '争议渠道',
  cId: '',
  type: 'comp',
  z_props: [].concat(
      commonProps(
          ['col', 'key', 'isRequire', 'value', 'name', 'placeholder', 'showCondition', 'relevance', 'eventsType', 'events', 'eventsFields'],
          {
            events: ['result_FMCascader_disputeChannel'],
            name: '争议渠道',
          }
      ),
      [
        {sort: -1, name: '组件类型', key: 'typeName', value: 'FMDisputeChannelSelector', type: 'input', isDisable: !0, isRequire: !1, col: 24},
        {isHidden: !0, key: 'component', value: 'DisputeChannelSelector'},
        {
          sort: 4.5, name: '数据源获取事件', key: 'optionsEvent', value: 'complaint_listChannelTree', type: 'select', isRequire: !1, col: 24,
          options({vm}) {
            const events = useEvents();
            return Object.keys(events).map(etk => ({label: events[etk].label, value: etk}))
          }
        },
        {sort: 4.6, name: '子父级互不关联', key: 'checkStrictly', value: true, type: 'radio', options: [{label: '是', value: true}, {label: '否', value: false}], isRequire: !1, col: 24},
      ]
  )
}
</script>
<style lang="scss" scoped>
</style>
