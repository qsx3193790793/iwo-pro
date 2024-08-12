<template>
  <MDialog v-bind.sync="$attrs" v-on="$listeners" ref="MDialogRef" width="90%" top="5vh" height="75vh" title="预览模板">
    <FormModel v-if="formConfig" ref="FormModelRef" :formConfig="formConfig"></FormModel>
    <template #footer="{DialogRef}">
      <el-button type="primary" plain @click="DialogRef?.handleClose()">返回</el-button>
    </template>
  </MDialog>
</template>

<script setup>
import {getCurrentInstance, onBeforeMount, ref, watch} from "vue";
import MDialog from '@/components/MDialog';
import FormModel from '@/components/FMGenerator/FormModel';
import {parseFormModel} from "@/components/FMGenerator/FMDesigner/config";

const {proxy} = getCurrentInstance();

const props = defineProps({
  pkid: {type: Object, default: null},//详情id
  json: {type: String, default: null},//直接展示json 不走pkid查询
});

const emitter = defineEmits([]);

const formConfig = ref();

async function getDetail() {
  if (props?.json) return formConfig.value = parseFormModel(JSON.parse(props?.json), true);
  const {res, err} = await proxy.$$api.template.detail({templateId: props.pkid.templateId, versionId: props.pkid.versionId})
  if (err) return;
  if (res?.formTemplateConfig?.formContent) {
    formConfig.value = parseFormModel(JSON.parse(res.formTemplateConfig.formContent), true);
  }
}

onBeforeMount(() => getDetail())

</script>
<style lang="scss" scoped>
::v-deep(.el-scrollbar__view) {
  height: 100%;
}

.AddDialog {
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: stretch;
  align-items: stretch;

  & > ::v-deep(.el-tabs__header) {
    flex-grow: 0;
    flex-shrink: 0;
  }

  & > ::v-deep(.el-tabs__content) {
    flex-grow: 1;
    overflow: hidden;

    & > .el-tab-pane {
      height: 100%;
      overflow: hidden;
    }
  }
}
</style>
