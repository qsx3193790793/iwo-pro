<!--独立打开页面-->
<template>
  <div class="window">
    <ComplaintCreate v-if="is==='ComplaintCreate'"></ComplaintCreate>
    <ComplaintDetail v-else-if="is==='ComplaintDetail'"></ComplaintDetail>
    <div v-else-if="isLoad" class="default-empty">页面不存在...</div>
  </div>
</template>

<script setup>
import {getCurrentInstance, ref, onMounted, onBeforeMount} from "vue";
import ComplaintCreate from "../layout/views/order/complaintForm/create";
import ComplaintDetail from "../layout/views/order/complaintForm/detail";

const {proxy} = getCurrentInstance();

const isLoad = ref(false);

const is = ref();

onBeforeMount(() => {
  is.value = proxy.$route.query.pageCode;
  isLoad.value = !0;
});
</script>

<style lang="scss" scoped>
</style>
