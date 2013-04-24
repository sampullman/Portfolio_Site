function PolyLeftScreenComponent() {
    this.update = function(timeDelta, parent) {
        if(parent.points[1].x < 0) {
            parent.active = false;
        }
    };
}

var Blocks = {
    BlockResolution: function(system, parent) {
        this.system = system;
        this.parent = parent;
        this.hitTimer = 0;
        this.v1 = new Vec2();
        this.update = function(timeDelta, parent) {
            this.hitTimer -= timeDelta;
            this.system.registerResolution(this);
        };
        this.resolve = function() {
            var parent = this.parent;
            var records = parent.collisionRecords;
            var hitPlayer = false;
            if(records.length > 0) {
                var v1=this.v1, v2=this.v2, v3=this.v3, v4=this.v4;
                var proj, record;
                for(var i=0;i<records.length;i+=1) {
                    var record = records[i];
                    var other = record[0];
                    var nor = record[1];
                    if(other == Survive.player) {
                        proj = record[2];
                        nor.scale(nor.y < -0.3 ? -200 : -400);
                        other.reportCollisionResponse(nor, new Vec2());
                        hitPlayer = true;
                    }
                }
                if(this.hitTimer <= 0 && hitPlayer) {
                    Survive.player.radius *= 1.05;
                    this.hitTimer = 0.5;
                }
            }
            this.parent.nextVel.setXY(0, 0);
        };
    },
    BlockManager: function() {
        this.objects = [];
        this.active = true;
        this.update = function(timeDelta, parent) {
            var me = this;
            this.objects = this.objects.filter(function(object) {
                object.update(timeDelta, me);
                return object.active;
            });
        };
        this.addBlock = function(block) {
            this.objects.push(block);
        };
        this.addBorder = function(border) {
            this.objects.push(border);
        };
    },
    BlockSpawner: function(blockManager) {
        this.vel = new Vec2(-100, 0);
        this.blockManager = blockManager;
        this.blockTimer = 2;
        this.blockFreq = 6;
        this.yTop = 30;
        this.yBottom = C_HEIGHT - 30;
        this.staticHeight = 100;
        this.blockHeight = 75;
        this.init = function() {
            this.blockTimer = 2;
            this.blockFreq = 6;
            this.yTop = 30;
            this.yBottom = C_HEIGHT - 30;
            this.staticHeight = 100;
            this.blockHeight = 75;
            this.vel.setXY(-100, 0);
            this.updateBlockVel();
        };
        this.spawnBorder = function(x, yLeft, yRight, len, top) {
            var y2 = top ? 0 : C_HEIGHT;
            var points = [new Vec2(x, y2), new Vec2(x+len, y2), new Vec2(x+len, yRight), new Vec2(x, yLeft)];
            var b = Base.makePoly(collisionSystem, points, { 'no_resolution': true });
            b.add(new Base.NoGravityPhysicsComponent(physics), 0);
            b.add(new Blocks.BlockResolution(collisionSystem, b));
            b.add(new PolyLeftScreenComponent());
            b.vel.set(this.vel);
            this.blockManager.addBorder(b);
            return b;
        };
        this.spawnBlock = function() {
            var y = (this.yBottom - this.yTop)*Math.random();
            var b = Base.makeRectangle(collisionSystem, C_WIDTH, y, 40, this.blockHeight, { 'no_resolution': true });
            b.add(new Base.NoGravityPhysicsComponent(physics), 0);
            b.add(new Blocks.BlockResolution(collisionSystem, b));
            b.add(new PolyLeftScreenComponent());
            b.vel.set(this.vel);
            this.blockManager.addBlock(b);
            return b;
        };
        this.increaseVel = function(velX) {
            this.vel.x -= velX;
            this.updateBlockVel();
        };
        this.updateBlockVel = function() {
            var me = this;
            this.blockManager.objects.forEach(function(block) {
                block.vel.set(me.vel);
            });
        };
        this.update = function(timeDelta, parent) {
            var r = this.top.points[2];
            this.blockTimer -= timeDelta;
            if(this.blockTimer < 0) {
                this.spawnBlock();
                this.blockTimer = halfRandom(this.blockFreq);
            }
            if(r.x < C_WIDTH) {
                var n = Math.random()*this.staticHeight;
                var newTop = n;
                this.top = this.spawnBorder(r.x-0.5, this.yTop, newTop, halfRandom(400), true);
                this.yTop = newTop;
            }
            r = this.bottom.points[1]; 
            if(r.x < C_WIDTH) {
                var n = Math.random()*this.staticHeight;
                var newBottom = C_HEIGHT - n;
                this.bottom = this.spawnBorder(r.x-0.5, this.yBottom, newBottom, halfRandom(300), false);
                this.yBottom = newBottom;
            }
        };
        this.top = this.spawnBorder(0, this.yTop, C_WIDTH, true);
        this.bottom = this.spawnBorder(0, this.yBottom, C_WIDTH, false);
    }
}

var Survive = {
    started: false,
    PlayerLogic: function() {
        this.update = function(timeDelta, parent) {
            if(parent.center.x + parent.radius < 0 || parent.center.y < 0 ||
               parent.center.y > C_HEIGHT) {
                Survive.gameOver();
            }
        }
    },
    PlayerResponse: function(system, parent) {
        this.system = system;
        this.parent = parent;
        this.tag = "response";
        this.update = function(timeDelta, parent) {
            this.system.registerResponse(this);
        };
        this.respond = function() {
            if(this.parent.numCollisions > 0) {
                this.parent.move(this.parent.adjustPos);
                this.parent.vel.y = this.parent.nextVel.y * 1/this.parent.numCollisions;
                this.parent.vel.x += this.parent.nextVel.x * 1/this.parent.numCollisions;
                this.parent.nextVel.setXY(0, 0);
                this.parent.adjustPos.setXY(0, 0);
                this.parent.numCollisions = 0;
            };
        };
    },
    PlayerMoveComponent: function(target) {
        this.update = function(timeDelta, parent) {
            parent.acc.x = 10*(target - parent.center.x) - 3*parent.vel.x;
        };
    },
    Controller: function(spawner) {
        this.heightTimer = 10;
        this.blockFreqTimer = 5;
        this.spawner = spawner;
        this.score = 0;
        this.init = function() {
            this.score = 0;
            this.heightTimer = 10;
            this.blockFreqTimer = 5;
            this.spawner.init();
        };
        this.update = function(timeDelta, parent) {
            if(!Survive.started) return;
            this.heightTimer -= timeDelta;
            this.blockFreqTimer -= timeDelta;
            if(this.heightTimer < 0) {
                this.spawner.staticHeight *= 1.05;
                this.heightTimer = 10;
            }
            if(this.blockFreqTimer < 0) {
                this.spawner.blockFreq *= 0.9;
                this.blockFreqTimer = 5;
            }
            this.spawner.increaseVel(0.06);
            this.score += -0.001*this.spawner.vel.x;
            Survive.scoreText.set(1, Math.round(this.score));
        };
    },
    initialize: function() {
        Survive.startText1 = new TextObject("Survival", C_WIDTH/2, C_HEIGHT/2, 48);
        Survive.gameOverText = new TextObject("Game Over!", C_WIDTH/2, C_HEIGHT/2, 48);
        Survive.startText2 = new TextObject("Press space to start", C_WIDTH/2, 0.7*C_HEIGHT, 24);
        Survive.startText2.add(new Base.InputKeyComponent({ 'space':function() { Survive.startGame(); } }));
        Survive.scoreText = new TextArrayObject(["Score: ", "0"], C_WIDTH-120, 30, 18, "#D00");
        Survive.blockManager = new Blocks.BlockManager();
        entityManager.add(Survive.blockManager);
        Survive.blockSpawner = new Blocks.BlockSpawner(Survive.blockManager);
        Survive.controller = new Survive.Controller(Survive.blockSpawner);
        root.insert(root.length-1, Survive.scoreText);
        root.push(Survive.startText1);
        root.push(Survive.startText2);
        root.insert(0, Survive.blockSpawner);
        root.insert(0, Survive.controller);
    },
    startGame: function() {
        root.remove(Survive.gameOverText);
        root.remove(Survive.startText1);
        root.remove(Survive.startText2);
        var v = 35;
        Survive.player = Base.makeCircle(collisionSystem, 200, 100, 20,
                                         { 'no_resolution': true, 'color': "#00F" });
        var player = Survive.player;
        player.add(new Base.PhysicsComponent(physics), 0);
        player.add(new Survive.PlayerResponse(collisionSystem, player));
        player.add(new Base.InputKeyComponent({ 'up':velInc(player, 0, -v), 'w':velInc(player, 0, -v) }, 0));
        player.add(new Survive.PlayerMoveComponent(200), 0);
        player.add(new Survive.PlayerLogic());
        entityManager.add(player);
        Survive.controller.init();
        Survive.started = true;
    },
    gameOver: function() {
        Survive.started = false;
        Survive.player.active = false;
        root.push(Survive.gameOverText);
        root.push(Survive.startText2);
    },
    cleanup: function() {
        root.remove(Survive.startText1);
        root.remove(Survive.startText2);
        root.remove(Survive.blockSpawner);
        root.remove(Survive.controller);
        root.remove(Survive.gameOverText);
        root.remove(Survive.scoreText);
    }
}