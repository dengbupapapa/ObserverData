import defPro from './defPro';
import {
    $set,
    $del
} from './control';
import rewriteArrayMethod from './rewriteArrayMethod';

export default function addReactive(data, opt, cb) {

    if (!data || typeof data !== 'object') {
        return;
    }

    if (data instanceof Array) {

        rewriteArrayMethod(data, function(result, val, old) {
            addReactive(result, opt, cb);
            cb(result, val, old);
        })

    }

    data.__proto__ = Object.create(data.__proto__, {
        $set: {
            value: $set.bind(data, opt, cb),
            enumerable: false, // 可枚举
            configurable: false,
        },
        $del: {
            value: $del.bind(data),
            enumerable: false, // 可枚举
            configurable: false,
        }
    });

    let includeProperty = opt.include;
    let excludeProperty = opt.exclude;

    Object.keys(data).forEach(function(key) {

        if (includeProperty && includeProperty.indexOf(key) == -1) return false;
        if (excludeProperty && excludeProperty.indexOf(key) != -1) return false;

        var val = data[key];

        defPro(data, key, val, opt, cb);

    });

}