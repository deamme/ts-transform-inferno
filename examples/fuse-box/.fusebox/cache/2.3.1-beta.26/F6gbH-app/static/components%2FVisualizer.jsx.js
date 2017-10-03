module.exports = { contents: "\"use strict\";\nexports.__esModule = true;\nvar Inferno = require(\"inferno\");\nvar createVNode = Inferno.createVNode;\n/*\n * This is example of Inferno functional component\n * Functional components provide great performance but does not have state\n */\nfunction Visualizer(_a) {\n    var number = _a.number;\n    return (createVNode(2, \"div\", \"visualizer\", number));\n}\nexports.Visualizer = Visualizer;\n",
dependencies: ["inferno"],
sourceMap: {},
headerContent: undefined,
mtime: 1503875678000,
devLibsRequired : undefined,
_ : {}
}
