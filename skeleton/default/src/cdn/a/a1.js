; (function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory(root);
    } else {
        root.a1 = factory(root);
    }
}(this, function (global, undefined) {
    let a1 = {
        version: '1.0.0',
        name: 'a1'
    };
    return a1;
}));