const Koa = require('koa')

const koaLogger = require('koa-logger')
const bodyParser = require('koa-bodyparser')
const path = require('path')
const fs = require('fs')
const staticFiles = require('koa-static')
const config = require('../server/config')

const {historyApiFallback} = require('koa2-connect-history-api-fallback');
const app = new Koa()
const router = require('./routes')
const ctx_function = require('./routes/ctx_function')
const authenticated = require('./routes/authenticated')


//这句代码需要在koa-static上面
app.use(historyApiFallback({
    index: '/index'
}));
app.use(staticFiles(path.resolve(__dirname, './assets/build/static/')))
app.use(staticFiles(path.resolve(__dirname, './assets/build/')))

/** gzip压缩配置 start **/
const compress = require('koa-compress');
const options = {
    threshold: 1024 //数据超过1kb时压缩
};
app.use(compress(options));
/** gzip压缩配置 end **/


/** 代理配置 start **/

const proxy = require('koa2-proxy-middleware'); //引入代理模块
const proxyOptions = {
    targets: {
        '/api/(.*)': {
            target: 'http://127.0.0.1:' + config.server.port,
            changeOrigin: true,//处理跨域
            pathRewrite: {
                "^/api": ""
            }
        }
    }
};

/** 代理配置 end **/

// 配置控制台日志
app.use(koaLogger((str, args) => {
    console.log(new Date().toLocaleString() + str)
}))
app.use(bodyParser({
    "formLimit": "50mb",
    "jsonLimit": "50mb",
    "textLimit": "50mb"
}))
// 注册中间件
app.use(ctx_function())
app.use(authenticated())
app.use(proxy(proxyOptions))


app.use(router.routes())//启动路由
app.use(router.allowedMethods());

const port = process.env.PORT || 3600;

async function startApp() {
    app.listen(port);
    console.log('http://127.0.0.1:'+port)
}
startApp()
