<template>
  <FMDesigner :quoteTemplateList="quoteTemplateList" has-save></FMDesigner>
</template>

<script setup>
import FMDesigner from "@/components/FMGenerator/FMDesigner";
import {defineComponent, h, getCurrentInstance, nextTick, onBeforeMount, ref} from "vue";
import {templates} from '@/components/FMGenerator/FMDesigner/config/comps.js';

const {proxy} = getCurrentInstance();

const quoteTemplateList = ref(templates?.[0]?.items || []);

</script>
<style lang="scss" scoped>
</style>
