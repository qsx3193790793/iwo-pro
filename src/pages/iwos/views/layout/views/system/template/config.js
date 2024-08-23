// 字段配置说明：
// type	字段类型：0.标准通用、1.场景、2.扩展通用、3自定义通用
//
// 4种前缀：
// 	0：public - 导入的初始化字段数据
//  1：scene - 新增场景字段
//  2：ext - 导入的初始化字段数据
//  3：comm - 新增通用字段
//
//  0/2/3 ：显示（通用）
//  1：     显示场景（场景）
// 只有自定义的可以删除，非自定义的不可以删除

export const TYPE_PREFIX = {
  '0': 'public',
  '1': 'scene',
  '2': 'ext',
  '3': 'comm',
};

export const options = [
  {label: '通用', value: '3'},
  {label: '场景', value: '1'},
];

export const optionsAll = [
  {label: '通用', value: '3'},
  {label: '场景', value: '1'},
  {label: '通用', value: '0'},
  {label: '通用', value: '2'},
];

export const type2name = function (type) {
  if (['1'].includes(type?.toString())) return '场景';
  if (['0', '2', '3'].includes(type?.toString())) return '通用';
  return '-';
};

export const getTypePrefix = function (type) {
  return `$${TYPE_PREFIX[type]}$`
};
