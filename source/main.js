import defPro from './defPro';
import addReactive from './addReactive';

function ObserverData(data, opt, cb) {

    this.data = data;
    this.cb = cb || new Function();
    this.opt = {
        configurable: opt && opt.configurable || false,
        include: opt && opt.include || []
    };

}

ObserverData.prototype = {

    run: function(cbOnce) {

        if (!this.data || typeof this.data !== 'object') {
            throw (new Error('data not is object'));
        }

        addReactive(this.data, this.opt, this.cb);

        if (cbOnce == 'dep') {
            this.cb(this.data);
        }

    }

}

export default ObserverData;