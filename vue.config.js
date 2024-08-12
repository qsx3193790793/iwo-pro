const CopyWebpackPlugin = require('copy-webpack-plugin');
const autoprefixer = require("autoprefixer");
const pxtorem = require("postcss-pxtorem");
const pagesConfig = require("./config/multiple.page.conf");
const path = require("path");
const os = require('os');
// const {VantResolver} = require('unplugin-vue-components/resolvers');
// const ComponentsPlugin = require('unplugin-vue-components/webpack');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')

function resolve(dir) {
  return path.resolve(__dirname, dir)
}

process.env.VUE_APP_PKGNAME = process.env.npm_config_env_pkg || process.env['npm_config_env.pkg'];//包名
console.log('process.env.NODE_ENV', process.env.VUE_APP_PKGNAME, process.env.NODE_ENV, process.env.VUE_APP_MICRO_SERVICE_PROXY);

module.exports = {
  // parallel: false,
  // publicPath: `${process.env.VUE_APP_PUBLIC_PATH}/${pagesConfig.entrys[0].pkgName}`,
  publicPath: `/${pagesConfig.entrys[0].pkgName}`,
  assetsDir: 'static',
  outputDir: `${process.env.VUE_APP_OUPUTDIR}/${pagesConfig.entrys[0].pkgName}`,
  pages: pagesConfig.entrys.reduce((t, entry) => (t[entry.name] = entry, t), {}),
  configureWebpack: {
    // devtool: process.env.NODE_ENV === "production" ? 'false' : 'source-map',
    devtool: false,
    resolve: {
      extensions: ['*', '.js', '.vue', '.json'],
      alias: {//别名配置
        '@': resolve('./src'),
        '@assets': resolve('./src/assets'),
        '@mock': resolve('./mock')
      }
    },
    output: {
      filename: 'static/js/[name].js?[hash:7]',
      chunkFilename: 'static/js/[name].js?[hash:7]',
    },
    plugins: [
      new MonacoWebpackPlugin({languages: ['json']})
      // ComponentsPlugin({
      //   resolvers: [VantResolver()],
      // }),
      // require('unplugin-vue-define-options/webpack')(),//unplugin-vue-define-options 安装时好时坏 还是不用了吧
      //测试环境复制到dev-server  生产环境路径act/json_data/
      // ...(process.env.NODE_ENV === "development" ? [new CopyWebpackPlugin([{
      //   from: resolve('./src/jsonData'),
      //   to: `jsonData`,
      // }])] : [])
    ],
  },
  devServer: {
    port: '8080',
    open: false,
    before: process.env.NODE_ENV === "development" && process.env.VUE_APP_IS_MOCK === 'true' ? require('./mock/index.js') : null,
    proxy: JSON.parse(process.env.VUE_APP_MICRO_SERVICE_PROXY).reduce((t, c) => ((t[`^/${c.key}`] = {
      target: c.host,
      changeOrigin: true,
      pathRewrite: {
        [`^/${c.key}`]: "",
      },
    }), t), {})

    // proxy: {
    //   "/proxy": {
    //     target: process.env.VUE_APP_BASE_API,
    //     changeOrigin: true,
    //     pathRewrite: {
    //       "^/proxy": "",
    //     },
    //   },
    // },
  },
  css: {
    extract: {
      ignoreOrder: true
    },
    loaderOptions: {
      postcss: {
        plugins: [
          autoprefixer(),
          pxtorem({
            rootValue: 100,
            propList: ["*"],
            selectorBlackList: [],
          }),
        ],
      },
      scss: { // 全局变量样式的地址为scss/variable.scss
        prependData: `@import "@/scss/variable.scss";`
      }
    },
  },
  chainWebpack(config) {
    process.env.NODE_ENV === "production" && config.plugin('extract-css').tap(args => [{
      filename: `static/css/[name].css?[contenthash]`,
      chunkFilename: `static/css/[name].css?[contenthash]`
    }]);
    //对node_modules部分转义
    config.module.rule('compile').test(/\.js$/).include
      .add(resolve('node_modules/element-ui'))
      .add(resolve('node_modules/debug'))
      .add(resolve('node_modules/sockjs-client'))
      .end().use('babel').loader('babel-loader').options({
      presets: [['@babel/preset-env', {modules: !1}]],
      plugins: [
        "@babel/plugin-transform-runtime",
        "@babel/plugin-proposal-optional-chaining",
        "@babel/plugin-transform-arrow-functions",
        "@babel/plugin-syntax-dynamic-import",
        "@babel/plugin-proposal-object-rest-spread",
        "@babel/plugin-transform-async-to-generator",
        "@babel/plugin-transform-classes",
      ]
    });
    config.module.rule("images").test(/\.(png|jpe?g|gif|svg)(\?.*)?$/).use("url-loader").loader("url-loader")
      .options({
        limit: 2048,
        name: file => {
          const subPath = os.type() === 'Windows_NT' ? file.match(/\\images\\(.*)\\(.*)\.(png|jpe?g|gif|svg)(\?.*)?$/) : file.match(/\/images\/(.*)\/(.*)\.(png|jpe?g|gif|svg)(\?.*)?$/)
          return `${subPath ? (subPath[1] + '/') : ''}[name].[ext]?[hash:7]`
        },
        outputPath: 'static/images',
        // name: '[name].[ext]?[hash:7]',
      }).end();

  }

};
