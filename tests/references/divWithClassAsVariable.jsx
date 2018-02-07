var Inferno = require("inferno");
var createTextVNode = Inferno.createTextVNode;
var createVNode = Inferno.createVNode;
createVNode(1, "div", variable, createTextVNode("1"), 2);
