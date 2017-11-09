import defPro from './defPro';

export function $set(opt, cb, key, val) { //高级试用版绑定监听

    if (key instanceof Function && !!!val) return false; //阻止第一次默认执行
    if (!(Object.prototype.toString.call(this) == '[object Object]')) return new Error('not object'); //如果为非对象
    if (this.hasOwnProperty(key)) return this[key] = val; //如果本身存在该属性

    this[key] = 'TEMPORARY_STANCE'; //临时占位

    defPro(this, key, this[key], opt, cb)

    this[key] = val;
    // console.log(this[key]);

}

export function $del(key) { //高级试用版移除属性

    if (key instanceof Function) return false; //阻止第一次默认执行

    if (!this.hasOwnProperty(key)) return false;

    this[key] = undefined;

    delete this[key];

}