<!--容器组件-->
<template>
  <div class="DragElement FMBlock" :class="{active:$attrs.node.cId===$$store.getters['fmDesigner/GET_ACTIVE_COMP_ID']}" :data-id="$attrs.node.cId" @click.stop="$emit('layout-click',$attrs.node)">
    <div class="drag-element-handler iconfont icon-yidong"></div>
    <div class="drag-element-bottom-tools">
      <span class="copy iconfont icon-fuzhi" title="复制" @click.stop="$emit('layout-copy',$attrs.node)"></span>
      <span class="del iconfont icon-shanchu" title="删除" @click.stop="$emit('layout-del',$attrs.node)"></span>
    </div>
    <el-collapse v-model="collapseActive">
      <el-collapse-item :class="{'is-disabled':!props_bind.name}" :name="props_bind.name||$attrs.cId">
        <template v-if="props_bind.name" #title>
          <div class="main-form-title">
            {{ props_bind.name }}<span v-if="props_bind.subName" class="sub-title-name" v-html="props_bind.subName"></span>
            <div class="collapse-mark" @click.stop></div>
            <span class="collapseTag">{{ collapseActive.includes(props_bind.name || $attrs.cId) ? '收起' : '展开' }}</span>
            <i class="el-icon-arrow-right" :class="{'is-active':collapseActive.includes(props_bind.name||$attrs.cId)}"></i>
          </div>
        </template>
        <Draggable :invertSwap="!1" :swapThreshold="0.2" direction="vertical" v-model="childrenModel" class="el-row" :class="{empty:!childrenModel.length}" handle=".drag-element-handler" ghostClass="ghost" :forceFallback="false" :group="{name:'comp',pull:!1,put:layoutPut}" :sort="true">
          <component v-for="(v,i) in childrenModel" v-on.stop="get$listeners()" :children.sync="v.children" :stage="children" :props="v.z_props" :node="v" :key="v.cId" :cId="v.cId" :is="v"></component>
        </Draggable>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script setup>
import Draggable from 'vuedraggable';
import {computed, getCurrentInstance, ref, useAttrs, watch, watchEffect} from "vue";
import {getProps} from "../../config";
import {compsMap} from "@/components/FMGenerator/FMDesigner/config/comps";

const components = ref(compsMap);

const {proxy} = getCurrentInstance();
const attrs = useAttrs();
const props_bind = computed(() => getProps(attrs.props));

const props = defineProps({
  children: {type: Array, default: () => []}
});

const childrenModel = computed({
  set: v => proxy.$emit('update:children', proxy.$$lodash.flattenDeep(v)),
  get: () => props.children
})
const collapseActive = computed({
  get: () => props_bind.value?.name || attrs.cId,
  set: () => {
  }
});

watch(() => props_bind.value?.isBtnBlock, (nV, oV) => {
  if (nV === '按钮组') {
    const clone = proxy.$$deepmerge(components.value['FMButtons']);
    clone.cId = `FMButtons_ID_${proxy.$$getUUID()}`;
    clone.z_props[0].value = 24;
    clone.z_props[0].isDisable = !0;
    childrenModel.value = [clone];
    return;
  }
  if (oV === '按钮组') childrenModel.value = [];
})

function layoutPut(to, form, item) {
  if (props_bind.value?.isBtnBlock === '按钮组') {
    // if (item.getAttribute('data-comp-type') === 'FMButton') {
    //   return !0;
    // }
    return !1
  }
  // 不允许layout和按钮放置
  if (item.getAttribute('data-type') === 'layout'
      || item.getAttribute('data-comp-type') === 'FMButton') {
    return !1;
  }
  return !0
}

// 去除父级update:children避免被v-on监听后向上触发
function get$listeners() {
  return Object.keys(proxy.$listeners).reduce((t, k) => ((k !== 'update:children' && (t[k] = proxy.$listeners[k])), t), {});
}

</script>
<script>
import {getProps} from "../../config";

export default {
  name: 'FMBlock',
  compType: '',
  title: '板块',
  cId: '',
  type: 'layout',
  children: [],
  z_props: [].concat([
    {
      sort: 4, name: '板块类型', key: 'isBtnBlock', value: '基础', type: 'radio', options: [{label: '基础', value: '基础'}, {label: '按钮组', value: '按钮组'}, {label: '隐藏域', value: '隐藏域'}], isRequire: !1, col: 24,
      onChange({vm}) {
        if (vm.formData.isBtnBlock === '基础') {
          return vm.formData.name = '板块名称', vm.formData.subName = '板块子名称';
        }
        vm.formData.name = '', vm.formData.subName = '';
      }
    },
    {
      sort: 5, name: '板块名称', key: 'name', value: '板块名称', type: 'input', isRequire: !1, col: 24,
      isShow({vm}) {
        return vm.formData.isBtnBlock === '基础'
      }
    },
    {
      sort: 6, name: '子板块名称', key: 'subName', value: '板块子名称', type: 'input', isRequire: !1, col: 24,
      isShow({vm}) {
        return vm.formData.isBtnBlock === '基础'
      }
    },
  ])
}
</script>
<style lang="scss" scoped>
@import "../dragElement.scss";

.DragElement:after {
  content: none;
}

.el-row {
  min-height: 48px !important;
}
</style>
