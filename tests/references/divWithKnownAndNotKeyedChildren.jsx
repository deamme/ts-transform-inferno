import * as Inferno from "inferno";
var createComponentVNode = Inferno.createComponentVNode;
var createVNode = Inferno.createVNode;
createVNode(1, "div", null, [createComponentVNode(2, FooBar), createVNode(1, "div", null, "1", 16)], 4);
