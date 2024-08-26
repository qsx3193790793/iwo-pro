const templateLoader = require.context('./template', true, /(\.js|\.vue)$/);

export default templateLoader.keys().map(v => templateLoader(v).default);
