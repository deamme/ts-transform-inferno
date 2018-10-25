import * as Inferno from "inferno";
var createVNode = Inferno.createVNode;
var createFragment = Inferno.createFragment;
createFragment([createFragment([createVNode(1, "span"), "Text", Wohoo], 0)], 2);
