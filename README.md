# 新版本h5工程 vue2.7 后续代码在此工程中开发

# UI框架采用element-ui

# 腾讯源

npm config set registry https://mirrors.cloud.tencent.com/npm/

PC端入口引用main_pc.js

# 运行方式

** 需要nodejs版本14.21.0

## npm run serve:xxxx

## npm run build:build:xxxx

#### pkgName入口包名，entry.js所在文件夹名，每个entry.js代表一个入口

### 访问地址为：xxxx/{VUE_APP_PUBLIC_PATH}/ssb/{pkgName}.html#/路由

#### 示例：https://host/act/sit/ssb/xxx.html#/

## npm run serve --env.pkg={pkgName需要的包名}，会单独运行这个包

#### 示例：npm run serve --env.pkg=xxx

### 访问地址为：xxxx/{VUE_APP_PUBLIC_PATH}/{pkgName}/index.html#/路由

### build打包同上

# 需兼容ie11 以下操作避免使用**

```html
<!--不要使用var()-->
<div class="xxx" :style="{'--w':boolean?'100rem':'6rem'}">
  <style>
    .xxx {
      width: var(--w);
    }
  </style>
  <!--请直接使用css variables-->
  <div class="xxx" :style="{width:boolean?'100rem':'6rem'}">
```

# 路由配置

由文件内option.js控制，配置同vue-router，每个页面对应一个option.js，只有配置了option才可以进入该页面。 路由命名规范：name和文件夹名字保持一致，如果是驼峰写法 path用下划线代替

#### parents：当前路由所属的父级路由。多级表示为 parents: 'routeA/routeB/routeC'

#### path：当前路由

#### name：别名

#### component：页面组件

#### meta：页面meta 可以针对性做些相关处理

```JavaScript
export default {
  parents: 'Layout',
  path: 'progressiveness_type_desc',
  name: 'ProgressivenessTypeDesc', //如果用到keepAlive，则该name需要和页面name保持一致
  component: () => import('./index.vue'),
  meta: {
    belong: 'System',//属于哪个一级菜单名称 高亮指向哪个菜单
    parentName: 'UserIndex',//父级路由名称 用来定位二级导航 高亮指向哪个菜单 （仅针对二级以上的路由）
    name: '个人中心',//tab名称
    title: '智慧客服工单系统',//固定不动
    authentication: true,//该页面是否需要登陆才可进入
    keepAlive: !0,
    pageLevel: 6 //缓存页面时用到 进入页面时会删除大于该页面pageLevel的keepAlive，再次进入时会重新添加
  }
};
```

# 接口请求

采用async await模式，默认只走resolve httpcode=0 rescode=200 才会返回res,其他情况返回err，取消情况canceled=true

```JavaScript
const {res, err, canceled} = await this.$$api.module.getUserInfo();
if (err) return;//接口异常
//---走正常res逻辑
```

# rem尺寸

### 1920设计稿px插件会自动转，或者手动(1920px/100)rem

# 工具类

### src/utils/index.js 封装了很多公共方法 可直接使用，后续有公共的逻辑告知下 封装在里面

```JavaScript
this.$$xxxxxx
```

# 字典类

```JavaScript
export default {
  dicts: ['sys_oper_type', 'sys_common_status'],//若依原始字典
  cusDicts: ['sys_oper_type', 'sys_common_status'],//新自定义字典
}
// 通过$options的dicts传入字典名 获取字典 会缓存 第二次不会获取接口直接拿缓存
// 使用基本
// {{ $store.getters['dictionaries/MATCH_LABEL']('sys_common_status', row.status) }} //值对应名称
// {{ $store.getters['dictionaries/MATCH_VALUE']('sys_common_status', row.statusName) }}//名称对应的值
// v-for="(v,i) in $store.getters['dictionaries/GET_DICT']('sys_common_status')"//字典列表
// 模型中
// {name: '工单类型', key: 'workorderType', value: '', col: 6, type: 'select', options: () => proxy.$store.getters['dictionaries/GET_DICT']('work_order_type'), isDisable: !1, isRequire: !1},
```

# 提示

```JavaScript
// Dialog Toast 已全局封装 直接在代码中 this.$$wx this.$$Dialog this.$$Toast
this.$$Dialog({...});
this.$$Toast({...});
```

# 入口

新建事项文件夹，复制entry.js和App.vue放在文件夹内

# 表单开发模式

```JavaScript
// 引入
import FormModel from '@/components/FMGenerator/FormModel';

const FormModelRef = ref();
// 在html使用
// <template>
//   <FormModel ref="FormModelRef" :formConfig="formConfig" @xxxx="可选监听配置发出的事件"></FormModel>
// </template>

// 编写配置
// formName:string 表单名称
// onLoad:function({vm}) 初始化调用
// items:[] 板块列表
// items[n]:{ 板块对象
//   name:string 板块名称 如果为空 则不显示伸缩面板
//   items:[] 表单元素列表
//   items[n]: { 表单元素
//     name:string||function 标签名称 如果是function会调用获取
//     key:string 字段名 
//     placeholder:string 占位符 
//     value:any 默认值 
//     type:string 元素类型 
//     rules:[] element-ui rules配置， 如果isRequire为true会自动添加必填校验，无需配置
//     clearable:boolean 可清空  
//     isHidden:boolean 是否隐藏元素  
//     isDisable:boolean 是否禁用 
//     isRequire:boolean 是否必填
//     col:number 栅格列 0-24
//     options:Array||function({vm})->Promise  [{label,value}] 选项列表 针对type=select|radio|checkbox|etc... 选择性元素
//     isShow:function({vm}) 表单显示条件 返回truly显示 反之隐藏
//     onChange:function({vm}) 值发生变化触发 
//     component:component|string  针对type=component元素 直接显示自定义组件获已经在FormModel引入的组件
//     attrs:{} 部分组件的props传递 type=cascader|component|button
//     emitter:function({vm}) 部分组件的事件监听 返回一系列事件对象  type=component 
//     ...etc 多数的element-ui props参阅https://element.eleme.cn/#/zh-CN，查看FormModel参数配置
//   } 
// } 

//形参vm实例
// vm.formData 当前的表单模型对象
// vm.expandFormConfigItems 当前的表单元素列表集合
// vm.initFormData({...}) 对表单模型进行赋值
// vm.getFormData() 获取当前的表单模型对象formData 比直接使用vm.formData高级 填写时key为 a.b.c 转换成 a：{b：{c}}
// vm.resetFormData(filterKeys?) 重置表单 filterKeys=[]重置全部  filterKeys不为空只重置filterKeys对应的字段
// vm.validator(resove:function,reject?:function) 表单验证 下例：
//    FormModelRef.value.validator(
//     async formData => {//验证成功
//        // ...do something
//      },
//      () => {//验证失败
//       // ...do something
//     }
//    )

// 配置样例
const formConfig = ref({
  formName: '',
  onLoad: async function ({vm}) {
    console.log('formConfig onLoad...', vm.reqQuery, vm.$attrs)
  },
  items: [
    {
      name: '板块名称',
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
          onChange({vm}) {//值发生变化触发
            console.log('onChange', vm)
          }
        },
        {
          name: '菜单名称', key: 'menuName', value: '', col: 8, type: 'input', isDisable: !1, isRequire: !0,
          isShow({vm}) {//表单显示条件
            return vm.formData.id !== null;
          }
        },
        {name: '权限编码', key: 'menuCode', value: '', placeholder: '如 sys:code:xxx', col: 8, type: 'input', isDisable: !1, isRequire: !0},
        {
          name: '菜单图标', key: 'menuIco', value: '', col: 8, type: 'select', isDisable: !1, isRequire: !1,
          options: iconfontJson.glyphs.map(ic => ({
            label: `${iconfontJson.css_prefix_text}${ic.font_class}`, value: `${iconfontJson.css_prefix_text}${ic.font_class}`
          })),
          label_component: IconfontComp,
          option_component: IconfontComp
        },
        {name: '菜单状态', key: 'status', value: '否', col: 8, type: 'radio', options: [{label: '是', value: '是'}, {label: '否', value: '否'}], isDisable: !1, isRequire: !1},
        {
          name: '占位符', key: 'fileId', value: '', type: 'component', col: 24, component: Placeholder, attrs: {},
          emitter({vm}) {//表单显示条件
            return {
              update(args) {
                //do something
                console.log('update', vm, args);
              }
            }
          }
        }

      ]
    },
  ]
});
```



