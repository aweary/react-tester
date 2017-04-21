// @flow
import NodeArray from './NodeArray'
import { traverseTree, getTypeName, hasClass, isString, isHostOrComposite } from './utilities'
// @TODO name this better
import matchSelectorAgainstTree from './selector-parser'
import _ from 'lodash'

import type { SearchPredicate, ReactTreeNode } from './types'

export default class Traversal {
  getTree() : ReactTreeNode | Array<ReactTreeNode> {
    throw new Error(
      `Traversal.getTree(...): Traversal is a base class that should ` +
        `be extended by a class implementing their own getTree method.`
    )
  }
  /**
   * findWhere is the most powerful and versatile way to
   * find any combination of nodes. It is exposed as a public
   * API, and is used frequently by other public APIs internally
   * that provide a simpler find abstraction
   * @param {SearchPredicate} predicate 
   */
  findWhere(predicate: SearchPredicate) {
    const tree = this.getTree()
    const results = new NodeArray()
    traverseTree(tree, node => {
      if (isHostOrComposite(node)) {
        if (predicate(node.type, node.props)) {
          results.push(node)
        }
      }
    })
    return results
  }

  find(nodeType: string | Function | Object): NodeArray {
    /**
     * We support four potential scenarios for matching nodes:
     * 
     * 1. a string attempting to match a host node ('host')
     * 2. a string attempting to match a composite node ('Foo')
     * 3. a function attempting to match a composite node (Foo)
     * 
     * This flag tells us whether we should coerce node.type to a string
     * so that case 2 works.
     */
    const coerceCompositeTypeToString = isString(nodeType)
    return this.findWhere(type => {
      if (coerceCompositeTypeToString) {
        type = getTypeName(type)
      }
      return type === nodeType
    })
  }

  // @TODO: type this
  findByProps(props: Object) {
    // findByProps lets you explicitly exclude keys by providing
    // a value of `undefined`. So { hidden: undefined } would match
    // any node that didn't have a `hidden` prop.
    // We diverge here based on whether there are any props to ignore.
    // We do this to avoid having to do extra work when there aren't
    // any props to ignore.
    const hasIgnoredProps = _.some(props, _.isUndefined)

    // No ignored props? Great! We can build a predicate with _.matches
    // that we can just call with the node props
    if (!hasIgnoredProps) {
      const predicate = _.matches(props)
      return this.findWhere((type, nodeProps) => predicate(nodeProps))
      // But if there *are* ignored props we have to do more work...
    } else {
      const propsToIgnore = _.pickBy(props, _.isUndefined)
      // The props that we should check, which are all the props
      // provided, except the ones we should ignore
      const propsToCheck = _.omitBy(props, _.isUndefined)
      const predicate = _.matches(propsToCheck)
      return this.findWhere((type, nodeProps) => {
        return (
          // It has the props that we want...
          predicate(nodeProps) &&
          // And every key in our propsToIgnore has a value of undefined
          // in the node props.
          _.every(propsToIgnore, (value, key) => _.isUndefined(nodeProps[key]))
        )
      })
    }
  }

  findByClass(targetClassName: string) {
    return this.findWhere((type, props) => hasClass(targetClassName, props))
  }

  findBySelector(selector: string) {
    const tree = this.getTree();
    return matchSelectorAgainstTree(selector, tree)
  }

  hasClass(targetClassName: string) {
    const tree = this.getTree()
    if (!isHostOrComposite(tree)) return false
    if (Array.isArray(tree)) {
      return (
        tree.length !== 0 && tree.every(node => {
          return isHostOrComposite(node) && hasClass(targetClassName, node.props)
        })
      )
    } else {
      return hasClass(targetClassName, tree.props)
    }
  }
}