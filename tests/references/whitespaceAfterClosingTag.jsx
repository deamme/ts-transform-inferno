import * as Inferno from "inferno";
var createTextVNode = Inferno.createTextVNode;
var createVNode = Inferno.createVNode;
createVNode(1, "p", null, [createVNode(1, "span", null, "hello", 16), createTextVNode(" world")], 4);
