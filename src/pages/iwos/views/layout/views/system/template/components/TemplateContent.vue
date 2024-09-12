<template>
  <div ref="quillRef" class="TemplateContent" :style="{height:`${(0.13*1.5*rows)+0.1}rem`}" @click="onFocus">
  </div>
</template>

<script setup>
import Quill from "quill";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import {getCurrentInstance, onBeforeUnmount, onMounted, ref, watch, nextTick} from "vue";

const BlockEmbed = Quill.import('blots/embed');
const Delta = Quill.import('delta');

class TPCTag extends BlockEmbed {
  static create(v) {
    const node = super.create(v);
    const {value, title} = v;
    if (v === true) return node;
    node.innerHTML = title;
    node.setAttribute('contenteditable', false);
    node.setAttribute('value', value);
    return node;
  }

  static value(node) {
    return {
      value: node.getAttribute('value'), title: node.innerText
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

const QuillInst = ref();
const quillRef = ref();

const currentContent = ref();
const editorCache = ref();
const range = ref();

function compiler2Html() {
  if (!props.value) return '';
  const fieldListMap = (props.root.vm.formData.fieldList || []).reduce((t, c) => ((t[c.resValue] = `{{${c.title}}}`), t), {});
  let content = props.value;
  content.match(/\{\{.*?\}\}/g)?.forEach(key => {
    const rk = key.replace(/[\{\}]/g, '');
    const reg = new RegExp(`\\{\\{${rk.replace(/\$/g,'\\$')}\\}\\}`, 'g');
    content = content.replace(reg, fieldListMap[rk] ? `<tpc-tag class="tpc-tag" contenteditable="false" value="${rk}">${fieldListMap[rk] || ''}</tpc-tag>` : '');
  });
  content = content.split('\n').map(t => t ? `<p>${t}</p>` : `<p><br></p>`).join('');
  return content;
}

watch(() => props.value, () => {
  const content = compiler2Html();
  if (content !== currentContent.value) {
    QuillInst.value?.pasteHTML(currentContent.value = content);
  }
});

function onFocus() {
  QuillInst.value.focus();
  range.value = QuillInst.value.getSelection(true);
  console.log('onFocus', range.value?.length)
}

function blur() {
  let html = QuillInst.value.root.innerHTML;
  if (editorCache.value === html) return;
  editorCache.value = html;
  html.match(/<tpc-tag class="tpc-tag" contenteditable="false" value=".*?">.*?<\/tpc-tag>/g)?.forEach(t => {
    html = html.replace(t, `{{${/value="(.*?)"/g.exec(t)?.[1]}}}`);
  });
  html = html.match(/<p>.*?<\/p>/g)?.map(t => {
    return t.replace(/<p>|<\/p>/g, '');
  });
  html = html.join('\n').replace(/<br>/g, '');
  proxy.$emit("input", html);
}

function init() {
  QuillInst.value = new Quill(quillRef.value, {
    theme: "snow",
    bounds: document.body,
    debug: "warn",
    modules: {toolbar: null},
    placeholder: "请输入",
    readOnly: props.disabled,
  });
  QuillInst.value.enable(false);//解决富文本自动聚焦
  setTimeout(() => QuillInst.value.enable(true), 200);
  QuillInst.value.pasteHTML(currentContent.value = compiler2Html());
  QuillInst.value.on('text-change', function (delta, oldDelta, source) {
    //删除事件更新选区长度 选区删除后长度不更新导致问题
    if (delta?.ops?.some(op => op.delete) && range.value) range.value.length = 0;
  });
  QuillInst.value.root.addEventListener('blur', blur);
  QuillInst.value.root.addEventListener('paste', (e) => {
    e.preventDefault();
    let text = (e.clipboardData || window.clipboardData).getData('text');
    text.match(/\{\{.*?\}\}/g)?.forEach(key => {
      const rk = key.replace(/[\{\}]/g, '');
      const finder = (props.root.vm.formData.fieldList || []).find(fl => fl.title === rk);
      if (finder) text = text.replace(key, `{{${finder.resValue}}}`);
    });
    const range = QuillInst.value.getSelection(true); // 获取光标位置
    const d = new Delta().retain(range?.index).delete(range?.length).insert(text);
    QuillInst.value.updateContents(d);
    QuillInst.value.setSelection(range.index, 0);
  }, true);
}

onMounted(() => init());

onBeforeUnmount(() => QuillInst.value = null);

defineExpose({
  enable(flag = true) {
    QuillInst.value.enable(flag);
  },
  insert(v) {
    QuillInst.value.focus();
    nextTick(() => {
      console.log('insert', range.value?.index, range.value?.length, QuillInst.value.getContents());
      const d = new Delta().retain(range.value?.index || 0).delete(range.value?.length || 0).insert({TPCTag: v});
      QuillInst.value.updateContents(d);
      // QuillInst.value.setSelection(range.value?.length || 0, 0);
      if (range.value) range.value.length = 0;
    });
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
