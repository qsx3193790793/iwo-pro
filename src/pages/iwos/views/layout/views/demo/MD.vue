<template>
  <div class="" style="width: 100%;">
    <div class="el-dialog" style="width: 100%;">
      <div class="el-dialog__header" style="width: 100%;position: relative;">
        <span class="el-dialog__title">{{ $attrs.title || '输入标题' }}</span>
        <button type="button" class="el-dialog__headerbtn">
          <i class="el-dialog__close el-icon el-icon-close"></i>
        </button>
      </div>
      <div class="el-dialog__body">
        <slot></slot>
        <div style="clear: both"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {computed, getCurrentInstance, nextTick, onBeforeMount, ref} from "vue";

const {proxy} = getCurrentInstance();

const props = defineProps({
  visible: {type: Boolean, default: !1}
});

const visibleModel = computed({
  set(e) {
    proxy.$emit('update:visible', e)
  },
  get() {
    return props.visible
  },
})

onBeforeMount(() => {
});
</script>
<style lang="scss" scoped>
</style>
