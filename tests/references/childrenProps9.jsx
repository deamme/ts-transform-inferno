import * as Inferno from "inferno";
var createTextVNode = Inferno.createTextVNode;
var createVNode = Inferno.createVNode;
createVNode(1, "foo", null, createVNode(1, "span", null, createTextVNode("b"), 2), 2);
