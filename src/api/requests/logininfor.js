import apiGenerator from '../apiGenerator';
import apiPrefix from '../apiPrefix';

const apis = {
  // 查询登录日志列表
  list: {url: `${apiPrefix('system')}/logininfor/list`, method: 'get'},
  // 解锁用户登录状态
  unlockLogininfor: {url: (args) => `${apiPrefix('system')}/logininfor/unlock/${args.username}`, method: 'get'},
  // 删除登录日志
  delLogininfor: {url: (args) => `${apiPrefix('system')}/logininfor/${args?.infoId || ''}`, method: 'delete'},
  // 清空登录日志
  cleanLogininfor: {url: `${apiPrefix('system')}/logininfor/clean`, method: 'delete'},
  // 导出
  export: {url: `${apiPrefix('system')}/logininfor/export`, responseType: 'blob', contentType: 1},
};

export default apiGenerator(apis);
