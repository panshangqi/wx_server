/**
 * 在app.use(router)之前调用
 */
const ApiError = require('../common/api_error')
const APIError = require('../common/api_error')

module.exports = function() {
    return async(ctx, next) => {
        ctx.rest = (data) => {
            if(data){
                ctx.body = { type: 'AJAX', code: 200, body: data }
            } else {
                ctx.body = { type: 'AJAX', code: 200, body: 'success' }
            }
        }

        //dialog = true， 前端弹出报错dialog, 前端判断 500 或者 code -1
        ctx.onError = (errorCode, errorMessage = '', dialog) => {
            ctx.response.status = errorCode
            ctx.response.message = 'Internal Server Error'

            let res_body = { type: 'ERROR', code: errorCode, message: errorMessage }
            if(dialog || errorCode == 500){
                res_body.code = -1
            }
            ctx.body = res_body
        }

        ctx.checkParameter =(need_params)=>{
            console.log(need_params)
            let requestBody = {...ctx.request.body, ...ctx.request.query, ...ctx.params, ...{}}
            //console.log(requestBody)
            if(!need_params){
                return requestBody
            }
            if(typeof need_params == 'string'){
                if(requestBody[need_params] == undefined){
                    throw new ApiError(400, `Bad Request: 缺少参数 ${need_params}`)
                    return
                }

            } else if(Array.isArray(need_params)){
                for(let key of need_params){
                    if(requestBody[key] == undefined){
                        throw new ApiError(400, `Bad Request: 缺少参数 ${key}`)
                        return
                    }
                }
            } else{
                throw new ApiError(400, 'Bad Request')
                return
            }

            return requestBody
        }

        try{
            await next()
            if(ctx.status == 404){
                throw new ApiError(404, 'Not Found')
            }
        }catch(err){

            console.log(err)
            if(err.code && err.message){  //捕获models, service, controllers 层 的 全局异常
                ctx.onError(err.code, err.message, err.dialog)
            }else{
                ctx.onError(500, '服务器错误')
            }
        }
    }
}