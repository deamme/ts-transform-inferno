var createVNode = Inferno.createVNode;
createVNode(2, "label", null, createVNode(512, "input", null, null, { "id": id, "name": name, "value": value, "onChange": onChange, "onInput": onInput, "onKeyup": onKeyup, "onFocus": onFocus, "onClick": onClick, "type": "number", "pattern": "[0-9]+([,\\.][0-9]+)?", "inputMode": "numeric", "min": minimum }), { "for": id });
