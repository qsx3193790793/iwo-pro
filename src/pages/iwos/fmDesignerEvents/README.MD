# 此处存放表单设计器事件函数

```JavaScript
export const key = 'mobile_event';//存取用key
export const label = '手机号事件';//描述
//导出函数 接收vm，vm为表单vue实例
export default function ({vm}) {
  console.log('手机号事件', vm);
  vm.formData.a = '1';
  vm.formData.b = '2';
  vm.formData.c = '3';
}
```

# 如果配置select的options获取事件

```JavaScript
export const key = 'get_options';//存取用key
export const label = '获取下拉某某菜单列表';//描述
// 导出函数 接收vm，vm为表单vue实例； item未当前组件配置，对配置进行操作，比如组件级loading；
// 可以导出async函数，处理选项的异步获取，示例代码如下：
export default async function ({vm, item}) {
  const res = await vm.$$api.xxxx();
  return res.data.list; //返回数据列表 更具情况返回[]或[{label:'选项名字',value:'选项值'}]
}

//如果返回Promise
export default ({vm, item}) => new Promise(async (reslove, reject) => {
  item.loading = !0;
  const res = await vm.$$api.xxxx();
  item.loading = !1;
  reslove(res.data.list)//返回数据列表 更具情况返回[]或[{label:'选项名字',value:'选项值'}]
})
```
