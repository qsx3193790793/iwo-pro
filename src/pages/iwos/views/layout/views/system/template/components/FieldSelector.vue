<template>
  <div>
    <el-table ref="table" :data="list" max-height="200px" border>
      <el-table-column type="index" align="center" width="50"></el-table-column>
      <el-table-column label="字段名称" prop="name" width="200" show-overflow-tooltip resizable></el-table-column>
      <el-table-column label="字段标题" prop="title" show-overflow-tooltip resizable></el-table-column>
      <el-table-column label="字段说明" prop="comment" show-overflow-tooltip resizable></el-table-column>
      <el-table-column label="字段类型" prop="type" show-overflow-tooltip resizable>
        <template #default="{row}">
          {{ type2name(row.type) }}
        </template>
      </el-table-column>
      <el-table-column v-if="!root.vm.disabled" align="center" width="440">
        <template #header="{ row }">
          <el-select v-model="selectValue" placeholder="输入字段标题进行搜索，选择添加" :remote-method="remoteMethod" :loading="loading" style="width: 260px;" filterable remote @change="handleChange">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
          <el-button class="quote-trigger" type="text" icon="el-icon-files" @click="isBatchQuoteTemplateShow=!0" title="批量选择字段">批量</el-button>
          <el-button class="quote-trigger" type="text" icon="el-icon-document-copy" @click="isQuoteTemplateShow=!0" title="复用已配置的模板字段列表和模板内容">复用</el-button>
        </template>
        <template #default="{ row,$index }">
          <el-button v-if="['TPL0100', 'TPL0101'].includes(root.vm.formData.smallType)" type="primary" @click="handleInsert(row)">插入</el-button>
          <el-button type="danger" @click="handleDelete(row,$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <MDialog v-if="isQuoteTemplateShow" v-model="isQuoteTemplateShow" width="90%" height="70vh" title="选择模板" onScreen>
      <QuoteComponent is-quote @onQuote="onQuote"></QuoteComponent>
    </MDialog>
    <MDialog v-if="isBatchQuoteTemplateShow" v-model="isBatchQuoteTemplateShow" width="90%" height="70vh" title="选择字段" onScreen>
      <BatchQuoteComponent is-batch-quote @onBatchQuote="onBatchQuote"></BatchQuoteComponent>
    </MDialog>
  </div>
</template>

<script setup>
import {computed, getCurrentInstance, ref} from "vue";
import MDialog from '@/components/MDialog';
import QuoteComponent from '../index';
import BatchQuoteComponent from '../field/index';
import {getTypePrefix, type2name} from "../config";

const {proxy} = getCurrentInstance();
const props = defineProps({
  root: {type: Object, default: null},
  value: {type: Array, default: () => []},
});

const emitter = defineEmits([]);

const isQuoteTemplateShow = ref(false);
const isBatchQuoteTemplateShow = ref(false);
const loading = ref(false);

const list = computed({
  get: () => {
    console.log(props.value);
    return props.value
  },
  set: v => {
    console.log(v);
    proxy.$emit('input', v)
  }
});

function onQuote(data) {
  props.root.vm.formData.verbalTrickContent = data.verbalTrickContent || '';
  list.value = data?.fieldConfigs || [];
  isQuoteTemplateShow.value = !1;
}

function onBatchQuote(data) {
  const exists = list.value.map(o => o.fieldId);
  list.value = [].concat(list.value, (data || []).filter(d => !exists.includes(d.fieldId)));
  isBatchQuoteTemplateShow.value = !1;
}

function handleInsert(row) {
  const textarea = props.root?.vm?.$refs?.verbalTrickContent?.[0]?.$refs?.textarea;
  if (!textarea) return;
  const arr = textarea.value.split('');
  arr.splice(textarea.selectionStart, textarea.selectionEnd - textarea.selectionStart, `{{${getTypePrefix(row.type)}${row.name}}}`);
  props.root.vm.formData.verbalTrickContent = arr.join('');
}

const options = ref([]);

async function remoteMethod(query) {
  if (!query) return options.value = [];
  const {res, err} = await proxy.$$api.modelFields.lists({params: {title: query}});
  options.value = (res?.list || []).map(r => Object.assign(r, {label: `${r.title}(${r.name})`, value: r.fieldId}))
}

const selectValue = ref();

function handleChange(r) {
  const exists = list.value.find(o => o.fieldId === r);
  if (exists) return proxy.$$Toast({message: `字段已存在`, type: 'error'});
  const finder = options.value.find(o => o.fieldId === r);
  if (finder) {
    selectValue.value = '';
    list.value.push(finder);
  }
}

function handleDelete(row, $index) {
  list.value.splice($index, 1);
}

</script>
<script>
export default {
  dicts: ['template_field_type']
}
</script>
<style lang="scss" scoped>
.quote-trigger {
  margin-left: 10px;
}
</style>
