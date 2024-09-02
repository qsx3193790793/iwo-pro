<template>
  <MDialog v-bind.sync="$attrs" v-on="$listeners" ref="MDialogRef" width="80%" top="5vh" height="75vh" :title="`${props.pkid?'修改':'新增'}接口`">
    <FormModel ref="FormModelRef" :formConfig="formConfig" :formStatus="props?.isDetail?'view':'create'"></FormModel>
    <template #footer="{DialogRef}">
      <el-button type="primary" plain @click="DialogRef?.handleClose()">返回</el-button>
      <el-button type="primary" @click="onSubmit(DialogRef)">保存</el-button>
    </template>
  </MDialog>
</template>

<script setup>
import {getCurrentInstance, onBeforeMount, ref, watch} from "vue";
import MDialog from '@/components/MDialog';
import FormModel from '@/components/FMGenerator/FormModel';
import requstFieldSelector from './requstFieldSelector.vue'
import responseFieldSelector from './responseFieldSelector.vue'
import sendRequst from './sendRequst.vue'
import analysisParams from "./analysisParams.vue";

const {proxy} = getCurrentInstance();

const props = defineProps({
  pkid: {type: Object, default: null},//详情id
  isDetail: {type: Boolean, default: !1},//是否只查看
});

const emitter = defineEmits(['success']);
const isSaveDiscribe = ref(false)
const FormModelRef = ref();
//编辑保存
const onSubmit = DialogRef => {
  FormModelRef.value?.validator(
      formData => {
        if (!isSaveDiscribe.value) return proxy.$$Dialog.confirm(`尚有label未保存！`)
        proxy.$$Dialog.confirm(`你确定要保存吗？保存前请确认已解析成功！`, '提示', {cancelButtonText: '取消', confirmButtonText: '确定',}).then(async () => {
          const {res, err} = await proxy.$$api.interface[props.pkid ? 'update' : 'create']({
            data: Object.assign({}, formData, {
              responseParam: JSON.stringify(deleteValue(formData.responseParam)),
              requestParam: JSON.stringify(deleteValue(formData.requestParam))
            })
          });
          if (err) return proxy.$$Toast({message: res?.msg || `操作失败`, type: 'error'});
          emitter('success');
          FormModelRef.value?.resetFormData();
          DialogRef?.handleClose();
          return proxy.$$Toast({message: `操作成功`, type: 'success'});
        }).catch(proxy.$$emptyFn);
      }
  );
};

function deleteValue(arr) {
  return arr.map(item => {
    const {value, ...rest} = item;
    return rest;
  })
}

const formConfig = ref({
  formName: '',
  onLoad: async function ({vm}) {
    console.log('formConfig onLoad...', vm.reqQuery, vm.$attrs)
    // 获取详情
    if (props.pkid) proxy.$$api.interface.detail({interfaceId: props.pkid.interfaceId}).then(({res}) => {
      isSaveDiscribe.value = true
      vm.initFormData({})
      //以下字段新建后不可再编辑
      vm.expandFormConfigItems.forEach(efci => [].includes(efci.key) && (efci.isDisable = !0));
      if (res) {
        vm.initFormData(Object.assign(res || {}, {
          // interfaceCode: res.interfaceCode || '',
          interfaceName: res?.interfaceName,
          interfaceUrl: res?.interfaceUrl,
          appId: res?.appId,
          appKey: res?.appKey,
          interfaceDesc: res?.interfaceDesc,
          interfaceMethod: res?.interfaceMethod,
          interfaceNormType: res?.interfaceNormType,
          interfaceInfo: res?.interfaceInfo,
          requestParam: JSON.parse(res?.requestParam),
          responseParam: JSON.parse(res?.responseParam),
          stagingrequest: JSON.parse(res?.requestParam),
          stagingresponse: JSON.parse(res?.responseParam),
          requestJsonStr: res?.requestJsonStr,
          responseJsonStr: res?.responseJsonStr,
        }));
      }
    });
  },
  items: [
    {
      name: '',
      items: [
        // {name: '接口编码', key: 'interfaceCode', value: '', placeholder: '', col: 6, type: 'input', isDisable: !1, isRequire: !0},
        {name: '接口名称', key: 'interfaceName', value: '', type: 'input', col: 6, isDisable: !1, isRequire: !0},
        {name: 'appId', key: 'appId', value: '', placeholder: '', maxlength: 100, col: 6, type: 'input', isDisable: !1, isRequire: !0},
        {name: 'appKey', key: 'appKey', value: '', placeholder: '', maxlength: 100, col: 6, type: 'input', isDisable: !1, isRequire: !0},
        {name: '接口规范类型', key: 'interfaceNormType', value: '', col: 6, type: 'select', options: () => proxy.$store.getters['dictionaries/GET_DICT']('interface_specification_type'), isDisable: !1, isRequire: !0},
        {name: '接口联系信息', key: 'interfaceInfo', value: '', col: 12, type: 'textarea', isDisable: !1, isRequire: !0},
        {name: '接口描述', key: 'interfaceDesc', value: '', col: 12, type: 'textarea', isDisable: !1, isRequire: !0},
        {name: '请求方式', key: 'interfaceMethod', value: '', col: 6, type: 'select', options: () => proxy.$store.getters['dictionaries/GET_DICT']('interface_request_method'), isDisable: !1, isRequire: !0},
        {name: '接口地址', key: 'interfaceUrl', value: '', placeholder: '', maxlength: 260, col: 12, type: 'input', isDisable: !1, isRequire: !0},
        {name: '请确保下方入参填写无误再发送', key: '', value: '', placeholder: '', col: 6, type: 'component', component: sendRequst, isDisable: !1, isRequire: !0},
        {
          type: 'alert', col: 24, description: 'GET请求请按该格式填写: key=value&key=value&...  将key，value替换为此接口入参值即可', title: '提示',
          isShow({vm}) {
            return vm.formData.interfaceMethod === 'GET';
          }
        },
        {
          type: 'alert', col: 24, description: 'POST请求请按该格式填写: { "key"："value"，"key"："value"，...} 将key，value替换为此接口入参值即可', title: '提示',
          isShow({vm}) {
            return vm.formData.interfaceMethod === 'POST';
          }
        },
        {
          name: '请在下方区域编辑接口入参', key: 'requestJsonStr', value: '', type: 'monacoEditor', height: '2rem', isRequire: !0, col: 24,
          isShow({vm}) {
            return vm.formData.interfaceMethod === 'POST';
          }
        },
        {
          name: '请在下方区域编辑接口入参', key: 'requestJsonStr', value: '', type: 'textarea', rows: 5, isRequire: !0, col: 24,
          isShow({vm}) {
            return vm.formData.interfaceMethod === 'GET';
          }
        },
        {name: '出参json', key: 'responseJsonStr', value: '', type: 'monacoEditor', height: '2rem', isDisable: !0, isRequire: !0, col: 24},
        {
          name: '入参出参确认无误后可将其解析至下方表格并填写描述', key: '', value: '', placeholder: '', col: 20, type: 'component', component: analysisParams, isDisable: !1, isRequire: !0,
          emitter({vm}) {
            return {
              hasSaveDiscribe(val) {
                isSaveDiscribe.value = val
              }
            }
          }
        },
        // 将请求响应参数暂存
        {name: '', key: 'stagingrequest', value: '', col: 1},
        {name: '', key: 'stagingresponse', value: '', col: 1},
        {name: '入参列表', key: 'requestParam', value: [], placeholder: '', col: 24, attrs: {isEdit: true}, type: 'component', component: requstFieldSelector, isDisable: !1, isRequire: !1},
        {name: '出参列表', key: 'responseParam', value: [], placeholder: '', col: 24, attrs: {isEdit: true}, type: 'component', component: responseFieldSelector, isRequire: !1, readOnly: !0},
      ]
    }
  ],
  topButtons: [],
  bottomButtons: []
});

onBeforeMount(() => {
});

</script>
<script>
export default {
  dicts: ['interface_request_method', 'interface_specification_type', 'interface_type', 'start_stop']
}
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
