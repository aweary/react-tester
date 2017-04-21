'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Traversal = require('./Traversal');

var _Traversal2 = _interopRequireDefault(_Traversal);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

console.log('Traversal is:', _Traversal2.default);

var NodeArray = function () {
  function NodeArray() {
    _classCallCheck(this, NodeArray);

    // super()
    this.items = [];
  }

  _createClass(NodeArray, [{
    key: 'at',
    value: function at(index) {
      return this.items[index];
    }
  }, {
    key: 'concat',
    value: function concat(arr) {
      return this.items.concat(arr);
    }
  }, {
    key: 'every',
    value: function every(callback) {
      return this.items.every(callback);
    }
  }, {
    key: 'forEach',
    value: function forEach(callback) {
      this.items.forEach(callback);
    }
  }, {
    key: 'getTree',
    value: function getTree() {
      return this.items;
    }
  }, {
    key: 'push',
    value: function push(item) {
      return this.items.push(item);
    }
  }, {
    key: 'length',
    get: function get() {
      return this.items.length;
    },
    set: function set(value) {
      return this.items.length = value;
    }
  }]);

  return NodeArray;
}();

exports.default = NodeArray;