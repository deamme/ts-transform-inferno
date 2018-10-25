import * as Inferno from "inferno";
var createTextVNode = Inferno.createTextVNode;
var createFragment = Inferno.createFragment;
createFragment([createFragment([createTextVNode("Text")], 4)], 4);
