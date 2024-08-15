<template>
  <div class="FMDesigner">
    <div class="fm-designer-top-tools-bar">
      <div class="t">表单设计器</div>
      <div class="tools">
        <el-button type="danger" @click="onClear">清空</el-button>
        <el-button type="primary" @click="onView">预览</el-button>
        <el-button v-if="hasSave" type="success" @click="onSave">保存</el-button>
      </div>
    </div>
    <div class="fm-designer-bottom-panel">
      <div class="fm-designer-components-panel">
        <el-button v-if="quoteComponent" class="quote-trigger" type="text" icon="el-icon-document-copy" @click="isQuoteTemplateShow=!0">复用</el-button>
        <el-tabs v-model="compsPanelActive">
          <el-tab-pane label="组件" name="组件">
            <el-collapse v-model="activeCollapse">
              <el-collapse-item v-for="(it,ii) in comps" :title="it.name" :name="it.name" :key="it.name">
                <Draggable v-model="it.items" class="fm-designer-components-panel-inner" :forceFallback="false" :group="{name:'components',pull:'clone',put:!1}" :sort="false" :clone="handleClone">
                  <div v-for="(v,i) in it.items" :key="i" :data-type="v.type" :data-comp-type="v.compType" class="fm-designer-components-item">{{ v.title }}</div>
                </Draggable>
              </el-collapse-item>
            </el-collapse>
          </el-tab-pane>
          <el-tab-pane label="表单" name="表单">
            <!--                      <el-collapse v-model="activeTemplatesCollapse">-->
            <!--                        <el-collapse-item v-for="(it,ii) in templates" :title="it.name" :name="it.name" :key="it.name">-->
            <template v-for="(it,ii) in templates">
              <div v-for="(v,i) in it.items" :key="it.name+i" class="fm-designer-components-item" @click="useTemplate(v)">{{ v.title }}</div>
            </template>
            <!--                        </el-collapse-item>-->
            <!--                      </el-collapse>-->
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="fm-designer-stage-panel">
        <div class="fm-designer-stage" @click.stop="handlerLayoutClick({cId:null})">
          <el-form :inline="true" label-position="top" hide-required-asterisk scroll-to-error>
            <Draggable v-model="stage" class="el-row" :class="{empty:!stage.length}" handle=".drag-element-handler" :forceFallback="false" :group="{name:'layout',pull:!1,put:layoutPut}" :sort="true">
              <component v-for="(v,i) in stage" :children.sync="v.children" :stage="stage" :props="v.z_props" :node="v" :key="v.cId" :cId="v.cId" :is="v" @layout-click="handlerLayoutClick" @layout-del="handlerLayoutDel" @layout-copy="handlerLayoutCopy"></component>
            </Draggable>
          </el-form>
        </div>
      </div>
      <div class="fm-designer-config-panel">
        <el-tabs v-model="configPanelActive">
          <el-tab-pane v-if="compFormConfig" label="组件配置" name="组件配置">
            <FormModel ref="FormModelRef" :formConfig="compFormConfig" @formDataChange="formDataChange"></FormModel>
          </el-tab-pane>
          <el-tab-pane label="表单配置" name="表单配置">
            <FormModel :formConfig="formConfig" @formDataChange="z_formConfigPropsChange"></FormModel>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <el-dialog v-if="dialogVisible" title="表单预览" :visible.sync="dialogVisible" width="75%" :close-on-click-modal="!1" destroy-on-close append-to-body>
      <div class="fm-designer-view">
        <FormModel ref="FormConfigViewRef" :formConfig="formConfigView"></FormModel>
      </div>
    </el-dialog>
    <MDialog v-if="isQuoteTemplateShow&&quoteComponent" v-model="isQuoteTemplateShow" width="90%" height="70vh" title="选择模板" onScreen>
      <component :is="quoteComponent" :is-quote="true" @onQuote="onQuote"></component>
    </MDialog>
  </div>
</template>
<script setup>
import Draggable from 'vuedraggable';
import {comps, templates} from './config/comps';
import FormModel from '../FormModel/index.vue';
import {computed, getCurrentInstance, onMounted, ref, watch} from "vue";
import {parseFormModel, parseJson, parseStage, parseStageFormConfig} from "./config";
import {formConfigProps} from "./config/defaultConfigProps";
import MDialog from '@/components/MDialog';

const {proxy} = getCurrentInstance();

const props = defineProps({
  fieldsArray: {type: [Array, Function], default: null},//字段名列表 为空手填
  hasSave: {type: Boolean, default: false},//是否显示保存按钮
  quoteComponent: {type: Object, default: null},//是否显示保存按钮
});

const isQuoteTemplateShow = ref(!1);
const dialogVisible = ref(!1);

const activeCollapse = ref((comps || []).map(c => c.name));
const activeTemplatesCollapse = ref((templates || []).map(t => t.name));

const compsPanelActive = ref('组件');

const configPanelActive = ref('表单配置');

const FormModelRef = ref();
const components = ref(comps);
const stage = ref([]);

watch(() => stage.value, () => {
  proxy.$$store.commit('fmDesigner/ADD_HISTORY', stage.value);
});

watch(() => proxy.$$store.getters['fmDesigner/GET_ACTIVE_COMP_ID'], (v) => {
  configPanelActive.value = v ? '组件配置' : '表单配置';
});

function layoutPut(to, form, item) {
  if (item.getAttribute('data-type') !== 'layout') {
    return !1;
  }
  return !0
}

function handleClone(item) {
  if (item.type === 'json') return parseStage(item.json, true);
  console.log('handleClone', item)
  return Object.assign({}, item, {
    cId: `${item.name}_ID_${proxy.$$getUUID()}`,
    children: item.children?.length ? item.children.map(c => handleClone(c)) : [],
    z_props: proxy.$$deepmerge(item.z_props)
  });
}

function handlerLayoutClick(node) {
  if (!proxy.$$store.getters['fmDesigner/GET_ACTIVE_COMP_ID']) return proxy.$$store.commit('fmDesigner/SET_ACTIVE_COMP_ID', node.cId);
  if (FormModelRef.value) return FormModelRef.value.validator(
      async formData => {//验证成功
        proxy.$$store.commit('fmDesigner/SET_ACTIVE_COMP_ID', node.cId);
      },
      () => {//验证失败
        proxy.$$Toast.error('配置验证不通过，请检查')
      }
  );
  proxy.$$store.commit('fmDesigner/SET_ACTIVE_COMP_ID', node.cId);
}

function handlerLayoutDel(node, parent) {
  const index = (parent || stage.value).findIndex(st => st.cId === node.cId);
  if (index >= 0) {
    (parent || stage.value).splice(index, 1);
    proxy.$$store.commit('fmDesigner/ADD_HISTORY', stage.value);
  }
}

function handlerLayoutCopy(node, parent) {
  // copy时必然为选择状态
  FormModelRef.value.validator(
      async formData => {//验证成功
        const index = (parent || stage.value).findIndex(st => st.cId === node.cId);
        if (index >= 0) {
          (parent || stage.value).splice(index, 0, handleClone(node));
          proxy.$$store.commit('fmDesigner/ADD_HISTORY', stage.value);
        }
      },
      () => {//验证失败
        proxy.$$Toast.error('无法操作，配置验证不通过，请检查')
      }
  );
}

function onClear() {
  proxy.$$Dialog.confirm('此操作将清空数据, 是否继续?', '提示', {
    confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
  }).then(() => stage.value = []).catch(proxy.$$emptyFn);
}

const formConfigView = ref();//预览

function onView(e) {
  formConfigView.value = parseFormModel(parseJson(stage.value, z_formConfigProps.value), true)
  dialogVisible.value = !0;
}

function finder(arr, cId) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].cId === cId) return arr[i];
    if (arr[i].children?.length) {
      const f = finder(arr[i].children, cId);
      if (f) return f;
    }
  }
  return null;
}

function formDataChange(formData) {
  const cId = proxy.$$store.getters['fmDesigner/GET_ACTIVE_COMP_ID'];
  if (!cId) return;
  const comp = finder(stage.value, cId);
  comp?.['z_props'].forEach(zp => zp.value = formData[zp.key]);
}

const compFormConfig = computed(() => {
  const cId = proxy.$$store.getters['fmDesigner/GET_ACTIVE_COMP_ID'];
  const comp = finder(stage.value, cId);
  return comp ? {
    formName: '',
    onLoad: async function ({vm}) {
      console.log('compFormConfig onLoad...', vm.reqQuery, vm.$attrs)
    },
    items: [
      {
        name: '',
        items: comp['z_props'].sort((a, b) => (a.sort ?? 9999) - (b.sort ?? 9999)).map(p => {
          // 对字段名进行处理 如果是有列表的使用下拉
          if (p.key === 'key') {
            const options = proxy.$$getVariableType(props.fieldsArray) === '[object Function]' ? props.fieldsArray() : props.fieldsArray;
            console.log('compFormConfig', options)
            if (options?.length) return Object.assign(p, {type: 'select', options});
            return Object.assign(p, {type: 'input', options: []});
          }
          return p;
        })
      },
    ]
  } : null
});

const z_formConfigProps = ref(formConfigProps());

watch(() => z_formConfigProps.value, () => proxy.$$store.commit('fmDesigner/ADD_FORM_HISTORY', z_formConfigProps.value));

function z_formConfigPropsChange(formData) {
  z_formConfigProps.value.forEach(zp => zp.value = formData[zp.key]);
}

const formConfig = computed(() => {
  return {
    formName: '',
    onLoad: async function ({vm}) {
      console.log('formConfig onLoad...', vm.reqQuery, vm.$attrs)
    },
    items: [
      {
        name: '',
        items: z_formConfigProps.value.sort((a, b) => (a.sort ?? 9999) - (b.sort ?? 9999))
      },
    ]
  }
});

function getJson() {
  return parseJson(stage.value, z_formConfigProps.value);
}

function onSave() {
  console.log('onSave', getJson());
  proxy.$emit('onSave', getJson());
}

//加载json
function loadJson(json) {
  stage.value = parseStage(json.stage, !1);
  z_formConfigProps.value = parseStageFormConfig(formConfigProps(), json.form);
}

//使用模板
function useTemplate(v) {
  proxy.$$Dialog.confirm(`使用模板将清空舞台数据，是否应用？`).then(() => {
    loadJson(v.json);
  }).catch(proxy.$$emptyFn)
}

//引用
function onQuote(data) {
  console.log('onQuote', data)
  loadJson(JSON.parse(data?.formTemplateConfig?.formContent));
  isQuoteTemplateShow.value = !1;
}

defineExpose({loadJson, getJson});

onMounted(() => {
  // const res = parseStage(testJson().stage);
  // stage.value = res;
})
</script>
<style lang="scss" scoped>
.fm-designer-view {
  max-height: 50vh;
  overflow: auto;
}

.FMDesigner {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  height: 100%;
  width: 100%;
  overflow: hidden;
  user-select: none;

  ::v-deep .draggable-item {
    display: flex;
    justify-content: flex-start;
    align-items: stretch;
    min-height: 32px;
  }

  .fm-designer-top-tools-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 48px;
    flex-grow: 0;
    flex-shrink: 0;
    background-color: #fff;
    border-bottom: 1PX solid #eee;
    padding: 0 10px;

    & > .t {
      font-size: 14px;
      font-weight: bold;
    }
  }

  .fm-designer-bottom-panel {
    display: flex;
    justify-content: flex-start;
    align-items: stretch;
    flex-grow: 1;
    overflow: hidden;


    & > .fm-designer-components-panel {
      position: relative;
      width: 300px;
      flex-grow: 0;
      flex-shrink: 0;
      overflow: auto;
      background-color: #fff;
      padding: 0 8PX;

      .quote-trigger {
        position: absolute;
        right: 8px;
        line-height: 40px !important;
        padding: 0 !important;
        font-size: 12px;
        z-index: 2;
      }

      ::v-deep(.el-collapse-item__header) {
        height: 32px;
        line-height: 32px;
      }

      ::v-deep(.el-collapse-item__wrap), ::v-deep(.el-collapse) {
        border: none !important;
      }

      .fm-designer-components-panel-inner {
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        align-content: flex-start;
        flex-wrap: wrap;
      }
    }

    & > .fm-designer-config-panel {
      width: 400px;
      flex-grow: 0;
      flex-shrink: 0;
      overflow: auto;
      background-color: #fff;
      padding: 0 8PX;

      ::v-deep(.el-tabs__header.is-top) {
        position: sticky;
        top: 0;
        background-color: #fff;
        z-index: 1;
      }

      ::v-deep(.el-tabs__content) {
        position: relative;
        z-index: 0;
      }
    }

    & > .fm-designer-stage-panel {
      flex-grow: 1;
      background-color: #eee;
      padding: 8px;
      width: 100%; //ie需要

      @import "../index.scss";

      & > .fm-designer-stage {
        position: relative;
        width: 100%;
        height: 100%;
        background-color: #fff;
        overflow: auto;

        & > .el-form {
          padding: 8PX;
          height: 100%;

          ::v-deep(.el-row) {
            position: relative;
            width: 100%;

            &.empty {
              min-height: 100%;
            }

            &.empty:after {
              content: '请从选择左侧板块组拖入此处';
              position: absolute;
              top: 0;
              right: 0;
              left: 0;
              bottom: 0;
              display: flex;
              justify-content: center;
              align-items: center;
              font-size: 14px;
              pointer-events: none;
              opacity: .8;
              border: 1PX dashed $main-disabled;
            }
          }
        }
      }
    }

    .fm-designer-components-item {
      width: calc(50% - 8px);
      text-align: center;
      font-size: 14px;
      line-height: 2;
      border: 1PX solid #d5d5d5;
      border-radius: 4px;
      cursor: pointer;
      clear: both;
      margin: 4px;
      color: rgb(97, 101, 110);;

      &.ghost {
        display: inline-block;
        width: 25%;
      }
    }
  }
}
</style>
