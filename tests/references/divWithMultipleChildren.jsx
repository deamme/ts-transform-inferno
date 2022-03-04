import * as Inferno from "inferno";
var createTextVNode = Inferno.createTextVNode;
var createComponentVNode = Inferno.createComponentVNode;
var createVNode = Inferno.createVNode;
createVNode(1, "div", null, [createComponentVNode(2, FooBar), createTextVNode("foobar")], 4);
