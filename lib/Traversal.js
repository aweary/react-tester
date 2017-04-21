'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _NodeArray = require('./NodeArray');

var _NodeArray2 = _interopRequireDefault(_NodeArray);

var _utilities = require('./utilities');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Traversal = function () {
  function Traversal() {
    _classCallCheck(this, Traversal);
  }

  _createClass(Traversal, [{
    key: 'getTree',
    value: function getTree() {
      throw new Error('Traversal::getTree: Traversal is a base class that should ' + 'be extended by a class implementing their own getTree method.');
    }
    /**
     * findWhere is the most powerful and versatile way to
     * find any combination of nodes. It is exposed as a public
     * API, and is used frequently by other public APIs internally
     * that provide a simpler find abstraction
     * @param {SearchPredicate} predicate 
     */

  }, {
    key: 'findWhere',
    value: function findWhere(predicate) {
      var tree = this.getTree();
      var results = new _NodeArray2.default();
      (0, _utilities.traverseTree)(tree, function (node) {
        if (_lodash2.default.isObject(node)) {
          if (predicate(node.type, node.props)) {
            results.push(node);
          }
        }
      });
      return results;
    }
  }, {
    key: 'find',
    value: function find(nodeType) {
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
      var coerceCompositeTypeToString = _lodash2.default.isString(nodeType);
      return this.findWhere(function (type) {
        if (coerceCompositeTypeToString) {
          type = (0, _utilities.getTypeName)(type);
        }
        return type === nodeType;
      });
    }

    // @TODO: type this

  }, {
    key: 'findByProps',
    value: function findByProps(props) {
      // findByProps lets you explicitly exclude keys by providing
      // a value of `undefined`. So { hidden: undefined } would match
      // any node that didn't have a `hidden` prop.
      // We diverge here based on whether there are any props to ignore.
      // We do this to avoid having to do extra work when there aren't
      // any props to ignore.
      var hasIgnoredProps = _lodash2.default.some(props, _lodash2.default.isUndefined);

      // No ignored props? Great! We can build a predicate with _.matches
      // that we can just call with the node props
      if (!hasIgnoredProps) {
        var predicate = _lodash2.default.matches(props);
        return this.findWhere(function (type, nodeProps) {
          return predicate(nodeProps);
        });
        // But if there *are* ignored props we have to do more work...
      } else {
        var propsToIgnore = _lodash2.default.pickBy(props, _lodash2.default.isUndefined);
        // The props that we should check, which are all the props
        // provided, except the ones we should ignore
        var propsToCheck = _lodash2.default.omitBy(props, _lodash2.default.isUndefined);
        var _predicate = _lodash2.default.matches(propsToCheck);
        return this.findWhere(function (type, nodeProps) {
          return (
            // It has the props that we want...
            _predicate(nodeProps) &&
            // And every key in our propsToIgnore has a value of undefined
            // in the node props.
            _lodash2.default.every(propsToIgnore, function (value, key) {
              return _lodash2.default.isUndefined(nodeProps[key]);
            })
          );
        });
      }
    }
  }]);

  return Traversal;
}();

exports.default = Traversal;