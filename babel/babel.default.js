const presets = [
    ["@babel/preset-env", {
        loose: true,
        useBuiltIns: "entry",
        corejs: 3,
        exclude: []
    }]
]

const plugins = [
    ["@babel/plugin-proposal-decorators", { legacy: true }], //, decoratorsBeforeExport: true }],
    ["@babel/plugin-proposal-class-properties", { loose: true }],
    ["@babel/plugin-proposal-object-rest-spread", { loose: true, useBuiltIns: true }],
    ["@babel/plugin-transform-modules-commonjs", { loose: true, strict: false, noInterop: false, lazy: false }],
    "@babel/plugin-proposal-export-default-from",
    "@babel/plugin-proposal-export-namespace-from",
    "@babel/plugin-syntax-dynamic-import",
    "@babel/plugin-proposal-optional-chaining",
    "@babel/plugin-proposal-async-generator-functions",
    "@babel/plugin-transform-regenerator",
    "@babel/plugin-transform-reserved-words",
    "@babel/plugin-transform-async-to-generator",
    "@babel/plugin-transform-property-literals",
    "@babel/plugin-transform-member-expression-literals"
]

module.exports = {
    presets,
    plugins
}
