import apiGenerator from '../apiGenerator';
import apiPrefix from '../apiPrefix';
//百万用户
const apis = {
  // 查询区域
  getArea: {url: `${apiPrefix('dash')}/api/dashboard/getArea`, method: 'get'},
  //新增
  insertUserNumber: {url: `${apiPrefix('dash')}/api/tUserNumbers/insertUserNumber`, method: 'post'},
  //编辑
  updateUserNum: {url: `${apiPrefix('dash')}/api/tUserNumbers/updateUserNum`, method: 'post'},
  //列表
  getUserNum: {url: `${apiPrefix('dash')}/api/tUserNumbers/getUserNum`, method: 'get'},
  //删除
  deleteUserNum: {url: `${apiPrefix('dash')}/api/tUserNumbers/deleteUserNum`, method: 'get'},
  //多维度
  multiDimensional: {url: `${apiPrefix('dash')}/api/tMultiReport/multiDimensional`, method: 'post'},
  //多维度
  uploadMultiDimensional: {url: `${apiPrefix('dash')}/api/tMultiReport/uploadMultiDimensional`, method: 'post',responseType: 'blob'},

};
export default apiGenerator(apis);

