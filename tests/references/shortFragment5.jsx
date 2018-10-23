import * as Inferno from "inferno";
var createTextVNode = Inferno.createTextVNode;
var createFragment = Inferno.createFragment;
createFragment([createFragment([Frag, createTextVNode("Text"), Wohoo], 0)], 4);
