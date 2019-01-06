import * as Inferno from "inferno";
var createTextVNode = Inferno.createTextVNode;
var createVNode = Inferno.createVNode;
var createFragment = Inferno.createFragment;
createFragment([createFragment([createVNode(1, "span"), createTextVNode("Text"), Wohoo], 0)], 4);
