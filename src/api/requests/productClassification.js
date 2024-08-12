import apiGenerator from '../apiGenerator';
import apiPrefix from '../apiPrefix';
// 
const apis = {
  // 查询产品分类树列表
  listProductTree: {url: `${apiPrefix('config')}/tProduct/productTree`, method: 'get'},
  // 查询产品分类列表
  listProduct: {url: `${apiPrefix('config')}/tProduct/list`, method: 'get'},
  // 查询产品分类详细
  getProductDetail: {url:  (args) => `${apiPrefix('config')}/tProduct/getProductByIdForUpd/${args?.productId || ''}`, method: 'get'},
  // 产品分类编码
  getProductCode: {url: `${apiPrefix('config')}/tProduct/genProductCode`, method: 'post'},
  // 新增产品分类
  addProduct: {url: `${apiPrefix('config')}/tProduct/addProduct`, method: 'post'},
  // 修改产品分类
  updateProduct: {url: `${apiPrefix('config')}/tProduct/updProduct`, method: 'put'},
  // 修改产品分类状态（启用/停用）
  updStatus: {url: `${apiPrefix('config')}/tProduct/updStatus`, method: 'put'},
  // 删除产品分类
  delProduct: {url: (args) => `${apiPrefix('config')}/tProduct/${args?.productIds || ''}`, method: 'put'},
  //根据pCode获取投诉产品列表(投诉产品下拉框使用)
//   productTypeList: {url: `${apiPrefix('config')}/tProduct/selectLowerLevelProductList`, method: 'get'},
};

export default apiGenerator(apis);
