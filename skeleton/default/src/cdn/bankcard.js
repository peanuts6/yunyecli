; (function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory(root);
    } else {
        root.bankcard = factory(root);
    }
}(this, function (global, undefined) {
    let bankcard = {
        version: '1.0.0',
        name: 'bankcard',
        lists: []
    };
    return bankcard;
}));