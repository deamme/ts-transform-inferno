var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var Inferno = require("inferno");
var createVNode = Inferno.createVNode;
createVNode(1, "div", null, null, 1, __assign({}, props, { "foo": "bar" }));
