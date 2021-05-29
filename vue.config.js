module.exports = {
  chainWebpack: config => {
    config.module
      .rule('raw')
      .test(/\.(bin|abi|txt)$/)
      .use('raw-loader')
      .loader('raw-loader')
      .end();
  }
}