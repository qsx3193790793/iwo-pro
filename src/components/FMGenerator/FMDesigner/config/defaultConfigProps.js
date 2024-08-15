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
  {sort: sort + 0.1, name: '选项源', key: 'optionsType', value: '静态数据', type: 'radio', options: [{label: '静态数据', value: '静态数据'}, {label: '字典', value: '字典'}, {label: '事件', value: '事件'}], isRequire: !1, col: 24},
  {
    sort: sort + 0.2, name: '选项列表', key: 'optionsStaticValue', value: [{label: '预览1', value: '预览1'}, {label: '预览2', value: '预览2'}], type: 'component', component: 'OptionSelector', isRequire: !1, col: 24,
    isShow({vm}) {
      return vm.formData.optionsType === '静态数据'
    }
  },
  {
    sort: sort + 0.2, name: '数据字典', key: 'optionsDictName', value: '', type: 'select', isRequire: !1, col: 24,
    options: [
      {label: '性别', value: 'dict_sex'}
    ],
    isShow({vm}) {
      return vm.formData.optionsType === '字典'
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
  {sort: 1, name: '初始化事件类型', key: 'eventsType', value: '事件', type: 'radio', options: [{label: '事件', value: '事件'}, {label: '接口', value: '接口'}], isRequire: !1, col: 24},
  {
    sort: 2, name: '绑定事件', key: 'events', value: [], type: 'multipleSelect', isRequire: !1, col: 24,
    options({vm}) {
      const events = useEvents();
      return Object.keys(events).map(etk => ({label: events[etk].label, value: etk}))
    },
    isShow({vm}) {
      return vm.formData.eventsType === '事件'
    }
  },
  {
    sort: 3, name: '绑定事件字段', key: 'eventsFields', value: [], type: 'component', component: 'OptionSelector', isRequire: !1, col: 24,
    attrs: {
      formPlaceholder: '选择字段', toPlaceholder: '绑定字段',
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
      },
    }
  },
  // {
  //   sort: 1, name: '关联初始化事件', key: 'events', value: '', type: 'multipleSelect', isRequire: !1, col: 24,
  //   options({vm}) {
  //     const events = useEvents();
  //     return Object.keys(events).map(etk => ({label: events[etk].label, value: etk}))
  //   }
  // },
  {sort: 4, name: '隐藏字段域', key: 'hiddenFields', attrs: {formPlaceholder: '字段名', toPlaceholder: '默认值',}, value: [], type: 'component', component: 'OptionSelector', isRequire: !1, col: 24},
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
  reqFields: {
    sort: 10.1, name: '绑定入参', key: 'reqFields', value: [], type: 'component', component: 'OptionSelector', isRequire: !1, col: 24,
    attrs: {
      formPlaceholder: '选择字段', toPlaceholder: '绑定字段',
      handleValueKeys({vm}) {
        const stage = vm.$$store.getters['fmDesigner/GET_HISTORY'];
        return [
          {
            label: '当前表单',
            options: keysFinder(stage[stage.length - 1], []).map(rk => {
              const [label, key] = rk.split('||');
              return {label: `${label}(${key})`, value: key};
            })
          }
        ]
      },
      handleKeys({vm}) {
        return [
          {label: '订单编号(orderId)', value: 'orderId'}
        ]
      }
    }
  },
  eventsType: {sort: 11, name: '事件类型', key: 'eventsType', value: '事件', type: 'radio', options: [{label: '事件', value: '事件'}, {label: '接口', value: '接口'}], isRequire: !1, col: 24},
  events: {
    sort: 12, name: '绑定事件', key: 'events', value: [], type: 'multipleSelect', isRequire: !1, col: 24,
    options({vm}) {
      const events = useEvents();
      return Object.keys(events).map(etk => ({label: events[etk].label, value: etk}))
    },
    isShow({vm}) {
      return vm.formData.eventsType === '事件'
    }
  },
  eventsFields: {
    sort: 13, name: '绑定事件字段', key: 'eventsFields', value: [], type: 'component', component: 'OptionSelector', isRequire: !1, col: 24,
    attrs: {
      formPlaceholder: '选择字段', toPlaceholder: '绑定字段',
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
export const commonProps = (commonPropsKeys = ['col', 'key', 'isRequire', 'isDisable', 'clearable', 'value', 'name', 'placeholder', 'showCondition', 'relevance', 'eventsType', 'events', 'eventsFields']) => commonPropsKeys.map((key, idx) => Object.assign({}, commonPropsMap[key]));
