import { FollowPlayerPath, AvoidPlayerPath, StandardAttackPath, SweepAttackPath } from './space_paths';
import { Enemy, EnemyMode, playSound, Laser, Mine, Shot } from './space_objects';
import { gameState } from './space_state';
import { arrayRand } from '../util';

const { sprites, sounds } = gameState;

const xWanderMax = 10;

function initEnemy(
  sprite, x, y, w, h, score, health, InitPathFn, AttackPath,
  shootFn, shotFreq, speed, parent,
) {
  const enemy = Enemy({
    sprite,
    x,
    y,
    width: w,
    height: h,
    parent,
    score,
    speed,
    health,
  });
  enemy.AttackPath = new AttackPath(gameState.c, enemy);
  enemy.shoot = shootFn(enemy, shotFreq);
  if(InitPathFn) {
    enemy.initPath = new InitPathFn(gameState.c, enemy).instantiate();
  }
  return enemy;
}

const Enemy1Obj = {
  type: 1,
  score: 10,
  health: 1,
  shootFn: () => (
    () => {}
  ),
  instantiate: (x, y, w, h, shotFreq, InitPathFn, speed, parent) => (
    initEnemy(Enemy1Obj.sprite, x, y, w, h, Enemy1Obj.score, Enemy1Obj.health, InitPathFn,
      Enemy1Obj.AttackPath, Enemy1Obj.shootFn, shotFreq, speed, parent)
  ),
  AttackPath: StandardAttackPath,
};

const Enemy2Obj = {
  type: 2,
  score: 20,
  health: 1,
  shootFn: (E, freq) => {
    let shotTimer = Math.random() * freq;
    return () => {
      shotTimer -= 1;
      if(shotTimer <= 0) {
        gameState.enemyShots.push(Shot({
          sprites: sprites.enemyShot,
          x: E.x + E.width / 2,
          y: E.y + E.height,
          speed: 10,
        }));
        shotTimer = (freq / 2) + Math.random() * (freq / 2);
        playSound(sounds.enemyShot);
      }
    };
  },
  instantiate: (x, y, w, h, shotFreq, InitPathFn, speed, parent) => (
    initEnemy(Enemy2Obj.sprite, x, y, w, h, Enemy2Obj.score, Enemy2Obj.health, InitPathFn,
      Enemy2Obj.AttackPath, Enemy2Obj.shootFn, shotFreq, speed, parent)
  ),
  AttackPath: StandardAttackPath,
};

const Enemy3Obj = {
  type: 3,
  score: 50,
  health: 1,
  shootFn: (E, freq) => {
    let shotTimer = freq;
    let left = true;
    return () => {
      shotTimer -= 1;
      if(shotTimer <= 0) {
        gameState.enemyShots.push(Shot({
          sprites: sprites.enemyShot,
          x: E.x + E.width / (left ? 4 : 1.75),
          y: E.y + E.height,
          speed: 10,
        }));
        left = !left;
        shotTimer = (freq / 2) + Math.random() * (freq / 2);
        playSound(sounds.enemyShot);
      }
    };
  },
  instantiate: (x, y, w, h, shotFreq, InitPathFn, speed, parent) => (
    initEnemy(Enemy3Obj.sprite, x, y, w, h, Enemy3Obj.score, Enemy3Obj.health, InitPathFn,
      Enemy3Obj.AttackPath, Enemy3Obj.shootFn, shotFreq, speed, parent)
  ),
  AttackPath: StandardAttackPath,
};

const Enemy4Obj = {
  type: 4,
  score: 100,
  health: 1,
  shootFn: (E, freq) => {
    let shotTimer = Math.random() * freq;
    return () => {
      shotTimer -= 1;
      if(shotTimer <= 0) {
        gameState.enemyShots.push(Shot({
          sprites: sprites.enemyShot,
          x: E.x + E.width / 4,
          y: E.y + E.height,
          speed: 10,
        }));
        gameState.enemyShots.push(Shot({
          sprites: sprites.enemyShot,
          x: E.x + E.width / 1.75,
          y: E.y + E.height,
          speed: 10,
        }));
        shotTimer = Math.random() * freq;
        playSound(sounds.enemyShot);
      }
    };
  },
  instantiate: (x, y, w, h, shotFreq, InitPathFn, parent, child) => {
    const enemy = initEnemy(Enemy4Obj.sprite, x, y, w, h, Enemy4Obj.score, Enemy4Obj.health, InitPathFn,
      Enemy4Obj.AttackPath, Enemy4Obj.shootFn, shotFreq, 1, parent);

    if(child) {
      child.parent = enemy;
    }
    return enemy;
  },
  AttackPath: FollowPlayerPath,
};

const Enemy5Obj = {
  type: 5,
  score: 250,
  health: 3,
  shootFn: (E, freq) => {
    const cannonFn = Enemy3Obj.shootFn(E, freq);
    let laserTimer = freq;
    return () => {
      cannonFn();
      laserTimer -= 1;
      if(laserTimer < 0) {
        gameState.enemyShots.push(Laser({
          owner: E, x: E.x + (E.width / 2), y: E.y + E.height - 5,
        }));
        laserTimer = Math.random() * freq * 3 + freq;
        playSound(sounds.laser);
      }
    };
  },
  notifyEscortsFn: (E, escorts) => {
    escorts.forEach((escort) => {
      escort.relativeEscortX = escort.x - E.x;
      escort.relativeEscortY = escort.y - E.y;
    });
    return () => {
      escorts.filter((escort) => {
        if(escort.active) {
          escort.attack(E.AttackPath.clone(escort));
          escort.x = E.x + escort.relativeEscortX;
          escort.y = E.y + escort.relativeEscortY;
          return true;
        }
        return false;
      });
    };
  },
  instantiate: (x, y, w, h, shotFreq, InitPathFn, escorts) => {
    const enemy = Enemy({
      sprite: Enemy5Obj.sprite,
      x,
      y,
      width: w,
      height: h,
      score: Enemy5Obj.score,
      health: Enemy5Obj.health,
    });
    enemy.AttackPath = new Enemy5Obj.AttackPath(gameState.c, enemy);
    enemy.shoot = this.shootFn(enemy, shotFreq);
    if(InitPathFn) {
      enemy.initPath = new InitPathFn(gameState.c, enemy).instantiate(true);
    }
    if(escorts) {
      enemy.notifyEscorts = this.notifyEscortsFn(enemy, escorts);
    }
    return enemy;
  },
  AttackPath: SweepAttackPath,
};

const Enemy6Obj = {
  type: 6,
  score: 300,
  health: 2,
  shootFn: (E, freq) => {
    let laserTimer = freq;
    return () => {
      laserTimer -= 1;
      if(laserTimer < 0) {
        gameState.enemyShots.push(Laser({
          owner: E, x: E.x + (E.width / 2), y: E.y + E.height - 5,
        }));
        laserTimer = Math.random() * freq + freq;
        playSound(sounds.laser);
      }
    };
  },
  hoverActionFn: (E, freq) => this.shootFn(E, freq),
  wanderFn: E => (
    (xWanderSpeed) => {
      let newXWanderSpeed = 0.5 * xWanderSpeed * ((gameState.c.width / 2 - 20) / xWanderMax);
      if(E.x > gameState.c.width - E.width || E.x < 0) {
        newXWanderSpeed *= -1;
      }
      E.x += newXWanderSpeed;
    }
  ),
  instantiate: (x, y, w, h, shotFreq, InitPathFn) => {
    const enemy = Enemy({
      sprite: Enemy6Obj.sprite,
      x,
      y,
      width: w,
      height: h,
      score: Enemy6Obj.score,
      health: Enemy6Obj.health,
    });
    enemy.shoot = this.shootFn(enemy, shotFreq);
    if(InitPathFn) {
      enemy.initPath = new InitPathFn(gameState.c, enemy).instantiate();
    }
    enemy.wander = this.wanderFn(enemy);
    enemy.hoverAction = this.hoverActionFn(enemy, shotFreq);
    return enemy;
  },
};

const Enemy7Obj = {
  type: 7,
  score: 200,
  health: 2,
  shootFn: (E, freq) => {
    let timer = Math.random() * freq;
    return () => {
      if(E.y > gameState.c.boundary && E.x > 0 && E.x < gameState.c.width && !E.path.done) {
        timer -= 1;
        if(timer <= 0) {
          gameState.mines.push(Mine({ x: E.x, y: E.y }));
          E.path.done = true;
          timer = Math.random() * freq;
        }
      }
    };
  },
  instantiate: (x, y, w, h, shotFreq, InitPathFn, speed, parent) => (
    initEnemy(Enemy7Obj.sprite, x, y, w, h, Enemy7Obj.score, Enemy7Obj.health, InitPathFn,
      Enemy7Obj.AttackPath, Enemy7Obj.shootFn, shotFreq, speed, parent)
  ),
  AttackPath: AvoidPlayerPath,
};

const Enemy8Obj = {
  type: 8,
  score: 400,
  health: 5,
  shootFn: (E, freq) => {
    let timer = freq / 5;
    return () => {
      timer -= 1;
      if(timer <= 0) {
        const rand = Math.random();
        const gun = Math.floor(rand * 6);
        if(rand < 0.2) {
          for(let i = 1; i < 6; i += 1) {
            gameState.enemyShots.push(Shot({
              sprites: sprites.enemyShot,
              x: E.x + (i * E.width) / 6,
              y: E.y + E.height - 5,
              speed: 10,
            }));
          }
        } else {
          gameState.enemyShots.push(Shot({
            sprites: sprites.enemyShot,
            x: E.x + (gun * E.width) / 6,
            y: E.y + E.height - 5,
            speed: 10,
          }));
        }
        playSound(sounds.enemyShot);
        timer = freq / 5 + rand;
      }
    };
  },
  instantiate: (x, y, w, h, shotFreq, InitPathFn) => {
    const enemy = Enemy({
      sprite: Enemy8Obj.sprite,
      x,
      y,
      width: w,
      height: h,
      score: Enemy8Obj.score,
      health: Enemy8Obj.health,
    });
    enemy.AttackPath = new Enemy8Obj.AttackPath(gameState.c, enemy);
    enemy.shoot = this.shootFn(enemy, shotFreq);
    if(InitPathFn) {
      enemy.initPath = new InitPathFn(gameState.c, enemy).instantiate();
    }
    return enemy;
  },
  AttackPath: StandardAttackPath,
};

const Enemy9Obj = {
  type: 9,
  score: 2000,
  health: 20,
  shootFn: (E, freq) => {
    const bottomEnemies = [Enemy1Obj, Enemy2Obj, Enemy3Obj];
    let timer = freq;
    return () => {
      timer -= 1;
      if(timer <= 0) {
        timer = (freq / 2) + Math.random() * (freq / 2);
        let e1;
        let e2;
        const rand = Math.random();
        if(rand < 0.3) {
          e1 = Enemy4Obj.instantiate(
            E.x - gameState.enemyData.width,
            E.y + 10,
            gameState.enemyData.width,
            gameState.enemyData.height,
            50,
            null,
            1,
          );
          e2 = Enemy4Obj.instantiate(
            E.x + E.width,
            E.y + 10,
            gameState.enemyData.width,
            gameState.enemyData.height,
            50,
            null,
            1,
          );
        } else if(rand < 0.8) {
          e1 = arrayRand(bottomEnemies).instantiate(
            E.x + 10,
            E.y + E.height,
            gameState.enemyData.width,
            gameState.enemyData.height,
            30,
            null,
            1,
          );
          e2 = arrayRand(bottomEnemies).instantiate(
            E.x + E.width - (10 + gameState.enemyData.width),
            E.y + E.height,
            gameState.enemyData.width,
            gameState.enemyData.height,
            30,
            null,
            1,
          );
        } else {
          gameState.enemyShots.push(Laser({ owner: E, x: E.x + (E.width / 2) - 3, y: E.y + E.height - 40, width: 5 }));
          playSound(sounds.laser);
          return;
        }
        e1.mode = EnemyMode.HOVER;
        e2.mode = EnemyMode.HOVER;
        gameState.enemyData.initEnemyCount += 2;
        e1.alwaysAttack = true;
        e2.alwaysAttack = true;
        e1.attack();
        e2.attack();
        gameState.enemies.push(e1);
        gameState.enemies.push(e2);
      }
    };
  },
  instantiate: (x, y, w, h, shotFreq, InitPathFn) => {
    const enemy = Enemy({
      sprite: Enemy9Obj.sprite,
      x,
      y,
      width: w,
      height: h,
      score: Enemy9Obj.score,
      health: Enemy9Obj.health,
    });
    enemy.shoot = this.shootFn(enemy, shotFreq);
    if(InitPathFn) enemy.initPath = new InitPathFn(gameState.c, enemy, 30).instantiate();
    enemy.hoverAction = this.shootFn(enemy, shotFreq);
    return enemy;
  },
};

const enemyObjList = [Enemy1Obj, Enemy2Obj, Enemy3Obj, Enemy4Obj, Enemy5Obj, Enemy6Obj, Enemy7Obj, Enemy8Obj];

export { enemyObjList, Enemy1Obj, Enemy2Obj, Enemy3Obj, Enemy4Obj, Enemy5Obj, Enemy6Obj, Enemy7Obj, Enemy8Obj, Enemy9Obj };
export { xWanderMax };
