// 表单的配置
import {getProps} from "@/components/FMGenerator/FMDesigner/config/index";
import useEvents from "@/components/FMGenerator/FMDesigner/config/events";
import Vue from "vue";

// 查询所有key
export const keysFinder = (arr, filter = []) => {
  const FORM_HISTORY = Vue.prototype.$$store.getters['fmDesigner/GET_FORM_HISTORY'];
  const {hiddenFields} = getProps(FORM_HISTORY[FORM_HISTORY.length - 1]) || {};
  //去重相同key
  return Array.from(new Set(arr?.reduce((t, c) => {
    const {key, name} = getProps(c['z_props']);
    const rk = `${name}||${key}`;
    if (key && name && !filter.includes(rk) && !t.includes(rk)) t.push(rk);
    if (c.children?.length) t.push(...keysFinder(c.children, filter))
    return t;
  }, hiddenFields?.map(hk => `隐藏字段域||${hk.label}`) || [])));
}

//选项配置
export const optionsProps = (sort = 1) => [
  {
    sort: sort + 0.1, name: '选项源', key: 'optionsType', value: '静态数据', type: 'radio', options: [{label: '静态数据', value: '静态数据'}, {label: '系统字典', value: '字典'}, {label: '自定义字典', value: '自定义字典'}, {label: '事件', value: '事件'}], isRequire: !1, col: 24,
    onChange({vm}) {
      const dictApiMap = {'字典': vm.$$api.dict.optionselect, '自定义字典': vm.$$api.customDict.DictionaryTypeOptions};
      const finder = vm.expandFormConfigItems.find(efci => efci.key === 'optionsDictName');
      if (finder) {
        vm.formData.optionsDictName = '';
        finder.options = ['字典', '自定义字典'].includes(vm.formData.optionsType) ? async function ({vm}) {
          const {res, err} = await dictApiMap[vm.formData.optionsType]();
          return (res?.rows || res?.dataList || res?.list || []).map(r => ({label: r.dictName, value: r.dictType}))
        } : [];
      }
    }
  },
  {
    sort: sort + 0.2, name: '选项列表', key: 'optionsStaticValue', value: [{label: '预览1', value: '预览1'}, {label: '预览2', value: '预览2'}], type: 'component', component: 'OptionSelector', isRequire: !1, col: 24,
    isShow({vm}) {
      return vm.formData.optionsType === '静态数据'
    }
  },
  {
    sort: sort + 0.2, name: '数据字典', key: 'optionsDictName', value: '', type: 'select', isRequire: !1, col: 24,
    async options({vm}) {
      const dictApiMap = {'字典': vm.$$api.dict.optionselect, '自定义字典': vm.$$api.customDict.DictionaryTypeOptions};
      const {res, err} = await dictApiMap[vm.formData.optionsType]();
      return (res?.rows || res?.dataList || res?.list || []).map(r => ({label: r.dictName, value: r.dictType}))
    },
    isShow({vm}) {
      return ['字典', '自定义字典'].includes(vm.formData.optionsType)
    }
  },
  {
    sort: sort + 0.2, name: '数据源获取事件', key: 'optionsEvent', value: '', type: 'select', isRequire: !1, col: 24,
    options({vm}) {
      const events = useEvents();
      return Object.keys(events).map(etk => ({label: events[etk].label, value: etk}))
    },
    isShow({vm}) {
      return vm.formData.optionsType === '事件'
    },
  }
]

export const formConfigProps = () => [
  {
    sort: 1, name: '标签位置', key: 'labelPosition', value: 'right', type: 'radio', options: [{label: '顶部', value: 'top'}, {label: '左侧', value: 'right'}], isRequire: !1, col: 24,
    onChange({vm}) {
      vm.formData.labelWidth = vm.formData.labelPosition === 'right' ? 110 : 'auto';
    }
  },
  {
    sort: 2, name: '标签宽度（px）', key: 'labelWidth', value: 110, type: 'number', isRequire: !1, col: 24,
    isShow({vm}) {
      return vm.formData.labelPosition === 'right';
    }
  },
  {sort: 3, name: '初始化事件类型', key: 'eventsType', value: '事件', type: 'radio', options: [{label: '事件', value: '事件'}, {label: '接口', value: '接口'}], isRequire: !1, col: 24},
  {
    sort: 4, name: '绑定接口', key: 'interfaceName', value: '', type: 'component', component: 'ApiSelector', isRequire: !1, col: 24,
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
    sort: 4.1, name: '绑定入参', key: 'interfaceReqParams', value: [], type: 'component', component: 'OptionSelector', isRequire: !1, col: 24,
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
    sort: 4.1, name: '绑定出参', key: 'interfaceResParams', value: [], type: 'component', component: 'OptionSelector', isRequire: !1, col: 24,
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
    sort: 5, name: '绑定事件', key: 'events', value: [], type: 'multipleSelect', isRequire: !1, col: 24,
    options({vm}) {
      const events = useEvents();
      return Object.keys(events).map(etk => ({label: events[etk].label, value: etk}))
    },
    isShow({vm}) {
      return vm.formData.eventsType === '事件'
    }
  },
  {
    sort: 6, name: '绑定事件字段', key: 'eventsFields', value: [], type: 'component', component: 'OptionSelector', isRequire: !1, col: 24,
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
        return vm.formData.events?.filter(e => !!events[e])?.map(evKey=> ({
          label: events[evKey].label, options: (events[evKey].resFields || []).map(rk => ({label: `${rk.label}(${rk.value})`, value: rk.value}))
        }));
      }
    },
    isShow({vm}) {
      return vm.formData.eventsType === '事件'
    }
  },
  {sort: 7, name: '隐藏字段域', key: 'hiddenFields', attrs: {formPlaceholder: '字段名', toPlaceholder: '默认值',}, value: [], type: 'component', component: 'OptionSelector', isRequire: !1, col: 24},
];

// 组件通用配置 右侧配置会根据sort排序显示
const commonPropsMap = {
  col: {sort: 1, name: '栅格', key: 'col', value: 6, type: 'slider', min: 1, max: 24, isRequire: !0, col: 24},
  key: {
    sort: 2, name: '字段名', key: 'key', value: '', type: 'input', isRequire: !0, col: 24,
    rules: [{validator: (rule, value, cb) => Vue.prototype.$$validator.isVariable(value) ? cb() : cb(new Error('不符合变量规范')), trigger: ['blur', 'change']}]
  },
  isRequire: {sort: 3, name: '是否必填', key: 'isRequire', value: false, type: 'radio', options: [{label: '是', value: true}, {label: '否', value: false}], isRequire: !1, col: 24},
  isDisable: {sort: 4, name: '是否禁用', key: 'isDisable', value: false, type: 'radio', options: [{label: '是', value: true}, {label: '否', value: false}], isRequire: !1, col: 24},
  clearable: {sort: 5, name: '可清除', key: 'clearable', value: true, type: 'radio', options: [{label: '是', value: true}, {label: '否', value: false}], isRequire: !1, col: 24},
  value: {sort: 6, name: '默认值', key: 'value', value: '', placeholder: '数组类型按,号分割（1,2,3）', type: 'input', isRequire: !1, col: 24},
  name: {sort: 7, name: '标签名', key: 'name', value: '输入标签名称', type: 'input', isRequire: !1, col: 24},
  placeholder: {sort: 8, name: '占位符', key: 'placeholder', value: '', type: 'input', isRequire: !1, col: 24},
  showCondition: {
    sort: 9, name: '显示条件', key: 'showCondition', value: [], type: 'component', component: 'ConditionSelector', isRequire: !1, col: 24,
    attrs: {
      handleKeys({vm}) {
        const stage = vm.$$store.getters['fmDesigner/GET_HISTORY'];
        return keysFinder(stage[stage.length - 1], [vm.root.vm.formData.key]).map(rk => {
          const [label, key] = rk.split('||');
          return {label: `${label}(${key})`, value: key};
        });
      }
    }
  },
  relevance: {
    sort: 10, name: '关联字段', key: 'relevance', value: '', type: 'multipleSelect', isRequire: !1, col: 24,
    options({vm}) {
      const stage = vm.$$store.getters['fmDesigner/GET_HISTORY'];
      return keysFinder(stage[stage.length - 1], [vm.formData.key]).map(rk => {
        const [label, key] = rk.split('||');
        return {label: `${label}(${key})`, value: key};
      });
    }
  },
  // eventsType: {sort: 11, name: '事件类型', key: 'eventsType', value: '事件', type: 'radio', options: [{label: '事件', value: '事件'}, {label: '接口', value: '接口'}], isRequire: !1, col: 24},
  // apiKey: {
  //   sort: 11.5, name: '接口名', key: 'apiKey', value: '', type: 'component', component: 'ApiSelector', isRequire: !1, col: 24,
  //   isShow({vm}) {
  //     return vm.formData.eventsType === '接口'
  //   }
  // },
  events: {
    sort: 12, name: '绑定事件', key: 'events', value: [], type: 'multipleSelect', isRequire: !1, col: 24,
    options({vm}) {
      const events = useEvents();
      return Object.keys(events).map(etk => ({label: events[etk].label, value: etk}))
    }
  },
  eventsFields: {
    sort: 13, name: '绑定事件字段', key: 'eventsFields', value: [], type: 'component', component: 'OptionSelector', isRequire: !1, col: 24,
    attrs: {
      formPlaceholder: '表单字段', toPlaceholder: '绑定事件字段',
      handleValueKeys({vm}) {
        const events = useEvents();
        return vm.formData.events?.filter(e => !!events[e])?.map(evLabel => ({
          label: events[evLabel].label, options: (events[evLabel].resFields || []).map(rk => ({label: `${rk.label}(${rk.value})`, value: rk.value}))
        }));
      },
      handleKeys({vm}) {
        const stage = vm.$$store.getters['fmDesigner/GET_HISTORY'];
        return keysFinder(stage[stage.length - 1], []).map(rk => {
          const [label, key] = rk.split('||');
          return {label: `${label}(${key})`, value: key};
        });
      }
    }
  },
}

// defaultValue默认值  {events:[xxxx,xxx]}
export const commonProps = (commonPropsKeys = ['col', 'key', 'isRequire', 'isDisable', 'clearable', 'value', 'name', 'placeholder', 'showCondition', 'relevance', 'eventsType', 'events', 'eventsFields'], defaultValue = {}) => commonPropsKeys.map((key, idx) => Object.assign({}, commonPropsMap[key], {
  value: defaultValue[key] ?? commonPropsMap[key]?.value
}));
