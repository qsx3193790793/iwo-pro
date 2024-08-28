import apiGenerator from "../apiGenerator";
import apiPrefix from "../apiPrefix";

const apis = {
  // 投诉产品树列表
  listProductTree: {url: `${apiPrefix("system")}/tProduct/productTree`, method: "get",},
  //   // 查询机构列表（排除节点）
  //   listDeptExcludeChild: {url: (args) => `${apiPrefix('system')}/dept/list/exclude/${args?.deptId || ''}`, method: 'get'},
  //   // 查询机构详细
  //   getDept: {url: (args) => `${apiPrefix('system')}/dept/${args?.deptId || ''}`, method: 'get'},
  // 查询产品分类
  getProduct: {
    url: (args) => `${apiPrefix("system")}/tProduct/list`,
    method: "get",
  },
  // 查询产品分类
  getProductDetail: {
    url: (args) => `${apiPrefix("system")}/tProduct/${args?.productId || ""}`,
    method: "get",
  },
  // 生成投诉产品编码
  getProductCode: {
    url: `${apiPrefix("system")}/tProduct/genProductCode`,
    method: "post",
  },
  // 新增产品分类
  addProduct: {
    url: `${apiPrefix("system")}/tProduct/addProduct`,
    method: "post",
  },
  // 修改产品分类
  updateProduct: {
    url: `${apiPrefix("system")}/tProduct/addProduct`,
    method: "put",
  },
  // 删除产品分类
  delProduct: {
    url: (args) => `${apiPrefix("system")}/tProduct/${args?.productIds || ""}`,
    method: "delete",
  },
};

export default apiGenerator(apis);
