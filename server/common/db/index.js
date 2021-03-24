const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const mongoOp = require('./mongo_op')
const config = require('../../config');
const APIError = require('../api_error')
class DB {
    constructor () {
        this.db_scanservice = -1
    }
    async connect_db(){
        let client = await MongoClient.connect(config.mongo.main_uri, {
            auth: {
                user: config.mongo.user,
                password: config.mongo.password,
            },
            useNewUrlParser: true,
            useUnifiedTopology: true
        }).catch((error)=>{
            console.log(error)
        return null
    })

        return client
    }
    async init_db () {
        let client = await this.connect_db()
        if(!client){
            console.error('mongo db connect fail')
            return
        }
        this.db_amway = client.db('amway')

        console.log('mongo db init success')

        this.c_classes = new mongoOp(this.db_amway, 'classes')
        this.c_section = new mongoOp(this.db_amway, 'section')
        this.c_comment = new mongoOp(this.db_amway, 'comment')
        this.c_login = new mongoOp(this.db_amway, 'login')
    }

    login(){
        return this.c_login
    }

    classes(){
        return this.c_classes
    }

    section(){
        return this.c_section
    }

    comment(){
        return this.c_comment
    }


}
let db = new DB()

module.exports = db
