<template>
  <div class="one-screen">
    <div class="Pagehead">
      <CustomerProfile @change="change" @diagnosisChange="diagnosisChange"></CustomerProfile>
    </div>
    <ELScrollbar class="one-screen-fg1 public-background create-order-container">
      <div class="create-order-header">投诉单</div>
      <div class="create-order-form">
        <FormModel v-if="formConfig" ref="FormModelRef" :formConfig="formConfig">
          <FileUploader></FileUploader>
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
import testJson from "@/components/FMGenerator/FMDesigner/components/jsonComps/投诉单模板.js";

const {proxy} = getCurrentInstance();
const FormModelRef = ref();
const formConfig = ref();

function change() {
  FormModelRef.value?.init();
}

function diagnosisChange(v) {
  FormModelRef.value?.initFormData(v);
}

onMounted(() => {
  formConfig.value = parseFormModel(proxy.$$deepmerge(testJson.json));
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
