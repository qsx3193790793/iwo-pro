<template>
  <div class="PageSearchPanel query-form one-screen-fg0" :class="{noBackground}">
    <FormModel ref="FormModelRef" :formConfig="formConfig"></FormModel>
    <div v-if="hasExpand&&props.formConfigItems.length > mainSize+1" class="expand" @click="isExpand=!isExpand">
      <i :class="isExpand?'el-icon-arrow-up':'el-icon-arrow-down'"></i>
    </div>
  </div>
</template>
<script setup>
import {computed, getCurrentInstance, ref} from 'vue';
import FormModel from '@/components/FMGenerator/FormModel';

const {proxy} = getCurrentInstance();

const props = defineProps({
  hasExpand: {type: Boolean, default: true},//是否有收起展开
  mainSize: {type: Number, default: 7},//首屏数量
  formConfigItems: {type: Array, default: () => []},// 表单配置项目
  labelWidth: {type: String, default: '1rem'},// 表单label宽度
  noBackground: {type: Boolean, default: false},// 表单label宽度
});

const isExpand = ref(!1);

const FormModelRef = ref();

const formConfig = computed(() => {
  // 展开截取前7个+最后按钮组 保证按钮组在最后一个
  const items = props.hasExpand && !isExpand.value && props.formConfigItems.length > props.mainSize
      ? ([].concat(props.formConfigItems.slice(0, props.mainSize), [props.formConfigItems[props.formConfigItems.length - 1]]))
      : props.formConfigItems;
  return {
    formName: '',
    labelPosition: 'left',
    labelWidth: props.labelWidth,
    onLoad: async ({vm}) => {
    },
    items: [
      {
        name: '',
        items: items
      },
    ]
  }
});

defineExpose({
  getFormData: () => FormModelRef.value.getFormData(),
  initFormData: (v) => FormModelRef.value.initFormData(v)
});

</script>
<style lang="scss" scoped>
.PageSearchPanel {
  transition: height .3s ease-out 0s;
  position: relative;

  ::v-deep(.el-form-item__label) {
    text-align: right;
  }

  ::v-deep(.el-form-item__label .slot-label) {
    color: rgb(85, 92, 98);
  }

  ::v-deep(.el-collapse-item__content) {
    padding-bottom: 0;
  }

  & > .expand {
    position: absolute;
    left: 50%;
    bottom: 0;
    transform: translate3d(-50%, calc(100% - 1PX), 0);
    background-color: inherit;
    width: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 12px;
    border-radius: 0 0 6px 6px;
    cursor: pointer;
  }
}
</style>
