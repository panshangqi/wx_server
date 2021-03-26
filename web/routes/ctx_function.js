/**
 * 在app.use(router)之前调用
 */
const ApiError = require('./api_error')
const redisOp = require('../../server/common/redis_op')
module.exports = function() {
    return async(ctx, next) => {
        ctx.rest = (data) => {
            if(data){
                ctx.body = {body: data, type: 'AJAX', code: 200}
            } else {
                ctx.body = {body: 'success', type: 'AJAX', code: 200}
            }
        }

        ctx.onError = (errorCode, message = '') => {
            ctx.body = { code: errorCode, type: 'ERROR', message: message}
        }

        ctx.checkParameter =(need_params)=>{
            let requestBody = {...ctx.request.body, ...ctx.request.query, ...ctx.params, ...{token: ctx.header.token, user_id: ctx.header.uid}}
            if(!need_params){
                return requestBody
            }
            
            if(typeof need_params == 'string'){
                if(requestBody[need_params] == undefined){
                    throw ApiError.ErrorForNeedParameter(need_params)
                }

            } else if(Array.isArray(need_params)){
                for(let key of need_params){
                    if(requestBody[key] == undefined){
                        throw ApiError.ErrorForNeedParameter(key)
                    }
                }
            } else{
                throw new APIError(400, 'error: second params of checkParameter must be string or array')
            }

            return requestBody
        }
        ctx.check_login = async () => {
            //检查登录
            let token = ctx.headers.token || undefined
            let username = ctx.headers.username || undefined
            console.success(`check login: token=${token}, username=${username}`)
            if (!token || !username) {
                return false
            }
            let check_res = await redisOp.get(username)
            
            if (!check_res) {
                return false
            }
            return true
        }
        await next();
    }
}