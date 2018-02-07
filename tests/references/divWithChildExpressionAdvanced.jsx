var Inferno = require("inferno");
var createVNode = Inferno.createVNode;
createVNode(1, "div", null, false && [
    createVNode(1, "div"),
    createVNode(1, "span")
], 0);
