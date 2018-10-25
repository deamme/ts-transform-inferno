import * as ts from 'typescript'

import { VNodeFlags, ChildFlags } from './utils/flags'
import isComponent from './utils/isComponent'
import isFragment from './utils/isFragment'
import createAssignHelper from './utils/createAssignHelper'
import isNullOrUndefined from './utils/isNullOrUndefined'
import getName from './utils/getName'
import getValue from './utils/getValue'
import svgAttributes from './utils/svgAttributes'
import isNodeNull from './utils/isNodeNull'
import handleWhiteSpace from './utils/handleWhiteSpace'
import vNodeTypes from './utils/vNodeTypes'
import updateSourceFile from './updateSourceFile'
let NULL

// All special attributes
let PROP_HasKeyedChildren = '$HasKeyedChildren'
let PROP_HasNonKeyedChildren = '$HasNonKeyedChildren'
let PROP_VNODE_CHILDREN = '$HasVNodeChildren'
let PROP_TEXT_CHILDREN = '$HasTextChildren'
let PROP_ReCreate = '$ReCreate'
let PROP_ChildFlag = '$ChildFlag'

const TYPE_ELEMENT = 0
const TYPE_COMPONENT = 1
const TYPE_FRAGMENT = 2

export default () => {
  return (context: ts.TransformationContext): ts.Transformer<ts.SourceFile> => {
    return (sourceFile: ts.SourceFile) => {
      if (sourceFile.isDeclarationFile) {
        return sourceFile
      }

      context['createFragment'] = false
      context['createVNode'] = false
      context['createComponentVNode'] = false
      context['createTextVNode'] = false
      context['normalizeProps'] = false

      let newSourceFile = ts.visitEachChild(sourceFile, visitor, context)

      return updateSourceFile(newSourceFile, context)
    }

    function visitor(node: ts.Node): ts.VisitResult<ts.Node> {
      switch (node.kind) {
        case ts.SyntaxKind.JsxFragment:
          return createFragment((<ts.JsxFragment>node).children)

        case ts.SyntaxKind.JsxElement:
          return createVNode(
            <ts.JsxElement>node,
            (<ts.JsxElement>node).children
          )

        case ts.SyntaxKind.JsxSelfClosingElement:
          return createVNode(<ts.JsxSelfClosingElement>node)

        case ts.SyntaxKind.JsxText:
          let text = handleWhiteSpace(node.getFullText())

          if (text !== '') {
            return ts.createLiteral(text)
          }
          break

        case ts.SyntaxKind.JsxExpression:
          if ((<ts.JsxExpression>node).expression) {
            return ts.visitNode((<ts.JsxExpression>node).expression, visitor)
          }
          break

        default:
          return ts.visitEachChild(node, visitor, context)
      }
    }

    function addCreateTextVNodeCalls(vChildren) {
      // When normalization is not needed we need to manually compile text into vNodes
      for (var j = 0; j < vChildren.elements.length; j++) {
        var aChild = vChildren.elements[j]

        if (aChild.kind === ts.SyntaxKind.StringLiteral) {
          vChildren.elements[j] = ts.createCall(
            ts.createIdentifier('createTextVNode'),
            [],
            [aChild]
          )
        }
      }

      return vChildren
    }

    function transformTextNodes(vChildren) {
      context['createTextVNode'] = true

      if (vChildren.elements) {
        return addCreateTextVNodeCalls(vChildren)
      }
      if (vChildren.kind === ts.SyntaxKind.StringLiteral) {
        return ts.createCall(
          ts.createIdentifier('createTextVNode'),
          [],
          [vChildren]
        )
      }
    }

    function createFragmentVNodeArgs(children, childFlags, key?) {
      var args = []
      var hasChildren = !isNodeNull(children)
      var hasChildFlags =
        hasChildren && childFlags !== ChildFlags.HasInvalidChildren
      var hasKey = !isNodeNull(key)

      if (hasChildren) {
        if (
          childFlags === ChildFlags.HasNonKeyedChildren ||
          childFlags === ChildFlags.HasKeyedChildren ||
          childFlags === ChildFlags.UnknownChildren ||
          children.kind === ts.SyntaxKind.ArrayLiteralExpression
        ) {
          args.push(children)
        } else {
          args.push(ts.createArrayLiteral([children]))
        }
      } else if (hasChildFlags || hasKey) {
        args.push(NULL)
      }

      if (hasChildFlags) {
        args.push(
          typeof childFlags === 'number'
            ? ts.createNumericLiteral(childFlags + '')
            : childFlags
        )
      } else if (hasKey) {
        args.push(ts.createNumericLiteral(ChildFlags.HasInvalidChildren + ''))
      }

      if (hasKey) {
        args.push(key)
      }

      return args
    }

    function createFragment(children?: ts.NodeArray<ts.JsxChild>) {
      let childrenResults = getVNodeChildren(children)
      let vChildren = childrenResults.children
      let childFlags

      if (!childrenResults.requiresNormalization) {
        if (childrenResults.parentCanBeKeyed) {
          childFlags = ChildFlags.HasKeyedChildren
        } else {
          childFlags = ChildFlags.HasNonKeyedChildren
        }
        if (childrenResults.hasSingleChild) {
          vChildren = ts.createArrayLiteral([vChildren])
        }
      } else {
        childFlags = ChildFlags.UnknownChildren
      }

      if (vChildren && vChildren !== NULL && childrenResults.foundText) {
        vChildren = transformTextNodes(vChildren)
      }

      context['createFragment'] = true

      return ts.createCall(
        ts.createIdentifier('createFragment'),
        [],
        createFragmentVNodeArgs(vChildren, childFlags)
      )
    }

    function createVNode(
      node: ts.JsxElement | ts.JsxSelfClosingElement,
      children?: ts.NodeArray<ts.JsxChild>
    ) {
      let vType
      let vProps
      let vChildren
      let childrenResults: any = {}
      let text

      if (children) {
        let openingElement = (<ts.JsxElement>node).openingElement
        vType = getVNodeType(openingElement.tagName)
        vProps = getVNodeProps(
          openingElement.attributes.properties,
          vType.vNodeType === TYPE_COMPONENT
        )
        childrenResults = getVNodeChildren(children)
        vChildren = childrenResults.children
      } else {
        vType = getVNodeType((<ts.JsxSelfClosingElement>node).tagName)
        vProps = getVNodeProps(
          (<ts.JsxSelfClosingElement>node).attributes.properties,
          vType.vNodeType === TYPE_COMPONENT
        )
      }

      let childFlags = ChildFlags.HasInvalidChildren
      let flags = vType.flags
      let props: any = vProps.props[0] || ts.createObjectLiteral()
      let childIndex = -1
      let i = 0

      if (vProps.hasReCreateFlag) {
        flags = flags | VNodeFlags.ReCreate
      }
      if (vProps.contentEditable) {
        flags = flags | VNodeFlags.ContentEditable
      }

      if (vType.vNodeType === TYPE_COMPONENT) {
        if (vChildren) {
          if (
            !(
              vChildren.kind === ts.SyntaxKind.ArrayLiteralExpression &&
              vChildren.elements.length === 0
            )
          ) {
            // Remove children from props, if it exists
            for (i = 0; i < props.properties.length; i++) {
              if (
                props.properties[i] &&
                props.properties[i].name.text === 'children'
              ) {
                childIndex = i
                break
              }
            }
            if (childIndex !== -1) {
              props.properties.splice(childIndex, 1) // Remove prop children
            }
            props.properties.push(
              ts.createPropertyAssignment(getName('children'), vChildren)
            )

            vProps.props[0] = props
          }
          vChildren = NULL
        }
      } else {
        if (
          ((vChildren &&
            vChildren.kind === ts.SyntaxKind.ArrayLiteralExpression) ||
            !vChildren) &&
          vProps.propChildren
        ) {
          if (vProps.propChildren.kind === ts.SyntaxKind.StringLiteral) {
            text = handleWhiteSpace(vProps.propChildren.text)
            if (text !== '') {
              if (vType.vNodeType !== TYPE_FRAGMENT) {
                childrenResults.foundText = true
                childrenResults.hasSingleChild = true
              }

              vChildren = ts.createLiteral(text)
            }
          } else if (vProps.propChildren.kind === ts.SyntaxKind.JsxExpression) {
            if (
              vProps.propChildren.expression.kind === ts.SyntaxKind.NullKeyword
            ) {
              vChildren = NULL
              childFlags = ChildFlags.HasInvalidChildren
            } else {
              vChildren = createVNode(
                vProps.propChildren.expression,
                vProps.propChildren.expression.children
              )
              childFlags = ChildFlags.HasVNodeChildren
            }
          } else {
            vChildren = NULL
            childFlags = ChildFlags.HasInvalidChildren
          }
        }
        if (
          (childrenResults && !childrenResults.requiresNormalization) ||
          vProps.childrenKnown
        ) {
          if (vProps.hasKeyedChildren || childrenResults.parentCanBeKeyed) {
            childFlags = ChildFlags.HasKeyedChildren
          } else if (
            vProps.hasNonKeyedChildren ||
            childrenResults.parentCanBeNonKeyed
          ) {
            childFlags = ChildFlags.HasNonKeyedChildren
          } else if (
            vProps.hasTextChildren ||
            (childrenResults.foundText && childrenResults.hasSingleChild)
          ) {
            childFlags = ChildFlags.HasTextChildren
          } else if (childrenResults.hasSingleChild) {
            childFlags = ChildFlags.HasVNodeChildren
          }
        } else {
          if (vProps.hasKeyedChildren) {
            childFlags = ChildFlags.HasKeyedChildren
          } else if (vProps.hasNonKeyedChildren) {
            childFlags = ChildFlags.HasNonKeyedChildren
          }
        }

        // Remove children from props, if it exists
        childIndex = -1

        for (i = 0; i < props.properties.length; i++) {
          if (
            props.properties[i].name &&
            props.properties[i].name.text === 'children'
          ) {
            childIndex = i
            break
          }
        }
        if (childIndex !== -1) {
          props.properties.splice(childIndex, 1) // Remove prop children
        }
      }

      let willNormalizeChildren =
        !(vType.vNodeType === TYPE_COMPONENT) &&
        childrenResults &&
        childrenResults.requiresNormalization &&
        !vProps.childrenKnown

      if (vProps.childFlags) {
        // If $ChildFlag is provided it is runtime dependant
        childFlags = vProps.childFlags
      } else {
        childFlags = willNormalizeChildren
          ? ChildFlags.UnknownChildren
          : childFlags
      }

      // Delete empty objects
      if (
        vProps.props.length === 1 &&
        vProps.props[0] &&
        !vProps.props[0].properties.length
      ) {
        vProps.props.splice(0, 1)
      }

      let createVNodeCall

      if (vType.vNodeType === TYPE_COMPONENT) {
        createVNodeCall = ts.createCall(
          ts.createIdentifier('createComponentVNode'),
          [],
          createComponentVNodeArgs(
            flags,
            vType.type,
            vProps.props,
            vProps.key,
            vProps.ref
          )
        )
        context['createComponentVNode'] = true
      } else if (vType.vNodeType === TYPE_ELEMENT) {
        createVNodeCall = ts.createCall(
          ts.createIdentifier('createVNode'),
          [],
          createVNodeArgs(
            flags,
            vType.type,
            vProps.className,
            vChildren,
            childFlags,
            vProps.props,
            vProps.key,
            vProps.ref,
            context
          )
        )
        context['createVNode'] = true
      } else if (vType.vNodeType === TYPE_FRAGMENT) {
        createVNodeCall = ts.createCall(
          ts.createIdentifier('createFragment'),
          [],
          createFragmentVNodeArgs(vChildren, childFlags, vProps.key)
        )
        context['createFragment'] = true
      }

      // NormalizeProps will normalizeChildren too
      if (vProps.needsNormalization) {
        context['normalizeProps'] = true
        createVNodeCall = ts.createCall(
          ts.createIdentifier('normalizeProps'),
          [],
          [createVNodeCall]
        )
      }

      return createVNodeCall
    }

    function getVNodeType(type) {
      let vNodeType
      let flags

      const text = type.getText()
      const textSplitted = text.split('.')
      const length = textSplitted.length
      const finalText = textSplitted[length - 1]
      if (isFragment(finalText)) {
        vNodeType = TYPE_FRAGMENT
      } else if (isComponent(finalText)) {
        vNodeType = TYPE_COMPONENT
        flags = VNodeFlags.ComponentUnknown
      } else {
        vNodeType = TYPE_ELEMENT
        type = ts.createLiteral(text)
        flags = vNodeTypes[text] || VNodeFlags.HtmlElement
      }

      return {
        type: type,
        vNodeType: vNodeType,
        flags: flags,
      }
    }

    function getVNodeProps(astProps, isComponent) {
      let props = []
      let key = null
      let ref = null
      let className = null
      let hasTextChildren = false
      let hasKeyedChildren = false
      let hasNonKeyedChildren = false
      let childrenKnown = false
      let needsNormalization = false
      let hasReCreateFlag = false
      let propChildren = null
      let childFlags = null
      let contentEditable = false
      let assignArgs = []

      for (let i = 0; i < astProps.length; i++) {
        let astProp = astProps[i]
        const initializer = astProp.initializer

        if (astProp.kind === ts.SyntaxKind.JsxSpreadAttribute) {
          needsNormalization = true
          assignArgs = [ts.createObjectLiteral(), astProp.expression]
        } else {
          let propName = astProp.name.text

          if (
            !isComponent &&
            (propName === 'className' || propName === 'class')
          ) {
            className = getValue(initializer, visitor)
          } else if (!isComponent && propName === 'htmlFor') {
            props.push(
              ts.createPropertyAssignment(
                getName('for'),
                getValue(initializer, visitor)
              )
            )
          } else if (!isComponent && propName === 'onDoubleClick') {
            props.push(
              ts.createPropertyAssignment(
                getName('onDblClick'),
                getValue(initializer, visitor)
              )
            )
          } else if (propName.substr(0, 11) === 'onComponent' && isComponent) {
            if (!ref) {
              ref = ts.createObjectLiteral([])
            }

            ref.properties.push(
              ts.createPropertyAssignment(
                getName(propName),
                getValue(initializer, visitor)
              )
            )
          } else if (!isComponent && propName in svgAttributes) {
            // React compatibility for SVG Attributes
            props.push(
              ts.createPropertyAssignment(
                getName(svgAttributes[propName]),
                getValue(initializer, visitor)
              )
            )
          } else {
            switch (propName) {
              case 'noNormalize':
              case '$NoNormalize':
                throw 'Inferno JSX plugin:\n' +
                  propName +
                  ' is deprecated use: $HasVNodeChildren, or if children shape is dynamic you can use: $ChildFlag={expression} see inferno package:inferno-vnode-flags (ChildFlags) for possible values'
              case 'hasKeyedChildren':
              case 'hasNonKeyedChildren':
                throw 'Inferno JSX plugin:\n' +
                  propName +
                  ' is deprecated use: ' +
                  '$' +
                  propName.charAt(0).toUpperCase() +
                  propName.slice(1)
              case PROP_ChildFlag:
                childrenKnown = true
                childFlags = getValue(initializer, visitor)
                break
              case PROP_VNODE_CHILDREN:
                childrenKnown = true
                break
              case PROP_TEXT_CHILDREN:
                childrenKnown = true
                hasTextChildren = true
                break
              case PROP_HasNonKeyedChildren:
                hasNonKeyedChildren = true
                childrenKnown = true
                break
              case PROP_HasKeyedChildren:
                hasKeyedChildren = true
                childrenKnown = true
                break
              case 'ref':
                ref = getValue(initializer, visitor)
                break
              case 'key':
                key = getValue(initializer, visitor)
                break
              case PROP_ReCreate:
                hasReCreateFlag = true
                break
              default:
                if (propName === 'children') {
                  propChildren = astProp.initializer
                }
                if (propName.toLowerCase() === 'contenteditable') {
                  contentEditable = true
                }
                props.push(
                  ts.createPropertyAssignment(
                    getName(propName),
                    initializer
                      ? getValue(initializer, visitor)
                      : ts.createTrue()
                  )
                )
            }
          }
        }
      }

      if (props.length) assignArgs.push(ts.createObjectLiteral(props))

      return {
        props: assignArgs,
        key: isNullOrUndefined(key) ? NULL : key,
        ref: isNullOrUndefined(ref) ? NULL : ref,
        hasKeyedChildren: hasKeyedChildren,
        hasNonKeyedChildren: hasNonKeyedChildren,
        propChildren: propChildren,
        childrenKnown: childrenKnown,
        className: isNullOrUndefined(className) ? NULL : className,
        childFlags: childFlags,
        hasReCreateFlag: hasReCreateFlag,
        needsNormalization: needsNormalization,
        contentEditable: contentEditable,
        hasTextChildren: hasTextChildren,
      }
    }

    function getVNodeChildren(astChildren) {
      let children = []
      let parentCanBeKeyed = false
      let requiresNormalization = false
      let foundText = false

      for (let i = 0; i < astChildren.length; i++) {
        let child = astChildren[i]
        let vNode = visitor(child)

        if (child.kind === ts.SyntaxKind.JsxExpression) {
          requiresNormalization = true
        } else if (
          child.kind === ts.SyntaxKind.JsxText &&
          handleWhiteSpace(child.getText()) !== ''
        ) {
          foundText = true
        }

        if (!isNullOrUndefined(vNode)) {
          children.push(vNode)

          /*
            * Loop direct children to check if they have key property set
            * If they do, flag parent as hasKeyedChildren to increase runtime performance of Inferno
            * When key already found within one of its children, they must all be keyed
            */
          if (parentCanBeKeyed === false && child.openingElement) {
            let astProps = child.openingElement.attributes.properties
            let len = astProps.length

            while (parentCanBeKeyed === false && len-- > 0) {
              let prop = astProps[len]

              if (prop.name && prop.name.text === 'key') {
                parentCanBeKeyed = true
              }
            }
          }
        }
      }

      // Fix: When there is single child parent cant be keyed either, its faster to use patch than patchKeyed routine in that case
      let hasSingleChild = children.length === 1

      return {
        parentCanBeKeyed: hasSingleChild === false && parentCanBeKeyed,
        children: hasSingleChild
          ? children[0]
          : ts.createArrayLiteral(children),
        foundText: foundText,
        parentCanBeNonKeyed:
          !hasSingleChild &&
          !parentCanBeKeyed &&
          !requiresNormalization &&
          astChildren.length > 1,
        requiresNormalization: requiresNormalization,
        hasSingleChild: hasSingleChild,
      }
    }

    function createComponentVNodeArgs(flags, type, props, key, ref) {
      let args = []
      let hasProps = props.length > 0
      let hasKey = !isNodeNull(key)
      let hasRef = !isNodeNull(ref)
      args.push(ts.createNumericLiteral(flags + ''))
      args.push(type)

      if (hasProps) {
        props.length === 1
          ? args.push(props[0])
          : args.push(createAssignHelper(context, props))
      } else if (hasKey || hasRef) {
        args.push(ts.createNull())
      }

      if (hasKey) {
        args.push(key)
      } else if (hasRef) {
        args.push(ts.createNull())
      }

      if (hasRef) {
        args.push(ref)
      }

      return args
    }

    function createVNodeArgs(
      flags,
      type,
      className,
      children,
      childFlags,
      props,
      key,
      ref,
      context
    ) {
      let args = []
      let hasClassName = !isNodeNull(className)
      let hasChildren = !isNodeNull(children)
      let hasChildFlags = childFlags !== ChildFlags.HasInvalidChildren
      let hasProps = props.length > 0
      let hasKey = !isNodeNull(key)
      let hasRef = !isNodeNull(ref)
      args.push(ts.createNumericLiteral(flags + ''))
      args.push(type)

      if (hasClassName) {
        args.push(className)
      } else if (hasChildren || hasChildFlags || hasProps || hasKey || hasRef) {
        args.push(ts.createNull())
      }

      if (hasChildren) {
        args.push(children)
      } else if (hasChildFlags || hasProps || hasKey || hasRef) {
        args.push(ts.createNull())
      }

      if (hasChildFlags) {
        args.push(
          typeof childFlags === 'number'
            ? ts.createNumericLiteral(childFlags + '')
            : childFlags
        )
      } else if (hasProps || hasKey || hasRef) {
        args.push(ts.createNumericLiteral(ChildFlags.HasInvalidChildren + ''))
      }

      if (hasProps) {
        props.length === 1
          ? args.push(props[0])
          : args.push(createAssignHelper(context, props))
      } else if (hasKey || hasRef) {
        args.push(ts.createNull())
      }

      if (hasKey) {
        args.push(key)
      } else if (hasRef) {
        args.push(ts.createNull())
      }

      if (hasRef) {
        args.push(ref)
      }

      return args
    }
  }
}
