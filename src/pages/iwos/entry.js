// 入口处
import main_setting from '@/main_pc';//引入统一入口配置文件
import App from './App.vue';//引入单页应用模板文件，如果是独立应用需要自己创建模板文件
import routerConfig from '@/router/config';//导入路由配置
import storeConfig from '@/store/config';//导入vuex配置
import scssVariables from '@/scss/variable.scss';//皮肤样式表
import * as pageConfig from './config';//导入页面配置
import {eventInstaller} from "@/components/FMGenerator/FMDesigner/config/events";
import fmDesignerEvents from "./fmDesignerEvents";
// import './scss/index.scss';//统一样式

eventInstaller(fmDesignerEvents);//安装设计器自定义事件

//加载stores 进行统一配置 添加扫描绿路径
let store = storeConfig([
  require.context('@/store/stores/Common', true, /\.js$/),
  // require.context('@/store/stores/demo', true, /\.js$/),
]);

//加载routes 进行路由配置
let customRoutes = [
  {
    redirect: '/layout/index',
    path: '/',//缺省
    name: 'redirect',
  },
  {
    path: '/403',
    component: () => import('./views/error/NoPermission.vue'),
    meta: {
      title: 'error',
      isStickyTopBar: true,
      authentication: false
    }
  },
  {
    path: '/404',
    component: () => import('./views/error/Err404'),
    meta: {
      title: '404',
      isStickyTopBar: true,
      authentication: false
    }
  }
];

let router = routerConfig({//进行统一配置
  customRoutes,
  routeContext: require.context('./', true, /\/option\.js$/),//添加扫描路径
});

main_setting({App, router, store, scssVariables, pageConfig});//挂载配置
