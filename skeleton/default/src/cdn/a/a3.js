; (function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory(root);
    } else {
        root.a3 = factory(root);
    }
}(this, function (global, undefined) {
    let a3 = {
        version: '1.0.0',
        name: 'a3'
    };
    return a3;
}));