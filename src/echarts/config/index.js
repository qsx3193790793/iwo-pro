//echarts 统一配置管理

import Vue from "vue";

export default {
  getFontSize: fz => (fz || 12) * Vue.prototype.$$getPageScale({type:'min'}),
  getMaxValue: data => {
    let maxStr = parseInt(Math.max(...data.filter(d => !Vue.prototype.$$isEmpty(d)))).toString();
    let max = Number((Number(maxStr.substr(0, 1)) + 1).toString() + '0'.repeat(maxStr.length - 1));
    return {
      max,
      interval: max / 4
    };
  },
};
