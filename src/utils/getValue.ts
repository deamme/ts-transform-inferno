import * as ts from "typescript";

export default function getValue(node) {
  if (node.kind === ts.SyntaxKind.StringLiteral) {
    return ts.createLiteral(node.text);
  }
  if (node.kind === ts.SyntaxKind.JsxExpression) {
    return node.expression;
  }
}
