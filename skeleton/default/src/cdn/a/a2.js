; (function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory(root);
    } else {
        root.a2 = factory(root);
    }
}(this, function (global, undefined) {
    let a2 = {
        version: '1.0.0',
        name: 'a2'
    };
    return a2;
}));