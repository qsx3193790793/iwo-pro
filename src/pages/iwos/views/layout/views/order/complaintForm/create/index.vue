<template>
  <div class="one-screen">
    <div class="Pagehead">
      <CustomerProfile @change="change" @diagnosisChange="diagnosisChange" @reset="reset"></CustomerProfile>
    </div>
    <ELScrollbar class="one-screen-fg1 public-background create-order-container">
      <!--      <div class="create-order-header">投诉单</div>-->
      <div class="create-order-form">
        <FormModel v-if="formConfig" ref="FormModelRef" :formConfig="formConfig">
          <template #ext="{root}">
            <FileUploader ref="FileUploaderRef" :root="root"></FileUploader>
          </template>
        </FormModel>
      </div>
    </ELScrollbar>
  </div>
</template>

<script setup>
import {getCurrentInstance, onMounted, ref} from "vue";
import FileUploader from "../components/FileUploader";
import CustomerProfile from "../../../../../../components/CustomerProfile.vue";
import FormModel from "@/components/FMGenerator/FormModel";
import {parseFormModel} from "@/components/FMGenerator/FMDesigner/config/index";
import template from "@/pages/iwos/fmDesignerComps/template/投诉单模板.js";

const {proxy} = getCurrentInstance();
const FormModelRef = ref();
const FileUploaderRef = ref();
const formConfig = ref();

function change() {
  reset();
  FormModelRef.value?.init();
}

function reset() {
  FormModelRef.value?.removeAllAppendItems();
  FormModelRef.value?.resetFormData();
  FileUploaderRef.value?.reset();
}

function diagnosisChange(v) {
  FormModelRef.value?.initFormData(v);
}

onMounted(() => {
  formConfig.value = parseFormModel(proxy.$$deepmerge(template.json));
});
</script>
<script>
export default {name: "ComplaintCreate"};
</script>
<style lang="scss" scoped>
.Pagehead {
  // height: 270px;
  margin-bottom: 12px;
}
</style>
