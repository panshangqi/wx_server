const config = require('../config')
const Define = {
    class_images: "class_images"
}
module.exports = {
    Define,
    make_static_url: (filename) => {
        return `${config.server.url}:${config.server.static_port}${filename}`
    }
}