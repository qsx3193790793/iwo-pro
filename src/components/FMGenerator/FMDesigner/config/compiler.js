import useEvents from "./events";
import {parseGeoJSON} from "../../../../../public/static/js/echarts.min";

//选项字典获取渲染
function dictReqCompiler(dictName) {
  return async function ({vm}) {
    return await (new Promise((rs, rj) => setTimeout(() => rs([
      {label: '1', value: '1'}, {label: '2', value: '2'}
    ]), 1000)));
  }
}

//级联选择类型编译FMCascader.vue
export const cascaderCompiler = (j, isView) => {
  if (!['FMCascader', 'cascader'].includes(j.name)) return {};
  const events = useEvents();
  return {
    // 选项
    options: events[j.z_props['optionsEvent']]?.fn,
    value: j.z_props['value']?.split(','),
    //值变化时触发
    attrs: {props: {checkStrictly: j.z_props['checkStrictly']}},
    onChange: function ({vm, item}) {
      //处理关联字段
      if (j.z_props.relevance?.length) {
        // 如果清空了 则清空他关联字段
        if (!vm.formData[j.z_props.key]) return vm.resetFormData(j.z_props.relevance || []);
      }
      //触发关联事件
      if (isView) return;
      (j.z_props.events || []).forEach(evk => events[evk]?.fn?.({vm, item}));
      // //值变化时 是否调用接口
      // j.z_props.apiName && console.log('FMInput onChange 调用接口', j.z_props.key, vm);
    }
  }
};

//选择框类型编译
export const selectCompiler = (j, isView) => {
  if (!['FMSelect', 'FMRadio'].includes(j.name)) return {};
  const events = useEvents();
  return {
    // 选项
    options: (() => {
      if (j.z_props.optionsType === '静态数据') return j.z_props.optionsStaticValue || [];
      if (j.z_props.optionsType === '字典' && j.z_props.optionsDictName) return dictReqCompiler(j.z_props.optionsDictName);
      if (j.z_props.optionsType === '事件') return events[j.z_props['optionsEvent']]?.fn;
      return [];
    })(),
    //resetNextValue 是否重置关联表单
    onChange: function ({vm, item, resetNextValue = true}) {
      //处理关联字段
      if (j.z_props.relevance?.length) {
        j.z_props.relevance?.forEach(k => {
          //重置关联字段
          const finder = vm.expandFormConfigItems.find(efci => efci.key === k);
          if (finder) {
            //如果需要重置 清空下拉，表单  ； 详情回填时不需要清空的
            if (resetNextValue) vm.formData[k] = null, finder.options && (finder.options = []);
            //如果为空 触发关联关系 将级联传递下去
            if (!vm.formData[j.z_props.key]) return finder.onChange?.({vm, item: finder, resetNextValue});
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
      (j.z_props.events || []).forEach(evk => events[evk]?.fn?.({vm, item}));
    }
  }
};

//输入框类型编译
export const inputCompiler = (j, isView) => {
  if (!['FMInput'].includes(j.name)) return {};
  const events = useEvents();
  return {
    //值变化时触发
    onChange: function ({vm, item}) {
      //处理关联字段
      if (j.z_props.relevance?.length) {
        // 如果清空了 则清空他关联字段
        if (!vm.formData[j.z_props.key]) return vm.resetFormData(j.z_props.relevance || []);
      }
      //触发关联事件
      if (isView) return;
      (j.z_props.events || []).forEach(evk => events[evk]?.fn?.({vm, item}));
      // //值变化时 是否调用接口
      // j.z_props.apiName && console.log('FMInput onChange 调用接口', j.z_props.key, vm);
    }
  }
};

//日期类型编译
export const datePickerCompiler = (j, isView) => {
  if (!['FMDatePicker'].includes(j.name)) return {};
  const events = useEvents();
  return {
    type: j.z_props.dateType,
    //值变化时触发
    onChange: function ({vm, item}) {
      //处理关联字段
      if (j.z_props.relevance?.length) {
        // 如果清空了 则清空他关联字段
        if (!vm.formData[j.z_props.key]) return vm.resetFormData(j.z_props.relevance || []);
      }
      //触发关联事件
      if (isView) return;
      (j.z_props.events || []).forEach(evk => events[evk]?.fn?.({vm, item}));
      // //值变化时 是否调用接口
      // j.z_props.apiName && console.log('FMInput onChange 调用接口', j.z_props.key, vm);
    }
  }
};

//按钮类型编译
export const buttonCompiler = (j, isView) => {
  if (!['FMButton'].includes(j.name)) return {};
  const events = useEvents();
  console.log('buttonCompiler', j.z_props)
  return {
    //点击
    attrs: {
      disabled: j.z_props.isDisable,
      type: j.z_props.btnType,
    },
    btnName: j.z_props.btnName,
    onClick: function ({vm}) {
      //触发关联事件
      console.log(isView, j.z_props)
      if (isView) return;
      (j.z_props.events || []).forEach(evk => events[evk]?.fn?.({vm}));
    }
  }
};

//按钮组类型编译
export const buttonsCompiler = (j, isView) => {
  if (!['FMButtons'].includes(j.name)) return {};
  return {
    items: j.children.map(btn => Object.assign(buttonCompiler(btn, isView)))
  }
};

//自定义编译
export const customizationCompsCompiler = (j, isView) => {
  if (![
    'FMAddressSelector', 'FMBalanceSelector',
    'FMSalesSelector', 'FMPaymentSelector',
    'FMDingDanSelector', 'FMOrderSalesSelector'
  ].includes(j.name)) return {};
  const events = useEvents();
  return {
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
          if (isView) return;
          (j.z_props.events || []).forEach(evk => events[evk]?.fn?.({vm, item, value}));
        }
      }
    }
  }
};

//显示条件编译
export const showConditionCompiler = (j, isView) => {
  if (!j.z_props?.showCondition?.length) return {};
  return {
    isShow({vm}) {
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
