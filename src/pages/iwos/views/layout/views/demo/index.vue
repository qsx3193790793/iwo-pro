<template>
  <div ref="MainRef" class="main-container">
    <div class="my-form">
      <div class="inner">
        <FormModel ref="FormModelRef" :formConfig="formConfig"></FormModel>
      </div>
    </div>
    <div class="my-form">
      <div class="inner">
        <FormCreate ref="FormCreateRef" v-model="formData" v-model:api="fApi" v-bind="opts" :config="config"></FormCreate>
      </div>
    </div>
    <el-button type="primary" @click="getJson">获取</el-button>
    <FcDesigner ref="FcDesignerRef" style="width: 100%;"></FcDesigner>
  </div>
</template>

<script setup>
// import formCreate from "@form-create/element-ui";
// import FcDesigner from '@form-create/designer';
import FormModel from '@/components/FMGenerator/FormModel';
import iconfontJson from '/public/static/css/iconfont/iconfont.json';
// import MD from './MD.vue';
import Placeholder from './Placeholder.vue';

import {defineComponent, h, getCurrentInstance, nextTick, onBeforeMount, ref} from "vue";

// FcDesigner.component('MD', MD);
// const FormCreate = formCreate.$form();

const {proxy} = getCurrentInstance();

const IconfontComp = defineComponent({
  props: {
    item: {type: Object, default: null}
  },
  setup(props) {
    return () => [
      h('div', {style: {display: 'flex'}}, [
        h('i', {
          class: `iconfont ${props.item?.value}`,
          style: {fontStyle: 'normal', marginRight: '0.05rem'}
        }, ``),
        h('span', {}, `${props.item?.label}`),
      ])
    ]
  }
});

const formConfig = ref({
  formName: '',
  onLoad: async function ({vm}) {
    console.log('formConfig onLoad...', vm.reqQuery, vm.$attrs)
  },
  items: [
    {
      name: '',
      items: [
        {name: 'id', key: 'id', value: null, type: 'input', isHidden: !0, isDisable: !0, isRequire: !1},
        {name: 'configStatus', key: 'configStatus', value: '1', type: 'input', isHidden: !0, isDisable: !0, isRequire: !1},
        {name: 'systemScope', key: 'systemScope', value: '1000', type: 'input', isHidden: !0, isDisable: !0, isRequire: !1},
        {
          name: '父菜单', key: 'parMenuId', value: '父菜单', col: 8, type: 'cascader', isDisable: !1, isRequire: !0,
          options: [{menuName: '主菜单', id: '0', children: []}],
          attrs: {
            props: {label: 'menuName', value: 'id', checkStrictly: !0, emitPath: !1}
          },
          onChange(args) {
            console.log('onChange', args)
          }
        },
        {name: '菜单类型', key: 'menuType', value: '是', col: 8, type: 'radio', options: [{label: '是', value: '是'}, {label: '否', value: '否'}], isDisable: !1, isRequire: !0},
        {name: '菜单名称', key: 'menuName', value: '', col: 8, type: 'input', isDisable: !1, isRequire: !0},
        {name: '权限编码', key: 'menuCode', value: '', placeholder: '如 sys:code:xxx', col: 8, type: 'input', isDisable: !1, isRequire: !0},
        {name: '链接类型', key: 'menuUrlType', value: '是', col: 8, type: 'radio', options: [{label: '是', value: '是'}, {label: '否', value: '否'}], isDisable: !1, isRequire: !0},
        {name: '路由/地址', key: 'menuUrl', value: '', col: 8, type: 'input', isDisable: !1, isRequire: !1},
        {name: '菜单排序', key: 'sort', value: 0, col: 8, type: 'number', isDisable: !1, isRequire: !1},
        {
          name: '菜单图标', key: 'menuIco', value: '', col: 8, type: 'select', isDisable: !1, isRequire: !1,
          options: iconfontJson.glyphs.map(ic => ({
            label: `${iconfontJson.css_prefix_text}${ic.font_class}`, value: `${iconfontJson.css_prefix_text}${ic.font_class}`
          })),
          label_component: IconfontComp,
          option_component: IconfontComp
        },
        {name: '菜单状态', key: 'status', value: '否', col: 8, type: 'radio', options: [{label: '是', value: '是'}, {label: '否', value: '否'}], isDisable: !1, isRequire: !1},
        {name: '占位符', key: 'fileId', value: '', type: 'component', col: 24, component: Placeholder, attrs: {}}

      ]
    },
  ]
});

// const formData = ref({});
// const fApi = ref({});
// const config = ref({});
//
// console.log('FormCreate', FormCreate, FcDesigner)
//
// const FcDesignerRef = ref();
// const FormCreateRef = ref();
// const MainRef = ref({
//   formRule: {
//     prepend: true,
//     rule() {
//       return [
//         {
//           type: 'input',
//           field: 'xxx',
//           value: "top"
//         }
//       ]
//     }
//   }
// });
//
// const opts = ref({
//   "option": {
//     "form": {
//       "inline": false,
//       "hideRequiredAsterisk": false,
//       "labelPosition": "right",
//       "size": "default",
//       "labelWidth": "125px"
//     },
//     "resetBtn": {
//       "show": false,
//       "innerText": "重置"
//     },
//     "submitBtn": {
//       "show": true,
//       "innerText": "提交"
//     }
//   },
//   "rule": [
//     {
//       "type": "MD",
//       "props": {
//         "visible": false,
//         "title": "输入标题"
//       },
//       "on": {
//         "opened": "$FNX:console.log('opened',$inject)",
//         "update:visible": "$FNX:$inject.rule.find(r=>r.name==='ref_F0ohly6zq4r3acc').props.visible=false"
//       },
//       "children": [
//         {
//           "type": "elButton",
//           "children": [
//             "按钮"
//           ],
//           "_fc_id": "id_Fhpnly6zqcviagc",
//           "name": "ref_Fsy4ly6zqcviahc",
//           "display": true,
//           "hidden": false,
//           "_fc_drag_tag": "elButton",
//           "on": {
//             "click": "$FNX:$inject.rule.find(r=>r.name==='ref_F0ohly6zq4r3acc').props.visible=false;",
//           }
//         },
//         {
//           "type": "input",
//           "field": "F7uuly6zq77aadc",
//           "title": "输入框",
//           "info": "",
//           "$required": false,
//           "_fc_id": "id_Fu40ly6zq77aaec",
//           "name": "ref_F9z0ly6zq77aafc",
//           "display": true,
//           "hidden": false,
//           "_fc_drag_tag": "input"
//         }
//       ],
//       "_fc_id": "id_Fhbyly6zq4r3abc",
//       "name": "ref_F0ohly6zq4r3acc",
//       "display": true,
//       "hidden": false,
//       "_fc_drag_tag": "md"
//     },
//     {
//       "type": "elButton",
//       "children": [
//         "按钮"
//       ],
//       "_fc_id": "id_Fj48ly6zqk0eaic",
//       "name": "ref_F01oly6zqk0eajc",
//       "display": true,
//       "hidden": false,
//       "_fc_drag_tag": "elButton",
//       "on": {
//         "click": "$FNX:$inject.rule.find(r=>r.name==='ref_F0ohly6zq4r3acc').props.visible=true;"
//       }
//     }
//   ]
// })
//
// function getJson() {
//   console.log({
//     option: FcDesignerRef.value.getOption(),
//     rule: FcDesignerRef.value.getRule(),
//   })
//   opts.value = {
//     option: FcDesignerRef.value.getOption(),
//     rule: FcDesignerRef.value.getRule(),
//   }
// }

onBeforeMount(() => {
  nextTick(() => {
    // fApi.value.$$api = proxy.$$api;
    // console.log(fApi.value, FcDesignerRef.value, FcDesignerRef.value.getConfig(), FormCreateRef.value, FcDesigner.value)
    // FcDesignerRef.value.addComponent({
    //   //插入菜单位置
    //   menu: 'layout',
    //   //图标
    //   icon: 'icon-col',
    //   //名称
    //   label: '弹窗',
    //   //id,唯一!
    //   name: 'md',
    //   //可以向内部拖入组件
    //   drag: true,
    //   //组件操作按钮生成在组件的内部还是外部
    //   inside: false,
    //   //不显示遮罩,容器组件不能显示遮罩
    //   mask: false,
    //   event: ['opened'],
    //   effect: {
    //     fetch: ''
    //   },
    //   //生成规则
    //   rule() {
    //     return {
    //       type: 'MD',
    //       props: {visible: !1, title: '输入标题'},
    //       children: []
    //     };
    //   },
    //   //属性配置规则
    //   props(_, {t}) {
    //     return [
    //       FcDesigner.makeOptionsRule(t, 'options'),
    //       {
    //         type: 'input',
    //         title: '标题',
    //         field: 'title'
    //       }, {
    //         type: 'switch',
    //         title: '是否显示',
    //         field: 'visible'
    //       }];
    //   }
    // });
    // FcDesignerRef.value.setOptions(opts.value.option)
    // FcDesignerRef.value.setRule(opts.value.rule)
  })
});
</script>
<script>
export default {name: 'Demo'}
</script>
<style lang="scss" scoped>
.items {
  display: flex;
  justify-content: flex-start;
  align-items: stretch;

  & > .item {
    margin-right: 16px;

    &:last-child {
      margin-right: 0;
    }
  }

  &.size-2 {
    flex-wrap: wrap;

    & > .item {
      width: calc(50% - 8px);

      &:nth-of-type(n) {
        margin-right: 8px;
        margin-left: 0;
      }

      &:nth-of-type(2n) {
        margin-right: 0;
        margin-left: 8px;
      }
    }
  }

  &.size-3 {
    flex-wrap: wrap;

    & > .item {
      width: calc(33.33% - 8px);

      &:nth-of-type(n) {
        margin-right: 8px;
        margin-left: 0;
      }

      &:nth-of-type(3n) {
        margin-right: 0;
        margin-left: 8px;
      }
    }
  }
}

.my-form {
  display: flex;
  justify-content: center;
  border: 1PX solid #6a6a6a;
  background-color: #fff;
  padding: 10px;

  & > .inner {
    width: 1000px;
  }
}
</style>
