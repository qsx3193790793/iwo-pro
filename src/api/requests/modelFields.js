// 模版管理-字段管理
import apiGenerator from '../apiGenerator';
import apiPrefix from '../apiPrefix';

const apis = {
  // 获取当前省通用字段名称列表
  names: {url: `${apiPrefix('config')}/tFieldConfig/names`, method: 'get'},
  // 列表
  list: {url: `${apiPrefix('config')}/tFieldConfig/list`, method: 'get'},
  // 详细
  getTFieldConfig: {url: (args) => `${apiPrefix('config')}/tFieldConfig/${args?.fieldId || ''}`, method: 'get'},
  // 新增
  addTFieldConfig: {url: `${apiPrefix('config')}/tFieldConfig`, method: 'post'},
  // 修改
  updateTFieldConfig: {url: `${apiPrefix('config')}/tFieldConfig`, method: 'put'},
  // 删除
  delTFieldConfig: {url: (args) => `${apiPrefix('config')}/tFieldConfig/${args?.fieldIds || ''}`, method: 'PUT'},
  // 不分页查列表
  lists: {url: `${apiPrefix('config')}/tFieldConfig/lists`, method: 'get'},
  // 字段id反查详细 data: [1,2,3,4]
  getListByIds: {url: `${apiPrefix('config')}/tFieldConfig/getListByIds`},
};

export default apiGenerator(apis);
