//引入所有MOCK
const mockjs = require('mockjs');
const glob = require("glob");

const mocks = [];
glob.sync(`${__dirname}/template/**/*.js`).forEach(file => mocks.push(require(file)));
// console.log('mocks', mocks)

const publicFn = mockTemplate => (rep, req) => {
  req.json(mockjs.mock(mockTemplate));
}

module.exports = app => {
  mocks.forEach(mock => {
    app[mock.method || 'post']('/api/' + mock.url, mock.fn ? mock.fn(mock.mockTemplate) : publicFn(mock.mockTemplate));
  });
}
