import * as Inferno from "inferno";
var createVNode = Inferno.createVNode;
createVNode(1, "p", null, [createVNode(1, "span", null, "hello", 16), " world"], 4);
