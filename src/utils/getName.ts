import * as ts from "typescript";

export default function getName(name): any {
  if (name.indexOf("-") !== 0) {
    return ts.createLiteral(name);
  }
  return ts.createIdentifier(name);
}
