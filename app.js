const Koa = require('koa')
const KoaRouter = require('koa-router');
const router = KoaRouter();
const path = require('path')
const fs = require('fs')
const staticFiles = require('koa-static')

const app = new Koa()
app.use(staticFiles(path.join(__dirname + '/static/')))
app.use(staticFiles(path.join(__dirname + '../files/')))
router.get('/',(ctx)=>{
    ctx.response.type = 'html';
    ctx.response.body = fs.createReadStream(__dirname+'/index.html');
});

app.use(router.routes())//启动路由

const port = 9999;
async function startApp() {
    app.listen(port);
    console.log('server is start, port='+port)
}
startApp()
