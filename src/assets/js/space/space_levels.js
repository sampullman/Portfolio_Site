
import { enemyWidth, enemyHeight, enemyObjList, enemy1Obj, enemy2Obj,
    enemy3Obj, enemy4Obj,enemy5Obj, enemy6Obj, enemy7Obj, enemy8Obj } from './space_enemies.js';

levels = {
    init: function() {
        this.eCols = 8;
        this.yDiff = enemyHeight * 1.6;
        this.xDiff = (c.width - enemyWidth) / this.eCols;

    },
    loadEnemies: function(enemyObjs, shotFreqs, initX, initY, xDiff, yDiff, initPathFn, speeds) {
        for(var i = 0; i < enemyObjs.length; i++) {
            var x = initX;
            for(var j = 0; j < levels.eCols; j++) {
                var parent=null;
                if(i != 0) {
                    parent = enemies[(i - 1) * levels.eCols + j];
                }
                enemies.push(enemyObjs[i].instantiate(x, initY, enemyWidth, enemyHeight,
                    shotFreqs[i], initPathFn, speeds[i], parent));
                x += xDiff;
            }
            initY += yDiff;
        }
    },
    setupEnemies: function(extras, active) {
        enemies = extras.concat(enemies);
        enemies.forEach(function(e) { e.initPath.init(); });
        activeEnemies = active;
    },
    level1: {
        attack_freq: function() {return 60 + enemies.length;},
        load: function() {
            enemyObjs = [enemy3Obj, enemy2Obj, enemy2Obj, enemy1Obj, enemy1Obj];
            speeds = [1, 1, 1, 1, 1];
            shotFreqs = [20, 50, 50, 0, 0];
            var initX = enemyWidth / 1.5, initY = 40 + levels.yDiff;
            levels.loadEnemies(enemyObjs, shotFreqs, initX, initY, levels.xDiff, levels.yDiff, randomVerticalInit, speeds);
            var h = enemy4Obj.instantiate(initX + (levels.xDiff * 3), initY - levels.yDiff, enemyWidth, enemyHeight, 30, randomVerticalInit, null, enemies[3]);
            levels.setupEnemies([h], enemies.slice(enemies.length - levels.eCols, enemies.length));
        }
    },
    level2: {
        attack_freq: function() {return 40 + enemies.length;},
        load: function() {
            enemyObjs = [enemy3Obj, enemy3Obj, enemy2Obj, enemy2Obj, enemy1Obj];
            speeds = [1, 1, 1, 1, 1];
            shotFreqs = [20, 20, 40, 50, 0];
            var initX = enemyWidth / 1.5, initY = 40 + levels.yDiff;
            levels.loadEnemies(enemyObjs, shotFreqs, initX, initY, levels.xDiff, levels.yDiff, randomVerticalInit, speeds);
            var h1 = enemy4Obj.instantiate(initX + levels.xDiff, initY - levels.yDiff, enemyWidth, enemyHeight, 30, randomVerticalInit, null, enemies[1]);
            var h2 = enemy4Obj.instantiate(initX + (levels.xDiff * 6), initY - levels.yDiff, enemyWidth, enemyHeight, 30, randomVerticalInit, null, enemies[6]);
            levels.setupEnemies([h1, h2], enemies.slice(enemies.length - levels.eCols, enemies.length));
        }
    },
    level3: {
        attack_freq: function() {
            return enemies.length * 2;
        },
        load: function() {
            enemyObjs = [enemy3Obj, enemy3Obj, enemy3Obj, enemy2Obj, enemy1Obj];
            shotFreqs = [15, 20, 20, 40, 0];
            speeds = [1, 1, 1, 1, 1];
            var initX = enemyWidth / 1.5, initY = 40 + levels.yDiff;
            levels.loadEnemies(enemyObjs, shotFreqs, initX, initY, levels.xDiff, levels.yDiff, randomVerticalInit, speeds);
            var h1 = enemy4Obj.instantiate(initX + levels.xDiff, initY - levels.yDiff, enemyWidth, enemyHeight, 30, randomVerticalInit, null, enemies[1]);
            var h2 = enemy4Obj.instantiate(initX + (levels.xDiff * 6), initY - levels.yDiff, enemyWidth, enemyHeight, 30, randomVerticalInit, null, enemies[6]);
            levels.setupEnemies([h1, h2], [h1, h1, h2, h2].concat(enemies.slice(enemies.length - 2 * levels.eCols, enemies.length)));
        }
    },
    level4: {
        attack_freq: function(){return 35;},
        load: function() {
            enemyObjs = [enemy4Obj, enemy3Obj, enemy3Obj, enemy2Obj, enemy2Obj, enemy1Obj];
            speeds = [1, 1, 1, 1, 1, 1];
            shotFreqs = [30, 15, 20, 30, 40, 0];
            var initX = enemyWidth / 1.5, initY = 40;
            levels.loadEnemies(enemyObjs, shotFreqs, initX, initY, levels.xDiff, levels.yDiff, randomVerticalInit, speeds);
            levels.setupEnemies([], enemies.slice(levels.eCols, 2 * levels.eCols));
        }
    },
    level5: {
        attack_freq: function(){return enemies.length;},
        load: function() {
            enemyObjs = [enemy4Obj, enemy3Obj, enemy2Obj, enemy1Obj, enemy1Obj, enemy1Obj];
            shotFreqs = [30, 15, 30, 0, 0, 0];
            speeds = [1, 1, 1, 2, 2, 2];
            var initX = enemyWidth / 1.5, initY = 40;
            levels.loadEnemies(enemyObjs, shotFreqs, initX, initY, levels.xDiff, levels.yDiff, randomVerticalInit, speeds);
            levels.setupEnemies([], enemies.slice(enemies.length - 3 * levels.eCols, enemies.length));
        }
    },
    level6: {
        attack_freq: function(){return 40;},
        load: function() {
            var initX = enemyWidth / 1.5, initY = 40;
            enemyObjs = [enemy3Obj, enemy3Obj, enemy2Obj,  enemy1Obj, enemy1Obj];
            shotFreqs = [30, 15, 30, 0, 0, 0];
            speeds = [1, 1, 1, 2, 2];
            levels.loadEnemies(enemyObjs, shotFreqs, initX, initY, levels.xDiff, levels.yDiff, randomInit, speeds);
            var b1 = enemy5Obj.instantiate(initX + levels.xDiff, initY, enemyWidth + levels.xDiff, enemyHeight + levels.yDiff, 20, randomVerticalInit,
                        enemies.slice(levels.eCols * 2, levels.eCols * 2 + 4));
            var b2 = enemy5Obj.instantiate(initX + levels.xDiff * 5, initY, enemyWidth + levels.xDiff, enemyHeight + levels.yDiff,
                        20, randomVerticalInit, enemies.slice(levels.eCols * 2 + 4, levels.eCols * 2 + 8));
            removeSquare(enemies, levels.eCols, 1, 0, 2, 2);
            removeSquare(enemies, levels.eCols, 5, 0, 2, 2);
            levels.setupEnemies([b1, b2], [b1, b1, b2, b2].concat(enemies.slice(enemies.length - 2 * levels.eCols, enemies.length)));
        }
    },
    level7: {
        attack_freq: function(){return 30;},
        load: function() {
            var initX = enemyWidth / 1.5, initY = 40;
            enemyObjs = [enemy3Obj, enemy3Obj, enemy2Obj,  enemy1Obj, enemy1Obj];
            shotFreqs = [30, 15, 30, 0, 0, 0];
            speeds = [1, 1, 1, 2, 2];
            levels.loadEnemies(enemyObjs, shotFreqs, initX, initY, levels.xDiff, levels.yDiff, randomInit, speeds);
            var escorts = [enemies[2], enemies[5], enemies[levels.eCols + 2], enemies[levels.eCols + 5]]
            .concat(enemies.slice(levels.eCols * 2 + 2, levels.eCols * 2 + 6))
            .concat(enemies.slice(levels.eCols * 3 + 2, levels.eCols * 3 + 6));
            var b = enemy5Obj.instantiate(initX + levels.xDiff * 3, initY, enemyWidth + levels.xDiff, enemyHeight + levels.yDiff, 20, randomVerticalInit, escorts);
            removeSquare(enemies, levels.eCols, 3, 0, 2, 2);
            levels.setupEnemies([b], [b, b, b, b].concat(enemies.slice(enemies.length - levels.eCols, enemies.length)));
        }
    },
    level8: {
        attack_freq: function(){return 50;},
        load: function() {
            var initX = enemyWidth / 1.5, initY = 40 + 2 * levels.yDiff;
            var enemyObjs = [enemy3Obj, enemy3Obj, enemy2Obj,  enemy1Obj];
            var shotFreqs = [30, 15, 30, 0];
            var speeds = [1, 1, 2, 2];
            levels.loadEnemies(enemyObjs, shotFreqs, initX, initY, levels.xDiff, levels.yDiff, randomInit, speeds);
            initY = 40;
            var b1 = enemy5Obj.instantiate(initX, initY, enemyWidth + levels.xDiff, enemyHeight + levels.yDiff, 20,
                        randomVerticalInit, [enemies[0], enemies[1]]);
            var b2 = enemy5Obj.instantiate(initX + 2 * levels.xDiff, initY, enemyWidth + levels.xDiff, enemyHeight + levels.yDiff, 20,
                        randomVerticalInit, [enemies[2], enemies[3]]);
            var b3 = enemy5Obj.instantiate(initX + 4 * levels.xDiff, initY, enemyWidth + levels.xDiff, enemyHeight + levels.yDiff, 20,
                        randomVerticalInit, [enemies[4], enemies[5]]);
            var b4 = enemy5Obj.instantiate(initX + 6 * levels.xDiff, initY, enemyWidth + levels.xDiff, enemyHeight + levels.yDiff, 20,
                        randomVerticalInit, [enemies[6], enemies[7]]);
            levels.setupEnemies([b1, b2, b3, b4], [b1, b1, b1, b2, b2, b2, b3, b3, b3, b4, b4, b4].concat(enemies.slice(enemies.length - levels.eCols, enemies.length)));
        }
    },
    level9: {
        attack_freq: function(){return 50;},
        load: function() {
            var initX = enemyWidth / 1.5, initY = 40 + levels.yDiff;
            var b = enemy6Obj.instantiate(c.width / 2, initY - levels.yDiff, enemyWidth, enemyHeight, 60, randomInit);
            var enemyObjs = [enemy4Obj, enemy3Obj, enemy2Obj,  enemy1Obj,  enemy1Obj,  enemy1Obj];
            var shotFreqs = [30, 15, 30, 0, 0, 0];
            var speeds = [1, 1, 1, 2, 2, 2];
            levels.loadEnemies(enemyObjs, shotFreqs, initX, initY, levels.xDiff, levels.yDiff, randomInit, speeds);
            levels.setupEnemies([b], enemies.slice(enemies.length - 3 * levels.eCols, enemies.length));
        }
    },
    level10: {
        attack_freq: function(){return 30;},
        load: function() {
            var initX = enemyWidth / 1.5, initY = 40;
            var enemyObjs = [enemy4Obj, enemy3Obj, enemy2Obj,  enemy1Obj,  enemy1Obj,  enemy1Obj];
            var shotFreqs = [30, 15, 30, 0, 0, 0];
            var speeds = [1, 1, 1, 2, 2, 2];
            levels.loadEnemies(enemyObjs, shotFreqs, initX, initY + levels.yDiff, levels.xDiff, levels.yDiff, randomInit, speeds);
            var b = enemy6Obj.instantiate(c.width / 2, initY, enemyWidth, enemyHeight, 60, randomInit);
            var m1 = enemy7Obj.instantiate(c.width / 2 - levels.xDiff, initY, enemyWidth, enemyHeight, 25, randomInit);
            var m2 = enemy7Obj.instantiate(c.width / 2 + levels.xDiff, initY, enemyWidth, enemyHeight, 25, randomInit);
            var bosses = [m1, m1, m1, m2, m2, m2];
            levels.setupEnemies([b, m1, m2], bosses.concat(bosses).concat(enemies.slice(enemies.length - 2 * levels.eCols, enemies.length)));
        }
    },
    level11: {
        attack_freq: function(){return 25;},
        load: function() {
            var initX = enemyWidth / 1.5, initY = 40;
            var enemyObjs = [enemy4Obj, enemy3Obj, enemy2Obj,  enemy2Obj,  enemy1Obj,  enemy1Obj];
            var shotFreqs = [30, 15, 20, 30, 0, 0];
            var speeds = [1, 1, 1, 2, 2, 2];
            levels.loadEnemies(enemyObjs, shotFreqs, initX, initY + levels.yDiff, levels.xDiff, levels.yDiff, randomInit, speeds);
            var b1 = enemy6Obj.instantiate(c.width / 2 - levels.xDiff, initY, enemyWidth, enemyHeight, 60, randomInit);
            var b2 = enemy6Obj.instantiate(c.width / 2 + levels.xDiff, initY, enemyWidth, enemyHeight, 60, randomInit);
            var m1 = enemy7Obj.instantiate(c.width / 2, initY, enemyWidth, enemyHeight, 25, randomInit);
            var m2 = enemy7Obj.instantiate(c.width / 2 - 2 * levels.xDiff, initY, enemyWidth, enemyHeight, 25, randomInit);
            var m3 = enemy7Obj.instantiate(c.width / 2 + 2 * levels.xDiff, initY, enemyWidth, enemyHeight, 25, randomInit);
            var bosses = [m1, m1, m1, m2, m2, m2, m3, m3, m3];
            bosses = bosses.concat(bosses);
            levels.setupEnemies([b1, b2, m1, m2, m3], bosses.concat(enemies.slice(enemies.length - 3 * levels.eCols, enemies.length)));
        }
    },
    level12: {
        attack_freq: function(){return 25;},
        load: function() {
            var initX = enemyWidth / 1.5, initY = 40;
            var enemyObjs = [enemy4Obj, enemy3Obj, enemy2Obj,  enemy2Obj,  enemy1Obj,  enemy1Obj];
            var shotFreqs = [30, 15, 20, 30, 0, 0];
            var speeds = [1, 1, 1, 2, 2, 2];
            levels.loadEnemies(enemyObjs, shotFreqs, initX, initY + levels.yDiff, levels.xDiff, levels.yDiff, randomInit, speeds);
            var b1 = enemy8Obj.instantiate(initX + levels.xDiff, initY, enemyWidth + 2 * levels.xDiff, enemyHeight, 40, randomInit);
            var b2 = enemy8Obj.instantiate(initX + 4 * levels.xDiff, initY, enemyWidth + 2 * levels.xDiff, enemyHeight, 40, randomInit);
            var m1 = enemy7Obj.instantiate(initX, initY, enemyWidth, enemyHeight, 25, randomInit);
            var m2 = enemy7Obj.instantiate(initX + 7 * levels.xDiff, initY, enemyWidth, enemyHeight, 25, randomInit);
            var bosses = [b1, b1, b2, b2, m1, m1, m1, m2, m2, m2];
            levels.setupEnemies([m1, m2, b1, b2], bosses.concat(enemies.slice(enemies.length - 2 * levels.eCols, enemies.length)));
        }
    },
    level13: {
        attack_freq: function(){return 20;},
        load: function() {
            var initX = enemyWidth / 1.5, initY = 40;
            var enemyObjs = [enemy7Obj, enemy7Obj, enemy1Obj,  enemy1Obj,  enemy1Obj,  enemy1Obj];
            var shotFreqs = [20, 20, 0, 0, 0, 0];
            var speeds = [1, 1, 2.5, 2, 2, 2];
            levels.loadEnemies(enemyObjs, shotFreqs, initX, initY + levels.yDiff, levels.xDiff, levels.yDiff, randomHorizontalInit, speeds);
            var active = enemies.slice(enemies.length - levels.eCols, enemies.length);
            levels.setupEnemies([], active.concat(enemies.slice(enemies.length - 5 * levels.eCols, enemies.length - 4 * levels.eCols)));
        }
    },
    level14: {
        attack_freq: function(){return 30;},
        load: function() {
            var initX = enemyWidth / 1.5, initY = 40;
            var enemyObjs = [enemy4Obj, enemy3Obj, enemy3Obj,  enemy2Obj,  enemy2Obj,  enemy1Obj];
            var shotFreqs = [20, 15, 20, 10, 30, 0];
            var speeds = [1, 1.5, 1, 1.5, 1, 2];
            levels.loadEnemies(enemyObjs, shotFreqs, initX, initY + levels.yDiff, levels.xDiff, levels.yDiff, randomHorizontalInit, speeds);
            var b1 = enemy8Obj.instantiate(initX + levels.xDiff, initY, enemyWidth + 2 * levels.xDiff, enemyHeight, 40, randomInit);
            var b2 = enemy8Obj.instantiate(initX + 4 * levels.xDiff, initY, enemyWidth + 2 * levels.xDiff, enemyHeight, 40, randomInit);
            var m1 = enemy7Obj.instantiate(initX, initY, enemyWidth, enemyHeight, 25, randomInit);
            var m2 = enemy7Obj.instantiate(initX + 7 * levels.xDiff, initY, enemyWidth, enemyHeight, 25, randomInit);
            levels.setupEnemies([b1, b2, m1, m2], enemies.slice(0, enemies.length));
        }
    },
    level15: {
        attack_freq: function(){return 40;},
        load: function() {
            var initX = enemyWidth / 1.5, initY = 40;
            var enemyObjs = [enemy4Obj, enemy3Obj, enemy2Obj,  enemy2Obj,  enemy1Obj];
            var shotFreqs = [25, 15, 10, 15, 0];
            var speeds = [1, 1.5, 1.7, 1.3, 2];
            levels.loadEnemies(enemyObjs, shotFreqs, initX, initY + levels.yDiff, levels.xDiff, levels.yDiff, randomHorizontalInit, speeds);
            var b1 = enemy6Obj.instantiate(initX, initY, enemyWidth, enemyHeight, 50, randomInit);
            var b2 = enemy6Obj.instantiate(c.width / 2, initY, enemyWidth, enemyHeight, 50, randomInit);
            var b3 = enemy6Obj.instantiate(initX + 7 * levels.xDiff, initY, enemyWidth, enemyHeight, 50, randomInit);
            levels.setupEnemies([b1, b2, b3], enemies.slice(enemies.length - 2 * levels.eCols, enemies.length));
        }
    },
    level16: {
        attack_freq: function(){return 13;},
        load: function() {
            var initX = enemyWidth / 1.5, initY = 40;
            var enemyObjs = [enemy4Obj, enemy3Obj,  enemy3Obj,  enemy2Obj,  enemy2Obj,  enemy1Obj,  enemy1Obj];
            var shotFreqs = [60, 30, 25, 25, 20, 0, 0];
            var speeds = [1, 1.5, 1.2, 1.5, 1.4, 1.8, 1.6];
            levels.loadEnemies(enemyObjs, shotFreqs, initX, initY + levels.yDiff, levels.xDiff, levels.yDiff, randomInit, speeds);
            levels.setupEnemies([], enemies.slice(0, enemies.length));
        }
    },
    level17: {
        attack_freq: function(){return 45;},
        load: function() {
            var initX = enemyWidth / 1.5, initY = 40;
            var enemyObjs = [enemy3Obj, enemy2Obj, enemy1Obj];
            var shotFreqs = [35, 20, 0];
            var speeds = [1.2, 1.2, 1.2];
            levels.loadEnemies(enemyObjs, shotFreqs, initX, initY + 3 * levels.yDiff, levels.xDiff, levels.yDiff, randomInit, speeds);
            var boss = enemy9Obj.instantiate(initX + 2 * levels.xDiff, initY, enemyWidth + 3 * levels.xDiff, enemyHeight + 2 * levels.yDiff, 50, randomVerticalInit);
            var m1 = enemy7Obj.instantiate(initX, initY + 2 * levels.yDiff, enemyWidth, enemyHeight, 25, randomInit);
            var m2 = enemy7Obj.instantiate(initX + levels.xDiff, initY + 2 * levels.yDiff, enemyWidth, enemyHeight, 25, randomInit);
            var m3 = enemy7Obj.instantiate(initX + 6 * levels.xDiff, initY + 2 * levels.yDiff, enemyWidth, enemyHeight, 25, randomInit);
            var m4 = enemy7Obj.instantiate(initX + 7 * levels.xDiff, initY + 2 * levels.yDiff, enemyWidth, enemyHeight, 25, randomInit);
            var b1 = enemy5Obj.instantiate(initX, initY, enemyWidth + levels.xDiff, enemyHeight + levels.yDiff, 20, randomInit);
            var b2 = enemy5Obj.instantiate(initX + 6 * levels.xDiff, initY, enemyWidth + levels.xDiff, enemyHeight + levels.yDiff, 20, randomInit);
            levels.setupEnemies([boss, m1, m2, m3, m4, b1, b2], enemies.slice(1, enemies.length));
        }
    },
    custom: {
        attack_freq: function() {return 50;},
        load: function() {
            activeEnemies = editorActiveEnemies.slice(0, editorActiveEnemies.length);
            activeEnemies = activeEnemies.filter(function(e) {
                return e.attackPath;
            });
        }
    }
}

var worlds = [
    [levels.level1, levels.level2, levels.level3, levels.level4],
    [levels.level5, levels.level6, levels.level7, levels.level8],
    [levels.level9, levels.level10, levels.level11, levels.level12],
    [levels.level13, levels.level14, levels.level15, levels.level16],
    [levels.level17]
];

export { worlds };