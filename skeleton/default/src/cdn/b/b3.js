; (function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory(root);
    } else {
        root.b3 = factory(root);
    }
}(this, function (global, undefined) {
    let b3 = {
        version: '1.0.0',
        name: 'b3'
    };
    return b3;
}));