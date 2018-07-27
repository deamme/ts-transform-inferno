import * as Inferno from "inferno";
var createVNode = Inferno.createVNode;
createVNode(1, "label", null, createVNode(64, "input", null, null, 1, { "id": id, "name": name, "value": value, "onChange": onChange, "onInput": onInput, "onKeyup": onKeyup, "onFocus": onFocus, "onClick": onClick, "type": "number", "pattern": "[0-9]+([,\\.][0-9]+)?", "inputMode": "numeric", "min": minimum }), 2, { "for": id });
