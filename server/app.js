const Koa = require('koa')

const koaLogger = require('koa-logger')
const bodyParser = require('koa-bodyparser')
const path = require('path')
const fs = require('fs')
const staticFiles = require('koa-static')
const ctx_function = require('./middlewares/ctx_function')
const controllers = require('./controllers')
const {historyApiFallback} = require('koa2-connect-history-api-fallback');
const app = new Koa()
const DB = require('./common/db')
const mime = {
    'mp4': 'video/mp4',
    'webm': 'video/webm',
    'ogg': 'application/ogg',
    'ogv': 'video/ogg',
    'mpg': 'video/mepg',
    'flv': 'flv-application/octet-stream',
    'mp3': 'audio/mpeg',
    'wav': 'audio/x-wav'
}

app.use(koaLogger())
app.use(bodyParser({
    "formLimit": "50mb",
    "jsonLimit": "50mb",
    "textLimit": "50mb"
}))

app.use(staticFiles(path.join(__dirname + '../static/')))
app.use(staticFiles(path.join(__dirname + '../files/')))

// 注册中间件
app.use(ctx_function())

app.use(controllers.routes())//启动路由


const port = process.env.PORT || 9000;
const static_port = process.env.STATIC_PORT || 9999;

async function startApp() {
    await DB.init_db()
    app.listen(port);
    console.log('server is start, port='+port)
}
startApp()


//流媒体服务
//==================================================
const NodeMediaServer = require('node-media-server');

const config = {
    rtmp: {
        port: 1935,
        chunk_size: 60000,
        gop_cache: true,
        ping: 30,
        ping_timeout: 60
    },
    http: {
        port: static_port,
        mediaroot: '../static/', // 建议写
        allow_origin: '*'
    }
};

var nms = new NodeMediaServer(config)
nms.run();
