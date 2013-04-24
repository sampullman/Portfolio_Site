function Physics(gravity) {
    this.v1 = new Vec2();
    this.v2 = new Vec2();
    this.gravity = new Vec2(0, gravity || 0);
    this.entities = [];
    this.gravityless = [];
    this.update = function(timeDelta, parent) {
        var me = this;
        this.entities.forEach(function(entity) {
            entity.acc.add(me.gravity);
            me.v1.set(entity.acc);
            entity.move(me.v1.scale(timeDelta / 2).add(entity.vel).scale(timeDelta));
            entity.vel.add(entity.acc.scale(timeDelta));
        });
        this.gravityless.forEach(function(entity) {
            me.v1.set(entity.acc);
            entity.move(me.v1.scale(timeDelta / 2).add(entity.vel).scale(timeDelta));
            entity.vel.add(entity.acc.scale(timeDelta));
        });
        this.gravityless.length = 0;
        this.entities.length = 0;
    };
    this.register = function(entity) {
        this.entities.push(entity);
    };
    this.registerGravityless = function(entity) {
        this.gravityless.push(entity);
    };
}