import * as Inferno from "inferno";
var createVNode = Inferno.createVNode;
createVNode(1, "foo", null, createVNode(1, "span", null, "b", 16), 2);
