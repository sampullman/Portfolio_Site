function surrogateCtor() {}

function EXTEND(base, sub) {
  surrogateCtor.prototype = base.prototype;
  sub.prototype = new surrogateCtor();
  sub.prototype.constructor = sub;
}

function BaseObject() {
    this.components = [];
    this.componentMap = {};
    this.active = true;
    this.updateComponents = function(timeDelta, parent) {
        var me = this;
        this.components.forEach(function(component) {
            component.update(timeDelta, me);
        });
    };
    this.update = function(timeDelta, parent) {
        this.updateComponents(timeDelta, parent);
    };
    this.add = function(component, ind) {
        if(ind != null) {
            this.components.insert(ind, component);
        } else {
            this.components.push(component);
        }
        this.componentMap[component.tag] = component;
    };
    this.get = function(tag) {
        return this.componentMap[tag];
    };
    this.remove = function(tag) {
        var comp = this.componentMap[tag];
        if(comp) {
            this.components.remove(comp);
            delete this.componentMap[tag];
        }
    };
}

function TextObject(text, x, y, size, color) {
    BaseObject.call(this);
    this.text = text;
    this.size = size || 16;
    this.color = color || "#000";
    this.font = size+"px Arial Black";
    var dim = text.size(this.font);
    this.x = x - dim[0]/2;
    this.y = y - dim[1]/2;
    this.update = function(timeDelta, parent) {
        this.updateComponents(timeDelta, parent);
        renderer.scheduleForDraw(this);
    };
    this.draw = function(c) {
	    c.font = this.font;
	    c.fillStyle = this.color;
	    c.fillText(this.text, this.x, this.y);
    };
}
EXTEND(TextObject, BaseObject);

function TextArrayObject(array, x, y, size, color) {
    TextObject.call(this, array.join(""), x, y, size, color);
    this.array = array;
    this.update = function(timeDelta, parent) {
        this.text = this.array.join("");
        this.updateComponents(timeDelta, parent);
        renderer.scheduleForDraw(this);
    };
    this.set = function(index, value) {
        this.array[index] = value;
    };
}
EXTEND(TextArrayObject, TextObject);

function GameObject(points, mass) {
    BaseObject.call(this);
    this.points = points;
    this.vel = new Vec2();
    this.nextVel = new Vec2();
    this.adjustPos = new Vec2();
    this.acc = new Vec2();
    this.collisionRecords = [];
    this.numCollisions = 0;
    this.bounce = new Vec2(0.9, 0.7);
    this.mass = mass || 1;
    this.update = function(timeDelta, parent) {
        this.acc.setXY(0, 0);
        this.updateComponents(timeDelta, parent);
        renderer.scheduleForDraw(this);
        this.collisionRecords.length = 0;
    };
    this.draw = function(c) {
    };
    this.reportCollisionResponse = function(v, p) {
        this.adjustPos.add(p);
        this.nextVel.add(v);
        this.numCollisions += 1;
    };
    this.reportCollision = function(other, norm, proj, consumed) {
        this.collisionRecords.push([other, norm, proj, consumed]);
    };
}
EXTEND(GameObject, BaseObject);

function Entity(points, mass) {
    GameObject.call(this, points, mass || 1);
    this.move = function(dist) {
        this.center.add(dist);
    };
    this.getXMinOffset = function() {
        return 0;
    };
    this.getXMaxOffset = function() {
        return 0;
    };
    this.getYMinOffset = function() {
        return 0;
    };
    this.getYMaxOffset = function() {
        return 0;
    };
}
EXTEND(Entity, GameObject);

function RenderSystem(c) {
    this.drawQueue = [];
    this.c = c;
    this.update = function(timeDelta, parent) {
        c.clearRect(0, 0, C_WIDTH, C_HEIGHT);
        this.drawQueue.forEach(function(entity) {
            entity.draw(this.c);
        });
        this.drawQueue.length = 0;
    };
    this.scheduleForDraw = function(entity) {
        this.drawQueue.push(entity);
    };
}

var Base = {
    EntityManager: function() {
        this.entities = [];
        this.add = function(entity) {
            this.entities.push(entity);
        };
        this.addAll = function(entities) {
            var me = this;
            entities.forEach(function(entity) {
                me.add(entity);
            });
        };
        this.update = function(timeDelta, parent) {
            var me = this;
            this.entities = this.entities.filter(function(entity) {
                entity.update(timeDelta, me);
                return entity.active;
            });
        };
    },
    PhysicsComponent: function(physics) {
        this.physics = physics;
        this.tag = "physics";
        this.update = function(timeDelta, parent) {
            this.physics.register(parent);
        };
    },
    NoGravityPhysicsComponent: function(physics) {
        this.physics = physics;
        this.tag = "physics";
        this.update = function(timeDelta, parent) {
            this.physics.registerGravityless(parent);
        };
    },
    InputKeyComponent: function(bindings) {
        this.time = 0;
        this.keys = [];
        this.fns = [];
        this.tag = "input";
        for(var k in bindings) {
            this.keys.push(k);
            this.fns.push(bindings[k]);
        };
        this.max = 0;
        this.update = function(timeDelta, parent) {
            this.time += timeDelta;
            var me = this;
            for(var i=0;i<this.keys.length;i+=1) {
                if(keydown[this.keys[i]]) this.fns[i](this.time, parent);
            }
        };
    },
    makeRectangle: function(collision, x, y, w, h, options) {
        options = options || {};
        var p1 = new Vec2(x, y);
        var p2 = new Vec2(x+w, y);
        var p3 = new Vec2(x+w, y+h);
        var p4 = new Vec2(x, y+h);
        var points = [p1, p2, p3, p4];
        var rect = new Shapes.Rectangle(points);
        rect.add(new Collision.Poly(collision, rect, points));
        if(!options.no_resolution) {
            rect.add(new Collision.CollisionResolution(collision, rect));
        }
        return rect;
    },
    makePoly: function(collision, points, options) {
        options = options || {};
        var center = new Vec2();
        points.forEach(function(p) {
            center.add(p);
        });
        center.scale(1/points.length);
        var poly = new Shapes.Poly(points, center);
        poly.add(new Collision.Poly(collision, poly, points));
        if(!options.no_resolution) {
            poly.add(new Collision.CollisionResolution(collision, poly));
        }
        poly.mass = Shapes.polygonArea(points);
        return poly;
    },
    makeCircle: function(collision, x, y, radius, options) {
        options = options || {};
        var circle = new Shapes.Circle(x, y, radius, options.color);
        circle.add(new Collision.Circle(collision, circle));
        if(!options.no_resolution) {
            circle.add(new Collision.CollisionResolution(collision, circle));
        }
        return circle;
    },
    makeTriangle: function(collision, x, y, w, h) {
        var p1 = new Vec2(x, y);
        var p2 = new Vec2(x+w, y);
        var p3 = new Vec2(x, y+h);
        var points = [p1, p2, p3];
        var c = new Vec2(p2).add(p3).scale(0.5).add(p1).scale(0.5);
        var rect = new Shapes.Poly(points, c);
        rect.add(new Collision.Poly(collision, rect, points));
        rect.add(new Collision.CollisionResolution(collision, rect));
        return rect;
    },
    makeCage: function(collision, x, y, w, h) {
        var p1 = new Vec2(x, y);
        var p2 = new Vec2(x+w, y);
        var p3 = new Vec2(x+w, y+h);
        var p4 = new Vec2(x, y+h);
        var top = [p1, p2];
        var right = [p2, p3];
        var bottom = [p3, p4];
        var left = [p4, p1];
        var c1 = new GameObject(top);
        c1.add(new Collision.Line(collision, c1, top, {'static': true, 'normalDir': -1}));
        c1.add(new Collision.Line(collision, c1, right, {'static': true, 'normalDir': -1}));
        c1.add(new Collision.Line(collision, c1, bottom, {'static': true, 'normalDir': -1}));
        c1.add(new Collision.Line(collision, c1, left, {'static': true, 'normalDir': -1}));
        c1.mass = 10000000000;
        return c1;
    }
}