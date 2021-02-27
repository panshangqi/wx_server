const path = require('path')

var root = path.resolve(__dirname, "../assets")
var src_root = path.resolve(root, 'src')
var dist_root = path.resolve(root, 'build')
var dist_static_root = ''
var global = {
    root,
    src_root,
    templates_root: path.resolve(src_root, 'templates'),
    routes_root: path.resolve(src_root, 'routes'),
    imgs_root: path.resolve(src_root, 'imgs'),
    components_root: path.resolve(src_root, 'components'),
    pages_root: path.resolve(src_root, 'pages'),
    fonts_root: path.resolve(src_root, 'fonts'),
    //dev
    port: 10032,
    dev_publicPath: '/',
    dev_insert_htmls: [],
    //prod
    dist_root,
    css_root: path.resolve(dist_root, 'css'),
    prod_publicPath: '../',
    static_font_root: `${dist_static_root}fonts`,
    static_css_root: `${dist_static_root}css`,
    static_img_root: `${dist_static_root}imgs`,
    static_js_root: `${dist_static_root}js`,
    static_template_root: `${dist_static_root}templates`

}


//console.log(global)
module.exports = global;