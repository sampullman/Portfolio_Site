
import {
  Enemy1Obj, Enemy2Obj,
  Enemy3Obj, Enemy4Obj, Enemy5Obj, Enemy6Obj, Enemy7Obj, Enemy8Obj, Enemy9Obj,
} from './space_enemies';
import { RandomInit, RandomVerticalInit, RandomHorizontalInit } from './space_paths';
import { removeSquare } from '../util.js';
import { gameState } from './space_state';

const { enemies, enemyData } = gameState;

const levels = {
  init: (c) => {
    levels.eCols = 8;
    levels.yDiff = gameState.enemyData.height * 1.6;
    levels.xDiff = (c.width - gameState.enemyData.width) / levels.eCols;
  },
  loadEnemies: (enemyObjs, shotFreqs, initX, initY, xDiff, yDiff, InitPathFn, speeds) => {
    let enemyY = initY;
    for(let i = 0; i < enemyObjs.length; i += 1) {
      let x = initX;
      for(let j = 0; j < levels.eCols; j += 1) {
        let parent = null;
        if(i !== 0) {
          parent = gameState.enemies[(i - 1) * levels.eCols + j];
        }
        gameState.enemies.push(enemyObjs[i].instantiate(x, enemyY, gameState.enemyData.width, gameState.enemyData.height,
          shotFreqs[i], InitPathFn, speeds[i], parent));
        x += xDiff;
      }
      enemyY += yDiff;
    }
  },
  setupEnemies: (extras, active) => {
    gameState.enemies = extras.concat(gameState.enemies);
    gameState.enemies.forEach((e) => { e.initPath.init() });
    gameState.activeEnemies = active;
  },
  level1: {
    attack_freq: () => 60 + gameState.enemies.length,
    load: (_c) => {
      const enemyObjs = [Enemy3Obj, Enemy2Obj, Enemy2Obj, Enemy1Obj, Enemy1Obj];
      const speeds = [1, 1, 1, 1, 1];
      const shotFreqs = [20, 50, 50, 0, 0];
      const initX = gameState.enemyData.width / 1.5;
      const initY = 40 + levels.yDiff;
      levels.loadEnemies(enemyObjs, shotFreqs, initX, initY, levels.xDiff, levels.yDiff, RandomVerticalInit, speeds);
      const h = Enemy4Obj.instantiate(
        initX + (levels.xDiff * 3),
        initY - levels.yDiff,
        gameState.enemyData.width,
        gameState.enemyData.height,
        30,
        RandomVerticalInit,
        null,
        gameState.enemies[3],
      );
      levels.setupEnemies([h], gameState.enemies.slice(gameState.enemies.length - levels.eCols, gameState.enemies.length));
    },
  },
  level2: {
    attack_freq: () => 40 + enemies.length,
    load: (_c) => {
      const enemyObjs = [Enemy3Obj, Enemy3Obj, Enemy2Obj, Enemy2Obj, Enemy1Obj];
      const speeds = [1, 1, 1, 1, 1];
      const shotFreqs = [20, 20, 40, 50, 0];
      const initX = enemyData.width / 1.5;
      const initY = 40 + levels.yDiff;
      levels.loadEnemies(enemyObjs, shotFreqs, initX, initY, levels.xDiff, levels.yDiff, RandomVerticalInit, speeds);
      const h1 = Enemy4Obj.instantiate(initX + levels.xDiff, initY - levels.yDiff, enemyData.width, enemyData.height, 30, RandomVerticalInit, null, enemies[1]);
      const h2 = Enemy4Obj.instantiate(initX + (levels.xDiff * 6), initY - levels.yDiff, enemyData.width, enemyData.height, 30, RandomVerticalInit, null, enemies[6]);
      levels.setupEnemies([h1, h2], enemies.slice(enemies.length - levels.eCols, enemies.length));
    },
  },
  level3: {
    attack_freq: () => enemies.length * 2,
    load: (_c) => {
      const enemyObjs = [Enemy3Obj, Enemy3Obj, Enemy3Obj, Enemy2Obj, Enemy1Obj];
      const shotFreqs = [15, 20, 20, 40, 0];
      const speeds = [1, 1, 1, 1, 1];
      const initX = enemyData.width / 1.5;
      const initY = 40 + levels.yDiff;
      levels.loadEnemies(enemyObjs, shotFreqs, initX, initY, levels.xDiff, levels.yDiff, RandomVerticalInit, speeds);
      const h1 = Enemy4Obj.instantiate(initX + levels.xDiff, initY - levels.yDiff, enemyData.width, enemyData.height, 30, RandomVerticalInit, null, enemies[1]);
      const h2 = Enemy4Obj.instantiate(initX + (levels.xDiff * 6), initY - levels.yDiff, enemyData.width, enemyData.height, 30, RandomVerticalInit, null, enemies[6]);
      levels.setupEnemies([h1, h2], [h1, h1, h2, h2].concat(enemies.slice(enemies.length - 2 * levels.eCols, enemies.length)));
    },
  },
  level4: {
    attack_freq: () => 35,
    load: (_c) => {
      const enemyObjs = [Enemy4Obj, Enemy3Obj, Enemy3Obj, Enemy2Obj, Enemy2Obj, Enemy1Obj];
      const speeds = [1, 1, 1, 1, 1, 1];
      const shotFreqs = [30, 15, 20, 30, 40, 0];
      const initX = enemyData.width / 1.5;
      const initY = 40;
      levels.loadEnemies(enemyObjs, shotFreqs, initX, initY, levels.xDiff, levels.yDiff, RandomVerticalInit, speeds);
      levels.setupEnemies([], enemies.slice(levels.eCols, 2 * levels.eCols));
    },
  },
  level5: {
    attack_freq: () => enemies.length,
    load: (_c) => {
      const enemyObjs = [Enemy4Obj, Enemy3Obj, Enemy2Obj, Enemy1Obj, Enemy1Obj, Enemy1Obj];
      const shotFreqs = [30, 15, 30, 0, 0, 0];
      const speeds = [1, 1, 1, 2, 2, 2];
      const initX = enemyData.width / 1.5;
      const initY = 40;
      levels.loadEnemies(enemyObjs, shotFreqs, initX, initY, levels.xDiff, levels.yDiff, RandomVerticalInit, speeds);
      levels.setupEnemies([], enemies.slice(enemies.length - 3 * levels.eCols, enemies.length));
    },
  },
  level6: {
    attack_freq: () => 40,
    load: (_c) => {
      const initX = enemyData.width / 1.5;
      const initY = 40;
      const enemyObjs = [Enemy3Obj, Enemy3Obj, Enemy2Obj, Enemy1Obj, Enemy1Obj];
      const shotFreqs = [30, 15, 30, 0, 0, 0];
      const speeds = [1, 1, 1, 2, 2];
      levels.loadEnemies(enemyObjs, shotFreqs, initX, initY, levels.xDiff, levels.yDiff, RandomInit, speeds);
      const b1 = Enemy5Obj.instantiate(initX + levels.xDiff, initY, enemyData.width + levels.xDiff, enemyData.height + levels.yDiff, 20, RandomVerticalInit,
        enemies.slice(levels.eCols * 2, levels.eCols * 2 + 4));
      const b2 = Enemy5Obj.instantiate(initX + levels.xDiff * 5, initY, enemyData.width + levels.xDiff, enemyData.height + levels.yDiff,
        20, RandomVerticalInit, enemies.slice(levels.eCols * 2 + 4, levels.eCols * 2 + 8));
      removeSquare(enemies, levels.eCols, 1, 0, 2, 2);
      removeSquare(enemies, levels.eCols, 5, 0, 2, 2);
      levels.setupEnemies([b1, b2], [b1, b1, b2, b2].concat(enemies.slice(enemies.length - 2 * levels.eCols, enemies.length)));
    },
  },
  level7: {
    attack_freq: () => 30,
    load: (_c) => {
      const initX = enemyData.width / 1.5;
      const initY = 40;
      const enemyObjs = [Enemy3Obj, Enemy3Obj, Enemy2Obj, Enemy1Obj, Enemy1Obj];
      const shotFreqs = [30, 15, 30, 0, 0, 0];
      const speeds = [1, 1, 1, 2, 2];
      levels.loadEnemies(enemyObjs, shotFreqs, initX, initY, levels.xDiff, levels.yDiff, RandomInit, speeds);
      const escorts = [enemies[2], enemies[5], enemies[levels.eCols + 2], enemies[levels.eCols + 5]]
        .concat(enemies.slice(levels.eCols * 2 + 2, levels.eCols * 2 + 6))
        .concat(enemies.slice(levels.eCols * 3 + 2, levels.eCols * 3 + 6));
      const b = Enemy5Obj.instantiate(initX + levels.xDiff * 3, initY, enemyData.width + levels.xDiff, enemyData.height + levels.yDiff, 20, RandomVerticalInit, escorts);
      removeSquare(enemies, levels.eCols, 3, 0, 2, 2);
      levels.setupEnemies([b], [b, b, b, b].concat(enemies.slice(enemies.length - levels.eCols, enemies.length)));
    },
  },
  level8: {
    attack_freq: () => 50,
    load: (_c) => {
      const initX = enemyData.width / 1.5;
      let initY = 40 + 2 * levels.yDiff;
      const enemyObjs = [Enemy3Obj, Enemy3Obj, Enemy2Obj, Enemy1Obj];
      const shotFreqs = [30, 15, 30, 0];
      const speeds = [1, 1, 2, 2];
      levels.loadEnemies(enemyObjs, shotFreqs, initX, initY, levels.xDiff, levels.yDiff, RandomInit, speeds);
      initY = 40;
      const b1 = Enemy5Obj.instantiate(initX, initY, enemyData.width + levels.xDiff, enemyData.height + levels.yDiff, 20,
        RandomVerticalInit, [enemies[0], enemies[1]]);
      const b2 = Enemy5Obj.instantiate(initX + 2 * levels.xDiff, initY, enemyData.width + levels.xDiff, enemyData.height + levels.yDiff, 20,
        RandomVerticalInit, [enemies[2], enemies[3]]);
      const b3 = Enemy5Obj.instantiate(initX + 4 * levels.xDiff, initY, enemyData.width + levels.xDiff, enemyData.height + levels.yDiff, 20,
        RandomVerticalInit, [enemies[4], enemies[5]]);
      const b4 = Enemy5Obj.instantiate(initX + 6 * levels.xDiff, initY, enemyData.width + levels.xDiff, enemyData.height + levels.yDiff, 20,
        RandomVerticalInit, [enemies[6], enemies[7]]);
      levels.setupEnemies([b1, b2, b3, b4], [b1, b1, b1, b2, b2, b2, b3, b3, b3, b4, b4, b4].concat(enemies.slice(enemies.length - levels.eCols, enemies.length)));
    },
  },
  level9: {
    attack_freq: () => 50,
    load: (c) => {
      const initX = enemyData.width / 1.5;
      const initY = 40 + levels.yDiff;
      const b = Enemy6Obj.instantiate(c.width / 2, initY - levels.yDiff, enemyData.width, enemyData.height, 60, RandomInit);
      const enemyObjs = [Enemy4Obj, Enemy3Obj, Enemy2Obj, Enemy1Obj, Enemy1Obj, Enemy1Obj];
      const shotFreqs = [30, 15, 30, 0, 0, 0];
      const speeds = [1, 1, 1, 2, 2, 2];
      levels.loadEnemies(enemyObjs, shotFreqs, initX, initY, levels.xDiff, levels.yDiff, RandomInit, speeds);
      levels.setupEnemies([b], enemies.slice(enemies.length - 3 * levels.eCols, enemies.length));
    },
  },
  level10: {
    attack_freq: () => 30,
    load: (c) => {
      const initX = enemyData.width / 1.5;
      const initY = 40;
      const enemyObjs = [Enemy4Obj, Enemy3Obj, Enemy2Obj, Enemy1Obj, Enemy1Obj, Enemy1Obj];
      const shotFreqs = [30, 15, 30, 0, 0, 0];
      const speeds = [1, 1, 1, 2, 2, 2];
      levels.loadEnemies(enemyObjs, shotFreqs, initX, initY + levels.yDiff, levels.xDiff, levels.yDiff, RandomInit, speeds);
      const b = Enemy6Obj.instantiate(c.width / 2, initY, enemyData.width, enemyData.height, 60, RandomInit);
      const m1 = Enemy7Obj.instantiate(c.width / 2 - levels.xDiff, initY, enemyData.width, enemyData.height, 25, RandomInit);
      const m2 = Enemy7Obj.instantiate(c.width / 2 + levels.xDiff, initY, enemyData.width, enemyData.height, 25, RandomInit);
      const bosses = [m1, m1, m1, m2, m2, m2];
      levels.setupEnemies([b, m1, m2], bosses.concat(bosses).concat(enemies.slice(enemies.length - 2 * levels.eCols, enemies.length)));
    },
  },
  level11: {
    attack_freq: () => 25,
    load: (c) => {
      const initX = enemyData.width / 1.5;
      const initY = 40;
      const enemyObjs = [Enemy4Obj, Enemy3Obj, Enemy2Obj, Enemy2Obj, Enemy1Obj, Enemy1Obj];
      const shotFreqs = [30, 15, 20, 30, 0, 0];
      const speeds = [1, 1, 1, 2, 2, 2];
      levels.loadEnemies(enemyObjs, shotFreqs, initX, initY + levels.yDiff, levels.xDiff, levels.yDiff, RandomInit, speeds);
      const b1 = Enemy6Obj.instantiate(c.width / 2 - levels.xDiff, initY, enemyData.width, enemyData.height, 60, RandomInit);
      const b2 = Enemy6Obj.instantiate(c.width / 2 + levels.xDiff, initY, enemyData.width, enemyData.height, 60, RandomInit);
      const m1 = Enemy7Obj.instantiate(c.width / 2, initY, enemyData.width, enemyData.height, 25, RandomInit);
      const m2 = Enemy7Obj.instantiate(c.width / 2 - 2 * levels.xDiff, initY, enemyData.width, enemyData.height, 25, RandomInit);
      const m3 = Enemy7Obj.instantiate(c.width / 2 + 2 * levels.xDiff, initY, enemyData.width, enemyData.height, 25, RandomInit);
      let bosses = [m1, m1, m1, m2, m2, m2, m3, m3, m3];
      bosses = [...bosses, ...bosses];
      levels.setupEnemies([b1, b2, m1, m2, m3], bosses.concat(enemies.slice(enemies.length - 3 * levels.eCols, enemies.length)));
    },
  },
  level12: {
    attack_freq: () => 25,
    load: (_c) => {
      const initX = enemyData.width / 1.5;
      const initY = 40;
      const enemyObjs = [Enemy4Obj, Enemy3Obj, Enemy2Obj, Enemy2Obj, Enemy1Obj, Enemy1Obj];
      const shotFreqs = [30, 15, 20, 30, 0, 0];
      const speeds = [1, 1, 1, 2, 2, 2];
      levels.loadEnemies(enemyObjs, shotFreqs, initX, initY + levels.yDiff, levels.xDiff, levels.yDiff, RandomInit, speeds);
      const b1 = Enemy8Obj.instantiate(initX + levels.xDiff, initY, enemyData.width + 2 * levels.xDiff, enemyData.height, 40, RandomInit);
      const b2 = Enemy8Obj.instantiate(initX + 4 * levels.xDiff, initY, enemyData.width + 2 * levels.xDiff, enemyData.height, 40, RandomInit);
      const m1 = Enemy7Obj.instantiate(initX, initY, enemyData.width, enemyData.height, 25, RandomInit);
      const m2 = Enemy7Obj.instantiate(initX + 7 * levels.xDiff, initY, enemyData.width, enemyData.height, 25, RandomInit);
      const bosses = [b1, b1, b2, b2, m1, m1, m1, m2, m2, m2];
      levels.setupEnemies([m1, m2, b1, b2], bosses.concat(enemies.slice(enemies.length - 2 * levels.eCols, enemies.length)));
    },
  },
  level13: {
    attack_freq: () => 20,
    load: (_c) => {
      const initX = enemyData.width / 1.5;
      const initY = 40;
      const enemyObjs = [Enemy7Obj, Enemy7Obj, Enemy1Obj, Enemy1Obj, Enemy1Obj, Enemy1Obj];
      const shotFreqs = [20, 20, 0, 0, 0, 0];
      const speeds = [1, 1, 2.5, 2, 2, 2];
      levels.loadEnemies(enemyObjs, shotFreqs, initX, initY + levels.yDiff, levels.xDiff, levels.yDiff, RandomHorizontalInit, speeds);
      const active = enemies.slice(enemies.length - levels.eCols, enemies.length);
      levels.setupEnemies([], active.concat(enemies.slice(enemies.length - 5 * levels.eCols, enemies.length - 4 * levels.eCols)));
    },
  },
  level14: {
    attack_freq: () => 30,
    load: (_c) => {
      const initX = enemyData.width / 1.5;
      const initY = 40;
      const enemyObjs = [Enemy4Obj, Enemy3Obj, Enemy3Obj, Enemy2Obj, Enemy2Obj, Enemy1Obj];
      const shotFreqs = [20, 15, 20, 10, 30, 0];
      const speeds = [1, 1.5, 1, 1.5, 1, 2];
      levels.loadEnemies(enemyObjs, shotFreqs, initX, initY + levels.yDiff, levels.xDiff, levels.yDiff, RandomHorizontalInit, speeds);
      const b1 = Enemy8Obj.instantiate(initX + levels.xDiff, initY, enemyData.width + 2 * levels.xDiff, enemyData.height, 40, RandomInit);
      const b2 = Enemy8Obj.instantiate(initX + 4 * levels.xDiff, initY, enemyData.width + 2 * levels.xDiff, enemyData.height, 40, RandomInit);
      const m1 = Enemy7Obj.instantiate(initX, initY, enemyData.width, enemyData.height, 25, RandomInit);
      const m2 = Enemy7Obj.instantiate(initX + 7 * levels.xDiff, initY, enemyData.width, enemyData.height, 25, RandomInit);
      levels.setupEnemies([b1, b2, m1, m2], enemies.slice(0, enemies.length));
    },
  },
  level15: {
    attack_freq: () => 40,
    load: (c) => {
      const initX = enemyData.width / 1.5;
      const initY = 40;
      const enemyObjs = [Enemy4Obj, Enemy3Obj, Enemy2Obj, Enemy2Obj, Enemy1Obj];
      const shotFreqs = [25, 15, 10, 15, 0];
      const speeds = [1, 1.5, 1.7, 1.3, 2];
      levels.loadEnemies(enemyObjs, shotFreqs, initX, initY + levels.yDiff, levels.xDiff, levels.yDiff, RandomHorizontalInit, speeds);
      const b1 = Enemy6Obj.instantiate(initX, initY, enemyData.width, enemyData.height, 50, RandomInit);
      const b2 = Enemy6Obj.instantiate(c.width / 2, initY, enemyData.width, enemyData.height, 50, RandomInit);
      const b3 = Enemy6Obj.instantiate(initX + 7 * levels.xDiff, initY, enemyData.width, enemyData.height, 50, RandomInit);
      levels.setupEnemies([b1, b2, b3], enemies.slice(enemies.length - 2 * levels.eCols, enemies.length));
    },
  },
  level16: {
    attack_freq: () => 13,
    load: (_c) => {
      const initX = enemyData.width / 1.5;
      const initY = 40;
      const enemyObjs = [Enemy4Obj, Enemy3Obj, Enemy3Obj, Enemy2Obj, Enemy2Obj, Enemy1Obj, Enemy1Obj];
      const shotFreqs = [60, 30, 25, 25, 20, 0, 0];
      const speeds = [1, 1.5, 1.2, 1.5, 1.4, 1.8, 1.6];
      levels.loadEnemies(enemyObjs, shotFreqs, initX, initY + levels.yDiff, levels.xDiff, levels.yDiff, RandomInit, speeds);
      levels.setupEnemies([], enemies.slice(0, enemies.length));
    },
  },
  level17: {
    attack_freq: () => 45,
    load: (_c) => {
      const initX = enemyData.width / 1.5;
      const initY = 40;
      const enemyObjs = [Enemy3Obj, Enemy2Obj, Enemy1Obj];
      const shotFreqs = [35, 20, 0];
      const speeds = [1.2, 1.2, 1.2];
      levels.loadEnemies(enemyObjs, shotFreqs, initX, initY + 3 * levels.yDiff, levels.xDiff, levels.yDiff, RandomInit, speeds);
      const boss = Enemy9Obj.instantiate(initX + 2 * levels.xDiff, initY, enemyData.width + 3 * levels.xDiff, enemyData.height + 2 * levels.yDiff, 50, RandomVerticalInit);
      const m1 = Enemy7Obj.instantiate(initX, initY + 2 * levels.yDiff, enemyData.width, enemyData.height, 25, RandomInit);
      const m2 = Enemy7Obj.instantiate(initX + levels.xDiff, initY + 2 * levels.yDiff, enemyData.width, enemyData.height, 25, RandomInit);
      const m3 = Enemy7Obj.instantiate(initX + 6 * levels.xDiff, initY + 2 * levels.yDiff, enemyData.width, enemyData.height, 25, RandomInit);
      const m4 = Enemy7Obj.instantiate(initX + 7 * levels.xDiff, initY + 2 * levels.yDiff, enemyData.width, enemyData.height, 25, RandomInit);
      const b1 = Enemy5Obj.instantiate(initX, initY, enemyData.width + levels.xDiff, enemyData.height + levels.yDiff, 20, RandomInit);
      const b2 = Enemy5Obj.instantiate(initX + 6 * levels.xDiff, initY, enemyData.width + levels.xDiff, enemyData.height + levels.yDiff, 20, RandomInit);
      levels.setupEnemies([boss, m1, m2, m3, m4, b1, b2], enemies.slice(1, enemies.length));
    },
  },
  custom: {
    attack_freq: () => 50,
    load: (_c) => {
      gameState.editorActiveEnemies = gameState.editorActiveEnemies.slice(0, gameState.editorActiveEnemies.length);
      gameState.activeEnemies = gameState.activeEnemies.filter(e => e.AttackPath);
    },
  },
};
window.levels = levels;

const worlds = [
  [levels.level1, levels.level2, levels.level3, levels.level4],
  [levels.level5, levels.level6, levels.level7, levels.level8],
  [levels.level9, levels.level10, levels.level11, levels.level12],
  [levels.level13, levels.level14, levels.level15, levels.level16],
  [levels.level17],
];

export { levels, worlds };
