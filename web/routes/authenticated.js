/**
 * 在app.use(router)之前调用
 */

const redisOp = require('./redis_op')
require('./console_light')
function get_route(url){
    let pos = url.indexOf('?')
    if(pos > -1){
        return url.substr(0, pos)
    }
    return url
}

module.exports = function() {
    return async(ctx, next) => {
        //console.log(ctx.request)
        let method = ctx.request.method
        let url = ctx.request.url
        console.success(`${method} \t\t\t\t ${url}`)
        if(url.startsWith('/api')){

            let check = await ctx.check_login()
            if(!check){
                ctx.body = { code: 401, type: 'ERROR', message: 'Unauthorized 登录状态失效'}
                return
            }
        }
        await next();
    }
}