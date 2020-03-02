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

  let shouldAddImport = false;

  if (context["createFragment"]) {
    shouldAddImport = true;
    statements.unshift(createVarStatement("createFragment"));
  }
  if (context["createVNode"]) {
    shouldAddImport = true;
    statements.unshift(createVarStatement("createVNode"));
  }
  if (context["createComponentVNode"]) {
    shouldAddImport = true;
    statements.unshift(createVarStatement("createComponentVNode"));
  }
  if (context["createTextVNode"]) {
    shouldAddImport = true;
    statements.unshift(createVarStatement("createTextVNode"));
  }
  if (context["normalizeProps"]) {
    shouldAddImport = true;
    statements.unshift(createVarStatement("normalizeProps"));
  }

  if (shouldAddImport) {
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
  }
  return ts.updateSourceFileNode(sourceFile, statements);
};
