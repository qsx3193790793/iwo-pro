<template>
  <div class="MonacoEditor" ref="MonacoEditorRef" :style="{height}"></div>
</template>

<script setup>
import * as monaco from "monaco-editor";
import {getCurrentInstance, ref, nextTick, watch} from "vue";

const {proxy} = getCurrentInstance();

const MonacoEditorRef = ref();
const MonacoEditorInstant = ref();

const props = defineProps({
  value: {type: String, default: null},
  language: {type: String, default: 'json'},
  height: {type: String, default: '1.2rem'}
});

// 当他进入时值为空情况 在监听变化赋值
watch(() => props.value, () => !props.value && MonacoEditorInstant.value?.setValue(props.value));

function init() {
  MonacoEditorInstant.value = monaco.editor.create(MonacoEditorRef.value, {
    theme: 'hc-light',
    value: props.value, // 默认显示的值
    language: props.language,
    folding: true, // 是否折叠
    foldingHighlight: true, // 折叠等高线
    foldingStrategy: "auto", // 折叠方式
    showFoldingControls: "always", // 是否一直显示折叠
    disableLayerHinting: true, // 等宽优化
    emptySelectionClipboard: false, // 空选择剪切板
    selectionClipboard: false, // 选择剪切板
    automaticLayout: true, // 自动布局
    codeLens: true, // 代码镜头
    scrollBeyondLastLine: false, // 滚动完最后一行后再滚动一屏幕
    colorDecorators: true, // 颜色装饰器
    accessibilitySupport: "on", // 辅助功能支持"auto" | "off" | "on"
    lineNumbers: "on", // 行号 取值： "on" | "off" | "relative" | "interval" | function
    lineNumbersMinChars: 4, // 行号最小字符   number
    enableSplitViewResizing: false,
    readOnly: false, //是否只读  取值 true | false
    fontSize: 14,
    scrollbar: {
      horizontalScrollbarSize: 6,
      horizontalSliderSize: 6,
      verticalScrollbarSize: 6,
      verticalSliderSize: 6,
    }
  });
  MonacoEditorInstant.value.onDidChangeModelContent(() => {
    const v = MonacoEditorInstant.value.getValue();
    proxy.$emit('input', v);
    proxy.$emit('change', v);
  });
}

nextTick(() => init());
</script>
<style lang="scss" scoped>
.MonacoEditor {
  border: 1px solid #DCDFE6;
  border-radius: 4px;
  padding: 8px;
}

.is-error .MonacoEditor {
  border: 1px solid #F56C6C;
}
</style>
