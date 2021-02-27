const config = require('../config')

module.exports = {
    make_static_url: (filename) => {
        return `${config.server.url}:${config.server.static_port}${filename}`
    }
}