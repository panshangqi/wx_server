//编码解码图片
const fs = require('fs');
const DB = require('../common/db');
const { ObjectID } = require('mongodb');
const common = require('../common')

module.exports = {
    async check_login(username, password){
        let userinfo = await DB.login().findOne({
            username, password
        })
        if(userinfo){
            return true
        }
        return false
    },
    
}