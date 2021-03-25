const KoaRouter = require('koa-router');
const router = KoaRouter();
const fs = require('fs')
const path = require('path')
const md5 = require('md5')
const uuid = require('node-uuid')
const Upload = require('../modules/upload')
const Classes = require('../modules/classes');
const Login = require('../modules/login')
const config = require('../config');
// const redis = require('../common/redis_op')
// render html
router.get('/index', (ctx, next) => {
    ctx.type = 'text/html;charset=utf-8';
    let file = path.join(__dirname, '../../web/assets/build/templates/index.html')
    console.log(file)
    let html_buffer = fs.readFileSync(file)
    ctx.response.body = html_buffer.toString()
})

router.post('/check_login', async (ctx, next) => {
    let { username, password } = ctx.checkParameter(['username','password']);
    let hr = await Login.check_login(username, password)

    ctx.rest({status: hr, username: username, user_id: username})
})
router.post('/logout', async (ctx, next) => {
    let { username } = ctx.checkParameter(['username']);
    await redis.del(username)
    ctx.rest({})
})

router.get('/',(ctx)=>{
    ctx.response.type = 'html';
    ctx.response.body = fs.createReadStream(__dirname+'/index.html');
});

router.get('/config',(ctx)=>{
    ctx.response.type = 'application/json';
    ctx.response.body = JSON.stringify({
        server: config.server
    })
});

router.get('/get_classes',async(ctx)=>{

    let datas = await Classes.query_class();
    ctx.rest(datas)
});

router.post('/create_class',async (ctx)=>{

    let { name } = ctx.checkParameter(['name']);

    await Classes.create_class(name);
    ctx.rest()
});

router.post('/delete_class',async (ctx)=>{

    let { class_id } = ctx.checkParameter(['class_id']);

    await Classes.delete_class(class_id);
    ctx.rest()
});

router.get('/get_sections', async(ctx)=>{
    let { class_id, section_id } = ctx.checkParameter(['class_id']);
    console.log(class_id, section_id)
    let datas = await Classes.get_sections(class_id, section_id);
    ctx.rest(datas)
})

router.post('/create_and_update_section',async (ctx)=> {

    let {data, class_id, section_id, action} = ctx.checkParameter(['data', 'class_id', 'section_id' ,'action']);
    let save_dir = path.join(__dirname, `../../static/${class_id}`);
    if(!fs.existsSync(save_dir)){
        fs.mkdirSync(save_dir)
    }
    
    await Classes.create_section(action, data, class_id, section_id, save_dir);
    
    ctx.rest()
});


module.exports = router