function Vec2(vecOrX, y) {
    if(!vecOrX && !y) {
        this.x=0; this.y=0;
    } else if(!y && y != 0) {
        this.x = vecOrX.x;
        this.y = vecOrX.y;
    } else {
        this.x = vecOrX;
        this.y = y;
    };
    this.clone = function() {
        return new Vec2(this.x, this.y);
    };
    this.setXY = function(x, y) {
        this.x = x;
        this.y = y;
        return this;
    };
    this.set = function(vec) {
        this.x = vec.x;
        this.y = vec.y;
        return this;
    };
    this.add = function(vec) {
        this.x += vec.x;
        this.y += vec.y;
        return this;
    };
    this.addScaled = function(vec, scalar) {
        this.x += vec.x * scalar;
        this.y += vec.y * scalar;
        return this;
    };
    this.addXY = function(x, y) {
        this.x += x;
        this.y += y;
        return this;
    };
    this.sub = function(vec) {
        this.x -= vec.x;
        this.y -= vec.y;
        return this;
    };
    this.mul = function(vec) {
        this.x *= vec.x;
        this.y *= vec.y;
        return this;
    };
    this.mulXY = function(x, y) {
        this.x *= x;
        this.y *= y;
        return this;
    };
    this.scale = function(scalar) {
        this.x *= scalar;
        this.y *= scalar;
        return this;
    };
    this.mag = function() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    };
    this.nor = function() {
        var len = this.mag();
        if(len != 0) {
            this.x /= len;
            this.y /= len;
        }
        return this;
    };
    this.dot = function(vec) {
        return this.x * vec.x + this.y * vec.y;
    };
    this.crs = function(vec) {
        return this.x*vec.y - this.y*vec.x;
    };
    this.crsXY = function(x, y) {
        return this.x * y - this.y * x;
    };
    this.toString = function() {
        return "["+this.x+", "+this.y+"]";
    };
    this.equals = function(vec) {
        return this.x == vec.x && this.y == vec.y;
    };
    this.len2 = function() {
        return this.x*this.x + this.y*this.y;
    };
    this.floor = function() {
        this.x = Math.floor(this.x);
        this.y = Math.floor(this.y);
        return this;
    };
}
Vec2.ZERO = new Vec2();