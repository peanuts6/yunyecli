;(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
        // define(['jquery', 'underscore'], factory);
    } else if(typeof exports === 'object') {
        module.exports = factory(root);
        // module.exports = factory(require('jquery'), require('underscore'));
    } else {
        root.sdc = factory(root);
    }
}(this, function (global, undefined) {
// }(this, function ($, _) {
    let sdc = {
        version: '1.0.0',
        name: 'SDC'
    };
    return sdc;
}));