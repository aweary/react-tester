'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = render;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactTestRenderer = require('react-test-renderer');

var _reactTestRenderer2 = _interopRequireDefault(_reactTestRenderer);

var _utilities = require('./utilities');

var _Traversal2 = require('./Traversal');

var _Traversal3 = _interopRequireDefault(_Traversal2);

var _NodeArray = require('./NodeArray');

var _NodeArray2 = _interopRequireDefault(_NodeArray);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

console.log('Traversal is!', _Traversal3.default);

var ReactFiberTestTraversalEngine = function (_Traversal) {
  _inherits(ReactFiberTestTraversalEngine, _Traversal);

  // @TODO how to import these types from React?
  function ReactFiberTestTraversalEngine(element) {
    _classCallCheck(this, ReactFiberTestTraversalEngine);

    var _this = _possibleConstructorReturn(this, (ReactFiberTestTraversalEngine.__proto__ || Object.getPrototypeOf(ReactFiberTestTraversalEngine)).call(this, element));

    _this.root = element;
    _this.renderer = _reactTestRenderer2.default.create(element);
    return _this;
  }

  _createClass(ReactFiberTestTraversalEngine, [{
    key: 'getTree',
    value: function getTree() {
      return this.renderer.toTree();
    }
  }, {
    key: 'update',
    value: function update(props) {
      var root = this.root;
      var tree = this.renderer.toTree();
      var prevProps = tree.props;
      var newElement = _react2.default.cloneElement(root, Object.assign({}, prevProps, props));
      this.renderer.update(newElement);
    }
  }]);

  return ReactFiberTestTraversalEngine;
}(_Traversal3.default);

function render(element) {
  return new ReactFiberTestTraversalEngine(element);
}