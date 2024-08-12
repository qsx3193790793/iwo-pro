// 模板管理
import apiGenerator from '../apiGenerator';
import apiPrefix from '../apiPrefix';

const apis = {
  // 列表
  list: {url: `${apiPrefix('config')}/template/list`, method: 'get'},
  // 详细
  detail: {url: (args) => `${apiPrefix('config')}/template/detail/${args.templateId ?? ''}/${args.versionId ?? ''}`, method: 'get'},
  // 查询模板表单
  form: {url: (args) => `${apiPrefix('config')}/template/form/${args.sceneCode ?? ''}/${args.bigType ?? ''}`, method: 'get'},
  // 查询模板表单 测试用 无视审核
  formMock: {url: (args) => `${apiPrefix("config")}/template/formMock/${args.sceneCode ?? ''}/${args.templateType ?? '0'}`, method: "get"},
  // 上架模板校验
  releaseCheck: {url: (args) => `${apiPrefix('config')}/template/releaseCheck/${args.sceneCode ?? ''}/${args.templateType ?? ''}`, method: 'get'},
  // 创建模板校验
  createCheck: {url: (args) => `${apiPrefix('config')}/template/createCheck/${args.sceneCode ?? ''}/${args.templateType ?? ''}`, method: 'get'},
  // 创建模板
  create: {url: `${apiPrefix('config')}/template/create`},
  // 修改
  update: {url: `${apiPrefix('config')}/template/update`},
  // 删除
  delete: {url: (args) => `${apiPrefix('config')}/template/delete/${args?.versionIds ?? ''}`},
  // 提交审核
  apply: {url: (args) => `${apiPrefix('config')}/template/apply/${args?.versionId ?? ''}`},
  // 提交通过
  approval: {url: (args) => `${apiPrefix('config')}/template/approval/${args?.versionId ?? ''}`},
  // 提交上架
  release: {url: (args) => `${apiPrefix('config')}/template/release`},
  // 提交下架
  soldOut: {url: (args) => `${apiPrefix('config')}/template/soldOut`},
  // 驳回
  reject: {url: (args) => `${apiPrefix('config')}/template/reject`},
  // 回退
  rollback: {url: (args) => `${apiPrefix('config')}/template/rollback`},
};

export default apiGenerator(apis);
