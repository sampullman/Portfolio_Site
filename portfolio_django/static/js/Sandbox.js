function posInc(entity, x, y) {
    var dp=20;
    var t =  new Vec2();
    return function(timeDelta, parent) {
        entity.move(t.setXY(x/4, y/4));
    };
}

function switchActive() {
    var entity = 0;
    var lastTrigger = 0;
    var v = 40;
    var e = entityManager.entities[entity];
    var comp = new Base.InputKeyComponent({'a':velInc(e, -v, 0), 'd':velInc(e, v, 0),
                                           'w':velInc(e, 0, -v), 's':velInc(e, 0, v)});
    e.add(comp, 0);
    e.color = "#F00";
    return function(time, parent) {
        //error = time+" "+lastTrigger;
        if(time > lastTrigger + 0.5) {
            e = entityManager.entities[entity];
            e.remove("input");
            e.color = "#000";
            while(true) {
                entity = (entity + 1) % entityManager.entities.length;
                e = entityManager.entities[entity];
                if(e.get("collision") && !e.get("collision").static) break;
            }
            comp = new Base.InputKeyComponent({'a':velInc(e, -v, 0), 'd':velInc(e, v, 0),
                                               'w':velInc(e, 0, -v), 's':velInc(e, 0, v)});
            e.add(comp);
            e.color = "#F00";
            lastTrigger = time;
        }
    };
}

var Sandbox = {
    initialize: function() {
        $("#sandbox_input").show();
        $("#circle_rad").val('20');
        $("#circle_add").click(function() {
            var rad = parseInt($("#circle_rad").val()) || 20;
            var circ = Base.makeCircle(collisionSystem, 200, 50, rad);
            circ.add(new Base.PhysicsComponent(physics), 0);
            circ.add(new Collision.CollisionResponse(collisionSystem, circ));
            entityManager.add(circ);
        });
        $("#rect_width").val('40');
        $("#rect_height").val('40');
        $("#rect_add").click(function() {
            var w = parseInt($("#rect_width").val()) || 20;
            var h = parseInt($("#rect_height").val()) || 20;
            var rect = Base.makeRectangle(collisionSystem, 250, 50, w, h);
            rect.add(new Base.PhysicsComponent(physics), 0);
            rect.add(new Collision.CollisionResponse(collisionSystem, rect));
            entityManager.add(rect);
        });
        var c1 = Base.makeCircle(collisionSystem, 200, 300, 30);
        c1.add(new Base.PhysicsComponent(physics), 0);
        c1.add(new Collision.CollisionResponse(collisionSystem, c1));
        entityManager.add(c1);

        var switcher = new BaseObject();
        switcher.add(new Base.InputKeyComponent({'space': switchActive() }));
        entityManager.add(switcher);

        entityManager.add(Base.makeCage(collisionSystem, 0, 0, C_WIDTH, C_HEIGHT));
    },
    cleanup: function() {
        $("#sandbox_input").hide();
        $("#circle_add").unbind('click');
        $("#rect_add").unbind('click');
    }
};