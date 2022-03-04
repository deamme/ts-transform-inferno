import * as Inferno from "inferno";
var createTextVNode = Inferno.createTextVNode;
var createVNode = Inferno.createVNode;
createVNode(1, "div", null, [createTextVNode("Okay"), createVNode(1, "span", null, "foo", 16)], 4);
