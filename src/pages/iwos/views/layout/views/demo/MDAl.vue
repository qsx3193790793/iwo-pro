<template>
  <el-dialog v-bind="$attrs" v-on="$listeners" :visible.sync="visibleModel" destroy-on-close close-on-click-modal>
    <div class="clear-last">
      <slot></slot>
    </div>
  </el-dialog>
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
