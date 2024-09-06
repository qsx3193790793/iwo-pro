<template>
  <div ref="quillRef" class="TemplateContent" :style="{height:`${(0.13*1.5*rows)+0.1}rem`}">
  </div>
</template>

<script setup>
import Quill from "quill";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import {computed, getCurrentInstance, onBeforeUnmount, onMounted, ref, watch} from "vue";
import {getTypePrefix} from "../config";

const BlockEmbed = Quill.import('blots/embed');

class TPCTag extends BlockEmbed {
  static create(v) {
    const node = super.create(v);
    const {value, title} = v;
    console.log('compiler2Html-BlockEmbed', node, v)
    if (v === true) return node;
    node.innerHTML = title;
    node.setAttribute('data-value', value);
    node.setAttribute('contenteditable', false);
    node.setAttribute('resize', 'none');
    return node;
  }

  static value(node) {
    console.log('compiler2Html-BlockEmbed-value', node)
    return {
      value: node.getAttribute('data-value'), title: node.innerHTML
    };
  }
}

TPCTag.blotName = 'TPCTag';
TPCTag.tagName = 'tpc-tag';
TPCTag.className = 'tpc-tag';

Quill.register('formats/dragon', TPCTag);

const {proxy} = getCurrentInstance();

const props = defineProps({
  root: {type: Object, default: null},
  value: {type: String, default: null},
  rows: {type: Number, default: 2},
  disabled: {type: Boolean, default: false},
});

const emitter = defineEmits([]);

const options = ref({
  theme: "snow",
  bounds: document.body,
  debug: "warn",
  modules: {toolbar: null},
  placeholder: "请输入",
  readOnly: props.disabled,
})

const QuillInst = ref();
const quillRef = ref();

const currentContent = ref();

function compiler2Html() {
  if (!props.value) return '';
  const fieldListMap = (props.root.vm.formData.fieldList || []).reduce((t, c) => ((t[c.resValue] = c.title), t), {});
  console.log('compiler2Html-1', fieldListMap);
  let content = props.value;
  content.match(/\{\{.*?\}\}/g)?.forEach(key => {
    const rk = key.replace(/[\{\}]/g, '');
    const reg = new RegExp(`\\{\\{${rk.replace(/\$/g,'\\$')}\\}\\}`, 'g');
    console.log('compiler2Html-2', fieldListMap, rk);
    content = content.replace(reg, fieldListMap[rk] ? `<tpc-tag class="tpc-tag" data-value="${rk}" contenteditable="false" resize="none">${fieldListMap[rk] || ''}</tpc-tag>` : '');
  });
  content = content.split('\n').map(t => t ? `<p>${t}</p>` : `<p><br></p>`).join('');
  console.log('compiler2Html-3', fieldListMap, content);
  return content;
}

watch(() => props.value, () => {
  const content = compiler2Html();
  if (content !== currentContent.value) QuillInst.value?.pasteHTML(currentContent.value = content);
});

function init() {
  QuillInst.value = new Quill(quillRef.value, options.value);
  QuillInst.value.pasteHTML(currentContent.value = compiler2Html());
  QuillInst.value.on("text-change", (delta, oldDelta, source) => {
    let html = QuillInst.value.root.innerHTML;
    html.match(/<tpc-tag class="tpc-tag" data-value=".*?" contenteditable="false" resize="none">.*?<\/tpc-tag>/g)?.forEach(t => {
      console.log('compiler2Html-cp', t, /data-value="(.*?)"/g.exec(t))
      html = html.replace(t, `{{${/data-value="(.*?)"/g.exec(t)?.[1]}}}`);
    });
    html = html.match(/<p>.*?<\/p>/g)?.map(t => {
      return t.replace(/<p>|<\/p>/g, '');
    }).join('\n').replace(/<br>/g, '\n');
    console.log('compiler2Html-emit', html);
    proxy.$emit("input", html);
  });
}

onMounted(() => init());

onBeforeUnmount(() => QuillInst.value = null);

defineExpose({
  insert(v) {
    const cursorPosition = QuillInst.value.getSelection(); // 获取光标位置
    QuillInst.value.insertEmbed(cursorPosition?.index || 0, 'TPCTag', v); // 在光标位置插入文本
  }
});

</script>
<style lang="scss" scoped>
.TemplateContent {
  border: 1px solid #DCDFE6;
  border-radius: 4px;
  line-height: 1.5;
  box-sizing: border-box;
  width: 100%;
  font-size: 13px;
  overflow: auto;

  &:focus {
    outline: 0;
    border-color: #409EFF;
  }
}

.is-error .TemplateContent, .is-error .TemplateContent:focus {
  border-color: #F56C6C;
}


</style>
