process.env.NODE_TLS_REJET_UNAUTHORIZED = '0'
const fs = require('fs')
const path = require('path')
const http = require('http')
const https = require('https')
const express = require('express')
const expressProxy = require('express-http-proxy')
const app = new express()
const webpack = require('webpack')

let env = process.env.ENV || 'prd'
let port = process.env.PORT || 19001
let sslport = process.env.SSLPORT || (+port + 1)
let isProxy = +(process.env.PROXY || '0')

let privateKey = fs.readFileSync(path.join(__dirname, './private.pem'), 'utf8')
let certificate = fs.readFileSync(path.join(__dirname, './public.pem'), 'utf8')
let credentials = { key: privateKey, cert: certificate }

let buildConfig = require(path.resolve('./', '_configs/build.js')) || {}
let { dist, proxy, bizType, mockData, mockDatas } = buildConfig
let staticPath = dist.root
let apiConfigFile = require(path.resolve('./', '_configs/api.js')) || {}
let apiConfig = apiConfigFile[env] || {}
let keys = Object.keys(apiConfig)
if (isProxy) {
    for (let i=0;i<keys.length;i++) {
        let k = keys[i]
        console.log('proxy: ', k, apiConfig[k])
        app.use(k, expressProxy(apiConfig[k]))
    }
    if (proxy) {
        for (let item in proxy) {
            app.use(item, proxy[item])
        }
    }
}

app.use(express.static(staticPath))
app.get('/', function (req, res, next) {
    console.log('', req.path)
    next()
})
app.get('/test', function (req, res) {
    let pages = {}
    scanPath(pages, staticPath)
    console.log('pages: ', pages)
    let str = ''
    getHtml(str, pages, '.')
    res.status(200).send(str);
})
app.all('/mock/:id/*', function(req, res) {
    let json
    let curPath = path.resolve('.')
    try {
        json = fs.readFileSync(path.resolve(curPath, `mock/${req.params.id}.json`), 'utf-8')
    } catch(err){
        json = {
            resCode: '',
            resMsg: `文件：mock/${err.path}不存在`
        }
    }
})
function scanPath(pcs, spdir) {
    let dir = fs.readFileSync(spdir)
    dir.map(file => {
        if (fs.statSync(path.resolve(sp, file)).isDirectory()) {
            pcs[file] = {}
            scanPath(pcs, path.join(sp, file))
        } else {
            pcs[file] = file
        }
    })
}
function getHtml(htmlstr, pages, ppath) {
    htmlstr += '<ul>'
    for (let page in pages) {
        if (typeof pages[page] === 'object') {
            str += `<li>${page}` + getHtml(htmlstr, pages[page], path.join(ppath, page)) + `${ppath}/${page}`
        } else {
            str += `<li><a href="${ppath}/${page}" target="_blank">${ppath}/${page}</a></li>`
        }
    }
    htmlstr += '</ul>'
}

let httpServ = http.createServer(app)
let httpsServ = https.createServer(credentials, app)
httpServ.listen(port, function () {
    console.log('Http Server start: http://localhost:' + port)
})
httpsServ.listen(sslport, function () {
    console.log('HTTPS Server start: https://localhost:' + sslport)
})

