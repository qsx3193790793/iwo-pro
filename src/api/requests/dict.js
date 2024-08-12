import apiGenerator from '../apiGenerator';
import apiPrefix from '../apiPrefix';

const apis = {
  // 查询字典数据列表
  listData: {url: `${apiPrefix('system')}/dict/data/list`, method: 'get'},
  // 查询字典数据详细
  getData: {url: (args) => `${apiPrefix('system')}/dict/data/${args?.dictCode || ''}`, method: 'get'},
  // 根据字典类型查询字典数据信息
  getDicts: {url: (args) => `${apiPrefix('system')}/dict/data/type/${args?.dictType || ''}`, method: 'get'},
  // 新增字典数据
  addData: {url: `${apiPrefix('system')}/dict/data`},
  // 修改字典数据
  updateData: {url: `${apiPrefix('system')}/dict/data`, method: 'put'},
  // 删除字典数据
  delData: {url: (args) => `${apiPrefix('system')}/dict/data/${args.dictCode || ''}`, method: 'delete'},

  // 查询字典类型列表
  listType: {url: `${apiPrefix('system')}/dict/type/list`, method: 'get'},
  // 查询字典类型详细
  getType: {url: (args) => `${apiPrefix('system')}/dict/type/${args?.dictId || ''}`, method: 'get'},
  // 新增字典类型
  addType: {url: `${apiPrefix('system')}/dict/type`},
  // 修改字典类型
  updateType: {url: `${apiPrefix('system')}/dict/type`, method: 'put'},
  // 删除字典类型
  delType: {url: (args) => `${apiPrefix('system')}/dict/type/${args?.dictId || ''}`},
  // 刷新字典缓存
  refreshCache: {url: `${apiPrefix('system')}/dict/type/refreshCache`, method: 'delete'},
  // 获取字典选择框列表
  optionselect: {url: `${apiPrefix('system')}/dict/type/optionselect`, method: 'get'},
  // 导出
  export: {url: `${apiPrefix('system')}/dict/type/export`, responseType: 'blob', contentType: 1},
  exportData: {url: `${apiPrefix('system')}/dict/data/export`, responseType: 'blob', contentType: 1},

};

export default apiGenerator(apis);
