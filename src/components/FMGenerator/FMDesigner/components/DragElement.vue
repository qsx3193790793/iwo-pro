<template>
  <el-col class="DragElement" :class="{active:$attrs.node.cId===$$store.getters['fmDesigner/GET_ACTIVE_COMP_ID']}" :data-id="$attrs.node.cId" :span="(props_bind.col||8)" @click.native.stop="$emit('layout-click',$attrs.node)">
    <div class="drag-element-handler iconfont icon-yidong"></div>
    <div class="drag-element-bottom-tools">
      <span class="copy iconfont icon-fuzhi" title="复制" @click.stop="$emit('layout-copy',$attrs.node,$attrs.stage)"></span>
      <span class="del iconfont icon-shanchu" title="删除" @click.stop="$emit('layout-del',$attrs.node,$attrs.stage)"></span>
    </div>
    <el-form-item>
      <template v-if="props_bind.name" #label>
        <div class="slot-label">
          <div v-html="props_bind.name" :class="{require:props_bind.isRequire}"></div>
          <div v-html="props_bind.subName" class="sub-name"></div>
        </div>
      </template>
      <slot></slot>
    </el-form-item>
  </el-col>
</template>
<script setup>
import {getProps} from "../config";
import {computed, useAttrs} from "vue";

const props_bind = computed(() => getProps(useAttrs().props));

</script>
<style lang="scss" scoped>
@import "./dragElement.scss";
</style>
