<template>
  <FMDesigner ref="FMDesignerRef" :fieldsArray="getFieldsArray" :quoteComponent="QuoteComponent" has-save @onSave="handleSave"></FMDesigner>
</template>

<script setup>
import FMDesigner from "@/components/FMGenerator/FMDesigner";
import {getCurrentInstance, onBeforeMount, ref} from "vue";
import QuoteComponent from '../index';

const {proxy} = getCurrentInstance();

const FMDesignerRef = ref();

const detail = ref()

//设计器获取字段名下拉
function getFieldsArray() {
  return detail.value?.fieldConfigs?.map(r => ({label: `${r.title}(${r.name})`, value: r.name})) || [];
}

async function getDetail() {
  const {res, err} = await proxy.$$api.template.detail(proxy.$route.params)
  if (err) return;
  detail.value = res;
  if (res?.formTemplateConfig?.formContent) {
    FMDesignerRef.value.loadJson(JSON.parse(res.formTemplateConfig.formContent));
  }
}

function handleSave(json) {
  proxy.$$Dialog.confirm(`你确定要保存吗？`, '提示', {cancelButtonText: '取消', confirmButtonText: '确定',}).then(async () => {
    const {res, err} = await proxy.$$api.template.update({
      data: Object.assign({}, detail.value, {
        formContent: JSON.stringify(json),
        formName: detail.value.formTemplateConfig?.formName,
        formId: detail.value.formTemplateConfig?.formId,
        fieldList: (detail.value.fieldConfigs || []).map(r => r.fieldId)
      })
    });
    if (err) return proxy.$$Toast({message: res?.msg || `操作失败`, type: 'error'});
    proxy.$store.commit('storage/REMOVE_TAB', proxy.$route.meta.name);
    return proxy.$$Toast({message: `操作成功`, type: 'success'});

  }).catch(proxy.$$emptyFn);
}

onBeforeMount(() => getDetail())
</script>
<style lang="scss" scoped>
</style>
