const rewriteArrayMethod = (function() {

    var arrayMethod = Object.create(Array.prototype);

    return function(data, callback) {

        [
            'push',
            'pop',
            'shift',
            'unshift',
            'splice',
            'sort',
            'reverse'
        ].forEach(function(method) {

            Object.defineProperty(arrayMethod, method, {
                value: function() {
                    var i = arguments.length
                    var args = new Array(i)
                    while (i--) {
                        args[i] = arguments[i]
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
            })
        })

        data.__proto__ = arrayMethod;

    }

})()

export default rewriteArrayMethod;