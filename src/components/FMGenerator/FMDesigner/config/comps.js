function getCompMap(comps) {
  return comps.keys().reduce((t, c) => {
    const comp = comps(c).default;
    return (t[comp.name] = comp), t;
  }, {});
}

//容器组件
const layoutComps = getCompMap(require.context('../components/layoutComps', true, /(\.js|\.vue)$/));
//基础组件
const baseComps = getCompMap(require.context('../components/baseComps', true, /(\.js|\.vue)$/));
//定制化组件 需要先开发
const customizationComps = getCompMap(require.context('../components/customizationComps', true, /(\.js|\.vue)$/));

export const compsMap = Object.assign({}, layoutComps, baseComps, customizationComps);

console.log('compsMap', compsMap);
export const comps = [
  {
    name: '容器组件', items: Object.values(layoutComps)
  },
  {
    name: '通用组件', items: Object.values(baseComps)
  },
  {
    name: '定制化组件', items: Object.values(customizationComps)
  }
];
