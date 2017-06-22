/**
 * This is a bad hack for now: this should be provided
 * by the testing environment, but for now we just
 * provide our own polyfills :shrugs:
 */
global.requestAnimationFrame = function(callback) {
  setTimeout(callback)
}

global.requestIdleCallback = function(callback) {
  setTimeout(() => {
    callback({
      timeRemaining() {
        return Infinity
      },
    })
  })
}

// TODO make these imports after the global rAF hack is fixed
const React = require('react')
const {
  renderIntoDocument,
  findAllInRenderedTree,
  traverseTree,
} = require('react-dom/test-utils')
import { toTree } from './utilities'
import Traversal from './Traversal'


class Wrapper extends React.Component {
  render() {
    return this.props.node || null
  }
}

class ReactTestDOMRenderer extends Traversal {
  constructor(element) {
    super()
    const wrapped = React.createElement(Wrapper, {
      node: element
    });
    this.root = renderIntoDocument(wrapped)
    this.tree = toTree(this.root._reactInternalInstance.child)
  }

  getTree() {
    return this.tree
  }
}

module.exports = function render(element) {
  return new ReactTestDOMRenderer(element)
}
