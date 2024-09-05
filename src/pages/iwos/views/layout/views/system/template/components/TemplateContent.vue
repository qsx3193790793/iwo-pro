<template>
  <div v-html="content" class="TemplateContent" contenteditable="true" :style="{height:`${(0.13*1.5*rows)+0.1}rem`}"></div>
</template>

<script setup>
import {computed, getCurrentInstance} from "vue";
import {getTypePrefix, type2name} from "../config";

const {proxy} = getCurrentInstance();
const props = defineProps({
  root: {type: Object, default: null},
  value: {type: String, default: null},
  rows: {type: Number, default: 2},
});

const emitter = defineEmits([]);

const content = computed(() => {
  if (!props.value) return ''
  const fieldListMap = (props.root.vm.formData.fieldList || []).reduce((t, c) => ((t[c.resValue] = c.title), t), {});
  const matches = props.root.vm.formData.verbalTrickContent2.match(/\{\{.*?\}\}/g);
  console.log('computed', fieldListMap, matches);
  let content = props.root.vm.formData.verbalTrickContent2;
  matches?.forEach(key => {
    const rk = key.replace(/[\{\}]/g, '');
    content = content.replace(key, `<span class="el-tag el-tag-span" contenteditable="false">${fieldListMap[rk]}</span>`);
  });
  console.log(content)
  return content;
});

</script>
<style lang="scss" scoped>
.TemplateContent {
  border: 1px solid #DCDFE6;
  border-radius: 4px;
  line-height: 1.5;
  padding: 5px 15px;
  box-sizing: border-box;
  width: 100%;
  font-size: 13px;
  overflow: auto;

  &:focus {
    outline: 0;
    border-color: #409EFF;
  }

  &:empty:before {
    content: '请输入';
    opacity: 0.36;
  }

  ::v-deep(.el-tag-span) {
    font-size: inherit;
    user-select: none;
    cursor: pointer;
  }
}

.is-error .TemplateContent, .is-error .TemplateContent:focus {
  border-color: #F56C6C;
}
</style>
