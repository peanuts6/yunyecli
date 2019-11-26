let webpackSource = require('webpack-sources')
let ConcatSource = webpackSource.ConcatSource

class HeadPolyfill {
    apply (complier) {
        complier.hooks.emit.tapAsync('HeadPolyfill', (compilation, callback) => {
            compilation.chunks.forEach(chunk => {
                chunk.files.forEach(filename => {
                    let source = compilation.assets[filename].source()
                    let s = source.replace(/document.head/ig, 'document.getElementsByTagName("head")[0]')
                    compilation.assets[filename] = new ConcatSource(s)
                })
            })
            callback()
        })
    }
}

module.exports = HeadPolyfill
