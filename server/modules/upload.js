//编码解码图片
const fs = require('fs');
module.exports = {
    save_mp3(base64str, save_path){
        let pos = base64str.indexOf('base64,')
        if(pos > -1){
            base64str = base64str.substring(pos+7, base64str.length)
        }
        var image = new Buffer(base64str, 'base64');
        fs.writeFileSync(save_path, image);
    },
    save_image(base64str, save_path) {
        //data:image/png;base64,
        let pos = base64str.indexOf('base64,')
        if(pos > -1){
            base64str = base64str.substring(pos+7, base64str.length)
        }
        var image = new Buffer(base64str, 'base64');
        fs.writeFileSync(save_path, image);
    }
}