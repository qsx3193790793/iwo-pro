import useEvents from "./events";
import {$$dayjs} from "@/utils";

//选项字典获取渲染
function dictReqCompiler(dictType) {
  return async function ({vm}) {
    await vm.$store.dispatch('dictionaries/GET_DICTIONARIES', {type: 'web', dicts: [dictType]})
    return vm.$store.getters['dictionaries/GET_DICT'](dictType);
  }
}

function createOptions(j) {
  const events = useEvents();
  if (j.z_props.optionsType === '静态数据') return j.z_props.optionsStaticValue || [];
  if (j.z_props.optionsType === '字典' && j.z_props.optionsDictName) return dictReqCompiler(j.z_props.optionsDictName);
  if (j.z_props.optionsType === '事件') return events[j.z_props['optionsEvent']]?.fn;
  return [];
}

function baseOnChange(j, isView) {
  const events = useEvents();
  return function ({vm, item, value}) {
    //处理关联字段
    if (j.z_props.relevance?.length) {
      // 如果清空了 则清空他关联字段
      if (!vm.formData[j.z_props.key]) return vm.resetFormData(j.z_props.relevance || []);
    }
    //触发关联事件
    if (isView) return;
    (j.z_props.events || []).forEach(evk => events[evk]?.fn?.({vm, item, value}));
    // //值变化时 是否调用接口
    // j.z_props.apiName && console.log('FMInput onChange 调用接口', j.z_props.key, vm);
  }
}

//接口时间编译
export const interfaceCompiler = async ({vm, value, item, opts}) => {
  const formData = vm.getFormData();
  const {res, err} = await vm.$$api.interface.requestApi({
    data: {
      interfaceCode: opts.interfaceCode,
      requestParam: JSON.stringify((opts.interfaceReqParams || []).reduce((t, c) => {
        // 目前模板配置三类型取值 $public$开头-通用字段  $ext$开头-扩展字段 其他默认场景字段
        if (c.value.startsWith('$public$')) vm.$$lodash.set(t, c.label, formData[c.value.replace('$public$', '')]);
        else vm.$$lodash.set(t, c.label, formData[c.value]);
        return t;
      }, {}))
    }
  });
  // 赋值出参
  (opts.interfaceResParams || []).forEach(ef => {
    const v = vm.$$lodash.get(res || {}, ef.value);
    if (vm.$$isEmpty(v)) return;
    if (ef.label.startsWith('$public$')) formData[ef.label.replace('$public$', '')] = v;
    else vm.formData[ef.label] = v;
  });
}

//显示条件编译
export const showConditionCompiler = (j) => {
  if (['FMButtons'].includes(j.name) || !j.z_props?.showCondition?.length) return {};
  return {
    isShow({vm}) {
      if (['FMButton'].includes(j.name) && !j.z_props.isShowInDetail && vm.disabled) return false;//对于按钮 先看是否在详情中展示
      return j.z_props.showCondition.map((sc, idx) => {//先处理数据true|false
        const result = sc.value?.split(',').includes(vm.formData[sc.key]);
        return {
          result: sc.condition === '等于' ? result : !result,
          nextRelation: idx < j.z_props.showCondition.length - 1 ? sc.relation : null
        };
      }).reduce((t, c) => {//再处理关系 || &&
        if (t === null) return (t = {result: c.result, nextRelation: c.nextRelation}, t);//第一次先赋值第一个数据
        return (t = {result: t.nextRelation === '||' ? (t.result || c.result) : (t.result && c.result), nextRelation: c.nextRelation}, t);
      }, null).result;
    }
  }
}

//级联选择类型编译FMCascader.vue
export const cascaderCompiler = (j, isView) => {
  if (!['FMCascader', 'cascader'].includes(j.name)) return {};
  const events = useEvents();
  return {
    // 选项
    options: events[j.z_props['optionsEvent']]?.fn,
    value: j.z_props['value'] ? j.z_props['value'].split(',') : [],
    //值变化时触发
    attrs: {props: {checkStrictly: j.z_props['checkStrictly']}},
    onChange: baseOnChange(j, isView)
  }
};

//选择框类型编译
export const selectCompiler = (j, isView) => {
  if (!['FMSelect', 'FMRadio'].includes(j.name)) return {};
  const events = useEvents();
  return {
    // 选项
    options: createOptions(j),
    //resetNextValue 是否重置关联表单
    onChange: function ({vm, item, value, resetNextValue = true}) {
      //处理关联字段
      if (j.z_props.relevance?.length) {
        j.z_props.relevance?.forEach(k => {
          //重置关联字段
          const finder = vm.expandFormConfigItems.find(efci => efci.key === k);
          if (finder) {
            //如果需要重置 清空下拉，表单  ； 详情回填时不需要清空的
            if (resetNextValue) vm.formData[k] = null, finder.options && (finder.options = []);
            //如果为空 触发关联关系 将级联传递下去
            if (!vm.formData[j.z_props.key]) return finder.onChange?.({vm, value, item: finder, resetNextValue});
            // //如果不为空 调用接口
            // if (finder.apiName) {
            //   console.log('FMSelect onChange 调用接口', finder.key, finder.apiName, finder.apiParams, vm);
            //   finder.options = Array.from({length: 0 | Math.random() * 16}).map((v, i) => ({label: `${finder.key}-${i}`, value: i}))
            // }
          }
        });
      }
      //触发关联事件
      if (isView) return;
      (j.z_props.events || []).forEach(evk => events[evk]?.fn?.({vm, value, item}));
    }
  }
};

//输入框类型编译
export const inputCompiler = (j, isView) => {
  if (!['FMInput'].includes(j.name)) return {};
  return {
    //值变化时触发
    onChange: baseOnChange(j, isView)
  }
};

//日期类型编译
export const datePickerCompiler = (j, isView) => {
  if (!['FMDatePicker'].includes(j.name)) return {};
  return {
    type: j.z_props.dateType,
    value: (function () {
      if (['FMDateRangePicker', 'FMDateTimeRangePicker', 'FMMonthRangePicker', 'FMDatesPicker', 'FMMonthsPicker', 'FMYearsPicker'].includes(j.z_props.dateType)) return [];
      return null//$$dayjs().format('YYYY-MM-DD HH:mm:ss');
    })(),
    //值变化时触发
    onChange: baseOnChange(j, isView)
  }
};

//按钮类型编译
export const buttonCompiler = (j, isView) => {
  if (!['FMButton'].includes(j.name)) return {};
  const events = useEvents();
  return {
    //点击
    attrs: {
      disabled: j.z_props.isDisable,
      type: j.z_props.btnType,
    },
    type: 'button',
    btnName: j.z_props.btnName,
    ...showConditionCompiler(j),
    onClick: async function ({vm, value, item}) {
      console.log('onClick', vm, j.z_props);
      //触发关联事件
      if (isView) return;
      if (j.z_props.eventsType === '接口') {
        return await interfaceCompiler({vm, value, item, opts: j.z_props});
      }
      (j.z_props.events || []).forEach(evk => events[evk]?.fn?.({vm, value, item}));
    }
  }
};

//按钮组类型编译
export const buttonsCompiler = (j, isView) => {
  if (!['FMButtons', 'FMApi'].includes(j.name)) return {};
  return {
    items: j.children.map(btn => buttonCompiler(btn, isView)),
    isShow({vm}) {
      if (!j.z_props.isShowInDetail && vm.disabled) return false;
      return !!this.items.filter(bv => (!bv.isShow) || bv.isShow({vm})).length;
    }
  }
};

//自定义编译
export const customizationCompsCompiler = (j, isView) => {
  if (![
    'FMAddressSelector', 'FMSalesSelector', 'FMPaymentSelector',
    'FMDingDanSelector', 'FMOrderSalesSelector', 'FMPointCosHisSelector', 'FMDisputeChannelSelector'
  ].includes(j.name)) return {};
  const events = useEvents();
  return {
    // 选项
    options: j.name === 'FMDisputeChannelSelector' ? events[j.z_props['optionsEvent']]?.fn : null,
    attrs: j.name === 'FMDisputeChannelSelector' ? {props: {checkStrictly: j.z_props['checkStrictly']}} : null,
    emitter({vm, item}) {
      return {
        //确认触发
        onConfirm: function (value) {
          //处理关联字段
          if (j.z_props.relevance?.length) {
            // 如果清空了 则清空他关联字段
            if (!vm.formData[j.z_props.key]) return vm.resetFormData(j.z_props.relevance || []);
          }
          //触发关联事件
          // if (isView) return;
          (j.z_props.events || []).forEach(evk => events[evk]?.fn?.({vm, item, value}));
        }
      }
    }
  }
};


