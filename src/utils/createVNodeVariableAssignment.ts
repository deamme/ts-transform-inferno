import * as ts from "typescript";

const assignHelper: ts.EmitHelper = {
  name: "typescript:createVNode",
  scoped: false,
  priority: 1,
  text: "var createVNode = Inferno.createVNode;"
};

export default function createVNodeVariableAssignment(
  context: ts.TransformationContext
) {
  context.requestEmitHelper(assignHelper);
}
