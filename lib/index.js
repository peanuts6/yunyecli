#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const fse = require('fs-extra')
const shelljs = require('shelljs')
const program = require('commander')
const projectPath = path.resolve('./')
const cliRootPath = path.resolve(__dirname, '../')
const cliNodePath = path.join(cliRootPath, 'node_modules')
const cliConfigPath = path.join(cliRootPath, 'configs')
const projectConfigPath = path.join(projectPath, '_configs')
const packageFile = require('../package.json') || {}
const log = console.log

const env = process.env.ENV || 'prd'
const projectType = process.env.PROJECT_TYPE || 'default'

const _configFiles = [
    'api.js',
    'build.js',
    'entries.js',
    'repository.js'
]
const lints = [
    '.htmllintrc',
    '.eslintignore',
    '.eslintrc'
]
const srcFiles = [
    'demo',
    'mock',
    'public',
    'src'
]

log(packageFile.name + '_' + packageFile.version || '', cliRootPath)
program.version(packageFile.version, '-v, --version, -version')

/**
 * initialize a project
 * current intial dir should be in the project dir
 * yunyecli init [default|react|angular|vue]
 */
program
    .command('init [projectType]')
    .action((pt) => {
        log(chalk.green(`start initializing project...`))
        log(chalk.green(`copying config files...`))
        copyFiles(cliConfigPath, projectConfigPath, _configFiles)
        copyFiles(path.join(cliRootPath, 'lint'), projectPath, lints)
        log(chalk.green(`finish copying config files`))
        log(chalk.green(`start project structure...`))
        createStruct(pt, projectPath)
        log(chalk.green(`end project structure...`))
        log(chalk.green(`finish initializing project`))
    });

/**
 * create a project:
 * yunyecli create project [projectName] [projectType]
 * create a page in current directory:
 * yunyecli create page [pageName]
 * create a page in specify directory, only allow 2 level directory:
 * yunyecli create page [path1/[.../]pageName]
 */
let tips = `
-----------------------------------------------------------------
|    yunyuecli --help                                           |
|    create project:                                            |
|        yunyuecli create project [projectName] [projectType]   |
|    create page:                                               |
|        yunyecli create page [[path/]pageName]                 |
|________________________________________________________________
`
program
    .command('create [acts] [name] [projectType]')
    .action((acts, name, pt) => {
        let proType = pt || 'default'
        switch (acts) {
            case 'project':
                createProject(name, proType)
                log(chalk.black.bgYellow.bold(' finish creating a project. you also need to cd ' + name +' && npm init '))
                break;
            case 'page':
                createPage(name)
                break;
            default:
                log(chalk.yellow(tips))
                break;
        }
    });
/**
 * 初始化项目并复制框架结构
 * @param {String} pt : 'default','react','angular','vue
 */
function createStruct (pt, proPath) {
    log(chalk.green('creating project'))
    let proType = pt || 'default'
    for (let i = 0; i < srcFiles.length; i++) {
        try {
            if (fs.existsSync(path.join(proPath, srcFiles[i]))) {
                log(chalk.red(`File ${srcFiles[i]} has existed!`))
                continue
            }
            fse.copySync(path.join(cliRootPath, 'skeleton', proType, srcFiles[i]), path.join(proPath, srcFiles[i]))
        } catch (e) {
            log(chalk.red(e))
        }
    }
    log(chalk.green('finish creating project'))
}
/**
 * 创建项目
 * @param {String} name 
 * @param {String} proType : 'default','react','angular','vue
 */
function createProject(name, proType) {
    console.log('creating a ', proType, 'project: ', name)
    if (!name) {
        log(chalk.red('please input a projectName'))
        return
    }
    let pt = name
    pt = path.resolve('./', name)
    // todo
    copyFiles(cliConfigPath, path.join(pt, '_configs'), _configFiles)
    copyFiles(path.join(cliRootPath, 'lint'), pt, lints)
    createStruct(proType, pt)
}
/**
 * 生成模版页面
 * @param {*} name 
 */
function createPage (name) {
    console.log('creating a page: ', name)
    console.log('hasn\'t support: ')
}

// build entry
program
    .command('build [env] [buildType]')
    .action((env, buildT) => {
        let buildType = buildT || 'all'
        log(chalk.cyan('start build... '))
        log(chalk.cyan('env: ' + env))
        log(chalk.cyan('buildType: ' + buildType))
        let isProxy = +(process.env.ISPROXY || 0)
        let vars = ''
        const buildConfigFile = path.join(projectConfigPath, 'build.js')
        const buildConfig = require(buildConfigFile) || {}
        const distPath = path.join(projectPath, buildConfig.dist.root)
        log(chalk.cyan('distPath: ' + distPath))
        log(chalk.cyan('publicPath: ' + buildConfig.publicPath))
        let webpackPath = path.join(cliNodePath, 'webpack/bin/webpack.js')
        if (env == 'dev') {
            vars += `rm -rf ${distPath} && ENV=${env} BUILDTYPE=${buildType} ISPROXY=${isProxy}`
        } else {
            vars += `rm -rf ${distPath} && ENV=${env} BUILDTYPE=${buildType}`
        }
        shelljs.exec(`${vars} ${webpackPath} --config ${path.join(cliRootPath, 'build/webpack.default.js')}`)
    })

// start server
program
    .command('start [serverPort] [sslPort]')
    .action((port, sslport) => {
        let p = +port
        let sslp = +(sslport || p) + 1
        let isProxy = +(process.env.ISPROXY || 0)
        console.log('server port', p, sslp, isProxy)
        shelljs.exec(`PORT=${p} SSLPORT=${sslp} ISPROXY=${isProxy} && node ${path.join(cliRootPath, 'serve/app.js')}`)
    })

// webpack-bundle-analyzer <bundleStatsFile> [bundleDir] [options]

let helpText = `
---------------------------------------------------------------
|   Examples:                                                  |
|   initialize a project:                                      |
|       yunyecli init [projectType]                            |
|                                                              |
|   create a project:                                          |
|       yunyecli create project [projectName] [projectType]    |
|                                                              |
|   create a page in current directory:                        |
|       yunyuecli create page [pageName]                       |
|                                                              |
|   create a page in specify directory:                        |
|       yunyecli create page [[path/../]pageName]              |
|______________________________________________________________|
`
program
    .on('--help', function() {
        console.log(chalk.yellow(helpText))
    })

program.parse(process.argv)

function copyFiles(from, to, files) {
    for (let i=0; i<files.length; i++) {
        if (fs.existsSync(path.join(to, files[i]))) {
            log(chalk.red(`File ${files[i]} has existed!`))
            continue
        }
        fse.copySync(path.join(from, files[i]), path.join(to, files[i]))
    }
}
