const path = require('path');

module.exports = {
  publicPath: '/',
  pluginOptions: {
    lintStyleOnBuild: false,
  },
  css: {
    loaderOptions: {
      sass: {
        sassOptions: {
          includePaths: [path.resolve('./src/assets/scss')],
        },
      },
    },
  },
  chainWebpack: (config) => {
    config.module.rule('pdf')
      .test(/\.pdf$/)
      .use('file-loader')
      .loader('file-loader')
      .tap(_ => (
        { name: '[name]_[contenthash].[ext]' }
      ));
  },
};
