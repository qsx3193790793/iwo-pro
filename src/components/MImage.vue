<template>
  <Image v-bind="$attrs" class="MImage" :src="src||require('@assets/images/default_image.png')" :class="imageType" :fit="$attrs.fit||'cover'" :preview-src-list="src?[src]:null" :style="{'width':width,'height':height}" lazy preview-teleported hide-on-click-modal>
    <template #error>
      <Image fit="cover" :src="require('@assets/images/default_image.png')"></Image>
    </template>
  </Image>
</template>
<script setup>
import {Image} from 'element-ui';

const props = defineProps({
  src: {type: String, default: ''},
  width: {type: String, default: '100%'},//宽 默认自动占满父元素
  height: {type: String, default: '100%'},//高 默认自动占满父元素
  imageType: {type: String, default: 'rect'},//图片样式 圆-circle 方-rect 默认方
})

</script>
<style lang="scss" scoped>
.MImage {
  border-radius: 4px;

  &.circle {
    border-radius: 50%;
  }

  & > .el-image {
    width: 100%;
    height: 100%;
  }
}
</style>
