import * as Inferno from "inferno";
var createTextVNode = Inferno.createTextVNode;
var createFragment = Inferno.createFragment;
createFragment([createTextVNode("Test")], 4);
