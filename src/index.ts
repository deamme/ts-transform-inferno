import * as ts from "typescript";

import VNodeFlags from "inferno-vnode-flags";
import isComponent from "./utils/isComponent";
import createAssignHelper from "./utils/createAssignHelper";
import isNullOrUndefined from "./utils/isNullOrUndefined";
import getName from "./utils/getName";
import getValue from "./utils/getValue";
import svgAttributes from "./utils/svgAttributes";
import isNodeNull from "./utils/isNodeNull";
import handleWhiteSpace from "./utils/handleWhiteSpace";
import createVNodeVariableAssignment from "./utils/createVNodeVariableAssignment";
let NULL;

export default function() {
  return (context: ts.TransformationContext): ts.Transformer<ts.SourceFile> => {
    return transformSourceFile;

    function transformSourceFile(node: ts.SourceFile) {
      if (node.isDeclarationFile) {
        return node;
      }

      createVNodeVariableAssignment(context);

      const visited = ts.visitEachChild(node, visitor, context);
      ts.addEmitHelpers(visited, context.readEmitHelpers());
      return visited;
    }

    function visitor(node: ts.Node): ts.VisitResult<ts.Node> {
      switch (node.kind) {
        case ts.SyntaxKind.JsxElement:
          return createVNode(
            <ts.JsxElement>node,
            (<ts.JsxElement>node).children
          );

        case ts.SyntaxKind.JsxSelfClosingElement:
          return createVNode(<ts.JsxSelfClosingElement>node);

        case ts.SyntaxKind.JsxText:
          var text = handleWhiteSpace(node.getText());

          if (text !== "") {
            return ts.createLiteral(text);
          }
          break;

        case ts.SyntaxKind.JsxExpression:
          if ((<ts.JsxExpression>node).expression) {
            return ts.visitNode((<ts.JsxExpression>node).expression, visitor);
          }
          break;

        default:
          return ts.visitEachChild(node, visitor, context);
      }
    }

    function createVNode(
      node: ts.JsxElement | ts.JsxSelfClosingElement,
      children?: ts.NodeArray<ts.JsxChild>
    ) {
      let vType;
      let vProps;
      let vChildren;

      if (children) {
        let openingElement = (<ts.JsxElement>node).openingElement;
        vType = getVNodeType(openingElement.tagName);
        vProps = getVNodeProps(
          openingElement.attributes.properties,
          vType.isComponent
        );
        vChildren = getVNodeChildren(children).children;
      } else {
        vType = getVNodeType((<ts.JsxSelfClosingElement>node).tagName);
        vProps = getVNodeProps(
          (<ts.JsxSelfClosingElement>node).attributes.properties,
          vType.isComponent
        );
      }

      let flags = vType.flags;
      let props: any = vProps.props;

      if (vProps.hasKeyedChildren) {
        flags = flags | VNodeFlags.HasKeyedChildren;
      }
      if (vProps.hasNonKeyedChildren) {
        flags = flags | VNodeFlags.HasNonKeyedChildren;
      }
      if (vType.isComponent && vChildren) {
        let addChildrenToProps = true;

        if (
          vChildren.kind === ts.SyntaxKind.ArrayLiteralExpression &&
          vChildren.elements.length === 0
        ) {
          addChildrenToProps = false;
        }
        if (addChildrenToProps) {
          if (props.length === 1) {
            props[0].properties.push(
              ts.createPropertyAssignment(getName("children"), vChildren)
            );
          } else {
            props.push(
              ts.createObjectLiteral([
                ts.createPropertyAssignment(
                  ts.createIdentifier("children"),
                  vChildren
                )
              ])
            );
          }
        }
        vChildren = NULL;
      }

      return ts.createCall(
        ts.createIdentifier("createVNode"),
        [],
        createVNodeArgs(
          flags,
          vType.type,
          vProps.className,
          vChildren,
          props,
          vProps.key,
          vProps.ref,
          vProps.noNormalize,
          context
        )
      );
    }

    function getVNodeType(type) {
      let nodeKind = type.kind;
      let component = false;
      let flags;

      if (nodeKind === ts.SyntaxKind.Identifier) {
        if (isComponent(type.text)) {
          component = true;
          flags = VNodeFlags.ComponentUnknown;
        } else {
          let tag = type.text;

          type = ts.createLiteral(tag);
          switch (tag) {
            case "svg":
              flags = VNodeFlags.SvgElement;
              break;
            case "input":
              flags = VNodeFlags.InputElement;
              break;
            case "textarea":
              flags = VNodeFlags.TextareaElement;
              break;
            case "select":
              flags = VNodeFlags.SelectElement;
              break;
            case "media":
              flags = VNodeFlags.MediaElement;
              break;
            default:
              flags = VNodeFlags.HtmlElement;
          }
        }
      }

      return {
        type: type,
        isComponent: component,
        flags: flags
      };
    }

    function getVNodeProps(astProps, isComponent) {
      let props = [];
      let key = null;
      let ref = null;
      let className = null;
      let hasKeyedChildren = false;
      let hasNonKeyedChildren = false;
      let noNormalize = false;
      let assignArgs = [];
      for (let i = 0; i < astProps.length; i++) {
        let astProp = astProps[i];

        if (astProp.kind === ts.SyntaxKind.JsxSpreadAttribute) {
          assignArgs = [
            ts.createObjectLiteral(),
            ts.createIdentifier(astProp.expression.text)
          ];
        } else {
          let propName = astProp.name.text;

          // if (propName.type === 'JSXIdentifier') {
          // 	propName = propName.name;
          // } else if (propName.type === 'JSXNamespacedName') {
          // 	propName = propName.namespace.name + ':' + propName.name.name;
          // }

          if (
            !isComponent &&
            (propName === "className" || propName === "class")
          ) {
            className = getValue(astProp.initializer);
          } else if (!isComponent && propName === "htmlFor") {
            props.push(
              ts.createPropertyAssignment(
                getName("for"),
                getValue(astProp.initializer)
              )
            );
          } else if (propName.substr(0, 11) === "onComponent" && isComponent) {
            // fix
            if (!ref) {
              ref = ts.createObjectLiteral([]);
            }

            ref.properties.push(
              ts.createObjectLiteral(
                getName(propName),
                getValue(astProp.initializer)
              )
            );
          } else if (!isComponent && propName in svgAttributes) {
            // React compatibility for SVG Attributes
            props.push(
              ts.createPropertyAssignment(
                getName(svgAttributes[propName]),
                getValue(astProp.initializer)
              )
            );
          } else {
            switch (propName) {
              case "noNormalize":
                noNormalize = true;
                break;
              case "hasNonKeyedChildren":
                hasNonKeyedChildren = true;
                break;
              case "hasKeyedChildren":
                hasKeyedChildren = true;
                break;
              case "ref":
                ref = getValue(astProp.initializer);
                break;
              case "key":
                key = getValue(astProp.initializer);
                break;
              default:
                props.push(
                  ts.createPropertyAssignment(
                    getName(propName),
                    getValue(astProp.initializer)
                  )
                );
            }
          }
        }
      }

      if (props.length) assignArgs.push(ts.createObjectLiteral(props));

      return {
        props: assignArgs,
        key: isNullOrUndefined(key) ? NULL : key,
        ref: isNullOrUndefined(ref) ? NULL : ref,
        hasKeyedChildren: hasKeyedChildren,
        hasNonKeyedChildren: hasNonKeyedChildren,
        noNormalize: noNormalize,
        className: isNullOrUndefined(className) ? NULL : className
      };
    }

    function getVNodeChildren(astChildren) {
      ts.SyntaxKind.NumericLiteral;
      let children = [];
      let parentCanBeKeyed = false;

      for (let i = 0; i < astChildren.length; i++) {
        let child = astChildren[i];
        let vNode = visitor(child);

        if (!isNullOrUndefined(vNode)) {
          children.push(vNode);

           /*
            * Loop direct children to check if they have key property set
            * If they do, flag parent as hasKeyedChildren to increase runtime performance of Inferno
            * When key already found within one of its children, they must all be keyed
            */
          if (parentCanBeKeyed === false && child.openingElement) {
            let astProps = child.openingElement.attributes;
            let len = astProps.length;

            while (parentCanBeKeyed === false && len-- > 0) {
              let prop = astProps[len];

              if (prop.name && prop.name.name === "key") {
                parentCanBeKeyed = true;
              }
            }
          }
        }
      }

      // Fix: When there is single child parent cant be keyed either, its faster to use patch than patchKeyed routine in that case
      let hasSingleChild = children.length === 1;

      return {
        parentCanBeKeyed: hasSingleChild === false && parentCanBeKeyed,
        children: hasSingleChild ? children[0] : ts.createArrayLiteral(children)
      };
    }

    function createVNodeArgs(
      flags,
      type,
      className,
      children,
      props,
      key,
      ref,
      noNormalize,
      context
    ) {
      let args = [];
      let hasClassName = !isNodeNull(className);
      let hasChildren = !isNodeNull(children);
      let hasProps = props.length ? true : false;
      let hasKey = !isNodeNull(key);
      let hasRef = !isNodeNull(ref);
      args.push(ts.createNumericLiteral(flags + ""));
      args.push(type);

      if (hasClassName) {
        args.push(className);
      } else if (hasChildren || hasProps || hasKey || hasRef || noNormalize) {
        args.push(ts.createNull());
      }

      if (hasChildren) {
        args.push(children);
      } else if (hasProps || hasKey || hasRef || noNormalize) {
        args.push(ts.createNull());
      }

      if (hasProps) {
        props.length === 1
          ? args.push(props[0])
          : args.push(createAssignHelper(context, props));
      } else if (hasKey || hasRef || noNormalize) {
        args.push(ts.createNull());
      }

      if (hasKey) {
        args.push(key);
      } else if (hasRef || noNormalize) {
        args.push(ts.createNull());
      }

      if (hasRef) {
        args.push(ref);
      } else if (noNormalize) {
        args.push(ts.createNull());
      }

      if (noNormalize) {
        args.push(ts.createTrue());
      }

      return args;
    }
  };
}
