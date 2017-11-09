import addReactive from './addReactive';

export default function defPro(data, key, val, opt, cb) { //defineProperty通用

    addReactive(val, opt, cb);

    Object.defineProperty(data, key, {
        enumerable: true, // 可枚举
        configurable: true,
        get: function() {
            return val;
        },
        set: function(newVal) {
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