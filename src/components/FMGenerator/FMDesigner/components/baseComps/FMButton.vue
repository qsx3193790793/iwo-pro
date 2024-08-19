<template>
  <DragElement v-bind="$attrs" v-on="$listeners">
    <div v-if="props_bind?.verticalAlign!=='top'" class="empty-inline" style="height: 0.28rem;"></div>
    <el-button v-bind.sync="props_bind" :type="props_bind.btnType" :disabled="props_bind?.isDisable">{{ props_bind?.btnName }}</el-button>
  </DragElement>
</template>
<script setup>
import DragElement from "../DragElement.vue";
import {computed, getCurrentInstance, useAttrs} from "vue";
import {getProps} from "../../config";

const {proxy} = getCurrentInstance();

const props_bind = computed(() => getProps(useAttrs().props));

</script>
<script>
import {getProps} from "../../config";
import {commonProps, keysFinder} from "../../config/defaultConfigProps";
import useEvents from "@/components/FMGenerator/FMDesigner/config/events";

export default {
  name: 'FMButton',
  compType: 'FMButton',
  title: '按钮',
  cId: '',
  type: 'comp',
  z_props: [].concat(commonProps(['isDisable', 'showCondition']), [
    {sort: -1, name: '组件类型', key: 'type', value: 'FMButton', type: 'input', isDisable: !0, isRequire: !1, col: 24},
// {sort: 1, name: '栅格（按钮组内不生效）', key: 'col', value: 6, type: 'slider', min: 1, max: 24, isRequire: !0, col: 24},
    // {sort: 5.1, name: '垂直对齐（按钮组内不生效）', key: 'verticalAlign', value: 'form', type: 'radio', options: [{label: '表单', value: 'form'}, {label: '顶部', value: 'top'}], isRequire: !1, col: 24},
    {sort: 5.2, name: '按钮名称', key: 'btnName', value: '按钮', type: 'input', isRequire: !1, col: 24},
    {
      sort: 5.3, name: '按钮类型', key: 'btnType', value: 'primary', type: 'select', isRequire: !1, col: 24,
      options: [
        {label: 'default（白）', value: 'default'},
        {label: 'primary（蓝）', value: 'primary'},
        {label: 'success（绿）', value: 'success'},
        {label: 'warning（黄）', value: 'warning'},
        {label: 'danger（红）', value: 'danger'},
        {label: 'info（灰）', value: 'info'},
        {label: 'text（文字）', value: 'text'},
      ]
    },
    {sort: 11, name: '事件类型', key: 'eventsType', value: '事件', type: 'radio', options: [{label: '事件', value: '事件'}, {label: '接口', value: '接口'}], isRequire: !1, col: 24},
    {
      sort: 12, name: '绑定接口', key: 'interfaceName', value: '', type: 'component', component: 'ApiSelector', isRequire: !1, col: 24,
      emitter({vm, item}) {
        return {
          onConfirm: function (value) {
            console.log(value)
            vm.formData.interfaceName = value?.interfaceName;
            vm.formData.interfaceCode = value?.interfaceCode;
            vm.formData.interfaceReqParamsArray = (value?.requestParam ? JSON.parse(value?.requestParam) : []).map(r => ({label: `${r.label}(${r.key})`, value: r.key}));
            vm.formData.interfaceResParamsArray = (value?.responseParam ? JSON.parse(value?.responseParam) : []).map(r => ({label: `${r.label}(${r.key})`, value: r.key}));
          }
        }
      },
      isShow({vm}) {
        return vm.formData.eventsType === '接口'
      }
    },
    {
      sort: 12.1, name: '绑定入参', key: 'interfaceReqParams', value: [], type: 'component', component: 'OptionSelector', isRequire: !1, col: 24,
      attrs: {
        formPlaceholder: '入参字段', toPlaceholder: '绑定表单字段',
        handleValueKeys({vm}) {
          return [
            {
              label: '',
              options: vm.formConfig.fieldsArray
              // options: keysFinder(stage[stage.length - 1], []).map(rk => {
              //   const [label, key] = rk.split('||');
              //   return {label: `${label}(${key})`, value: key};
              // })
            }
          ]
        },
        handleKeys({vm}) {
          return vm.formData.interfaceReqParamsArray || [];
        }
      },
      isShow({vm}) {
        return vm.formData.eventsType === '接口'
      }
    },
    {
      sort: 12.2, name: '绑定出参', key: 'interfaceResParams', value: [], type: 'component', component: 'OptionSelector', isRequire: !1, col: 24,
      attrs: {
        formPlaceholder: '表单字段', toPlaceholder: '绑定出参字段',
        handleValueKeys({vm}) {
          return [
            {
              label: '',
              options: vm.formData.interfaceResParamsArray || []
            }
          ]
        },
        handleKeys({vm}) {
          const stage = vm.$$store.getters['fmDesigner/GET_HISTORY'];
          return keysFinder(stage[stage.length - 1], []).map(rk => {
            const [label, key] = rk.split('||');
            return {label: `${label}(${key})`, value: key};
          })
        }
      },
      isShow({vm}) {
        return vm.formData.eventsType === '接口'
      }
    },
    {isHidden: !0, key: 'interfaceCode', value: ''},
    {isHidden: !0, key: 'interfaceReqParamsArray', value: []},
    {isHidden: !0, key: 'interfaceResParamsArray', value: []},
    {
      sort: 15, name: '绑定事件', key: 'events', value: [], type: 'multipleSelect', isRequire: !1, col: 24,
      options({vm}) {
        const events = useEvents();
        return Object.keys(events).map(etk => ({label: events[etk].label, value: etk}))
      },
      isShow({vm}) {
        return vm.formData.eventsType === '事件'
      }
    },
    {
      sort: 15.1, name: '绑定事件字段', key: 'eventsFields', value: [], type: 'component', component: 'OptionSelector', isRequire: !1, col: 24,
      attrs: {
        formPlaceholder: '表单字段', toPlaceholder: '绑定事件字段',
        handleKeys({vm}) {
          const stage = vm.$$store.getters['fmDesigner/GET_HISTORY'];
          return keysFinder(stage[stage.length - 1], []).map(rk => {
            const [label, key] = rk.split('||');
            return {label: `${label}(${key})`, value: key};
          });
        },
        handleValueKeys({vm}) {
          const events = useEvents();
          return vm.formData.events?.filter(e => !!events[e])?.map(evLabel => ({
            label: events[evLabel].label, options: (events[evLabel].resFields || []).map(rk => ({label: `${rk.label}(${rk.value})`, value: rk.value}))
          }));
        }
      },
      isShow({vm}) {
        return vm.formData.eventsType === '事件'
      }
    },
  ])
}
</script>
<style lang="scss" scoped>
</style>
