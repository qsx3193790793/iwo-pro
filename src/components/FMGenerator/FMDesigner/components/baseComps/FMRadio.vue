<template>
  <DragElement v-bind="$attrs" v-on="$listeners">
    <el-radio-group v-bind.sync="props_bind" :disabled="props_bind?.isDisable">
      <el-radio-button v-for="(ev,i) in options" :key="ev.value+i" :label="ev.value" :style="{width: `calc(100% / ${options?.length||2})`}" border>{{ ev.label }}</el-radio-button>
    </el-radio-group>
  </DragElement>
</template>
<script setup>
import DragElement from "../DragElement.vue";
import {computed, getCurrentInstance, useAttrs} from "vue";
import {getProps} from "../../config";

const {proxy} = getCurrentInstance();

const props_bind = computed(() => getProps(useAttrs().props));

const options = computed(() => {
  const example = [{label: '预览1', value: '预览1'}, {label: '预览2', value: '预览2'}];
  if (props_bind.value.optionsType === '静态数据') return props_bind.value.optionsStaticValue.length ? props_bind.value.optionsStaticValue : example;
  return example;
})

</script>
<script>
import {getProps} from "../../config";
import {commonProps, optionsProps} from "../../config/defaultConfigProps";

export default {
  name: 'FMRadio',
  compType: 'FMRadio',
  title: '单选框',
  cId: '',
  type: 'comp',
  z_props: [].concat(commonProps(), optionsProps(4.5), [
    {sort: -1, name: '组件类型', key: 'type', value: 'FMRadio', type: 'input', isDisable: !0, isRequire: !1, col: 24},
  ])
}
</script>
<style lang="scss" scoped>
</style>
