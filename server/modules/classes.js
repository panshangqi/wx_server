const fs = require('fs');
const path = require('path');
const md5 = require('md5');
const Upload = require('./upload');
const DB = require('../common/db');
const { ObjectID } = require('mongodb');
const common = require('../common')

module.exports = {

    'create_and_modify_class': async (action, data, class_id,save_dir) => {
        let timer = new Date().getTime()
        let extension = data.background.extension

        let base64str = data.background['image']
        let file_md5 = md5(base64str)
        let save_path = path.join(save_dir, `${file_md5}.${extension}`)
        console.log(save_path)
        Upload.save_image(base64str, save_path)

        let class_data = {
            title: data.title,
            name: data.title,
            sub_title: data.sub_title,
            background: {
                image: `/${common.Define.class_images}/${file_md5}.${extension}`,
                extension: extension
            },
            
            introduction: data.introduction,
            
        };
        console.log(action, class_id)
        if(action == 'create'){
            class_data.section_count = 0
            class_data.create_time = timer
            class_data.modify_time = timer
            await DB.classes().insertOne(class_data);
        }
        else if(action == 'modify' && class_id){
            class_data.modify_time = timer
            await DB.classes().updateOne({_id: ObjectID(class_id)},{
                $set: class_data
            })
        }
    },

    'query_class': async (class_id) => {
        if(class_id == -1){
            return await DB.classes().queryMany()
        }
        let classInfo = await DB.classes().queryOne({_id: ObjectID(String(class_id))})
        if(classInfo){
            classInfo.background.image = common.make_static_url(classInfo.background.image)
            return classInfo
        }
        
    },

    'delete_class': async(class_id) => {
        await DB.classes().deleteOne({_id: ObjectID(class_id)})
    },
    /***
     * 
     * title: ""
     * music: {
     *      audio: '',
     *      extension: 'mp3'
     * }
        content: Array(4)
        0: {image: undefined, extension: 'jpg'}
        1: {text: ""}
        2: {text: ""}
        3: {image: undefined}
     */
    'create_section': async (action, data, class_id, section_id, save_dir)=>{
        
        let content = data.content;
        let section_data = {
            title: data.title,
            author: data.author,
            content: [],
            class_id: class_id,
        };
        let music = data.music
        let audio_md5 = md5(music.audio)

        let audio_path = path.join(save_dir, `${audio_md5}.${music.extension}`)
        console.log(audio_path)
        Upload.save_image(music.audio, audio_path)

        section_data.music = {
            audio: `/${class_id}/${audio_md5}.${music.extension}`,
            extension: music.extension,
            duration: music.duration
        } 

        for(let obj of content){
            if('image' in obj) {
                let extension = obj.extension

                let base64str = obj['image']
                let file_md5 = md5(base64str)
                let save_path = path.join(save_dir, `${file_md5}.${extension}`)
                console.log(save_path)
                Upload.save_image(base64str, save_path)

                section_data.content.push({
                    type: 'image',
                    image: `/${class_id}/${file_md5}.${extension}`,
                    extension: extension
                })
            } else if('text' in obj){
                section_data.content.push({
                    type: 'text',
                    text: `${obj.text}`
                })
            }
        }
        //console.log(section_data, action)
        let current_time = new Date().getTime()
        console.log(current_time)
        if(action == 'create'){
            section_data.create_time = current_time
            section_data.modify_time = current_time
            await DB.section().insertOne(section_data)
        } else if(action == 'modify') {
            section_data.modify_time = current_time
            await DB.section().updateOne({_id: ObjectID(section_id)},{
                $set: section_data
            })
        }
        
        let section_count = await DB.section().count()
        
        await DB.section().updateOne({
            _id: ObjectID(class_id)
        },{
            $set: {section_count: section_count}
        })
        
    },

    'get_sections': async (class_id, section_id) => {
        console.log(class_id, section_id)
        if(section_id){
            let section = await DB.section().queryOne({_id: ObjectID(section_id)}); 
            if(section) {
                section.music.audio = common.make_static_url(section.music.audio)
                for(let con of section.content){
                    if('image' in con){
                        con.image = common.make_static_url(con.image)
                    }
                }
            }
            return section
        }
        return await DB.section().queryMany({class_id: class_id});
    },
}
