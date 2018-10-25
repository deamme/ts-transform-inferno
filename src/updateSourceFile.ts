import * as ts from "typescript";

function createVarStatement(name: string) {
  return ts.createVariableStatement(undefined, [
    ts.createVariableDeclaration(
      name,
      undefined,
      ts.createPropertyAccess(
        ts.createIdentifier("Inferno"),
        ts.createIdentifier(name)
      )
    )
  ]);
}

export default (sourceFile: ts.SourceFile, context) => {
  let statements = [...sourceFile.statements];

  if (context["createFragment"]) {
    statements.unshift(createVarStatement("createFragment"));
  }
  if (context["createVNode"]) {
    statements.unshift(createVarStatement("createVNode"));
  }
  if (context["createComponentVNode"]) {
    statements.unshift(createVarStatement("createComponentVNode"));
  }
  if (context["createTextVNode"]) {
    statements.unshift(createVarStatement("createTextVNode"));
  }
  if (context["normalizeProps"]) {
    statements.unshift(createVarStatement("normalizeProps"));
  }

  statements.unshift(
    ts.createImportDeclaration(
      undefined,
      undefined,
      ts.createImportClause(
        undefined,
        ts.createNamespaceImport(ts.createIdentifier("Inferno"))
      ),
      ts.createLiteral("inferno")
    )
  );

  return ts.updateSourceFileNode(sourceFile, statements);
};
