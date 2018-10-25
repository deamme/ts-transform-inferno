import * as Inferno from "inferno";
var createVNode = Inferno.createVNode;
var createFragment = Inferno.createFragment;
createFragment([createVNode(1, "span", null, "kk", 16, null, "ok"), createVNode(1, "div", null, "ok", 16, null, "ok2")], 8);
