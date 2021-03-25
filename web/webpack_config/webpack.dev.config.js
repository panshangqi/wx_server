const BaseConfig = require('./webpack.base.config').dev_config
const WebpackDevServer = require('webpack-dev-server');
const Webpack = require('webpack');
const vars = require('./variables');
//代理配置
var final_proxy = {
    "/api/*":{
        target:"http://127.0.0.1:9000",
        changeOrigin: true,
        pathRewrite: {
        '^/api': ''
        },
        secure: false, // 接受 运行在 https 上的服务
    },
    "/client/*":{
        target:"http://127.0.0.1:3600",
        changeOrigin: true,
        secure: false, // 接受 运行在 https 上的服务
    }
}

BaseConfig.plugins.push(new Webpack.HotModuleReplacementPlugin());
BaseConfig.plugins.push(new Webpack.NoEmitOnErrorsPlugin());
var compiler = Webpack(BaseConfig);
var server = new WebpackDevServer(compiler, {
    inline: true,                //设置为true，当源文件改变的时候会自动刷新
    contentBase: "./public", //默认webpack-dev-server会为根文件夹提供本地服务器
    hot: true,                   //允许热加载
    hotOnly: true,               //当编译失败时，不刷新页面
    historyApiFallback: {
        'index': '/templates/index.html'
    },
    disableHostCheck: true,
    proxy: final_proxy,
    //publicPath: vars.dev_publicPath,
    overlay: true,                     //用来在编译出错的时候，在浏览器页面上显示错误
    progress:false,                    //显示打包的进度
    stats: {
        entrypoints: false,
        children: false,
        chunks: false,  // 使构建过程更静默无输出
        colors: true,    // 在控制台展示颜色
        modules: false,
        chunkModules: false
    }

});

server.listen(vars.port, 'localhost', function () {

});
