var c, C_WIDTH, C_HEIGHT;
var FPS;

var gameEventId;
var fpsClock = new FPSClock();
var delta, time, lastTime = Date.now();
var root=[], renderer, physics, entityManager;

function halfRandom(n) {
    return 0.5*(n*Math.random() + n);
}

function setFPS(fps) {
    if(fps) {
        clearInterval(gameEventId);
        FPS = fps;
        startLoop();
    }
}

function velInc(entity, x, y) {
    var velMax=500;
    return function() {
        entity.vel.addXY(x, y);
        if(entity.vel.x < -velMax) entity.vel.x = -velMax;
        else if(entity.vel.x > velMax) entity.vel.x = velMax;
        else if(entity.vel.y < -velMax) entity.vel.y = -velMax;
        else if(entity.vel.y > velMax) entity.vel.y = velMax;
    };
}
var error = "";
var Special =  {
    initialize: function(options) {
        var canvasId = options.canvas_id || "#canvas1";
        C_WIDTH = options.canvas_width || 720;
        C_HEIGHT = options.canvas_height || 480;
        FPS = options.fps || 60;
        $("#fps_val").val(FPS);
        $("#fps_button").click(function() {setFPS(parseInt($("#fps_val").val()))});
        var canvas = $(canvasId);
        c = canvas[0].getContext("2d");
        canvas.focus();
        renderer = new RenderSystem(c);
        collisionSystem = new CollisionSystem();
        entityManager = new Base.EntityManager();
        root.push(entityManager);
        if(options.gravity) {
            physics = new Physics(options.gravity);
            root.push(physics);
        }
        root.push(collisionSystem);
        root.push(renderer);
        startLoop();
    },
    clear: function() {
        entityManager.entities.length = 0;
    }
}

function startLoop() {
	gameEventId = setInterval(loop, 1000/FPS);
}

function loop() {
    time = Date.now();
    delta = (time - lastTime) / 1000;
    if(delta < 0.1) {
        fpsClock.tick(delta);
        
        root.forEach(function(gameObject) {
            gameObject.update(delta, null);
        });
        debug(error || fpsClock.fps.toFixed(1));
    }
    lastTime = time;
}

function debug(msg) {
    c.fillStyle = "#F00";
    c.font = "16px Arial";
    c.fillText(msg, 5, 20);
}

function FPSClock() {
    this.n = 0;
    this.fps = 0;
    this.time = 0;
    this.tick = function(delta) {
        this.n += 1;
        this.time += delta;
        if(this.n == 10) {
            this.n = 0;
            this.fps = 10 / this.time;
            this.time = 0;
            return this.fps;
        } else {
            return this.fps;
        }
    }
}
