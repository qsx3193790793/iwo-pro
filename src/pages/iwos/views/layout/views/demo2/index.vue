<template>
  <FMDesigner :quoteTemplateList="quoteTemplateList" has-save></FMDesigner>
</template>

<script setup>
import FMDesigner from "@/components/FMGenerator/FMDesigner";
import {defineComponent, h, getCurrentInstance, nextTick, onBeforeMount, ref} from "vue";
import templates from '@/pages/iwos/fmDesignerComps';

const {proxy} = getCurrentInstance();

const quoteTemplateList = ref(templates || []);

</script>
<style lang="scss" scoped>
</style>
