const ExtractTextWebapckPlugin = require('extract-text-webpack-plugin');
const vars = require('./variables');
const graphs = require('./graphs')

const Mode = {
    DEV: 'development',
    PROD: 'production'
}
let less_loaders = [{
        loader: "css-loader",
        options: {
            minimize: process.env.NODE_ENV === 'production'
        }
    }, {
        loader: "less-loader",
        options: {
            javascriptEnabled: true,
            globalVars: {
                'theme_color': '#FF9647',
                'theme_red': '#FF796B',
                'theme_green': '#13D469',
                'img_root': '/static/imgs'
            }
        }
    }
    // ,
    // {
    //     loader: 'style-resources-loader',
    //     options: {
    //         patterns: `${vars.routes_root}/common.less` //全局变量
    //     }
    // }
]

function getConfig(envs){

    let less_rules_use = [ {loader: "style-loader"}, ...less_loaders ]
    if(envs === Mode.PROD){
        less_rules_use = ExtractTextWebapckPlugin.extract({ fallback:"style-loader",  use: [...less_loaders] })
    }
    const config = {
        entry: JSON.parse(JSON.stringify(graphs.entries)),               // 入口文件
        output:{
            path: vars.dist_root,
            publicPath: vars.dev_publicPath,  //相对于 HTML 页面的资源
            filename: '[name].[hash:8].js'
        },
        resolve:{
            extensions: ['.js','.jsx','.json'],
            alias:{
                '@components': vars.components_root,
                '@pages': vars.pages_root,
                '@imgs': vars.imgs_root
            }
        },
        module: {// 处理对应模块
            rules:[{
                    test: /\.less$/,
                    use: less_rules_use
                }, {
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/,
                    enforce: "pre",
                    use: [
                        {
                            loader: 'babel-loader',
                            options: {
                                presets: ["env","react", "stage-0"],
                                plugins: [
                                    ["import",
                                        {
                                            "libraryName": "antd",
                                            "libraryDirectory": "es",
                                            "style": true
                                        }
                                    ],
                                    ["transform-decorators-legacy"],
                                    ["transform-runtime"]
                                ]
                            }
                        }
                    ]
                }, {
                    test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                    exclude: /(node_modules)/,
                    loader: 'file-loader',
                    options: {
                        limit: 10000,
                        name: 'imgs/[name].[hash:8].[ext]',
                    }
                }, {
                    test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                    exclude: /(node_modules)/,
                    loader: 'url-loader',
                    options:{
                        limit: 10000,
                        name: 'medias/[name].[hash:8].[ext]'
                    }
                }, {
                    test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                    exclude: /(node_modules)/,
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        name: 'fonts/[name].[hash:8].[ext]'
                    }
                }
            ]
        },
        plugins: [
            ...graphs.html_plugins
        ],             // 对应的插件
        devServer: {},           // 开发服务器配置
        mode: envs == Mode.DEV ? Mode.DEV: Mode.PROD      // 环境模式
    }

    if(envs == Mode.DEV){
        for(let p in config.entry){
            config.entry[p].unshift(`webpack-dev-server/client?http://localhost:${vars.port}/`)
            config.entry[p].unshift(`webpack/hot/dev-server`)
        }
        config.devtool = 'cheap-module-source-map';
        console.log(config)
        for(let name of graphs.graphs){
            console.log(`http://localhost:${vars.port}/templates/${name}.html`)
        }

    }else{
        config.plugins.push(
            new ExtractTextWebapckPlugin({
                filename: `${vars.static_css_root}/[name].[chunkhash:8].css`,
                allChunks: false,
            })
        )
        config.output.publicPath = vars.prod_publicPath  //url()  prod_publicPath + url-loader: name
        config.output.filename = `${vars.static_js_root}/[name].[chunkhash:8].js`
        //console.log(config)
    }
    //console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
    //console.log(config.entry)
    return config
}
const baseConfig = {
    dev_config: getConfig(Mode.DEV),
    prod_config: getConfig(Mode.PROD)
}
module.exports = baseConfig