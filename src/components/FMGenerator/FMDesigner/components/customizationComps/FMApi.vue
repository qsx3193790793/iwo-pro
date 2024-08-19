<template>
  <FMButtons v-bind="$attrs" v-on="$listeners"></FMButtons>
</template>
<script setup>
import FMButtons from "../layoutComps/FMButtons";
import {computed, getCurrentInstance, useAttrs} from "vue";
import {getProps} from "../../config";

const {proxy} = getCurrentInstance();

const props_bind = computed(() => getProps(useAttrs().props));

</script>
<script>
import FMButton from "../baseComps/FMButton";
import {commonProps} from "@/components/FMGenerator/FMDesigner/config/defaultConfigProps";
import {$$deepmerge} from "@/utils";

const cloneFMButton = $$deepmerge(FMButton);
cloneFMButton.z_props.forEach(zp => ((zp.key === 'eventsType' && (zp.value = '接口')), zp));

export default {
  name: 'FMApi',
  compType: 'FMButtons',
  title: '接口',
  cId: '',
  type: 'comp',
  children: [cloneFMButton],
  z_props: [].concat(commonProps(['col']), [
    {sort: -1, name: '组件类型', key: 'typeName', value: 'FMApi', type: 'input', isDisable: !0, isRequire: !1, col: 24},
    {sort: 5.3, name: '对齐方式', key: 'align', value: 'center', type: 'radio', options: [{label: '左', value: 'left'}, {label: '中', value: 'center'}, {label: '右', value: 'right'}], isRequire: !1, col: 24},
    {sort: 5.1, name: '垂直对齐', key: 'verticalAlign', value: 'form', type: 'radio', options: [{label: '表单', value: 'form'}, {label: '顶部', value: 'top'}], isRequire: !1, col: 24},
  ])
}
</script>
<style lang="scss" scoped>
</style>
