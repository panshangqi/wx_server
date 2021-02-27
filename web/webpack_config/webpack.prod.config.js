const BaseConfig = require('./webpack.base.config').prod_config
const Webpack = require('webpack');
const shelljs = require('shelljs')
const vars = require('./variables');
//webapck 依赖效果图
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

BaseConfig.optimization = {           //代码拆分
    runtimeChunk: false,
        splitChunks: {
        chunks: 'initial',
            cacheGroups: {
            vendors: {
                test: /[\\/]node_modules[\\/]/,
                    minChunks: 1,
                    priority: -10,
                    name: 'vendors'
            },
        default: {
                minChunks: 2,
                    priority: -20,
                    name: 'common'
            }
        }
    }
}
//clean
shelljs.rm('-rf', BaseConfig.output.path)
shelljs.mkdir('-p', BaseConfig.output.path)


//BaseConfig.plugins.push(new BundleAnalyzerPlugin());

Webpack(BaseConfig, function (err, stats) {
    if(err){
        console.log(err)
        throw err
    }
    console.log(stats.toString({
        entrypoints: false,
        children: false,
        chunks: false,  // 使构建过程更静默无输出
        colors: true,    // 在控制台展示颜色
        modules: false,
        chunkModules: false
    }))
})
