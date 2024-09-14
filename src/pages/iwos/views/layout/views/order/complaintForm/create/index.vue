<template>
  <div class="one-screen">
    <div class="Pagehead public-background">
      <CustomerProfile ref="CustomerProfileRef" @change="change" @diagnosisChange="diagnosisChange" @reset="reset"></CustomerProfile>
    </div>
    <ELScrollbar class="one-screen-fg1 public-background create-order-container">
      <!--      <div class="create-order-header">投诉单</div>-->
      <div class="create-order-form">
        <FormModel v-if="formConfig" ref="FormModelRef" :formConfig="formConfig" @reset="onFormModelReset" :rootParams="rootParams">
          <template #ext="{root}">
            <FileUploader ref="FileUploaderRef" :root="root"></FileUploader>
          </template>
        </FormModel>
      </div>
    </ELScrollbar>
  </div>
</template>

<script setup>
import {getCurrentInstance, onMounted, ref, nextTick} from "vue";
import FileUploader from "../components/FileUploader";
import CustomerProfile from "../../../../../../components/CustomerProfile.vue";
import FormModel from "@/components/FMGenerator/FormModel";
import {parseFormModel} from "@/components/FMGenerator/FMDesigner/config/index";
import template from "@/pages/iwos/fmDesignerComps/template/投诉单模板.js";

const {proxy} = getCurrentInstance();
const CustomerProfileRef = ref();
const FormModelRef = ref();
const FileUploaderRef = ref();
const formConfig = ref();
const rootParams = ref(null);//设备号定位数据

//接收开始init
function change(v) {
  // reset();
  rootParams.value = v;
  nextTick(() => FormModelRef.value?.init());
}

function reset() {
  rootParams.value = null;
  formConfig.value = parseFormModel(proxy.$$deepmerge(template.json));
  FileUploaderRef.value?.reset();
}

function onFormModelReset() {
  reset();
  CustomerProfileRef.value.reset();
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
  overflow: hidden;
  flex-shrink: 0;
  flex-grow: 0;
  // height: 270px;
  margin-bottom: 12px;
}

.create-order-container {
  .create-order-header {
    font-size: 18px;
    line-height: 3;
    border-bottom: 1PX solid #eeeeee;
    position: sticky;
    top: 0;
    z-index: 1;
    padding: 0 20px !important;
    background-color: rgb(241, 247, 253);
    font-weight: bold;
  }

  .create-order-form {
    padding: 6px 20px !important;
  }
}
</style>
