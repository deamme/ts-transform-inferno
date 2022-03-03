import * as Inferno from "inferno";
var createVNode = Inferno.createVNode;
var createFragment = Inferno.createFragment;
createFragment([createVNode(1, "div", null, "1", 16), createVNode(1, "span", null, "foo", 16)], 4, "foo");
