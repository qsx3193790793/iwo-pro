<template>
  <el-dialog v-bind.sync="$attrs" v-on="$listeners" ref="DialogRef" :top="top" :visible.sync="dialogVisibleModel" :close-on-click-modal="!1" destroy-on-close append-to-body>
    <template v-if="onScreen">
      <div class="inner" :style="{height:height,padding:`0 0.2rem`}">
        <slot></slot>
      </div>
    </template>
    <ELScrollbar v-else class="inner" :style="{height:height}">
      <slot></slot>
    </ELScrollbar>
    <template #footer>
      <slot name="footer" :DialogRef="DialogRef"></slot>
    </template>
  </el-dialog>
</template>
<script>
export default {inheritAttrs: !1}
</script>
<script setup>
import {computed, getCurrentInstance, nextTick, ref, watch} from "vue";

const {proxy} = getCurrentInstance();

const props = defineProps({
  value: {type: Boolean, default: false},
  onScreen: {type: Boolean, default: false},
  height: {type: String, default: '60vh'},
  top: {type: String, default: '10vh'},
})

const dialogVisibleModel = computed({
  get: () => props.value,
  set: v => {
    console.log('dialogVisibleModel', v)
    proxy.$emit('input', v)
  }
});

const DialogRef = ref(null);

function handleClose() {
  proxy.$emit('input', !1);
}

defineExpose({handleClose});
</script>
<style lang="scss" scoped>
::v-deep(.el-dialog__header) {
  border-bottom: 1PX solid #eee;
}

::v-deep(.el-dialog__footer) {
  border-top: 1PX solid #eee;
}

::v-deep(.el-dialog__body) {
  padding: 10px 0;
}

.inner {
  overflow: hidden;

  ::v-deep(.el-scrollbar__wrap) {
    padding: 0 20px;
  }
}
</style>
