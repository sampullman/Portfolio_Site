import { followPlayerPath } from './space_paths.js';

var enemyWidth = 36, enemyHeight = 24;
var enemies = [];

function setEnemies(newEnemies) {
    enemies = newEnemies
}

function initEnemy(sprite, x, y, w, h, score, health, initPathFn, attackPath,
           shootFn, shotFreq, speed, parent) {
    var enemy = Enemy({
        sprite: sprite,
        x: x, y: y, width: w, height: h,
        parent: parent,
        score: score,
        speed: speed,
        health: health
    });
    enemy.attackPath = new attackPath(enemy);
    enemy.shoot = shootFn(enemy, shotFreq);
    if(initPathFn) {
        enemy.initPath = new initPathFn(enemy).instantiate();
    }
    return enemy;
}

var enemy1Obj = {
    type: 1,
    score: 10,
    health: 1,
    shootFn: function() {
        return function() {};
    },
    instantiate: function(x, y, w, h, shotFreq, initPathFn, speed, parent) {
        return initEnemy(enemy1Obj.sprite, x, y, w, h, enemy1Obj.score, enemy1Obj.health, initPathFn,
             enemy1Obj.attackPath, enemy1Obj.shootFn, shotFreq, speed, parent);
    },
    attackPath: standardAttackPath
}

var enemy2Obj = {
    type: 2,
    score: 20,
    health: 1,
    shootFn: function(E, freq) {
    var shotTimer = Math.random() * freq;
        return function() {
            shotTimer -= 1;
            if(shotTimer <= 0) {
            enemyShots.push(Shot({
                sprites: enemyShot,
                x: E.x + E.width / 2,
                y: E.y + E.height,
                speed: 10
            }));
            shotTimer = freq / 2 + Math.random() * freq / 2;
            playSound(enemyShotSound);
            }
        };
    },
    instantiate: function(x, y, w, h, shotFreq, initPathFn, speed, parent) {
        return initEnemy(enemy2Obj.sprite, x, y, w, h, enemy2Obj.score, enemy2Obj.health, initPathFn,
             enemy2Obj.attackPath, enemy2Obj.shootFn, shotFreq, speed, parent);
    },
    attackPath: standardAttackPath
}

var enemy3Obj = {
    type: 3,
    score: 50,
    health: 1,
    shootFn: function(E, freq) {
        var shotTimer = freq;
        var left = true;
        return function() {
            shotTimer -= 1;
            if(shotTimer <= 0) {
            enemyShots.push(Shot({
                sprites: enemyShot,
                x: E.x + E.width / (left ? 4 : 1.75),
                y: E.y + E.height,
                speed: 10
            }));
            left = !left;
            shotTimer = freq / 2 + Math.random() * freq / 2;
            playSound(enemyShotSound);
            }
        }
    },
    instantiate: function(x, y, w, h, shotFreq, initPathFn, speed, parent) {
        return initEnemy(enemy3Obj.sprite, x, y, w, h, enemy3Obj.score, enemy3Obj.health, initPathFn,
             enemy3Obj.attackPath, enemy3Obj.shootFn, shotFreq, speed, parent);
    },
    attackPath: standardAttackPath
}

var enemy4Obj = {
    type: 4,
    score: 100,
    health: 1,
        shootFn: function(E, freq) {
        var shotTimer = Math.random() * freq;
        return function() {
            shotTimer -= 1;
            if(shotTimer <= 0) {
            enemyShots.push(Shot({
                sprites: enemyShot,
                x: E.x + E.width / 4,
                y: E.y + E.height,
                speed: 10
            }));
            enemyShots.push(Shot({
                sprites: enemyShot,
                x: E.x + E.width / 1.75,
                y: E.y + E.height,
                speed: 10
            }));
            shotTimer = Math.random() * freq;
            playSound(enemyShotSound);
            }
        }
    },
    instantiate: function(x, y, w, h, shotFreq, initPathFn, parent, child) {
        var enemy = initEnemy(enemy4Obj.sprite, x, y, w, h, enemy4Obj.score, enemy4Obj.health, initPathFn,
                enemy4Obj.attackPath, enemy4Obj.shootFn, shotFreq, 1, parent);

        if(child) child.parent = enemy;
        return enemy;
    },
    attackPath: followPlayerPath
}

var enemy5Obj = {
    type: 5,
    score: 250,
    health: 3,
    shootFn: function(E, freq) {
        var cannonFn = enemy3Obj.shootFn(E, freq);
        var laserTimer = freq;
        return function() {
            cannonFn();
            laserTimer -= 1;
            if(laserTimer < 0) {
                enemyShots.push(Laser({owner: E, x: E.x + (E.width / 2), y: E.y + E.height - 5}));
                laserTimer = Math.random() * freq * 3 + freq;
                playSound(laserSound);
            }
        }
    },
    notifyEscortsFn: function(E, escorts) {
        escorts.forEach(function(escort) {
            escort.relativeEscortX = escort.x - E.x;
            escort.relativeEscortY = escort.y - E.y;
        });
        return function() {
            escorts = escorts.filter(function(escort) {
            if(escort.active) {
                escort.attack(E.attackPath.clone(escort));
                escort.x = E.x + escort.relativeEscortX;
                escort.y = E.y + escort.relativeEscortY;
                return true;
            }
            return false;
            });
        }
    },
    instantiate: function(x, y, w, h, shotFreq, initPathFn, escorts) {
        var enemy = Enemy({
            sprite: enemy5Obj.sprite,
            x: x, y: y, width: w, height: h,
            score: enemy5Obj.score,
            health: enemy5Obj.health
        });
        enemy.attackPath = new enemy5Obj.attackPath(enemy);
        enemy.shoot = this.shootFn(enemy, shotFreq);
        if(initPathFn) enemy.initPath = new initPathFn(enemy).instantiate(true);
        if(escorts) enemy.notifyEscorts = this.notifyEscortsFn(enemy, escorts);
        return enemy;
    },
    attackPath: sweepAttackPath
}

var enemy6Obj = {
    type: 6,
    score: 300,
    health: 2,
    shootFn: function(E, freq) {
        var laserTimer = freq;
        return function() {
            laserTimer -= 1;
            if(laserTimer < 0) {
            enemyShots.push(Laser({owner: E, x: E.x + (E.width / 2), y: E.y + E.height - 5}));
            laserTimer = Math.random() * freq + freq;
            playSound(laserSound);
            }
        }
    },
    hoverActionFn: function(E, freq) {
        return this.shootFn(E, freq);
    },
    wanderFn: function(E) {
        var newXWanderSpeed = 0.5 * xWanderSpeed * (c.width / 2 - 20) / xWanderMax;
        return function(xWanderSpeed) {
            if(E.x > c.width - E.width || E.x < 0) {
            newXWanderSpeed *= -1;
            }
            E.x += newXWanderSpeed;
        }
    },
    instantiate: function(x, y, w, h, shotFreq, initPathFn) {
        var enemy = Enemy({
            sprite: enemy6Obj.sprite,
            x: x, y: y, width: w, height: h,
            score: enemy6Obj.score,
            health: enemy6Obj.health
        });
        enemy.shoot = this.shootFn(enemy, shotFreq);
        if(initPathFn) enemy.initPath = new initPathFn(enemy).instantiate();
        enemy.wander = this.wanderFn(enemy);
        enemy.hoverAction = this.hoverActionFn(enemy, shotFreq);
        return enemy;
    }
}

var enemy7Obj = {
    type: 7,
    score: 200,
    health: 2,
    shootFn: function(E, freq) {
        var timer = Math.random() * freq;
        return function() {
            if(E.y > BOUNDARY && E.x > 0 && E.x < c.width && !E.path.done) {
            timer -= 1;
            if(timer <= 0) {
                mines.push(Mine({x: E.x, y: E.y}));
                E.path.done = true;
                timer = Math.random() * freq;
            }
            }
        }
    },
    instantiate: function(x, y, w, h, shotFreq, initPathFn, speed, parent) {
        return initEnemy(enemy7Obj.sprite, x, y, w, h, enemy7Obj.score, enemy7Obj.health, initPathFn,
             enemy7Obj.attackPath, enemy7Obj.shootFn, shotFreq, speed, parent);
    },
    attackPath: avoidPlayerPath
}

var enemy8Obj = {
    type: 8,
    score: 400,
    health: 5,
    shootFn: function(E, freq) {
        var timer = freq / 5;
        return function() {
            timer -= 1;
            if(timer <= 0) {
            var rand = Math.random();
            var gun = Math.floor(rand * 6);
            if(rand < 0.2) {
                for(var i = 1; i < 6; i++) {
                    enemyShots.push(Shot({
                        sprites: enemyShot,
                        x: E.x + i * E.width / 6,
                        y: E.y + E.height - 5,
                        speed: 10
                    }));
                }
            } else {
                enemyShots.push(Shot({
                    sprites: enemyShot,
                    x: E.x + gun * E.width / 6,
                    y: E.y + E.height - 5,
                    speed: 10
                }));
            }
            playSound(enemyShotSound);
            timer = freq / 5 + rand;
            }
        }
    },
    instantiate: function(x, y, w, h, shotFreq, initPathFn) {
        var enemy = Enemy({
            sprite: enemy8Obj.sprite,
            x: x, y: y, width: w, height: h,
            score: enemy8Obj.score,

            health: enemy8Obj.health
        });
        enemy.attackPath = new enemy8Obj.attackPath(enemy);
        enemy.shoot = this.shootFn(enemy, shotFreq);
        if(initPathFn) enemy.initPath = new initPathFn(enemy).instantiate();
        return enemy;
    },
    attackPath: standardAttackPath
}

var enemy9Obj = {
    type: 9,
    score: 2000,
    health: 20,
    shootFn: function(E, freq) {
        var bottomEnemies = [enemy1Obj, enemy2Obj, enemy3Obj];
        var timer = freq;
        return function() {
            timer -= 1;
            if(timer <= 0) {
                timer = freq / 2 +Math.random() * freq / 2;
                var e1, e2, rand = Math.random();
                if(rand < 0.3) {
                    e1 = enemy4Obj.instantiate(E.x - enemyWidth, E.y + 10, enemyWidth, enemyHeight, 50, null, 1);
                    e2 = enemy4Obj.instantiate(E.x + E.width, E.y + 10, enemyWidth, enemyHeight, 50, null, 1);
                } else if(rand < 0.8) {
                    e1 = arrayRand(bottomEnemies).instantiate(E.x + 10, E.y + E.height, enemyWidth, enemyHeight, 30, null, 1);
                    e2 = arrayRand(bottomEnemies).instantiate(E.x + E.width - (10 + enemyWidth), E.y + E.height, enemyWidth, enemyHeight, 30, null, 1);
                } else {
                    enemyShots.push(Laser({owner: E, x: E.x + (E.width / 2) - 3, y: E.y + E.height - 40, width: 5}));
                    playSound(laserSound);
                    return;
                }
                e1.mode = EnemyMode.HOVER;
                e2.mode = EnemyMode.HOVER;
                initEnemyCount += 2;
                e1.alwaysAttack = true;
                e2.alwaysAttack = true;
                e1.attack();
                e2.attack();
                enemies.push(e1);
                enemies.push(e2);
            }
        }
    },
    instantiate: function(x, y, w, h, shotFreq, initPathFn) {
        var enemy = Enemy({
            sprite: enemy9Obj.sprite,
            x: x, y: y, width: w, height: h,
            score: enemy9Obj.score,
            health: enemy9Obj.health
        });
        enemy.shoot = this.shootFn(enemy, shotFreq);
        if(initPathFn) enemy.initPath = new initPathFn(enemy, 30).instantiate();
        enemy.hoverAction = this.shootFn(enemy, shotFreq);
        return enemy;
    },
}

var enemyObjList = [enemy1Obj, enemy2Obj, enemy3Obj, enemy4Obj, enemy5Obj, enemy6Obj, enemy7Obj, enemy8Obj];

export { enemyObjList, enemy1Obj, enemy2Obj, enemy3Obj, enemy4Obj, enemy5Obj, enemy6Obj, enemy7Obj, enemy8Obj };
export { enemies, setEnemies, enemyWidth, enemyHeight };
