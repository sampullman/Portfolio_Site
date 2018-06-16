
import { enemyData, enemies, setEnemies, Enemy1Obj, Enemy2Obj,
    Enemy3Obj, Enemy4Obj, Enemy5Obj, Enemy6Obj, Enemy7Obj, Enemy8Obj, Enemy9Obj } from './space_enemies.js';
import { RandomInit, RandomVerticalInit, RandomHorizontalInit } from './space_paths.js';
import { removeSquare } from '../util.js';

var activeEnemies = [];
var editorActiveEnemies = [];

function setEditorActiveEnemies(enemies) {
    editorActiveEnemies = enemies;
}

let levels = {
    init: function(c) {
        this.eCols = 8;
        this.yDiff = enemyData.height * 1.6;
        this.xDiff = (c.width - enemyData.width) / this.eCols;
    },
    loadEnemies: function(enemyObjs, shotFreqs, initX, initY, xDiff, yDiff, InitPathFn, speeds) {
        for(var i = 0; i < enemyObjs.length; i++) {
            var x = initX;
            for(var j = 0; j < levels.eCols; j++) {
                var parent = null;
                if(i !== 0) {
                    parent = enemies[(i - 1) * levels.eCols + j];
                }
                enemies.push(enemyObjs[i].instantiate(x, initY, enemyData.width, enemyData.height,
                    shotFreqs[i], InitPathFn, speeds[i], parent));
                x += xDiff;
            }
            initY += yDiff;
        }
    },
    setupEnemies: function(extras, active) {
        setEnemies(extras.concat(enemies));
        enemies.forEach(function(e) { e.initPath.init() });
        activeEnemies = active;
    },
    level1: {
        attack_freq: function() { return 60 + enemies.length },
        load: function(c) {
            var enemyObjs = [Enemy3Obj, Enemy2Obj, Enemy2Obj, Enemy1Obj, Enemy1Obj];
            var speeds = [1, 1, 1, 1, 1];
            var shotFreqs = [20, 50, 50, 0, 0];
            var initX = enemyData.width / 1.5;
            var initY = 40 + levels.yDiff;
            levels.loadEnemies(enemyObjs, shotFreqs, initX, initY, levels.xDiff, levels.yDiff, RandomVerticalInit, speeds);
            var h = Enemy4Obj.instantiate(initX + (levels.xDiff * 3), initY - levels.yDiff, enemyData.width, enemyData.height, 30, RandomVerticalInit, null, enemies[3]);
            levels.setupEnemies([h], enemies.slice(enemies.length - levels.eCols, enemies.length));
        }
    },
    level2: {
        attack_freq: function() { return 40 + enemies.length },
        load: function(c) {
            var enemyObjs = [Enemy3Obj, Enemy3Obj, Enemy2Obj, Enemy2Obj, Enemy1Obj];
            var speeds = [1, 1, 1, 1, 1];
            var shotFreqs = [20, 20, 40, 50, 0];
            var initX = enemyData.width / 1.5;
            var initY = 40 + levels.yDiff;
            levels.loadEnemies(enemyObjs, shotFreqs, initX, initY, levels.xDiff, levels.yDiff, RandomVerticalInit, speeds);
            var h1 = Enemy4Obj.instantiate(initX + levels.xDiff, initY - levels.yDiff, enemyData.width, enemyData.height, 30, RandomVerticalInit, null, enemies[1]);
            var h2 = Enemy4Obj.instantiate(initX + (levels.xDiff * 6), initY - levels.yDiff, enemyData.width, enemyData.height, 30, RandomVerticalInit, null, enemies[6]);
            levels.setupEnemies([h1, h2], enemies.slice(enemies.length - levels.eCols, enemies.length));
        }
    },
    level3: {
        attack_freq: function() {
            return enemies.length * 2;
        },
        load: function(c) {
            var enemyObjs = [Enemy3Obj, Enemy3Obj, Enemy3Obj, Enemy2Obj, Enemy1Obj];
            var shotFreqs = [15, 20, 20, 40, 0];
            var speeds = [1, 1, 1, 1, 1];
            var initX = enemyData.width / 1.5;
            var initY = 40 + levels.yDiff;
            levels.loadEnemies(enemyObjs, shotFreqs, initX, initY, levels.xDiff, levels.yDiff, RandomVerticalInit, speeds);
            var h1 = Enemy4Obj.instantiate(initX + levels.xDiff, initY - levels.yDiff, enemyData.width, enemyData.height, 30, RandomVerticalInit, null, enemies[1]);
            var h2 = Enemy4Obj.instantiate(initX + (levels.xDiff * 6), initY - levels.yDiff, enemyData.width, enemyData.height, 30, RandomVerticalInit, null, enemies[6]);
            levels.setupEnemies([h1, h2], [h1, h1, h2, h2].concat(enemies.slice(enemies.length - 2 * levels.eCols, enemies.length)));
        }
    },
    level4: {
        attack_freq: function() { return 35 },
        load: function(c) {
            var enemyObjs = [Enemy4Obj, Enemy3Obj, Enemy3Obj, Enemy2Obj, Enemy2Obj, Enemy1Obj];
            var speeds = [1, 1, 1, 1, 1, 1];
            var shotFreqs = [30, 15, 20, 30, 40, 0];
            var initX = enemyData.width / 1.5;
            var initY = 40;
            levels.loadEnemies(enemyObjs, shotFreqs, initX, initY, levels.xDiff, levels.yDiff, RandomVerticalInit, speeds);
            levels.setupEnemies([], enemies.slice(levels.eCols, 2 * levels.eCols));
        }
    },
    level5: {
        attack_freq: function() { return enemies.length },
        load: function(c) {
            var enemyObjs = [Enemy4Obj, Enemy3Obj, Enemy2Obj, Enemy1Obj, Enemy1Obj, Enemy1Obj];
            var shotFreqs = [30, 15, 30, 0, 0, 0];
            var speeds = [1, 1, 1, 2, 2, 2];
            var initX = enemyData.width / 1.5;
            var initY = 40;
            levels.loadEnemies(enemyObjs, shotFreqs, initX, initY, levels.xDiff, levels.yDiff, RandomVerticalInit, speeds);
            levels.setupEnemies([], enemies.slice(enemies.length - 3 * levels.eCols, enemies.length));
        }
    },
    level6: {
        attack_freq: function() { return 40 },
        load: function(c) {
            var initX = enemyData.width / 1.5;
            var initY = 40;
            var enemyObjs = [Enemy3Obj, Enemy3Obj, Enemy2Obj, Enemy1Obj, Enemy1Obj];
            var shotFreqs = [30, 15, 30, 0, 0, 0];
            var speeds = [1, 1, 1, 2, 2];
            levels.loadEnemies(enemyObjs, shotFreqs, initX, initY, levels.xDiff, levels.yDiff, RandomInit, speeds);
            var b1 = Enemy5Obj.instantiate(initX + levels.xDiff, initY, enemyData.width + levels.xDiff, enemyData.height + levels.yDiff, 20, RandomVerticalInit,
                enemies.slice(levels.eCols * 2, levels.eCols * 2 + 4));
            var b2 = Enemy5Obj.instantiate(initX + levels.xDiff * 5, initY, enemyData.width + levels.xDiff, enemyData.height + levels.yDiff,
                20, RandomVerticalInit, enemies.slice(levels.eCols * 2 + 4, levels.eCols * 2 + 8));
            removeSquare(enemies, levels.eCols, 1, 0, 2, 2);
            removeSquare(enemies, levels.eCols, 5, 0, 2, 2);
            levels.setupEnemies([b1, b2], [b1, b1, b2, b2].concat(enemies.slice(enemies.length - 2 * levels.eCols, enemies.length)));
        }
    },
    level7: {
        attack_freq: function() { return 30 },
        load: function(c) {
            var initX = enemyData.width / 1.5;
            var initY = 40;
            var enemyObjs = [Enemy3Obj, Enemy3Obj, Enemy2Obj, Enemy1Obj, Enemy1Obj];
            var shotFreqs = [30, 15, 30, 0, 0, 0];
            var speeds = [1, 1, 1, 2, 2];
            levels.loadEnemies(enemyObjs, shotFreqs, initX, initY, levels.xDiff, levels.yDiff, RandomInit, speeds);
            var escorts = [enemies[2], enemies[5], enemies[levels.eCols + 2], enemies[levels.eCols + 5]]
                .concat(enemies.slice(levels.eCols * 2 + 2, levels.eCols * 2 + 6))
                .concat(enemies.slice(levels.eCols * 3 + 2, levels.eCols * 3 + 6));
            var b = Enemy5Obj.instantiate(initX + levels.xDiff * 3, initY, enemyData.width + levels.xDiff, enemyData.height + levels.yDiff, 20, RandomVerticalInit, escorts);
            removeSquare(enemies, levels.eCols, 3, 0, 2, 2);
            levels.setupEnemies([b], [b, b, b, b].concat(enemies.slice(enemies.length - levels.eCols, enemies.length)));
        }
    },
    level8: {
        attack_freq: function() { return 50 },
        load: function(c) {
            var initX = enemyData.width / 1.5;
            var initY = 40 + 2 * levels.yDiff;
            var enemyObjs = [Enemy3Obj, Enemy3Obj, Enemy2Obj, Enemy1Obj];
            var shotFreqs = [30, 15, 30, 0];
            var speeds = [1, 1, 2, 2];
            levels.loadEnemies(enemyObjs, shotFreqs, initX, initY, levels.xDiff, levels.yDiff, RandomInit, speeds);
            initY = 40;
            var b1 = Enemy5Obj.instantiate(initX, initY, enemyData.width + levels.xDiff, enemyData.height + levels.yDiff, 20,
                RandomVerticalInit, [enemies[0], enemies[1]]);
            var b2 = Enemy5Obj.instantiate(initX + 2 * levels.xDiff, initY, enemyData.width + levels.xDiff, enemyData.height + levels.yDiff, 20,
                RandomVerticalInit, [enemies[2], enemies[3]]);
            var b3 = Enemy5Obj.instantiate(initX + 4 * levels.xDiff, initY, enemyData.width + levels.xDiff, enemyData.height + levels.yDiff, 20,
                RandomVerticalInit, [enemies[4], enemies[5]]);
            var b4 = Enemy5Obj.instantiate(initX + 6 * levels.xDiff, initY, enemyData.width + levels.xDiff, enemyData.height + levels.yDiff, 20,
                RandomVerticalInit, [enemies[6], enemies[7]]);
            levels.setupEnemies([b1, b2, b3, b4], [b1, b1, b1, b2, b2, b2, b3, b3, b3, b4, b4, b4].concat(enemies.slice(enemies.length - levels.eCols, enemies.length)));
        }
    },
    level9: {
        attack_freq: function() { return 50 },
        load: function(c) {
            var initX = enemyData.width / 1.5;
            var initY = 40 + levels.yDiff;
            var b = Enemy6Obj.instantiate(c.width / 2, initY - levels.yDiff, enemyData.width, enemyData.height, 60, RandomInit);
            var enemyObjs = [Enemy4Obj, Enemy3Obj, Enemy2Obj, Enemy1Obj, Enemy1Obj, Enemy1Obj];
            var shotFreqs = [30, 15, 30, 0, 0, 0];
            var speeds = [1, 1, 1, 2, 2, 2];
            levels.loadEnemies(enemyObjs, shotFreqs, initX, initY, levels.xDiff, levels.yDiff, RandomInit, speeds);
            levels.setupEnemies([b], enemies.slice(enemies.length - 3 * levels.eCols, enemies.length));
        }
    },
    level10: {
        attack_freq: function() { return 30 },
        load: function(c) {
            var initX = enemyData.width / 1.5;
            var initY = 40;
            var enemyObjs = [Enemy4Obj, Enemy3Obj, Enemy2Obj, Enemy1Obj, Enemy1Obj, Enemy1Obj];
            var shotFreqs = [30, 15, 30, 0, 0, 0];
            var speeds = [1, 1, 1, 2, 2, 2];
            levels.loadEnemies(enemyObjs, shotFreqs, initX, initY + levels.yDiff, levels.xDiff, levels.yDiff, RandomInit, speeds);
            var b = Enemy6Obj.instantiate(c.width / 2, initY, enemyData.width, enemyData.height, 60, RandomInit);
            var m1 = Enemy7Obj.instantiate(c.width / 2 - levels.xDiff, initY, enemyData.width, enemyData.height, 25, RandomInit);
            var m2 = Enemy7Obj.instantiate(c.width / 2 + levels.xDiff, initY, enemyData.width, enemyData.height, 25, RandomInit);
            var bosses = [m1, m1, m1, m2, m2, m2];
            levels.setupEnemies([b, m1, m2], bosses.concat(bosses).concat(enemies.slice(enemies.length - 2 * levels.eCols, enemies.length)));
        }
    },
    level11: {
        attack_freq: function() { return 25 },
        load: function(c) {
            var initX = enemyData.width / 1.5;
            var initY = 40;
            var enemyObjs = [Enemy4Obj, Enemy3Obj, Enemy2Obj, Enemy2Obj, Enemy1Obj, Enemy1Obj];
            var shotFreqs = [30, 15, 20, 30, 0, 0];
            var speeds = [1, 1, 1, 2, 2, 2];
            levels.loadEnemies(enemyObjs, shotFreqs, initX, initY + levels.yDiff, levels.xDiff, levels.yDiff, RandomInit, speeds);
            var b1 = Enemy6Obj.instantiate(c.width / 2 - levels.xDiff, initY, enemyData.width, enemyData.height, 60, RandomInit);
            var b2 = Enemy6Obj.instantiate(c.width / 2 + levels.xDiff, initY, enemyData.width, enemyData.height, 60, RandomInit);
            var m1 = Enemy7Obj.instantiate(c.width / 2, initY, enemyData.width, enemyData.height, 25, RandomInit);
            var m2 = Enemy7Obj.instantiate(c.width / 2 - 2 * levels.xDiff, initY, enemyData.width, enemyData.height, 25, RandomInit);
            var m3 = Enemy7Obj.instantiate(c.width / 2 + 2 * levels.xDiff, initY, enemyData.width, enemyData.height, 25, RandomInit);
            var bosses = [m1, m1, m1, m2, m2, m2, m3, m3, m3];
            bosses = bosses.concat(bosses);
            levels.setupEnemies([b1, b2, m1, m2, m3], bosses.concat(enemies.slice(enemies.length - 3 * levels.eCols, enemies.length)));
        }
    },
    level12: {
        attack_freq: function() { return 25 },
        load: function(c) {
            var initX = enemyData.width / 1.5;
            var initY = 40;
            var enemyObjs = [Enemy4Obj, Enemy3Obj, Enemy2Obj, Enemy2Obj, Enemy1Obj, Enemy1Obj];
            var shotFreqs = [30, 15, 20, 30, 0, 0];
            var speeds = [1, 1, 1, 2, 2, 2];
            levels.loadEnemies(enemyObjs, shotFreqs, initX, initY + levels.yDiff, levels.xDiff, levels.yDiff, RandomInit, speeds);
            var b1 = Enemy8Obj.instantiate(initX + levels.xDiff, initY, enemyData.width + 2 * levels.xDiff, enemyData.height, 40, RandomInit);
            var b2 = Enemy8Obj.instantiate(initX + 4 * levels.xDiff, initY, enemyData.width + 2 * levels.xDiff, enemyData.height, 40, RandomInit);
            var m1 = Enemy7Obj.instantiate(initX, initY, enemyData.width, enemyData.height, 25, RandomInit);
            var m2 = Enemy7Obj.instantiate(initX + 7 * levels.xDiff, initY, enemyData.width, enemyData.height, 25, RandomInit);
            var bosses = [b1, b1, b2, b2, m1, m1, m1, m2, m2, m2];
            levels.setupEnemies([m1, m2, b1, b2], bosses.concat(enemies.slice(enemies.length - 2 * levels.eCols, enemies.length)));
        }
    },
    level13: {
        attack_freq: function() { return 20 },
        load: function(c) {
            var initX = enemyData.width / 1.5;
            var initY = 40;
            var enemyObjs = [Enemy7Obj, Enemy7Obj, Enemy1Obj, Enemy1Obj, Enemy1Obj, Enemy1Obj];
            var shotFreqs = [20, 20, 0, 0, 0, 0];
            var speeds = [1, 1, 2.5, 2, 2, 2];
            levels.loadEnemies(enemyObjs, shotFreqs, initX, initY + levels.yDiff, levels.xDiff, levels.yDiff, RandomHorizontalInit, speeds);
            var active = enemies.slice(enemies.length - levels.eCols, enemies.length);
            levels.setupEnemies([], active.concat(enemies.slice(enemies.length - 5 * levels.eCols, enemies.length - 4 * levels.eCols)));
        }
    },
    level14: {
        attack_freq: function() { return 30 },
        load: function(c) {
            var initX = enemyData.width / 1.5;
            var initY = 40;
            var enemyObjs = [Enemy4Obj, Enemy3Obj, Enemy3Obj, Enemy2Obj, Enemy2Obj, Enemy1Obj];
            var shotFreqs = [20, 15, 20, 10, 30, 0];
            var speeds = [1, 1.5, 1, 1.5, 1, 2];
            levels.loadEnemies(enemyObjs, shotFreqs, initX, initY + levels.yDiff, levels.xDiff, levels.yDiff, RandomHorizontalInit, speeds);
            var b1 = Enemy8Obj.instantiate(initX + levels.xDiff, initY, enemyData.width + 2 * levels.xDiff, enemyData.height, 40, RandomInit);
            var b2 = Enemy8Obj.instantiate(initX + 4 * levels.xDiff, initY, enemyData.width + 2 * levels.xDiff, enemyData.height, 40, RandomInit);
            var m1 = Enemy7Obj.instantiate(initX, initY, enemyData.width, enemyData.height, 25, RandomInit);
            var m2 = Enemy7Obj.instantiate(initX + 7 * levels.xDiff, initY, enemyData.width, enemyData.height, 25, RandomInit);
            levels.setupEnemies([b1, b2, m1, m2], enemies.slice(0, enemies.length));
        }
    },
    level15: {
        attack_freq: function() { return 40 },
        load: function(c) {
            var initX = enemyData.width / 1.5;
            var initY = 40;
            var enemyObjs = [Enemy4Obj, Enemy3Obj, Enemy2Obj, Enemy2Obj, Enemy1Obj];
            var shotFreqs = [25, 15, 10, 15, 0];
            var speeds = [1, 1.5, 1.7, 1.3, 2];
            levels.loadEnemies(enemyObjs, shotFreqs, initX, initY + levels.yDiff, levels.xDiff, levels.yDiff, RandomHorizontalInit, speeds);
            var b1 = Enemy6Obj.instantiate(initX, initY, enemyData.width, enemyData.height, 50, RandomInit);
            var b2 = Enemy6Obj.instantiate(c.width / 2, initY, enemyData.width, enemyData.height, 50, RandomInit);
            var b3 = Enemy6Obj.instantiate(initX + 7 * levels.xDiff, initY, enemyData.width, enemyData.height, 50, RandomInit);
            levels.setupEnemies([b1, b2, b3], enemies.slice(enemies.length - 2 * levels.eCols, enemies.length));
        }
    },
    level16: {
        attack_freq: function() { return 13 },
        load: function(c) {
            var initX = enemyData.width / 1.5;
            var initY = 40;
            var enemyObjs = [Enemy4Obj, Enemy3Obj, Enemy3Obj, Enemy2Obj, Enemy2Obj, Enemy1Obj, Enemy1Obj];
            var shotFreqs = [60, 30, 25, 25, 20, 0, 0];
            var speeds = [1, 1.5, 1.2, 1.5, 1.4, 1.8, 1.6];
            levels.loadEnemies(enemyObjs, shotFreqs, initX, initY + levels.yDiff, levels.xDiff, levels.yDiff, RandomInit, speeds);
            levels.setupEnemies([], enemies.slice(0, enemies.length));
        }
    },
    level17: {
        attack_freq: function() { return 45 },
        load: function(c) {
            var initX = enemyData.width / 1.5;
            var initY = 40;
            var enemyObjs = [Enemy3Obj, Enemy2Obj, Enemy1Obj];
            var shotFreqs = [35, 20, 0];
            var speeds = [1.2, 1.2, 1.2];
            levels.loadEnemies(enemyObjs, shotFreqs, initX, initY + 3 * levels.yDiff, levels.xDiff, levels.yDiff, RandomInit, speeds);
            var boss = Enemy9Obj.instantiate(initX + 2 * levels.xDiff, initY, enemyData.width + 3 * levels.xDiff, enemyData.height + 2 * levels.yDiff, 50, RandomVerticalInit);
            var m1 = Enemy7Obj.instantiate(initX, initY + 2 * levels.yDiff, enemyData.width, enemyData.height, 25, RandomInit);
            var m2 = Enemy7Obj.instantiate(initX + levels.xDiff, initY + 2 * levels.yDiff, enemyData.width, enemyData.height, 25, RandomInit);
            var m3 = Enemy7Obj.instantiate(initX + 6 * levels.xDiff, initY + 2 * levels.yDiff, enemyData.width, enemyData.height, 25, RandomInit);
            var m4 = Enemy7Obj.instantiate(initX + 7 * levels.xDiff, initY + 2 * levels.yDiff, enemyData.width, enemyData.height, 25, RandomInit);
            var b1 = Enemy5Obj.instantiate(initX, initY, enemyData.width + levels.xDiff, enemyData.height + levels.yDiff, 20, RandomInit);
            var b2 = Enemy5Obj.instantiate(initX + 6 * levels.xDiff, initY, enemyData.width + levels.xDiff, enemyData.height + levels.yDiff, 20, RandomInit);
            levels.setupEnemies([boss, m1, m2, m3, m4, b1, b2], enemies.slice(1, enemies.length));
        }
    },
    custom: {
        attack_freq: function() { return 50 },
        load: function(c) {
            activeEnemies = editorActiveEnemies.slice(0, editorActiveEnemies.length);
            activeEnemies = activeEnemies.filter(function(e) {
                return e.AttackPath;
            });
        }
    }
};

var worlds = [
    [levels.level1, levels.level2, levels.level3, levels.level4],
    [levels.level5, levels.level6, levels.level7, levels.level8],
    [levels.level9, levels.level10, levels.level11, levels.level12],
    [levels.level13, levels.level14, levels.level15, levels.level16],
    [levels.level17]
];

export { levels, worlds, activeEnemies, editorActiveEnemies, setEditorActiveEnemies };
