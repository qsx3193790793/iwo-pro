import apiGenerator from '../apiGenerator';
import apiPrefix from '../apiPrefix';

const apis = {
  // 查询公告列表
  list: {url: `${apiPrefix('system')}/operlog/list`, method: 'get'},
  // 清空操作日志
  cleanOperlog: {url: `${apiPrefix('system')}/operlog/clean`, method: 'delete'},
  // 删除菜单
  delOperlog: {url: (args) => `${apiPrefix('system')}/operlog/${args?.operId || ''}`, method: 'delete'},
  // 导出
  export: {url: `${apiPrefix('system')}/operlog/export`, responseType: 'blob', contentType: 1},
};

export default apiGenerator(apis);
