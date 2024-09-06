<template>
  <MDialog v-bind.sync="$attrs" v-on="$listeners" ref="MDialogRef" width="96vw" top="5vh" height="75vh" :title="`${props.pkid?type:'新增'}模板`">
    <el-tabs v-model="tabActive" class="AddDialog" :before-leave="tabBeforeLeave">
      <el-tab-pane label="基本信息" name="基本信息">
        <ELScrollbar style="height: 100%">
          <FormModel ref="FormModelRef" :formConfig="formConfig" :formStatus="props?.isDetail?'view':'create'"></FormModel>
        </ELScrollbar>
      </el-tab-pane>
      <el-tab-pane label="表单设计" name="表单设计">
        <FMDesigner v-if="!props?.isDetail" ref="FMDesignerRef" :fieldsArray="getFieldsArray" :quoteTemplateList="quoteTemplateList" :quoteComponent="QuoteComponent"></FMDesigner>
        <FormModel v-else-if="detailFormConfig" :formConfig="detailFormConfig"></FormModel>
      </el-tab-pane>
    </el-tabs>
    <template #footer="{DialogRef}">
      <el-button type="primary" plain @click="DialogRef?.handleClose()">返回</el-button>
      <el-button v-if="type==='修改'" type="primary" @click="onSubmit(DialogRef)">保存</el-button>
      <template v-if="type==='发布'">
        <el-button type="success" v-hasPermission="['system:template:release']" @click="onRelease(DialogRef)">发布</el-button>
        <el-button type="danger" v-hasPermission="['system:template:rollback']" @click="onRollback(DialogRef)">回退</el-button>
      </template>
      <template v-if="type==='审核'">
        <el-button type="success" v-hasPermission="['system:template:approval']" @click="onAuditPass(DialogRef)">通过</el-button>
        <el-button type="danger" v-hasPermission="['system:template:reject']" @click="onAuditBack(DialogRef)">驳回</el-button>
      </template>
    </template>
  </MDialog>
</template>

<script setup>
import {getCurrentInstance, onBeforeMount, ref, watch} from "vue";
import MDialog from '@/components/MDialog';
import FieldSelector from './FieldSelector';
import TemplateContent from './TemplateContent';
import FormModel from '@/components/FMGenerator/FormModel';
import FMDesigner from "@/components/FMGenerator/FMDesigner";
import {parseFormModel} from "@/components/FMGenerator/FMDesigner/config";
import QuoteComponent from '../index';
import {getTypePrefix} from "../config";

const {proxy} = getCurrentInstance();

const props = defineProps({
  pkid: {type: Object, default: null},//详情id
  isDetail: {type: Boolean, default: !1},//是否只查看
  type: {type: String, default: '修改'},//类型 修改 发布 审核
});
const emitter = defineEmits(['success']);

const tabActive = ref('基本信息');

function tabBeforeLeave(activeName, oldActiveName) {
  return new Promise((rs, rj) => {
    if (activeName === '表单设计') return FormModelRef.value?.validator(rs, () => {
      proxy.$$Toast({message: `请先完整填写基本信息`, type: 'error'});
      rj();
    });
    rs();
  });
}

const FMDesignerRef = ref(null);
const FormModelRef = ref(null);

const quoteTemplateList = ref([]);

async function getSceneForm(vm) {
  const formData = vm.getFormData();
  if (!formData.workorderType || !formData.smallType) return;
  // 场景编码：投诉来源或投诉现象的编码，如果选择了产品需要合并一起。例如：现象编码末级:产品编码(10001:2010)
  const sceneCode = [
    formData.workorderType,
    formData.bigType,
    formData.smallType,
    formData.sceneLevelCode?.[2] || formData.sceneLevelCode?.[1] || formData.sceneLevelCode?.[0],
    formData.productCode?.[0]
  ].filter(v => !!v).join(':');
  if (!sceneCode) return quoteTemplateList.value = [];
  const {res, err} = await proxy.$$api.template.getSceneForm({sceneCode, smallType: formData.smallType, workorderType: formData.workorderType});
  quoteTemplateList.value = (res?.list || []).map(r => ({title: r.formName, json: JSON.parse(r.formContent || 'null')}));
}

const detailFormConfig = ref(null);//详情json

//设计器获取字段名下拉
function getFieldsArray() {
  return FormModelRef.value?.formData?.fieldList?.map(r => {
    let name = `${getTypePrefix(r.type)}${r.name}`;
    return {label: `${r.title}(${name})`, value: name, originLabel: r.title, type: r.type}
  }) || [];
}

//审核通过
const onAuditPass = DialogRef => {
  proxy.$$Dialog.confirm(`你确定要审核通过吗？`, '提示', {cancelButtonText: '取消', confirmButtonText: '确定',}).then(async () => {
    const formData = FormModelRef.value?.getFormData();
    const {res, err} = await proxy.$$api.template.approval({versionId: formData.versionId});
    if (err) return;
    emitter('success');
    DialogRef?.handleClose();
    return proxy.$$Toast({message: `操作成功`, type: 'success'});
  }).catch(proxy.$$emptyFn);
}

//审核驳回
const onAuditBack = DialogRef => {
  proxy.$$Dialog.prompt('', `请输入驳回理由`, {
    confirmButtonText: '确定', cancelButtonText: '取消', inputPlaceholder: '请输入驳回理由',
    inputValidator: v => !!v, inputErrorMessage: '不可为空', inputValue: ''
  }).then(async ({value}) => {
    const formData = FormModelRef.value?.getFormData();
    const {res, err} = await proxy.$$api.template.reject({data: {versionId: formData.versionId, unsanctionedDesc: value}});
    if (err) return;
    emitter('success');
    DialogRef?.handleClose();
    proxy.$$Toast({message: `操作成功`, type: 'success'});
  }).catch(proxy.$$emptyFn)
}

//发布
async function handleRelease(DialogRef, formData) {
  const {res, err} = await proxy.$$api.template.release({data: {templateId: formData.templateId, versionId: formData.versionId, sceneCode: formData.sceneCode, templateType: formData.bigType, workorderType: formData.workorderType}});
  if (err) return;
  emitter('success');
  DialogRef?.handleClose();
  proxy.$$Toast({message: `操作成功`, type: 'success'});
}

const onRelease = DialogRef => {
  proxy.$$Dialog.confirm('确认发布吗？', '提示').then(async () => {
    const formData = FormModelRef.value?.getFormData();
    const {res, err} = await proxy.$$api.template.releaseCheck({sceneCode: formData.sceneCode, bigType: formData.bigType, workorderType: formData.workorderType});
    if (err) return;
    if (res.value) return proxy.$$Dialog.confirm('存在已经发布的模板，是否继续发布？', '提示').then(async () => {
      handleRelease(DialogRef, formData);
    }).catch(proxy.$$emptyFn);
    handleRelease(DialogRef, formData);
  }).catch(proxy.$$emptyFn);
}
//回退
const onRollback = DialogRef => {
  proxy.$$Dialog.prompt('', `请输入回退理由`, {
    confirmButtonText: '确定', cancelButtonText: '取消', inputPlaceholder: '请输入回退理由',
    inputValidator: v => !!v, inputErrorMessage: '不可为空', inputValue: ''
  }).then(async ({value}) => {
    const formData = FormModelRef.value?.getFormData();
    const {res, err} = await proxy.$$api.template.rollback({data: {versionId: formData.versionId, unsanctionedDesc: value}});
    if (err) return;
    emitter('success');
    DialogRef?.handleClose();
    proxy.$$Toast({message: `操作成功`, type: 'success'});
  }).catch(proxy.$$emptyFn)
}

//编辑保存
const onSubmit = DialogRef => {
  FormModelRef.value?.validator(
      formData => {
        console.log('onSubmit formData', DialogRef, formData)
        proxy.$$Dialog.confirm(`你确定要保存吗？`, '提示', {cancelButtonText: '取消', confirmButtonText: '确定',}).then(async () => {
          const {res, err} = await proxy.$$api.template[props.pkid ? 'update' : 'create']({
            data: Object.assign({}, formData, {
              fieldList: formData.fieldList.map(fl => fl.fieldId),
              formContent: JSON.stringify(FMDesignerRef.value.getJson()),
              // 场景编码：工单类型：大类：小类：现象或来源末级:产品编码(111:1111:111:10001:2010)
              sceneCode: [
                formData.workorderType,
                formData.bigType,
                formData.smallType,
                formData.sceneLevelCode?.[2] || formData.sceneLevelCode?.[1] || formData.sceneLevelCode?.[0],
                formData.productCode?.[0]
              ].filter(v => !!v).join(':') || null,
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
const getAllcomplaintSource = async () => {
  await proxy.$$api.complaintSource
      .listComplaintSourceTree()
      .then(({res: response, err}) => {
        if (err) return;
        proxy.$store.commit('dictionaries/SET_DICTIONARIES', {complaint_source_tree_by_uid: proxy.$$formatCascaderTree(response?.list || [], 'sourceName', 'sourceCode', 'children')});
      });
}

const formConfig = ref({
  formName: '',
  onLoad: async function ({vm}) {
    console.log('formConfig onLoad...', vm.reqQuery, vm.$attrs)
    // 获取详情
    if (props.pkid) {
      proxy.$$api.template.detail({templateId: props.pkid.templateId, versionId: props.pkid.versionId}).then(({res}) => {
        //以下字段新建后不可再编辑
        vm.expandFormConfigItems.forEach(efci => ['smallType', 'sceneLevelCode', 'productCode'].includes(efci.key) && (efci.isDisable = !0));
        if (res) {
          vm.initFormData(Object.assign(res || {}, {
            fieldList: (res.fieldConfigs || []).map(op => Object.assign({}, op, {resValue: `${getTypePrefix(op.type)}${op.name}`})),
            formId: res?.formTemplateConfig?.formId,
            formName: res?.formTemplateConfig?.formName,
            sceneLevelCode: [res?.sceneLevel1Code, res?.sceneLevel2Code, res?.sceneLevel3Code].filter(r => !!r),//回显级联
            productCode: [res?.productCode].filter(r => !!r),//回显级联
            workorderType: res?.workorderType?.toString(),
            bigType: res?.bigType?.toString(),
            smallType: res?.smallType?.toString(),
            // verbalTrickContent2: res?.verbalTrickContent,
          }));
          // 编辑回显时，通过全量的投诉来源 获取数据进行匹配
          if (res?.smallType && res?.smallType?.toString() == 'TPL0101') {
            getAllcomplaintSource()
          }

          getSceneForm(vm);
          if (res?.formTemplateConfig?.formContent) {
            //回显设计器
            FMDesignerRef.value && FMDesignerRef.value.loadJson(JSON.parse(res.formTemplateConfig.formContent));

            //详情查看用
            if (props.isDetail) {
              detailFormConfig.value = parseFormModel(JSON.parse(res.formTemplateConfig.formContent));
            }
          }
        }
      });
    }

  },
  items: [
    {
      name: '',
      items: [
        {
          name: '工单类型', key: 'workorderType', value: '', type: 'select', options: () => proxy.$store.getters['dictionaries/GET_DICT']('template_work_order_type'), isDisable: !1, isRequire: !0,
          onChange({vm}) {
            getSceneForm(vm);
          }
        },
        {
          name: '模板大类', key: 'bigType', value: '', type: 'select', options: () => proxy.$store.getters['dictionaries/GET_DICT']('template_big_type'), isDisable: !1, isRequire: !0,
          onChange({vm}) {
            getSceneForm(vm);
          }
        },
        {
          name: '模板小类', key: 'smallType', value: 'TPL0100', type: 'radio', options: () => proxy.$store.getters['dictionaries/GET_DICT']('template_small_type'), isDisable: !1, isRequire: !0,
          onChange({vm}) {
            vm.formData.productCode = [];
            vm.formData.sceneLevelCode = [];
            getSceneForm(vm);
            vm.formData.templateName = vm.formData.formName = vm.formData.templateDesc = null
          }
        },
        {
          name: ({vm}) => (vm.formData.smallType === 'TPL0100' ? '投诉现象' : '投诉来源'), key: 'sceneLevelCode', value: [], type: 'cascader', isDisable: !1, isRequire: !0,
          options: ({vm}) => vm.formData.smallType === 'TPL0100' ? proxy.$store.getters['dictionaries/GET_DICT']('complaint_phenomenon_tree') : proxy.$store.getters['dictionaries/GET_DICT']('complaint_source_tree_by_uid'),
          attrs: {props: {checkStrictly: !0}},
          onChange({vm}) {
            getSceneForm(vm);
            const {path: developChannelLevelPath, pathLabels: developChannelLevelPathLabels} = vm.$refs.sceneLevelCode?.[0]?.getCheckedNodes()?.[0] || {};
            vm.formData.templateName = vm.formData.formName = vm.formData.templateDesc = `${vm.formData.smallType === 'TPL0100' ? '投诉现象' : '投诉来源'}-${developChannelLevelPathLabels.join('-')}`
          },
          isShow({vm}) {
            return ['TPL0100', 'TPL0101'].includes(vm.formData.smallType);
          }
        },
        {
          name: '产品', key: 'productCode', value: [], type: 'cascader', isDisable: !1, isRequire: !1,
          options: ({vm}) => proxy.$store.getters['dictionaries/GET_DICT']('complaint_product_tree_level_1'),
          attrs: {props: {checkStrictly: !0}},
          isShow({vm}) {
            return ['TPL0100'].includes(vm.formData.smallType);
          },
          onChange({vm}) {
            getSceneForm(vm);
          }
        },
        {name: '模板名称', key: 'templateName', value: '', placeholder: '', type: 'input', isDisable: !1, isRequire: !0},
        {name: '表单模板名称', key: 'formName', value: '', placeholder: '', type: 'input', isDisable: !1, isRequire: !0},
        {name: '描述', key: 'templateDesc', value: '', placeholder: '', type: 'input', isDisable: !1, isRequire: !0},
        {name: '字段列表', key: 'fieldList', value: [], placeholder: '', col: 24, type: 'component', component: FieldSelector, isDisable: !1, isRequire: !1},
        {
          type: 'alert', col: 24, description: '请在字段列表中点击插入按钮，会自动插入到模板内容光标停留处。', title: '提示',
          isShow({vm}) {
            return ['TPL0100', 'TPL0101'].includes(vm.formData.smallType);
          }
        },
        {
          name: '模板内容', key: 'verbalTrickContent', value: '', type: 'textarea', rows: 5, col: 24, isDisable: !1, isRequire: !0,
          isShow({vm}) {
            return ['TPL0100', 'TPL0101'].includes(vm.formData.smallType);
          }
        },
        {
          name: '模板内容（体验版）', key: 'verbalTrickContent', value: '', type: 'component', component: TemplateContent, attrs: {rows: 5}, col: 24, isDisable: !1, isRequire: !0,
        },
      ]
    }
  ],
  topButtons: [],
  bottomButtons: []
});

//投诉现象下拉菜单
async function listComplaintPhenomenonTree() {
  if (proxy.$store.getters['dictionaries/GET_DICT']('complaint_phenomenon_tree')?.length) return;
  const {res, err} = await proxy.$$api.complaintPhenomenon.listComplaintPhenomenonTree({params: {status: 1}});
  if (err) return;
  proxy.$store.commit('dictionaries/SET_DICTIONARIES', {complaint_phenomenon_tree: proxy.$$formatCascaderTree(res?.phenomList || [], 'phenomName', 'phenomCode', 'phenomList')});
}

//投诉来源下拉菜单
async function listComplaintSourceTree() {
  // if (proxy.$store.getters['dictionaries/GET_DICT']('complaint_source_tree_by_uid')?.length) return;
  // const {res, err} = await proxy.$$api.complaintSource.getAskSourceSrlByUid({});
  const {res, err} = await proxy.$$api.complaintSource.listComplaintSourceTree({data: {status: 1}});
  if (err) return;
  proxy.$store.commit('dictionaries/SET_DICTIONARIES', {complaint_source_tree_by_uid: proxy.$$formatCascaderTree(res?.list || [], 'sourceName', 'sourceCode', 'children')});
}

//产品下拉菜单
async function listProductTree() {
  if (proxy.$store.getters['dictionaries/GET_DICT']('complaint_product_tree_level_1')?.length) return;
  const {res, err} = await proxy.$$api.productClassification.listProductTree({params: {status: 1}});
  if (err) return;
  // 只需要一级即可
  proxy.$store.commit('dictionaries/SET_DICTIONARIES', {complaint_product_tree_level_1: proxy.$$formatCascaderTree((res?.list || []).map(r => (r.children = null, r)), 'productName', 'productCode', 'children')});
}

watch(() => props.pkid, () => FormModelRef.value?.init());

onBeforeMount(() => {
  // 只有在新建时获取根据角色分配的投诉来源数据项
  if (!props.pkid) {
    listComplaintSourceTree();
  }
  listComplaintPhenomenonTree();
  listProductTree();
});

</script>
<script>
export default {
  name: 'TemplateAddDialog',
  dicts: ['template_work_order_type', 'template_status_name', 'template_big_type', 'template_small_type']
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
