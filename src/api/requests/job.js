import apiGenerator from '../apiGenerator';
import apiPrefix from '../apiPrefix';

const apis = {
  // 查询定时任务调度列表
  listJob: {url: `${apiPrefix('schedule')}/job/list`, method: 'get'},
  // 查询定时任务调度详细
  getJob: {url: (args) => `${apiPrefix('schedule')}/job/${args?.jobId}`, method: 'get'},
  // 新增定时任务调度
  addJob: {url: (args) => `${apiPrefix('schedule')}/job`},
  // 修改定时任务调度
  updateJob: {url: (args) => `${apiPrefix('schedule')}/job`, method: 'put'},
  // 删除定时任务调度
  delJob: {url: (args) => `${apiPrefix('schedule')}/job/${args?.jobId}`, method: 'delete'},
  // 任务状态修改 changeJobStatus(jobId, status)
  changeJobStatus: {url: (args) => `${apiPrefix('schedule')}/job/changeStatus`, method: 'put'},
  // 定时任务立即执行一次 runJob(jobId, jobGroup)
  runJob: {url: (args) => `${apiPrefix('schedule')}/job/run`, method: 'put'},
  // 查询调度日志列表
  listJobLog: {url: `${apiPrefix('schedule')}/job/log/list`, method: 'get'},
  // 删除调度日志
  delJobLog: {url: (args) => `${apiPrefix('schedule')}/job/log/${args?.jobLogId}`, method: 'delete'},
  // 清空调度日志
  cleanJobLog: {url: `${apiPrefix('schedule')}/job/log/clean`, method: 'delete'},
  // 导出
  export: {url: `${apiPrefix('schedule')}/job/export`, responseType: 'blob', contentType: 1},
  exportLog: {url: `${apiPrefix('schedule')}/job/log/export`, responseType: 'blob', contentType: 1},
};

export default apiGenerator(apis);
