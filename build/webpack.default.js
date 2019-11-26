
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const Utils = require('./utils')

const env = process.env.ENV || 'prd'
const buildType = process.env.BUILDTYPE || 'all'
const ISPROXY = process.env.ISPROXY || false

const cliRootPath = path.resolve(__dirname, '../')
const cliNodePath = path.join(cliRootPath, 'node_modules')
const projectPath = path.resolve('./')
const projectNodePath = path.join(projectPath, 'node_modules')
const configFilePath = path.join(projectPath, '_configs')
const babelConfig = require(path.join(cliRootPath, 'babel/babel.default.js'))
const ApiConfigFile = require(path.join(configFilePath, 'api.js'))
const buildConfig = require(path.join(configFilePath, 'build.js'))
let { bizType, publicPath, watch, optimize, alias, mockData, mockDatas, chunkNameMD5, htmllint, entry, cdnjs, dist, extractCss, devtool, devtools, externals } = buildConfig || { dist: {} }
bizType = bizType || ''
const publicPaths = publicPath || {}
let webpackPublicPath = publicPaths[env] || '/'
if (bizType) {
    webpackPublicPath = webpackPublicPath + bizType + '/'
}
Utils.log(1, 'env: ', env, ' buildType: ', buildType, ' isProxy: ', ISPROXY, ' webpackPublicPath ', webpackPublicPath)
Utils.log(2, 'cliRootPaht:', cliRootPath, 'cliNodePath: ', cliNodePath, ' projectNodePath: ', projectNodePath, '__dirname:', __dirname)

let entryFiles
if (buildType == 'diff') {
    try{
        entryFiles = require(path.join(configFilePath, 'entries.js'))
    } catch(e) {
        console.log(`缺少入口配置文件，请检查项目文件夹: _config/${entryFile} 是否存在`)
    }
}
entryFiles = entryFiles || {}
let flatEntries = {}
Utils.getFlatEntries(entryFiles, flatEntries)
// console.log('allEntries: ', flat(entryFiles))
// console.log('flatEntries:', flatEntries)
// let eslintignore = Utils.getEslintIgnore(path.join(projectPath, '.eslintignore'))
// console.log('eslintfile: ', eslintignore)

let isOptimize = optimize || true
let isWatch = false
let isMock = false
if (env == 'dev') {
    isWatch = watch
    isMock = mockData
    mockData = mockData && mockDatas ? mockDatas : {}
}
let configs = {
    env: env,
    isProxy: ISPROXY,
    version: require(path.join(projectPath, './package.json')).version
}
let config = {
    mode: 'development',
    watch: isWatch,
    resolve: {
        modules: [cliNodePath, projectPath, projectNodePath],
        alias: alias || {}
    },
    resolveLoader: {
        modules: [cliNodePath, projectNodePath]
    },
    entry: {},
    output: {
        path: path.resolve(dist.root, bizType),
        filename: chunkNameMD5 ? '[name].[chunkhash].js' : '[name].js?v=[chunkhash]',
        publicPath: webpackPublicPath,
        chunkFilename: `` + chunkNameMD5 ? '[name].chunk.[chunkhash].js' : '[name].chunk.js?v=[chunkhash]' + '.js'
    },
    module: {
        rules: [
            {
                test: /\.html$/,
                exclude: /node_modules/,
                loader: path.join(cliRootPath, 'build/swig-loader'),
                query: { config: configs, origins: ApiConfigFile[env] || {} }
            },
            {
                test: /\.tpl$/,
                exclude: /node_modules/,
                loader: 'html-loader'
            },
            {
                test: /\.js/,
                loader: 'babel-loader',
                options: {
                    babelrc: false,
                    configFile: path.join(cliRootPath, 'babel/babel.default.js')
                }
            },
            {
                test: /\.js$/,
                loader: 'eslint-loader',
                exclude: /node_modules/,
                // exclude: require(path.join(projectPath, '.eslintignore')),
                options: {
                    fix: true,
                    configFile: path.join(projectPath, '.eslintrc'),
                    outputReport: {
                        filePath: '../reports/checkstyle.xml',
                        formatter: 'checkstyle'
                    },
                    quiet: true
                }
            },
            {
                test: /\.css$/,
                exclude: /node_modules/,
                use: [
                    !!extractCss ? MiniCssExtractPlugin.loader : 'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/,
                loader: 'file-loader',
                exclude: /node_modules/,
                options: {
                    outputPath: `${dist.assets}/images/`,
                    name: chunkNameMD5 ? '[name].[hash].[ext]' : '[name].[ext]?v=[hash]'
                }
            },
            {
                test: /\.(svg|woff|eot|ttf)$/,
                loader: 'file-loader',
                exclude: /node_modules/,
                options: {
                    outputPath: `${dist.assets}/fonts/`,
                    name: chunkNameMD5 ? '[name].[hash].[ext]' : '[name].[ext]?v=[hash]'
                }
            }
        ]
    },
    plugins: [],
    externals: {

    },
    optimization: {},
    performance: {
        hints: false
    }
}
if (htmllint) {
    config.module.rules.push({
        test: /(\.html|\.tpl)$/,
        exclude: /node_modules/,
        loader: 'htmllint-loader',
        query: {
            config: path.join(projectPath, '.htmllintrc'),
            failOnError: false,
            failOnWarning: false
        }
    })
}
if (extractCss) {
    config.plugins.push(
        new MiniCssExtractPlugin({
            filename: chunkNameMD5 ? '[name].[contenthash].css' : '[name].css?v=[contenthash]',
            chunkFilename: chunkNameMD5 ? '[id].[contenthash].css' : '[id].css?v=[contenthash]'
        })
    )
}
let defineParam = {
    env: JSON.stringify(env),
    ISMOCK: isMock && env == 'dev',
    ISPROXY: ISPROXY && env == 'dev'
}
let uglifyOptions = {
    cache: true,
    parallel: true,
    extractComments: 'all',
    warning: 'verbose',
    ecma: 5,
    ie8: true,
    beautify: false,
    compress: false,
    // compress: {
    //     drop_console: true
    // },
    comments: false,
    mangle: false,
    toplevel: false,
    keep_classnames: true,
    keep_fnames: true
}
if (env !== 'dev' && isOptimize) {
    config.mode = 'production'
    config.optimization.minimizer = [
        new UglifyJsPlugin({
            uglifyOptions: uglifyOptions
        })
    ]
    defineParam['process.env.NODE_ENV'] = JSON.stringify('production')
} else {
    config.mode = 'development'
    defineParam['process.env.NODE_ENV'] = JSON.stringify('development')
}
config.plugins.push(new webpack.HashedModuleIdsPlugin())
config.plugins.push(new webpack.DefinePlugin(defineParam))
config.plugins.push(new CopyWebpackPlugin([
    {
        from: './public',
        to: './vendors',
        // ignore: [''],
        force: true,
        cache: true
    }
]))
if(devtool && devtools && devtools[env]) {
    config.devtool = devtools[env]
}
if (externals) {
    config.externals = Object.assign({}, config.externals, externals || {})
}

let containers = []
let htmlPlugins = []
let scanPath = path.join(projectPath, entry.root || '', entry.module || '')
console.log('scan page path: ', scanPath)
Utils.getEntries(containers, scanPath, 0, 2, false)
// console.log('all entries finished! ', containers.length)
// console.log('all html:  ', htmlPlugins)
let cdnjss = []
let cdnScanPath = path.join(projectPath, cdnjs.root || '', cdnjs.module || '')
console.log('scan cdn path: ', cdnScanPath)
Utils.getEntries(cdnjss, cdnScanPath, 0, 2, true)
// console.log('all cdn js finished! ', cdnjss.length)
let allEntries = containers.concat(cdnjss)
allEntries.forEach(item => {
    let isCadidate = buildType == 'diff' ? Utils.isAnEntry(flatEntries, item) : true
    if (isCadidate) {
        let entryname = path.join(item.parentModel, item.moduleName, item.name)
        if (item.nonePage) {
            entryname = path.join('cdn', entryname)
        }
        config.entry[entryname] = item.entryPath
        console.log('entryname: ', entryname, item.path, item.parentModel, item.moduleName, item.name)
        if (!item.nonePage) {
            htmlPlugins.push(new HtmlWebpackPlugin({
                filename: entryname + '.html',
                template: item.path,
                chunks: [].concat(entryname)
            }))
        }
    }
})
console.log('all entries finished! ', config.entry)

config.plugins = config.plugins.concat(htmlPlugins)

module.exports = config
