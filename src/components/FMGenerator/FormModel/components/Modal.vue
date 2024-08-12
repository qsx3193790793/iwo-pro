<template>
  <MDialog v-bind="$attrs" ref="MDialogRef" :title="title" :width="width">
    <slot :handleClose="MDialogRef?.handleClose"></slot>
    <template #footer="{DialogRef}">
      <el-button type="primary" plain @click="DialogRef?.handleClose()">返回</el-button>
    </template>
  </MDialog>
</template>

<script setup>
import {ref} from "vue";
import MDialog from '@/components/MDialog';

const props = defineProps({
  title: {type: String, default: ''},
  width: {type: String, default: '60%'},
})

const MDialogRef = ref(null);

</script>
<style scoped lang="scss">
</style>
