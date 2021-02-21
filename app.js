const Koa = require('koa')
const KoaRouter = require('koa-router');
const router = KoaRouter();
const path = require('path')
const fs = require('fs')
const staticFiles = require('koa-static')

const app = new Koa()
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
app.use(staticFiles(path.join(__dirname + '/static/')))
app.use(staticFiles(path.join(__dirname + '../files/')))
router.get('/',(ctx)=>{
    ctx.response.type = 'html';
    ctx.response.body = fs.createReadStream(__dirname+'/index.html');
});

app.use(router.routes())//启动路由

const port = 9000;
async function startApp() {
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
        port: 9999,
        mediaroot: './static/', // 建议写
        allow_origin: '*'
    }
};

var nms = new NodeMediaServer(config)
nms.run();
