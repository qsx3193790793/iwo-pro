<template>
  <MDialog v-bind.sync="$attrs" v-on="$listeners" ref="MDialogRef" width="30%" :title="`${props.pkid?'修改':'新增'}字段`">
    <FormModel ref="FormModelRef" :formConfig="formConfig" :formStatus="props?.isDetail?'view':'create'"></FormModel>
    <template #footer="{DialogRef}">
      <el-button type="primary" plain @click="DialogRef?.handleClose()">返回</el-button>
      <el-button type="primary" @click="onSubmit(DialogRef)">保存</el-button>
    </template>
  </MDialog>
</template>

<script setup>
import Vue, {getCurrentInstance, ref, watch} from "vue";
import MDialog from '@/components/MDialog';
import FormModel from '@/components/FMGenerator/FormModel';
import {options, optionsAll} from "@/pages/iwos/views/layout/views/system/template/config";

const {proxy} = getCurrentInstance();

const props = defineProps({
  pkid: {type: [String, Number], default: null},//详情id
  isDetail: {type: Boolean, default: !1},//是否只查看
});
const emitter = defineEmits(['success']);

const FormModelRef = ref(null);

const onSubmit = DialogRef => {
  FormModelRef.value?.validator(
      formData => {
        console.log('onSubmit formData', DialogRef, formData)
        proxy.$$Dialog.confirm(`你确定要保存吗？`, '提示', {cancelButtonText: '取消', confirmButtonText: '确定',}).then(async () => {
          const {res, err} = await proxy.$$api.modelFields[formData.fieldId ? 'updateTFieldConfig' : 'addTFieldConfig']({data: formData});
          if (err) return proxy.$$Toast({message: `操作失败`, type: 'error'});
          emitter('success');
          FormModelRef.value?.resetFormData();
          DialogRef?.handleClose();
          proxy.$$Toast({message: `操作成功`, type: 'success'});
        }).catch(proxy.$$emptyFn);
      }
  );
}
watch(() => props.pkid, () => FormModelRef.value?.init());

const formConfig = ref({
  formName: '',
  onLoad: async function ({vm}) {
    console.log('formConfig onLoad...', vm.reqQuery, vm.$attrs)

    // 获取详情
    if (props.pkid) proxy.$$api.modelFields.getTFieldConfig({fieldId: props.pkid}).then(({res}) => {
      if (res) {
        vm.initFormData(res || {});
      }
    });
  },
  items: [
    {
      name: '',
      items: [
        {name: '字段类型', key: 'type', value: '', col: 24, type: 'select', options: props.pkid ? optionsAll : options, isDisable: props.pkid ? !0 : !1, isRequire: !0},
        {
          name: '字段标题', key: 'title', value: '', type: 'input', col: 24, isDisable: !1, isRequire: !0,
          rules: [
            {
              validator: (rule, value, cb) => {
                proxy.$$validator.isVariableAndChineseCharacters(value) ? cb() : cb(new Error('只能是[中文、数字、英文、_、$]，且不能以数字开头'))
              }, trigger: ['blur', 'change']
            }
          ],
          async onChange({vm}) {
            if (!proxy.$$validator.isVariableAndChineseCharacters(vm.formData.title)) return vm.formData.name = null;
            const {res, err} = await proxy.$$api.modelFields.trans({params: {param: vm.formData.title}})
            if (err) return
            vm.formData.name = res.value
          }
        },
        {
          name: '字段名称', key: 'name', value: '', type: 'input', col: 24, maxlength: 30, isDisable: !1, isRequire: !0,
          rules: [{validator: (rule, value, cb) => Vue.prototype.$$validator.isVariable(value) ? cb() : cb(new Error('不符合变量规范[A~Z、a~z、0~9、_、$]，不允许数字开头）')), trigger: 'blur'}],
        },
        {name: '是否省自定义', key: 'isProvinceCustom', value: '1', col: 24, options: () => proxy.$store.getters['dictionaries/GET_DICT']('yes_no'), type: 'select', isDisable: !0, isRequire: !1},
        {name: '字段描述', key: 'comment', value: '', type: 'textarea', row: 4, col: 24, maxlength: 100, isDisable: !1, isRequire: !1},
        {name: '是否必填', key: 'required', value: '1', type: 'input', isHidden: !0, isDisable: !0, isRequire: !0},
      ]
    }
  ],
  topButtons: [],
  bottomButtons: []
});

</script>
<script>
export default {
  dicts: ['yes_no']
}
</script>
<style lang="scss" scoped>
</style>
