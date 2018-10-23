import * as Inferno from "inferno";
var createVNode = Inferno.createVNode;
var createFragment = Inferno.createFragment;
createFragment(["Okay", createVNode(1, "span", null, "foo", 16)], 4);
