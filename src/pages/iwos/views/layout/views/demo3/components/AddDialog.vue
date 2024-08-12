<template>
  <MDialog v-bind.sync="$attrs" v-on="$listeners" ref="MDialogRef" width="80%" :title="`${props.pkid?'编辑':'新增'}课程资源`">
    <FormModel ref="FormModelRef" :formConfig="formConfig" :disabled="props?.isDetail"></FormModel>
    <template #footer="{DialogRef}">
      <el-button type="primary" plain @click="DialogRef?.handleClose()">返回</el-button>
      <el-button type="primary" @click="onSubmit(DialogRef)">保存</el-button>
    </template>
  </MDialog>
</template>

<script setup>
import {getCurrentInstance, ref, watch} from "vue";
import MDialog from '@/components/MDialog';
import FormModel from '@/components/FMGenerator/FormModel';

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
          const {res, err} = await proxy.$$api.manager.saveResourseCourseResInfo({
            data: Object.assign({}, formData, {
              res_url: formData.file_type === '103600' ? formData.res_url_doc : formData.res_url_video,
              duration: proxy.$$dictionaries.descValue['file_type_video'] === formData.file_type ? formData.duration : 0,
            })
          });
          if (res?.result) {
            emitter('success');
            FormModelRef.value?.resetFormData();
            DialogRef?.handleClose();
            return proxy.$$Toast({message: `操作成功`, type: 'success'});
          }
          proxy.$$Toast({message: res?.msg || `操作失败`, type: 'error'});
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
    if (props.pkid) proxy.$$api.manager.getResourseCourseResInfoDetail({data: {select_pkid: props.pkid}}).then(({res}) => {
      if (res) {
        res.res_url_doc = res.file_type === '103600' ? res.res_url : '';
        res.res_url_video = res.file_type === '103601' ? res.res_url : '';
        vm.initFormData(res || {});
      }
    });
  },
  items: [
    {
      name: '',
      items: [
        {name: 'json', key: 'json', value: '{}', type: 'monacoEditor', height: '2rem', isDisable: !1, isRequire: !0, col: 24},
        {name: '资源类型', key: 'file_type', value: '', type: 'select', options: [], isDisable: !1, isRequire: !0},
        {name: '资源类型', key: 'file_type', value: '', type: 'select', options: [], isDisable: !1, isRequire: !0},
        {name: '资源类型', key: 'file_type', value: '', type: 'select', options: [], isDisable: !1, isRequire: !0},
        {name: '资源类型', key: 'file_type', value: '', type: 'select', options: [], isDisable: !1, isRequire: !0},
        {name: '资源类型', key: 'file_type', value: '', type: 'select', options: [], isDisable: !1, isRequire: !0},
        {name: '资源类型', key: 'file_type', value: '', type: 'select', options: [], isDisable: !1, isRequire: !0},
        {name: '资源类型', key: 'file_type', value: '', type: 'select', options: [], isDisable: !1, isRequire: !0},
        {name: '资源类型', key: 'file_type', value: '', type: 'select', options: [], isDisable: !1, isRequire: !0},
        {type: 'divider-empty', col: 8},
        {name: '资源类型A', key: 'file_type', value: '', type: 'select', options: [], isDisable: !1, isRequire: !0},
        {name: '资源类型C', key: 'file_type', value: '', type: 'select', options: [], isDisable: !1, isRequire: !0},
        {name: '资源类型', key: 'file_type', value: '', type: 'select', options: [], isDisable: !1, isRequire: !0},
        {name: '资源类型', key: 'file_type', value: '', type: 'select', options: [], isDisable: !1, isRequire: !0},
        {name: '资源类型', key: 'file_type', value: '', type: 'select', options: [], isDisable: !1, isRequire: !0},
        {name: '资源类型', key: 'file_type', value: '', type: 'select', options: [], isDisable: !1, isRequire: !0},
        {name: '资源类型', key: 'file_type', value: '', type: 'select', options: [], isDisable: !1, isRequire: !0},
        {name: '资源类型', key: 'file_type', value: '', type: 'select', options: [], isDisable: !1, isRequire: !0},
        {name: '资源名称', key: 'res_name', value: '', type: 'input', isDisable: !1, isRequire: !0},
        {
          name: '业务类别', key: 'busi_code', value: '', type: 'select', options: [], isDisable: !1, isRequire: !0,
          onChange({vm}) {
            vm.formData.busi_name = [];
          }
        },
        {name: '密级', key: 'dsecrets', value: '', type: 'select', options: [], isDisable: !1, isRequire: !0},
        {
          name: '时长', key: 'duration', value: 0, type: 'timerSelector', isDisable: !1, isRequire: !0,
          isShow({vm}) {
            return vm.formData.file_type === '103601';
          }
        },
        {
          name: '页数', key: 'page', value: 0, min: 1, max: 1000, type: 'number', options: [], isDisable: !1, isRequire: !0,
          isShow({vm}) {
            return vm.formData.file_type === '103600';
          }
        },
        {name: '', key: 'busi_name', value: '', type: 'input', isHidden: !0, isDisable: !0, isRequire: !1},
        {name: '', key: 'res_url', value: '', type: 'input', isHidden: !0, isDisable: !0, isRequire: !1},
        {name: '', key: 'file_hash', value: '', type: 'input', isHidden: !0, isDisable: !0, isRequire: !1},
        {name: '', key: 'file_size', value: '', type: 'input', isHidden: !0, isDisable: !0, isRequire: !1},
        {name: '', key: 'file_format', value: '', type: 'input', isHidden: !0, isDisable: !0, isRequire: !1},
        {name: '资源简介', key: 'content', value: '', type: 'textarea', row: 4, col: 24, maxlength: 400, isDisable: !1, isRequire: !0},
      ]
    }
  ],
  topButtons: [],
  bottomButtons: []
});

</script>
<style lang="scss" scoped>
</style>
