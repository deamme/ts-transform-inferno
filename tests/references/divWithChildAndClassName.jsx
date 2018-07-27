import * as Inferno from "inferno";
var createTextVNode = Inferno.createTextVNode;
var createVNode = Inferno.createVNode;
createVNode(1, "div", "first second", createTextVNode("1"), 2);
