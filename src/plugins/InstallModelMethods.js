//注入模块方法 _Ctor: null的意义 webpack会记录已导入组件导致无法修改 所以在修改原型时 需要让他为null
import merge from "deepmerge";

export default (model, methods) => {
  const comp = merge.all([model, {methods: methods, _Ctor: null}]);
  console.log('InstallModelMethods', comp);
  return comp;
};
