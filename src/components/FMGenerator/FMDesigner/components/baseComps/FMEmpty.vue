<template>
  <DragElement v-bind="$attrs" v-on="$listeners" class="mine-row-divider-empty">
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
  name: 'FMEmpty',
  compType: 'divider-empty',
  title: '占位空间',
  cId: '',
  type: 'comp',
  z_props: [].concat(commonProps(['col'], [
    {sort: -1, name: '组件类型', key: 'type', value: 'FMEmpty', type: 'input', isDisable: !0, isRequire: !1, col: 24},
  ]))
}
</script>
<style lang="scss" scoped>
.mine-row-divider-empty {
  background: repeating-linear-gradient(135deg, #f3f3f3 0%, #ffffff 10%) repeat;
  background-size: 40px 40px;
}
</style>
