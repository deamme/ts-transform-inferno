import * as Inferno from "inferno";
var createVNode = Inferno.createVNode;
createVNode(1, "div", null, [a, createVNode(1, "div", null, "1", 16), ">>\u00A0\\u00a0\u00A0\\u00A0", createVNode(1, "div", null, "&gt;&#62;&nbsp;\u00a0&#160;\u00A0", 0)], 0);
