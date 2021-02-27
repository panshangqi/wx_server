const ObjectID = require('mongodb').ObjectID

class CollectionEx {
    constructor(db, collectionName) {
        this.collection = db.collection(collectionName);
    }

    async findById(id) {
        let result = await this.collection.findOne({_id: ObjectID(String(id))})
        return result
    }

    async findOne(filter, options = {}) {
        let result = await this.collection.findOne(filter, options)
        return result
    }

    async queryOne(filter, options = {}) {
        let result = await this.collection.findOne(filter, options)
        return result
    }

    async findMany(filter, options = {}) {
        let result = await this.collection.find(filter, options).toArray()
        return result
    }

    async queryMany(filter, options = {}) {
        let result = await this.collection.find(filter, options).toArray()
        return result
    }

    async insertOne(doc, options = {}) {
        let result = await this.collection.insertOne(doc, options);
        return result ? result.insertedId : null;
    }

    async insertMany(docs, options = {}) {
        let result = await this.collection.insertMany(docs, options);
        return result ? result.insertedId : null;
    }

    async deleteOne(filter, options = {}) {
        let result = await this.collection.deleteOne(filter, options);
        return result ? result.result.ok : null;
    }

    async deleteMany(filter, options = {}) {
        let result = await this.collection.deleteMany(filter, options);
        return result ? result.result.n : null;
    }

    async updateOne(filter, options = {}) {
        let ret = await this.collection.updateOne(filter, options)
        return ret ? ret.result.ok : ret
    }

    async updateMany(filter, options = {}) {
        let ret = await this.collection.updateMany(filter, options)
        return ret ? ret.result.nModified : ret
    }

    async aggregate(pipleline, options = {}) {
        let result = await this.collection.aggregate(pipleline, options).toArray()
        return result
    }

    async distinct(key, filter, options = {}){
        let result = await this.collection.distinct(key, filter, options).sort()
        return result
    }

    async count(filter, options = {}) {
        let count = await this.collection.countDocuments(filter, options)
        return count
    }
}

module.exports = CollectionEx
