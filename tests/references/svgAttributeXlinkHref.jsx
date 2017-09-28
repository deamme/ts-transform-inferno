var Inferno = require("inferno");
var createVNode = Inferno.createVNode;
createVNode(128, "svg", null, createVNode(2, "use", null, null, { "xlink:href": "#tester" }));
