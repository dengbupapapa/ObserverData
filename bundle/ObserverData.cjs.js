'use strict';

function $set(opt, cb, key, val) {
    //高级试用版绑定监听

    if (key instanceof Function && !!!val) return false; //阻止第一次默认执行
    if (!(Object.prototype.toString.call(this) == '[object Object]')) return new Error('not object'); //如果为非对象
    if (this.hasOwnProperty(key)) return this[key] = val; //如果本身存在该属性

    this[key] = 'TEMPORARY_STANCE'; //临时占位

    defPro(this, key, this[key], opt, cb);

    this[key] = val;
    // console.log(this[key]);
}

function $del(key) {
    //高级试用版移除属性

    if (key instanceof Function) return false; //阻止第一次默认执行

    if (!this.hasOwnProperty(key)) return false;

    this[key] = undefined;

    delete this[key];
}

var rewriteArrayMethod = function () {

    var arrayMethod = Object.create(Array.prototype);

    return function (data, callback) {

        ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'].forEach(function (method) {

            Object.defineProperty(arrayMethod, method, {
                value: function value() {
                    var i = arguments.length;
                    var args = new Array(i);
                    while (i--) {
                        args[i] = arguments[i];
                    }
                    var original = Array.prototype[method];
                    var old = this;
                    var result = original.apply(this, args);
                    callback(this, args, old);
                    return result;
                },
                enumerable: false,
                writable: true,
                configurable: true
            });
        });

        data.__proto__ = arrayMethod;
    };
}();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};





var asyncGenerator = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function (fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function (value) {
      return new AwaitValue(value);
    }
  };
}();

function addReactive(data, opt, cb) {

    if (!data || (typeof data === 'undefined' ? 'undefined' : _typeof(data)) !== 'object') {
        return;
    }

    if (data instanceof Array) {

        rewriteArrayMethod(data, function (result, val, old) {
            addReactive(result, opt, cb);
            cb(result, val, old);
        });
    }

    data.__proto__ = Object.create(data.__proto__, {
        $set: {
            value: $set.bind(data, opt, cb),
            enumerable: false, // 可枚举
            configurable: false
        },
        $del: {
            value: $del.bind(data),
            enumerable: false, // 可枚举
            configurable: false
        }
    });

    var includeProperty = opt.include;
    var excludeProperty = opt.exclude;

    Object.keys(data).forEach(function (key) {

        if (includeProperty && includeProperty.indexOf(key) == -1) return false;
        if (excludeProperty && excludeProperty.indexOf(key) != -1) return false;

        var val = data[key];

        defPro(data, key, val, opt, cb);
    });
}

function defPro(data, key, val, opt, cb) {
    //defineProperty通用

    addReactive(val, opt, cb);

    Object.defineProperty(data, key, {
        enumerable: true, // 可枚举
        configurable: true,
        get: function get() {
            return val;
        },
        set: function set(newVal) {
            if (newVal === val) {
                return;
            }
            var old = val;
            val = newVal;
            addReactive(val, opt, cb);
            cb(newVal, key, old);
        }
    });
}

function ObserverData(data, opt, cb) {

    this.data = data;
    this.cb = cb || new Function();
    this.opt = {
        configurable: opt && opt.configurable || false,
        include: opt && opt.include || []
    };
}

ObserverData.prototype = {

    run: function run(cbOnce) {

        if (!this.data || _typeof(this.data) !== 'object') {
            throw new Error('data not is object');
        }

        addReactive(this.data, this.opt, this.cb);

        if (cbOnce == 'dep') {
            this.cb(this.data);
        }
    }

};

module.exports = ObserverData;
