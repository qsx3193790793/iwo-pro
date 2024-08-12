//多页面配置
const glob = require("glob");
const libs = require('./libs');
let entrys = [];//入口
const pkgName = process.env.npm_config_env_pkg || process.env['npm_config_env.pkg'];
console.log('pkgName', pkgName)
glob.sync(`src/pages/**/entry.js`).forEach(file => {
  const reg = new RegExp('/(\\w*)/entry.js');
  const name = file.match(reg)[1];
  if (pkgName && pkgName !== name) return;
  console.log('### create entry', name, file, ' ###');
  entrys.push({
    entry: file,
    template: `public/index.html`,
    chunks: ["chunk-vendors", "chunk-common", name],
    filename: `${pkgName ? 'index' : name}.html`,
    name,
    pkgName: pkgName ? name : 'full',
    title: '在线培训平台',
    // root: `${process.env.VUE_APP_PUBLIC_PATH}/${pkgName ? name : 'all'}/static`,
    root: `/${pkgName}/static`,
    libs: (libs[name] || libs.default).map(lib => lib),//libs 给html模板渲染
  });
});

module.exports = {
  entrys,
};
