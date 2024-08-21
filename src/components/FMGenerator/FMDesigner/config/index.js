//通用配置
import {compsMap} from "./comps";
import useEvents from "./events";
import {buttonCompiler, buttonsCompiler, cascaderCompiler, customizationCompsCompiler, datePickerCompiler, inputCompiler, interfaceCompiler, selectCompiler, showConditionCompiler} from "./compiler";
import {$$isEmpty, $$getUUID} from "@/utils";

//配置列表转换值模型
export const getProps = (props_arr) => {
  return props_arr?.reduce((t, c) => (t[c.key] = c.value, t), {});
};

//组件转json
function compsStageJson(stage) {
  return stage.map(st => {
    const z_props = getProps(st.z_props);
    //OptionSelector 过滤
    if (z_props.optionsStaticValue?.length) z_props.optionsStaticValue = z_props.optionsStaticValue.filter(op => !$$isEmpty(op.label) && !$$isEmpty(op.value))
    //ConditionSelector 过滤
    if (z_props.showCondition?.length) z_props.showCondition = z_props.showCondition.filter(op => !$$isEmpty(op.key))
    return {cId: st.cId, name: st.name, compType: st.compType, z_props, children: st.children ? compsStageJson(st.children) : null}
  })
}

//舞台转json
export const parseJson = (stage, formConfigs) => {
  return {
    form: formConfigs ? getProps(formConfigs) : {},
    stage: compsStageJson(stage)
  }
};

//json配置转舞台  传入json.stage
export const parseStage = (json, isNewCID = false) => {
  return json.map(j => Object.assign({}, compsMap[j.name], {
    cId: isNewCID ? `${j.name}_ID_${$$getUUID()}` : j.cId,
    z_props: compsMap[j.name].z_props.map(zp => {
      // console.log('parseStage z_props', zp, j.z_props[zp.key], zp.value)
      return Object.assign({}, zp, {value: j.z_props[zp.key] ?? zp.value})
    }),
    children: j.children ? parseStage(j.children, isNewCID) : null
  }))
};

//json表单配置 转 表单真实配置 传入json.form
export const parseStageFormConfig = (formConfig, json) => {
  return formConfig.map(c => Object.assign(c, {value: json[c.key]}));
};

//json配置转表单渲染 isView预览？
export const parseFormModel = (json, isView = false) => {
  return {
    formName: '',
    loading: false,
    onLoad: async function ({vm, value}) {
      console.log('parseFormModel onLoad...', vm, value, json)
      if (isView) return;//预览跳过
      const events = useEvents();

      if (json.form?.eventsType === '接口') {
        return await interfaceCompiler({vm, value, opts: json.form});
      }
      json.form?.events?.forEach(evk => events[evk]?.fn?.({vm, value, eventsFields: json.form?.eventsFields || []}));
    },
    appendItems: null,
    hiddenFields: [].concat(
      json.form.hiddenFields?.map(hf => ({key: hf.label, value: hf.value})) || [],
      ...json.stage?.filter(it => ['隐藏域'].includes(it.z_props.isBtnBlock)).map(it => it.children.map(j => ({
        key: j.z_props.key, value: j.z_props.value
      })))
    ),
    items: [].concat(
      json.stage?.filter(it => !['按钮组', '隐藏域'].includes(it.z_props.isBtnBlock)).map(it => ({
        name: it.z_props.name, subName: it.z_props.subName,
        items: it.children.map(j => {
          return Object.assign(
            j?.z_props || {},
            {type: j.compType, key: j?.z_props?.key},
            selectCompiler(j, isView), // 选择框类型编译
            inputCompiler(j, isView), // 输入框类型编译
            buttonsCompiler(j, isView), // 按钮组型编译
            datePickerCompiler(j, isView), //日期选择编译
            cascaderCompiler(j, isView), //级联编译
            customizationCompsCompiler(j, isView), //自定义组件编译
            showConditionCompiler(j, isView), //显示条件编译
          );
        })
      })),
    ),
    bottomButtons: (function () {
      // 只能存在一个 其他忽略
      const FMButtons = json.stage?.filter(it => it.z_props.isBtnBlock === '按钮组')?.[0]?.children?.[0];
      if (!FMButtons) return {items: []}
      return {
        align: FMButtons.z_props.align,
        items: FMButtons.children.map(btn => Object.assign(
          btn?.z_props || {},
          {type: btn.compType},
          buttonCompiler(btn, isView), // 按钮组型编译
        ))
      }
    })()
  }
};

//验证配置项必填字段是否填写
export const stageValidator = arr => {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].z_props?.length) {
      for (let zpi = 0; zpi < arr[i].z_props.length; zpi++) {
        const zp = arr[i].z_props[zpi];
        if (zp.isRequire && ((Object.prototype.toString.call(zp.value) === '[object Array]' && !zp.value.length) || $$isEmpty(zp.value))) {
          const zpf = getProps(arr[i].z_props);
          return {cId: arr[i].cId, name: zpf.name, title: zp.name};
        }
      }
    }
    if (arr[i].children?.length) {
      const cid = stageValidator(arr[i].children);
      if (cid) return cid;
    }
  }
  return null;
}
