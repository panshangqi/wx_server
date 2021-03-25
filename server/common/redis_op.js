var redis_op = require("redis")
const config = require("../config");

class RedisClientEx {
    constructor(redis_url, options) {
        this.client = redis_op.createClient(redis_url, options)
        
        this.client.on('error', (err) => {
            console.log('------ Redis connection failed ------' + err)
        }).on('connect', () => {
            console.log(`------ Redis connection succeed: ${redis_url} ------`)
        })
    }

    //string
    async get(key) {
        //OK
        return new Promise((resolve, reject) => {
            this.client.get(key, (err, value) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(value)
                }
            })
        })
    }

    async set(key, value, seconds) {
        //OK
        return new Promise((resolve, reject) => {
            if (seconds) {
                this.client.setex(key, seconds, value, (err, ok) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(ok)
                    }
                })

            } else {
                this.client.set(key, value, (err, ok) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(ok)
                    }
                })
            }
        })
    }

    async del(key) {
        return new Promise((resolve, reject) => {
            this.client.del(key, (err, ok) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(ok)
                }
            })
        })
    }
}

const opts = {
	auth_pass: config.redis.pwd,
}
let redisClient = new RedisClientEx(config.redis.url, opts)

// 只有使用过的接口经过测试 自己是用新的接口请查询是否被是用过测试，没有接口 自己补充测试
module.exports = redisClient