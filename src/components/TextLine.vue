<template>
  <div class="text-line-container">
    <div v-for="(v,i) in list" class="text-line-item" :key="i" :style="{width: `calc(100% / ${v.col||col})`}">
      <div v-if="v.label" v-html="v.label" class="text-line-item-label" :style="{width:labelWidth}"></div>
      <div v-html="$$isEmpty(v.value)?'-':v.value" class="text-line-item-value"></div>
    </div>
  </div>
</template>
<script setup>

const props = defineProps({
  list: {type: Array, default: () => []},//数据 [{label,value,col},...]
  labelWidth: {type: String, default: '120px'},
  col: {type: Number, default: 1},//几列 一行
})

</script>
<style lang="scss" scoped>
.text-line-container {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-wrap: wrap;
  // color: #606266;
  font-size: inherit;
  width: 100%;

  & > .text-line-item {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    margin: 4px 0;


    & > .text-line-item-label {
      line-height: 1.5;
      text-align: right;
      margin-right: 6px;
      font-weight: bold;
      flex-grow: 0;
      flex-shrink: 0;
      letter-spacing: 1.5px;
    }

    & > .text-line-item-value {
      line-height: 1.5;
      flex-grow: 1;
      text-align: left;
    }
  }
}
</style>
