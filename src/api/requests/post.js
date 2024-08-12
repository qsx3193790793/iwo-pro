import apiGenerator from '../apiGenerator';
import apiPrefix from '../apiPrefix';

const apis = {
  // 查询岗位列表
  listpost: {url: `${apiPrefix('system')}/post/list`, method: 'get'},
  // 查询岗位详细
  getPost: {url: (args) => `${apiPrefix('system')}/post/${args?.postId || ''}`, method: 'get'},
  // 新增岗位
  addPost: {url: `${apiPrefix('system')}/post`, method: 'post'},
  // 修改岗位
  updatePost: {url: `${apiPrefix('system')}/post`, method: 'put'},
  // 删除岗位
  delPost: {url: (args) => `${apiPrefix('system')}/post/${args?.postId || ''}`, method: 'delete'},
  // 导出
  export: {url: `${apiPrefix('system')}/post/export`, responseType: 'blob', contentType: 1},
};

export default apiGenerator(apis);

