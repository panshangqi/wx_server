
const router = require('koa-router')();  /*引入是实例化路由** 推荐*/
const uuid = require('node-uuid');
const md5 = require('md5')
const fs = require('fs')
const path = require('path')
const http = require('./http')
const redisOp = require('../../server/common/redis_op')
const ApiError = require('./api_error')

router.post('/client/login', async (ctx, next)=>{
    
    let { username, password } = ctx.checkParameter(['username', 'password'])
    console.log(username, password)
    let res = await http.postSync('http://127.0.0.1:9000/check_login', {username, password}, true)
    console.log(res)
    if(res && res.type == 'AJAX' && res.body.status == true) {
        //密码校验成功
        //生成token并存储redis
        let token = md5(uuid.v1())
        
        redisOp.set(username, JSON.stringify({
            token: token,
            stime: new Date().getTime()
        }), 3600) //设置中台过期时间 一天
        response = {
            success: 'yes',
            message: '登录成功',
            username: username,
            token: token
        }
    }
    else {
        response = {
            success: 'no',
            message: '登录失败'
        }
    }

    ctx.rest(response)
})
router.post('/logout', async(ctx, next)=> {
    let params = ctx.checkParameter()
    console.log(params)
    let check = await ctx.check_login()
    if(check){
        redisOp.del(params.user_id)
    }
    ctx.rest()
})
// render html
router.get('/index', (ctx, next) => {
    ctx.type = 'text/html;charset=utf-8';
    let file = path.join(__dirname, '../assets/build/templates/index.html')
    console.log(file)
    let html_buffer = fs.readFileSync(file)
    ctx.response.body = html_buffer.toString()
})

//权限
router.get('/client/check/login/status', async (ctx, next) => {

    let check = await ctx.check_login()
    if (!check) {
        ctx.rest({ status: 'fail', message: 'Unauthorized 登录状态失效'})
        return
    }
    ctx.rest({ status: 'success', message: '登录状态成功'})
})

router.get('/ping/health', (ctx, next) => {
    ctx.rest()
})

module.exports = router