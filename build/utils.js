const fs = require('fs')
const path = require('path')
const flat = require('flat')
const chalk = require('chalk')
const levels = {
    'info': 'green',
    'debug': 'blue',
    'warn': 'orange',
    'error': 'red'
    // '0': 'green',
    // '1': 'blue',
    // '2': 'orange',
    // '3': 'red'
}

function log(level, ...texts) {
    let color = levels[level] || ''
    if (color) {
        console.log(chalk[color](texts))
    }
}
function getBabels(bals) {
    let b = bals.map(item => {
        let a
        if (item instanceof Array) {
            a = require.resolve(item[0])
            return item[0]
        } else {
            a = require.resolve(item)
        }
        return a
    })
    return b
}
function getEslintIgnore(eslintfile) {
    let eslints = require(eslintfile)
    return eslints
}
function getEntries(containers, scanPath, level, totalLevel, isNotEntry) {
    if (!scanPath) {
        console.log('')
        return;
    }
    if (!fs.existsSync(scanPath)) {
        console.log('')
        return;
    }
    getFiles(containers, scanPath, '', '', level, totalLevel, isNotEntry)
}
function getFiles(containers, scanPath, modName, parentModel, level, totalLevel, isNotEntry) {
    if (level > totalLevel) {
        // console.log('level ', level, totalLevel, scanPath)
        return;
    }
    if (!fs.statSync(scanPath).isDirectory()) {
        console.log('scan path is not a directory!')
        return;
    }
    // console.log('scanning path: ', scanPath)
    let pageDir = fs.readdirSync(scanPath)
    pageDir.forEach(modulName => {
        let modulPath = path.join(scanPath, modulName)
        // console.log('moduleName1: ', parentModel, modulName, modulPath)
        if (fs.statSync(modulPath).isDirectory()) {
            getFiles(containers, modulPath, modulName, modName, level + 1, totalLevel, isNotEntry)
        } else {
            let pageName = modulName.replace(path.extname(modulName), '')
            let mpath = modulPath.replace(path.extname(modulName), '')
            let pdir = modName ? modName : ''
            // console.log('moduleName2: ', parentModel, modulName, mpath, path.extname(modulName))
            let item = {
                name: pageName,
                moduleName: pdir,
                parentModel: parentModel,
                path: mpath,
                entryPath: mpath + '.js',
                nonePage: false
            }
            
            if (!isNotEntry) {
                if (/\.html$/.test(modulName)) {
                    // console.log('page item: ')
                    // console.log(item)
                    item.path = item.path + '.html'
                    containers.push(item)
                }
            } else {
                if (/\.js$/.test(modulName)) {
                    item.nonePage = true
                    // console.log('cdnjs item: ')
                    // console.log(item)
                    containers.push(item)
                }
            }
        }
    })
}
function getFlatEntries(obj, container) {
    let flatObj = flat(obj || {})
    Object.keys(flatObj).forEach(key => {
        let val = flatObj[key]
        let keyPath = key.replace(/\./g, '/')
        keyPath = keyPath.replace(/(.*)\/\d$/, '$1')
        if (val && !(typeof flatObj[key] == 'object' && Object.keys(flatObj[key]).length === 0)) {
            keyPath = keyPath + '/' + val
            // console.log('keyPath: ', keyPath, typeof flatObj[key], Object.keys(flatObj[key]).length === 0)
        }
        container[keyPath] = true
    });
    return container
}
function isAnEntry(e, item) {
    let parentM = item.parentModel || ''
    let moduleName = item.moduleName ? path.join(parentM, item.moduleName) : ''
    let pageName = item.name ? path.join(moduleName, item.name) : ''
    // console.log('isAnEntry: ', parentM, ':', moduleName, ':', pageName, " == ", e[pageName], e[moduleName], e[parentM])
    if (e[pageName]) {
        return true
    } else if (e[moduleName]) {
        return true
    } else if (e[parentM]) {
        return true
    } else {
        return false
    }
}

module.exports = {
    log: log,
    getBabels: getBabels,
    getEslintIgnore: getEslintIgnore,
    getEntries: getEntries,
    getFiles: getFiles,
    isAnEntry: isAnEntry,
    getFlatEntries: getFlatEntries
}