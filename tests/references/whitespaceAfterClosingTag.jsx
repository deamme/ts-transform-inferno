var Inferno = require("inferno");
var createTextVNode = Inferno.createTextVNode;
var createVNode = Inferno.createVNode;
createVNode(1, "p", null, [createVNode(1, "span", null, createTextVNode("hello"), 2), createTextVNode(" world")], 4);
