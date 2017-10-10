import * as ts from "typescript";

function getHelperName(name) {
  return ts.setEmitFlags(
    ts.createIdentifier(name),
    ts.EmitFlags.HelperName | ts.EmitFlags.AdviseOnEmitNode
  );
}

const classwrapHelper: ts.EmitHelper = {
  name: "typescript:classwrap",
  scoped: false,
  priority: 1,
  text: `
        var __classwrap = function(classes, prefix) {
          var value
          var className = ""
          var type = typeof classes
        
          if ((classes && type === "string") || type === "number") {
            return classes
          }
        
          prefix = prefix || " "
        
          if (Array.isArray(classes) && classes.length) {
            for (var i = 0, l = classes.length; i < l; i++) {
              if ((value = __classwrap(classes[i], prefix))) {
                className += (className && prefix) + value
              }
            }
          } else {
            for (var i in classes) {
              if (classes.hasOwnProperty(i) && (value = classes[i])) {
                className +=
                  (className && prefix) +
                  i +
                  (typeof value === "object" ? __classwrap(value, prefix + i) : "")
              }
            }
          }
        
          return className
        }`
};

export default function createClasswrapHelper(
  context: ts.TransformationContext,
  attributesSegments: ts.Expression[]
) {
  context.requestEmitHelper(classwrapHelper);
  return ts.createCall(
    getHelperName("__classwrap"),
    /*typeArguments*/ undefined,
    attributesSegments
  );
}
