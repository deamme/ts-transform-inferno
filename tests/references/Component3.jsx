var Inferno = require("inferno");
var createTextVNode = Inferno.createTextVNode;
var createComponentVNode = Inferno.createComponentVNode;
var createVNode = Inferno.createVNode;
createComponentVNode(2, Comp, { "children": [createVNode(1, "p", null, createTextVNode("child1"), 2), createVNode(1, "p", null, createTextVNode("child2"), 2), createVNode(1, "p", null, createTextVNode("child3"), 2)] });
