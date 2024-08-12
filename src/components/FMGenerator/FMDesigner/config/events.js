//事件安装
let fmDesignerEvents = {};

export const eventInstaller = (evt = {}) => {
  console.log('fmDesigner eventInstaller', evt);
  fmDesignerEvents = evt || {};
}

export default () => fmDesignerEvents;
