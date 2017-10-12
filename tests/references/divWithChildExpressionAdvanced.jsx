var Inferno = require("inferno");
var createVNode = Inferno.createVNode;
createVNode(2, "div", null, false && [
    createVNode(2, "div"),
    createVNode(2, "span")
]);
