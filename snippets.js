/*** Array ***/

Array.prototype.random = function() {
    return this[Math.floor((Math.random()*this.length))];
};

Array.prototype.each = function(fun) {
    for(var i=0;i<this.length;i++) {
        fun(this[i]);
    }
};

Array.prototype.collect = function(fun) {
    var collect = [];
    for(var i=0;i<this.length;i++) {
        collect.push(fun(this[i]));
    }
    return collect;
};

Array.prototype.include = function(value) {
    for(var i=0;i<this.length;i++) {
        if(this[i] == value) {
            return true;
        }
    }
    return false;
};

/*** String ***/

String.prototype.valMatch = function(regex, expLength) {
    var key = this.match(regex);
    if(key !== null && key.length == expLength) {
        return key;
    } else {
        return false;
    }
};

String.prototype.endsWith = function(needle) {
    return needle === this.slice(this.length - needle.length);
};

String.prototype.startsWith = function(needle) {
    return needle === this.slice(0, needle.length);
};

/*** Object ***/

Object.prototype.isFunction = function(obj) {
    return typeof(obj) === 'function';
};

Object.prototype.isArray = function(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
};

/*** Integer ***/

Number.prototype.chanceIn = function(x, y) {
    var num = Math.floor(Math.random() * (y + 1)) / x;
    return num == 1;
};