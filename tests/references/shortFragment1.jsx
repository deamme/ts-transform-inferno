import * as Inferno from "inferno";
var createTextVNode = Inferno.createTextVNode;
var createVNode = Inferno.createVNode;
var createFragment = Inferno.createFragment;
createFragment([createTextVNode("Okay"), createVNode(1, "span", null, "foo", 16)], 4);
