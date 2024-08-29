import apiGenerator from '../apiGenerator';
import apiPrefix from '../apiPrefix';
// 
const apis = {
  // 分页查询归档配置
  listOnFileStrategy: {url: `${apiPrefix("config")}/archiveRule/findArchiveRulePage`, method: "get"},
  // 新增归档配置
  addOnFileStrategy: {url: `${apiPrefix('config')}/archiveRule/save`, method: 'post'},
  //根据主键Id查询归档配置
  detailOnFileStrategy: {url: (args) => `${apiPrefix('config')}/archiveRule/findArchiveRuleById/${args?.archiveRuleId || ''}`, method: 'get'},
  // 批量删除归档配置
  delteOnFileStrategy: {url: `${apiPrefix('config')}/archiveRule/deleteByIds`, method: 'post'},
  //修改归档配置根据归档配置主键Id
  updataOnFileStrategy: {url: `${apiPrefix('config')}/archiveRule/update`, method: 'post'},
  //修改启用、停用状态
  statusOnFileStrategy: {url: `${apiPrefix('config')}/archiveRule/updateStatus`, method: 'post'},
};

export default apiGenerator(apis);
