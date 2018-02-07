var Inferno = require("inferno");
var createTextVNode = Inferno.createTextVNode;
var createComponentVNode = Inferno.createComponentVNode;
var createVNode = Inferno.createVNode;
createComponentVNode(2, Com, { "children": createVNode(1, "div", null, createTextVNode("1"), 2) });
