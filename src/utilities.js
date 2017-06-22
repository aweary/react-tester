// @flow
import _ from 'lodash'
import ReactTreeNodeArray from './NodeArray'
import type { ReactTreeNode } from './types'
import {
  HostRoot,
  ClassComponent,
  FunctionalComponent,
  HostComponent,
  HostText,
} from './work'

export function isString(x: any): boolean %checks {
  return typeof x === 'string'
}

export function isHostOrComposite(x: any): boolean %checks {
  return x !== null && !isString(x) && typeof x === 'object'
}

export function isHostOrCompositeWithChildren(x: any): boolean %checks {
  return (
    x !== null &&
    !isString(x) &&
    typeof x === 'object' &&
    Array.isArray(x.rendered)
  )
}

export function isArray(x: any): boolean %checks {
  return x !== null && Array.isArray(x)
}

/**
 * node.type can be a string for host nodes, or a function
 * for composites. This is a normalized way to get back a string
 * for either.
 */
export function getTypeName(type: string | Function): string {
  switch (typeof type) {
    case 'string':
      return type
    case 'function':
      return type.name
    default:
      throw new Error(`Unknown type: ${type}`)
  }
}

export function traverseTree(
  target: ReactTreeNode | Array<ReactTreeNode>,
  fn: ReactTreeNode => void,
  parent: ReactTreeNode = null
) {
  // Flow wont accept our null check as a sound type refinement
  // so it gives us errors about accessing a potentially null value
  // To get around this we store and reference a local variable instead
  const root = target
  // Null nodes cannot be traversed, abort!
  if (root === null) {
    return
  }
  if (isArray(root)) {
    return root.forEach((node, i) => {
      if (isHostOrComposite(node)) {
        // @TODO maybe it would be better if this was defined
        // before traversal
        node.prevSibling = root[i - 1] || null
        node.nextSibling = root[i + 1] || null
      }
      traverseTree(node, fn, parent)
    })
  }
  // Attach parent if its a host or composite node
  if (isHostOrComposite(root)) {
    root.parent = parent
  }
  // First, call it with the root node of the tree,
  // which in this case is the tree itself.
  fn(root)
  // Return if this root has no rendered children,
  // which is the case for primitive leafs like numbers
  // or strings
  if (typeof root !== 'string' && root && root.rendered) {
    traverseTree(root.rendered, fn, root)
  }
}

export function reduceTree(
  root: ReactTreeNode | Array<ReactTreeNode>,
  accumulator: ReactTreeNodeArray | Array<ReactTreeNode>,
  predicate: ReactTreeNode => boolean
) {
  traverseTree(root, node => {
    if (predicate(node)) {
      accumulator.push(node)
    }
  })
}

export function hasClass(targetClassName: string, { className }: Object) {
  if (!className) return false
  const classList = className.split(' ')
  return classList.indexOf(targetClassName) !== -1
}

function nodeAndSiblingsArray(nodeWithSibling) {
  var array = [];
  var node = nodeWithSibling;
  while (node != null) {
    array.push(node);
    node = node.sibling;
  }
  return array;
}

/**
 * Used by the DOM renderer to convert the _reactInternalInstance
 * to the same tree structure that toTree returns
 * @param {*} root 
 */
export function toTree(node) {
  if (node == null) {
    return null
  }
  switch (node.tag) {
    case HostRoot: // 3
      return toTree(node.child)
    case ClassComponent:
      return {
        nodeType: 'component',
        type: node.type,
        props: Object.assign({}, node.memoizedProps),
        instance: node.stateNode,
        rendered: toTree(node.child),
      }
    case FunctionalComponent: // 1
      return {
        nodeType: 'component',
        type: node.type,
        props: Object.assign({}, node.memoizedProps),
        instance: null,
        rendered: toTree(node.child),
      }
    case HostComponent: // 5
      return {
        nodeType: 'host',
        type: node.type,
        props: Object.assign({}, node.memoizedProps),
        instance: null,
        rendered: nodeAndSiblingsArray(node.child).map(toTree),
      }
    case HostText: // 6
      return node.stateNode.text
    default:
      throw new Error(`toTree() does not yet know how to handle nodes with tag=${node.tag}`)
  }
}
