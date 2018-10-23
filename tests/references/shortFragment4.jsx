import * as Inferno from "inferno";
var createVNode = Inferno.createVNode;
var createFragment = Inferno.createFragment;
createFragment([createFragment([createVNode(1, "div", null, "Text", 16)], 4)], 4);
