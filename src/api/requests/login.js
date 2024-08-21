import apiGenerator from '../apiGenerator';
import apiPrefix from '../apiPrefix';

const apis = {
  // 单点
  ssoAuth: {url: `${apiPrefix('auth')}/ssoAuth`, method: 'get'},
  // 登录 ( username, password, code, uuid)
  login: {url: `${apiPrefix('auth')}/login`, headers: {isToken: !1, repeatSubmit: !1}},
  // 注册方法
  register: {url: (args) => `${apiPrefix('auth')}/register`, headers: {isToken: !1}},
  // 刷新
  refreshToken: {url: `${apiPrefix('auth')}/refreshToken`},
  // 获取用户详细信息
  getInfo: {url: `${apiPrefix('system')}/user/getInfo`, method: 'get'},
  // 退出
  logout: {url: `${apiPrefix('auth')}/logout`, method: 'delete'},
  // 获取业务数据
  getBizData: {url: `${apiPrefix('auth')}/getBizData`, method: 'get'},
  // 获取验证码
  getCodeImg: {url: `${apiPrefix('ruoyi')}/code`, method: 'get', headers: {isToken: !1}},
};

export default apiGenerator(apis);
