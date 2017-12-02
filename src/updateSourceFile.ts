import * as ts from 'typescript'

export default (sourceFile: ts.SourceFile) => {
  const createVNodeVariableStatement = ts.createVariableStatement(undefined, [
    ts.createVariableDeclaration(
      'createVNode',
      undefined,
      ts.createPropertyAccess(
        ts.createIdentifier('Inferno'),
        ts.createIdentifier('createVNode'),
      ),
    ),
  ])
  
  return ts.updateSourceFileNode(sourceFile, [
    ts.createVariableStatement(undefined, [
      ts.createVariableDeclaration(
        'Inferno',
        undefined,
        ts.createCall(
          ts.createIdentifier('require'),
          [],
          [ts.createLiteral('inferno')],
        ),
      ),
    ]),
    createVNodeVariableStatement,
    ...sourceFile.statements,
  ])
}
