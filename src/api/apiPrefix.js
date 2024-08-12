//前缀
function getProxy(key = 'default') {
  if (key === 'default') {//无前缀配置 使用default代理
    if (process.env.VUE_APP_IS_PROXY === 'true') return `/${[process.env.VUE_APP_BASE_API, key].filter(v => !!v).join('/')}`;
    return `/${process.env.VUE_APP_BASE_API}`
  }
  if (process.env.VUE_APP_IS_PROXY === 'true') return `/${[process.env.VUE_APP_BASE_API, key, process.env.VUE_APP_IS_LOC === 'true' ? '' : key].filter(v => !!v).join('/')}`;
  return `/${[process.env.VUE_APP_BASE_API, key].filter(v => !!v).join('/')}`
}

const service = {
  system: getProxy('system'),
  schedule: getProxy('schedule'),
  auth: getProxy('auth'),
  config: getProxy('config'),
  web: getProxy('web'),
  ruoyi: getProxy(),
};

console.log('service', service);

export default (serviceName) => {
  return `${service[serviceName] || ''}`;
};
