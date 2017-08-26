import * as ts from "typescript";

export default function isNodeNull(node) {
  if (!node) {
    return true;
  }
  if (
    node.kind === ts.SyntaxKind.ArrayLiteralExpression &&
    node.elements.length === 0
  ) {
    return true;
  }
  return node.text === "null";
}
