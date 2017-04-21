// @flow

import React from 'react'
import ReactTestRenderer from 'react-test-renderer'
import { traverseTree, getTypeName } from './utilities'
// @TODO Jest fails if I import Traversal before NodeArray,
// which also extends Traversal
import NodeArray from './NodeArray'
import Traversal from './Traversal'
import _ from 'lodash'

import type { ReactTreeNode } from './types'

export class Renderer extends Traversal {
  // @TODO how to import these types from React?
  renderer: ReactTestRenderer & {
    toTree: () => ReactTreeNode,
    toJSON: () => string
  }
  root: React$Element<*>
  constructor(element: Object) {
    super(element);
    this.root = element
    this.renderer = ReactTestRenderer.create(element)
  }

  getTree(): ReactTreeNode {
    return this.renderer.toTree();
  }

  update(props: Object) {
    const root = this.root
    const tree = this.renderer.toTree()
    const prevProps = tree.props
    const newElement = React.cloneElement(
      root,
      Object.assign({}, prevProps, props)
    )
    this.renderer.update(newElement)
  }
}

export default function render(element: Object) : Renderer {
  return new Renderer(element)
}
