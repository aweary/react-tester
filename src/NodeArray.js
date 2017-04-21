// @flow
import Traversal from './Traversal'

import type { ReactTreeNode } from './types'

export default class ReactTreeNodeArray extends Traversal {
  items: Array<ReactTreeNode>
  constructor(items?: Array<ReactTreeNode> | ReactTreeNode) {
    super()
    if (items) {
      this.items = Array.isArray(items) ? items : []
    } else {
      this.items = []
    }
  }

  get length(): number {
    return this.items.length
  }

  at(index: number): ?ReactTreeNode {
    return this.items[index]
  }

  contains(node: ReactTreeNode): boolean {
    return this.items.indexOf(node) !== -1
  }

  every(callback: ReactTreeNode => boolean): boolean {
    return this.items.every(callback)
  }

  forEach(callback: ReactTreeNode => void): void {
    this.items.forEach(callback)
  }

  filter(callback: ReactTreeNode => boolean): ReactTreeNodeArray {
    return new ReactTreeNodeArray(this.items.filter(callback))
  }

  getTree(): Array<ReactTreeNode> {
    return this.items
  }

  push(node: ReactTreeNode) {
    this.items.push(node)
  }

  reduce(predicate: ReactTreeNode => ?ReactTreeNode): ReactTreeNodeArray {
    const results = new ReactTreeNodeArray()
    this.items.forEach(node => {
      const nodeToPush = predicate(node)
      if (nodeToPush) {
        results.push(nodeToPush)
      }
    })
    return results
  }
}
