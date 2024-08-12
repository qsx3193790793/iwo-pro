import apiGenerator from '../apiGenerator';
import apiPrefix from '../apiPrefix';
//
const apis = {
  // 查询自定义字典树列表
  listDictionary: {url: `${apiPrefix('config')}/dictionary/pageList`, method: 'get'},
  // 新增自定义字典
  addDictionary: {url: `${apiPrefix('config')}/dictionary/add`, method: 'post'},
  // 修改自定义字典
  updateDictionary: {url: `${apiPrefix('config')}/dictionary/update`, method: 'post'},
  // 删除自定义字典
  delDictionary: {url: (args) => `${apiPrefix('config')}/dictionary/delete/${args?.dictId ?? ''}`, method: 'get'},
  //查询自定义字典类型下拉列表接口
  DictionaryTypeOptions: {url: `${apiPrefix('config')}/dictionary/optionsList`, method: 'get'},
  //强制刷新
  cacheRefresh: {url: `${apiPrefix('config')}/dictionary/refreshCache`, method: 'get'},

  //   ---------------------------------------------4.	自定义字典数据
  // 查询自定义字典数据分页列表接口
  listDictionaryData: {url: `${apiPrefix('config')}/dictionaryItem/pageList`, method: 'get'},
  // 新增自定义字典数据
  addDictionaryData: {url: `${apiPrefix('config')}/dictionaryItem/add`, method: 'post'},
  // 修改自定义字典数据
  updateDictionaryData: {url: `${apiPrefix('config')}/dictionaryItem/update`, method: 'post'},
  // 删除自定义字典数据
  delDictionaryData: {url: (args) => `${apiPrefix('config')}/dictionaryItem/delete/${args?.dictItemId ?? ''}`, method: 'get'},
  //查询字典
  getDicts: {url: args => `${apiPrefix('config')}/dictionaryItem/type/${args.dictType}`, method: 'get'},
};

export default apiGenerator(apis);
