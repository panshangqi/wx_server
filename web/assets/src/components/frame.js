import 'whatwg-fetch';
import {Button,Input,message,Icon} from 'antd'
const env_dev = process.env.NODE_ENV === 'development';
const Frames = {}
function paramFormat(obj){
    var str = ''
    for(var key in obj){
        if(str != ''){
            str += '&'
        }
        str += `${key}=${obj[key]}`
    }
    return str;
}
function common_fetch(method, url, reqParams = {}, callback, fn_err){
    const dtime = new Date().getTime()
    const params = reqParams
    let path = url
    const setting = {
        method,
        credentials: 'include',
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/json',
            'Accept': 'application/json; charset=utf-8'
        }
    }
    params.t = dtime
    if(method == 'post' || method == 'put'){
        setting.body = JSON.stringify(params)
    }else{ //get delete
        const params_string = paramFormat(params)
        path = `${url}?${params_string}`
    }
    function check_response_status(res){
        const { status } = res;
        const msg = [];
        if (status >= 200 && status < 300) {
            return res;
        }else if (status === 400 || status === 500) {
            msg.push('我们正在努力解决问题');
        }
        else if (status === 401) {
            msg.push('您尚未登录');
        }
        else if (status === 403) {
            msg.push('你无权限访问');
        }
        else if (status === 404) {
            msg.push('未发现所请求的资源');
        }
        else if (status === 403) {
            msg.push('没有权限或访问的资源不属于此账号');
        }
        else if (status === 502) {
            msg.push('服务正在升级，请稍后重试！');
        }
        if(typeof fn_err === 'function'){
            fn_err(status);
        }
        msg.push(`(${res.statusText})`);
        const error = new Error();
        error.name = status;
        error.message = msg.join('\n');
        error.res = res;
        throw error;

    }
    function parse_res(res){
        return res.json()
    }
    function success(res_data){
        if(typeof callback === 'function'){
            callback(res_data)
        }
    }
    function net_error(err){
        if(typeof fn_err === 'function'){
            fn_err(500)
        }
        console.log(err.message)
    }
    fetch(path, setting).then(check_response_status)
        .then(parse_res)
        .then(success)
        .catch(net_error)
}

Frames.http = {
    get(url, reqParam, callback, fn_err) {
        return common_fetch('get', url, reqParam, callback, fn_err);
    },
    post(url, reqParam, callback, fn_err) {
        return common_fetch('post', url, reqParam, callback, fn_err);
    },
    put(url, reqParam, callback, fn_err) {
        return common_fetch('put', url, reqParam, callback, fn_err);
    },
    _delete(url, reqParam, callback, fn_err) {
        return common_fetch('delete', url, reqParam, callback, fn_err);
    },
    getSync(url, reqParam){
        return new Promise(function (resolve, reject) {
            Frames.http.get(url, reqParam, function (data) {
                resolve(data)
            },function (err_code) {
                resolve(err_code)
            })
        })
    },
    postSync(url, reqParam){
        return new Promise(function (resolve, reject) {
            Frames.http.post(url, reqParam, function (data) {
                resolve(data)
            },function (err_code) {
                resolve(err_code)
            })
        })
    }
};
/*
let date = new Date(timestamp)
        let year = date.getFullYear()
        let month = ('0' + (date.getMonth() + 1)).slice(-2)
        let day = ('0' + date.getDate()).slice(-2)
        let hour = ('0' + date.getHours()).slice(-2)
        let minute = ('0' + date.getMinutes()).slice(-2)
        let second = ('0' + date.getSeconds()).slice(-2)
        return `${year}-${month}-${day} ${hour}:${minute}:${second}`
 */
Frames.util = {
    dataFormat: (timestamp)=>{
        let date = new Date(timestamp)
        let year = date.getFullYear()
        let month = ('0' + (date.getMonth() + 1)).slice(-2)
        let day = ('0' + date.getDate()).slice(-2)
        let hour = ('0' + date.getHours()).slice(-2)
        let minute = ('0' + date.getMinutes()).slice(-2)
        let second = ('0' + date.getSeconds()).slice(-2)
        return `${year}-${month}-${day} ${hour}:${minute}:${second}`
    },
    make_route: (route) => {

        if (route[0] == '/')
            route = route.substr(1)
        return `http://${window.location.host}/${route}`
    },
    make_url: (route) => {
        if(env_dev){
            return '/api' + route
        }
        return '/api' + route
    },
    get_url_params: (url) => {
        if (!url)
            return {}
        let pos = url.indexOf('?')
        let search = url
        if (pos > -1) {
            search = url.substring(pos + 1, url.length)
        }
        let param_arr = search.split('&')
        let params = {}
        for (let param of param_arr) {
            let value = param.split('=')
            params[value[0]] = value[1]
        }
        return params
    },
    sleep: (time) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(time)
            }, time)
        })
    },
    get_file_suffix(fileName){
        let extName = fileName.substring(fileName.lastIndexOf('.')+1);    //后缀名
        return extName
    },
    loading(load, msg){
        
        if(load) {
            message.config({
                top: 250,
                content: '',
                duration: 20
            })
            message.loading(msg)
            
        }else {
            message.destroy()
        }
    }
}
export default Frames;
