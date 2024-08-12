<template>
  <DragElement v-bind="$attrs" v-on="$listeners" class="FMButtons">
    <div v-if="props_bind?.verticalAlign!=='top'" style="height: 0.28rem;"></div>
    <Draggable :invertSwap="!1" :swapThreshold="0.3" v-model="childrenModel" class="el-row form-buttons" :class="{empty:!childrenModel?.length,[props_bind?.align]:!0}" handle=".drag-element-handler" ghostClass="ghost" :forceFallback="false" :group="{name:'buttons',pull:!1,put:layoutPut}" :sort="true">
      <component v-for="(v,i) in childrenModel" v-on.stop="$listeners" :stage="children" :props="v.z_props" :node="v" :key="v.cId" :cId="v.cId" :is="v"></component>
    </Draggable>
  </DragElement>
</template>
<script setup>
import Draggable from 'vuedraggable';
import DragElement from "../DragElement.vue";
import {computed, getCurrentInstance, onMounted, ref, useAttrs, watch} from "vue";
import {getProps} from "../../config";

const {proxy} = getCurrentInstance();
const attrs = useAttrs();
const props_bind = computed(() => getProps(attrs.props));

const props = defineProps({
  children: {type: Array, default: () => []}
})
const childrenModel = computed({
  set: v => proxy.$emit('update:children', proxy.$$lodash.flattenDeep(v)),
  get: () => props.children
})

function layoutPut(to, form, item) {
  //值允许按钮放置
  if (item.getAttribute('data-comp-type') !== 'FMButton') {
    return !1;
  }
  return !0
}

</script>
<script>
import {getProps} from "../../config";
import {commonProps} from "@/components/FMGenerator/FMDesigner/config/defaultConfigProps";

export default {
  name: 'FMButtons',
  compType: 'FMButtons',
  title: '按钮组',
  cId: '',
  type: 'comp',
  children: [],
  z_props: [].concat(commonProps(['col']), [
    {sort: 5.3, name: '对齐方式', key: 'align', value: 'right', type: 'radio', options: [{label: '左', value: 'left'}, {label: '中', value: 'center'}, {label: '右', value: 'right'}], isRequire: !1, col: 24},
    {sort: 5.1, name: '垂直对齐', key: 'verticalAlign', value: 'form', type: 'radio', options: [{label: '表单', value: 'form'}, {label: '顶部', value: 'top'}], isRequire: !1, col: 24},
  ])
}
</script>
<style lang="scss" scoped>
@import "../dragElement.scss";

.DragElement:after {
  content: none;
}

.el-row {
  &.empty {
    height: 32px !important;
  }

  &.empty:after {
    content: '只允许放入按钮组件' !important;
  }
}

.form-buttons {
  .el-col {
    float: none;
    width: auto;
    display: inline-block;
    height: auto !important;
  }

  ::v-deep(.el-form-item) {
    margin-bottom: 0 !important;
  }

  ::v-deep(.empty-inline) {
    display: none;
  }
}
</style>
