'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.getTypeName = getTypeName;
exports.traverseTree = traverseTree;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * node.type can be a string for host nodes, or a function
 * for composites. This is a normalized way to get back a string
 * for either.
 */
function getTypeName(type) {
  switch (typeof type === 'undefined' ? 'undefined' : _typeof(type)) {
    case 'string':
      return type;
    case 'function':
      return type.name;
    default:
      throw new Error('Unknown type: ' + type);
  }
}

// @TODO this isn't really any, should be Node | number | string | null...
function traverseTree(root, fn) {
  // First, call it with the root node of the tree,
  // which in this case is the tree itself.
  fn(root);
  // Return if this root has no rendered children,
  // which is the case for primitive leafs like numbers
  // or strings
  if (!root.rendered) {
    return;
  }
  // rendered can be an array if an element returns
  // multiple children.
  if (Array.isArray(root.rendered)) {
    root.rendered.forEach(function (node) {
      return traverseTree(node, fn);
    });
  } else {
    traverseTree(root.rendered, fn);
  }
}