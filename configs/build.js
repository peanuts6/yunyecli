
module.exports = {
    // 项目类型
    // 0: default -> es6 es7 [默认类型，无使用框架]
    // 1: react [使用react框架]
    // 2: vue [使用vue框架]
    // 3: angular [使用angular框架,ts写法]
    projectType: "default",

    // 部署领域 /
    bizType: "",

    // 入口文件配置
    entry: {
        root: "src",
        module: "pages"
    },
    cdnjs: {
        root: "src",
        module: "cdn"
    },

    // 输出配置
    dist: {
        root: "dist",
        assets: "_assets"
    },
    
    //
    publicPath: {
        dev: "/",
        test: "/",
        prd: "/"
    },

    // 文件版本号输出格式：
    // true: chunkname.[md5hashcode].js
    // false: chunkname.js?v=[md5hashcode]
    chunkNameMD5 : false,
    
    // 
    extractCss: true,

    // 项目require/import 资源别名
    alias: {

    },
    externals: {},
    devtool: false,
    devtools: {
        // dev: '',
        // test: '',
        // prd: ''
    },
    // 是否开启代码压缩优化
    optimize: true,
    // 是否开启监听
    watch: true,
    // 是否开启html代码检测
    htmllint: true,

    // 模拟数据
    mockData: false,
    // 指定模拟接口
    mockDatas: {
        // 'getData': ''
    }

}
