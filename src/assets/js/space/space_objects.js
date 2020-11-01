import { keyhandler, clamp } from '../util';
import { gameState, GameMode, shotW, shotH } from './space_state';
import { Point, PointPath } from './space_paths';

const { sprites, sounds } = gameState;

let powerupObjs;
let life;

function playSound(sound) {
  if(gameState.soundOn) {
    sound.stop();
    sound.play();
  }
}

function entityCollision(e1, e2) {
  const r1 = e1.x + e1.width;
  const b1 = e1.y + e1.height;
  const r2 = e2.x + e2.width;
  const b2 = e2.y + e2.height;
  return r1 > e2.x && e1.x < r2 && e1.y < b2 && b1 > e2.y;
}

function Life(L) {
  L.update = () => {
    if(L.path) {
      const dir = L.path.next();
      L.x += dir.x;
      L.y += dir.y;
      if(L.path.finished) {
        L.path = null;
      }
    }
  };
  L.draw = (c) => {
    L.sprite.draw(c, L.x, L.y);
  };
  return L;
}

function Laser(L) {
  L.active = true;
  L.timer = L.timer || 15;
  L.width = L.width || 3;
  L.height = gameState.c.height - L.y;
  L.yDiff = L.height / L.timer;
  L.draw = (c) => {
    c.fillStyle = '#71CA35';
    c.fillRect(L.x, L.y, L.width, L.height);
  };
  L.hitEntity = (entity) => {
    if(entityCollision(L, entity)) {
      entity.entityHit();
    }
  };
  L.update = () => {
    L.timer -= 1;
    if(L.timer < 0) {
      L.active = false;
    }
    L.y += L.yDiff;
    L.height -= L.yDiff;
    // L.x = L.owner.x + L.owner.width/2;
    // L.y = L.owner.y + L.owner.height;
  };
  return L;
}

const ShotMode = {
  NORMAL: 0,
  EXPLODING: 1,
  GONE: 2,
};

function Shot(S) {
  S.width = S.width || shotW;
  S.height = S.height || shotH;
  S.active = true;
  S.mode = ShotMode.NORMAL;
  S.explosionTimer = 0;
  S.sprite = S.sprites[S.mode];
  S.inBounds = () => (
    S.x >= 0 && S.x <= gameState.c.width
      && S.y >= 0 && S.y <= gameState.c.height
  );
  S.draw = (c) => {
    S.sprite.draw(c, S.x, S.y);
  };
  S.hitEntity = (entity) => {
    switch(S.mode) {
    case ShotMode.NORMAL:
      if(entityCollision(S, entity)) {
        entity.entityHit();
        S.mode = ShotMode.EXPLODING;
        S.sprite = S.sprites[S.mode];
      }
      return false;
    case ShotMode.EXPLODING:
      if(S.explosionTimer > 20) {
        S.active = false;
        S.mode = ShotMode.GONE;
      } else {
        S.explosionTimer += 1;
      }
      return false;
    default:
    }
    return false;
  };
  S.update = () => {
    switch(S.mode) {
    case ShotMode.NORMAL:
      S.y += S.speed;
      if(S.y < 0 || S.y > gameState.c.height) {
        S.active = false;
      }
      break;
    default:
    }
  };
  return S;
}

function replaceActiveEnemy(E) {
  let ind = gameState.activeEnemies.indexOf(E);
  if(ind === -1) {
    return;
  }
  while(ind !== -1) {
    gameState.activeEnemies.splice(ind, 1);
    ind = gameState.activeEnemies.indexOf(E);
  }
  const seen = [];
  let enemy = E;
  while(true) { // eslint-disable-line
    if(enemy) {
      if(seen.indexOf(enemy) !== -1) {
        return;
      }
      if(!enemy.active || (gameState.activeEnemies.indexOf(enemy) !== -1)) {
        seen.push(enemy);
        enemy = enemy.parent;
      } else {
        break;
      }
    } else {
      return;
    }
  }
  gameState.activeEnemies.push(E);
}

function Explosion(x, y, w, h) {
  this.x = x;
  this.y = y;
  this.width = w;
  this.height = h;
  this.time = 0;
  this.active = true;
  this.ind = 0;
  this.spriteTime = 2;
  const self = this;
  this.draw = (c) => {
    if(w && h) {
      sprites.explosions[self.ind].draw(c, self.x, self.y, w, h);
    } else {
      sprites.explosions[self.ind].draw(c, self.x, self.y);
    }
  };
  this.update = () => {
    self.time += 1;
    if(self.time > self.spriteTime) {
      self.time = 0;
      self.ind += 1;
      if(self.ind >= sprites.explosions.length) {
        self.active = false;
      }
    }
  };
}

function Missile(x, y, speed, w, h) {
  this.x = x;
  this.y = y;
  this.speed = speed || -7;
  this.active = true;
  this.width = w || sprites.missile.width;
  this.height = h || sprites.missile.height;
  this.explosionTimer = 0;
  const self = this;
  this.inBounds = () => (
    self.x >= 0 && self.x <= gameState.c.width
      && self.y >= 0 && self.y <= gameState.c.height
  );
  this.draw = (c) => {
    sprites.missile.draw(c, self.x, self.y);
  };
  this.hitEntity = (entity) => {
    if(entityCollision(self, entity)) {
      self.active = false;
      const exp = new Explosion(self.x - 2 * self.width, self.y - self.height, self.width * 5, self.height * 3);
      gameState.explosions.push(exp);
      gameState.enemies.forEach((enemy) => {
        if(entityCollision(exp, enemy)) {
          enemy.entityHit(2);
        }
      });
    }
  };
  this.update = () => {
    self.y += self.speed;
    if(self.y < 0 || self.y > gameState.c.height) {
      self.active = false;
    }
  };
  return this;
}

function clearEntities() {
  gameState.mines.length = 0;
  gameState.enemies.length = 0;
  gameState.activeEnemies.length = 0;
  gameState.player.shots.length = 0;
  gameState.enemyShots.length = 0;
  gameState.enemyData.numAttacks = 0;
  gameState.enemyData.initEnemyCount = 0;
}

function Mine(M) {
  M.active = true;
  M.blinkTimer = 15;
  M.blink = true;
  M.width = sprites.mines[0].width;
  M.height = sprites.mines[0].height;
  M.sprite = sprites.mines[0]; // eslint-disable-line
  M.draw = (c) => {
    M.sprite.draw(c, M.x, M.y);
  };
  M.hitEntity = (entity) => {
    if(entityCollision(M, entity)) {
      entity.entityHit(3);
      M.active = false;
    }
  };
  M.entityHit = () => {
    this.active = false;
    gameState.explosions.push(new Explosion(this.x, this.y, this.width, this.height));
  };
  M.update = () => {
    M.blinkTimer -= 1;
    if(M.blinkTimer <= 0) {
      M.sprite = M.blink ? sprites.mines[1] : sprites.mines[0];
      M.blink = !M.blink;
      M.blinkTimer = 15;
    }
  };
  return M;
}

const EnemyMode = {
  INIT: 0,
  HOVER: 1,
  ATTACK: 2,
  RETURN: 3,
};

function Enemy(E) {
  E.active = true;
  E.alwaysAttack = false;
  E.mode = E.mode || EnemyMode.INIT;
  E.speed = E.speed || 1;
  E.notifyEscorts = E.notifyEscorts || (() => {});
  E.returnPath = () => {
    E.y = 0;
    return new PointPath([new Point(E.x, E.y), new Point(E.startX, E.startY)], [30], 1);
  };
  E.clone = (x, y) => {
    const e = Enemy({
      sprite: E.sprite,
      x: x || E.x,
      y: y || E.y,
      width: E.width,
      height: E.height,
      score: E.score,
      health: E.health,
    });
    e.speed = E.speed;
    e.shotFreq = E.shotFreq;
    e.initPathFn = E.initPathFn;
    e.AttackPathFn = E.AttackPathFn;
    e.shootFn = E.shootFn;
    e.wanderFn = E.wanderFn;
    e.hoverActionFn = E.hoverActionFn;
    if(E.initPathFn) {
      e.initPath = E.initPathFn(gameState.c, e);
    }
    if(E.AttackPathFn) {
      e.AttackPath = new E.AttackPathFn(gameState.c, e);
    }
    e.shoot = E.shootFn(e, E.shotFreq);
    if(E.hoverActionFn) {
      e.hoverAction = e.hoverActionFn(e, e.shotFreq);
    }
    if(e.wanderFn) {
      e.wander = e.wanderFn(e);
    }
    return e;
  };
  E.wander = (xWander) => {
    if(E.mode === EnemyMode.ATTACK) {
      E.startX += xWander;
    } else {
      E.x += xWander;
    }
  };
  E.attack = (path) => {
    if(E.mode === EnemyMode.ATTACK || E.mode === EnemyMode.INIT
        || E.x < 0 || E.x > gameState.c.width || E.AttackPath === null) {
      return;
    }
    if(E.mode === EnemyMode.HOVER) {
      E.startX = E.x;
      E.startY = E.y;
    }
    E.mode = EnemyMode.ATTACK;
    E.path = path || E.AttackPath.instantiate();
    E.notifyEscorts();
  };
  E.update = () => {
    switch(E.mode) {
    case EnemyMode.INIT: {
      const dir = E.initPath.next();
      E.x += dir.x;
      E.y += dir.y;
      if(E.initPath.finished) {
        E.mode = EnemyMode.HOVER;
        const last = E.initPath.lastPoint();
        E.x = last.x;
        E.y = last.y;
        gameState.enemyData.initEnemyCount += 1;
      }
      break;
    }
    case EnemyMode.HOVER:
      if(E.hoverAction) {
        E.hoverAction();
      }
      break;
    case EnemyMode.ATTACK: {
      const dir = E.path.next();
      E.x += dir.x;
      E.y += dir.y;
      if(entityCollision(E, gameState.player)) {
        gameState.player.entityHit();
        E.entityHit();
      }
      if(E.path.finished) {
        E.mode = EnemyMode.RETURN;
        E.path = E.returnPath();
      }
      E.shoot();
      break;
    }
    case EnemyMode.RETURN: {
      const dir = E.path.next();
      E.x += dir.x;
      E.y += dir.y;
      if(E.path.finished) {
        E.mode = EnemyMode.HOVER;
        if(E.alwaysAttack) {
          E.attack();
        }
      }
      break;
    }
    default:
    }
  };
  // TODO -- move this functionality to editor
  E.draw = (c) => {
    E.sprite.draw(c, E.x, E.y, E.width, E.height);
    if(gameState.mode === GameMode.EDIT) {
      if(E.squared) {
        c.strokeStyle = '#DDD';
        c.strokeRect(E.x, E.y, E.width, E.height);
      }
      c.strokeStyle = '#0F0';
      if(E.editorActive || gameState.activeEnemies.indexOf(E) !== -1) {
        c.beginPath();
        c.arc(E.x + E.width / 2, E.y + E.height / 2, 1.2 * (E.width / 2), 0, 2 * Math.PI);
        c.stroke();
        c.closePath();
      }
      let next = E.parent;
      while(next) {
        if(next.active) {
          c.beginPath();
          c.moveTo(E.x + E.width / 2, E.y + E.height / 2);
          c.lineTo(next.x + next.width / 2, next.y + next.height / 2);
          c.closePath();
          c.stroke();
          break;
        } else {
          next = next.parent;
        }
      }
    }
  };
  E.entityHit = (dmg) => {
    E.health -= dmg || 1;
    if(E.health <= 0) {
      playSound(sounds.enemyExp);
      const rand = Math.random();
      if(rand < 0.02) {
        gameState.powerups.push(powerupObjs[0].instantiate(E.x, E.y));
      } else if(rand < 0.05) {
        gameState.powerups.push(powerupObjs[1].instantiate(E.x, E.y));
      } else if(rand < 0.06) {
        gameState.powerups.push(powerupObjs[2].instantiate(E.x, E.y));
      }
      gameState.score += E.score;
      E.active = false;
      gameState.explosions.push(new Explosion(E.x, E.y, E.width, E.height));
      replaceActiveEnemy(E);
    }
  };
  return E;
}

const PlayerState = {
  NORMAL: 0,
  LEFT: 1,
  RIGHT: 2,
  DAMAGED: 3,
  DESTROYED: 4,
};

gameState.player = {
  color: '#00A',
  width: 36,
  height: 36,
  x: 0,
  y: 0,
  sprites: [],
  xVel: 0,
  yVel: 0,
  visible: true,
  blinks: 0,
  blinkNum: 0,
  blinkDur: 10,
  immobile: 0,
  lives: [],
  shots: [],
  numMissiles: 2,
  state: PlayerState.NORMAL,
  shielded: false,
  init(c) {
    this.x = c.width / 2;
    this.y = c.height - 36;
  },
  switchState(state) {
    if(this.state !== PlayerState.DAMAGED) {
      this.state = state;
    }
  },
  entityHit(dmg) {
    const damage = dmg || 1;
    if(this.blinks > 0) {
      return;
    }
    if(damage > 1) this.shielded = false;
    if(this.shielded) {
      this.shielded = false;
      return;
    }
    playSound(sounds.enemyExp);
    gameState.explosions.push(new Explosion(this.x, this.y, this.width, this.height));
    this.lives.pop();
    if(this.lives.length === 0) {
      this.state = PlayerState.DESTROYED;
      gameState.isOver = true;
      gameState.gameOverTimer = 15;
    } else {
      this.x = gameState.c.width / 2;
      this.y = gameState.c.height - 36;
      this.blink(3);
    }
  },
  shield() {
    if(this.shielded) {
      gameState.score += 500;
    }
    this.shielded = true;
  },
  blink(blinks) {
    this.blinks = blinks;
    this.immobile = 30;
  },
  update() {
    if(this.immobile > 0) {
      this.immobile -= 1;
    } else {
      if(keyhandler.ArrowLeft || keyhandler.KeyA) {
        this.xVel = -8;
        this.x -= 8;
        this.switchState(PlayerState.LEFT);
      } else if(keyhandler.ArrowRight || keyhandler.KeyD) {
        this.xVel = 8;
        this.x += 8;
        this.switchState(PlayerState.RIGHT);
      } else {
        this.xVel = 0;
        this.switchState(PlayerState.NORMAL);
      }
      if(keyhandler.ArrowUp || keyhandler.KeyW) {
        this.yVel = -8;
        this.y -= 8;
      } else if(keyhandler.ArrowDown || keyhandler.KeyS) {
        this.yVel = 8;
        this.y += 8;
      } else {
        this.yVel = 0;
      }
      if(gameState.shotTimer > 10) {
        if(keyhandler.Space) {
          playSound(sounds.shot);
          gameState.shotTimer = 0;
          this.shots.push(Shot({
            speed: -10,
            x: this.x + (this.width / 2),
            y: this.y,
            sprites: sprites.playerShot,
          }));
        }
        if(keyhandler.Shift() && this.numMissiles > 0) {
          gameState.shotTimer = 0;
          this.shots.push(new Missile(this.x, this.y));
          this.numMissiles -= 1;
        }
      }
    }
    this.x = clamp(this.x, 0, gameState.c.width - this.width);
    this.y = clamp(this.y, gameState.c.boundary, gameState.c.height - this.height);
    if(this.blinks > 0) {
      this.blinkNum += 1;
      if(this.blinkNum >= this.blinkDur) {
        this.visible = !this.visible;
        if(this.visible) {
          this.blinks -= 1;
        }
        this.blinkNum = 0;
      }
    }
  },
  draw(c) {
    if(this.state !== PlayerState.DESTROYED && this.visible && !gameState.isOver) {
      this.sprites[this.state].draw(c, this.x, this.y);
      if(this.shielded) {
        sprites.shield.draw(c, this.x - 6, this.y - 8);
      }
    }
  },
  setupLives(c, lives) {
    this.blink(3);
    for(let i = 0; i < lives; i += 1) {
      this.lives.push(Life({
        sprite: sprites.playerLife,
        x: i * (this.width / 2) + (i + 1) * 10,
        y: c.height - (this.height / 2 + 5),
      }));
    }
  },
};

function Powerup(sprite, x, y, w, h, hitCallback) {
  this.sprite = sprite;
  this.x = x;
  this.y = y;
  this.width = w;
  this.height = h;
  this.radius = Math.sqrt(2) * (w / 2);
  this.hitCallback = hitCallback;
  this.active = true;
  const self = this;
  this.update = () => {
    self.y += 4;
    if(self.y > gameState.c.height) {
      self.active = false;
    } else if(entityCollision(self, gameState.player)) {
      self.hitCallback();
      self.active = false;
    }
  };
  this.draw = (c) => {
    self.sprite.draw(c, self.x, self.y, self.width, self.height);
    c.beginPath();
    c.arc(self.x + self.radius / 1.5, self.y + self.radius / 1.5, self.radius, 0, 2 * Math.PI);
    c.strokeStyle = '#DDD';
    c.stroke();
    c.closePath();
  };
  return this;
}

function MissilePowerup() {
  this.width = 20; this.height = 20;
  const self = this;
  this.hitCallback = () => {
    gameState.player.numMissiles += 1;
  };
  this.instantiate = (x, y) => (
    new Powerup(sprites.missile, x, y, self.width, self.height, self.hitCallback)
  );
  return this;
}

function addLife(x, y) {
  life = Life({ sprite: sprites.playerLife, x, y });
  gameState.player.lives.push(life);
  const xMul = gameState.player.lives.length - 1;
  const lifeX = xMul * (gameState.player.width / 2) + (xMul + 1) * 10;
  const endP = new Point(lifeX, gameState.c.height - (gameState.player.height / 2 + 5));
  life.path = new PointPath([new Point(x, y), endP], [15]);
}

function LifePowerup() {
  this.width = 20; this.height = 20;
  const self = this;
  this.hitCallback = () => {
    addLife(self.x, self.y);
  };
  this.instantiate = (x, y) => {
    self.powerup = new Powerup(sprites.playerLife, x, y, self.width, self.height, self.hitCallback, self.newUpdateFn);
    return self.powerup;
  };
  return this;
}

function ShieldPowerup() {
  this.width = 20; this.height = 20;
  const self = this;
  this.hitCallback = () => {
    gameState.player.shield();
  };
  this.instantiate = (x, y) => (
    new Powerup(sprites.shieldPowerup, x, y, self.width, self.height, self.hitCallback)
  );
  return this;
}

function pointInRect(px, py, x, y, w, h) {
  return px > x && px < x + w && py > y && py < y + h;
}

function Button(c, text, x, y, size, font, fontColor, _color, _hoverColor) {
  this.font = font || '20px Arial Black';
  this.size = size || text.size(this.font);
  this.text = text;
  this.x = x;
  this.y = y;
  this.width = this.size[0] + 15;
  this.height = this.size[1] + 12;
  this.left = this.x - 10;
  this.top = this.y;
  this.fontColor = fontColor || '#000';
  // this.color = color || '6e898a';
  // this.hoverColor = hoverColor || '88babb';
  this.color = 'rgb(110,137,138)';
  this.hoverColor = 'rgb(136,186,187)';
  this.mouseOver = false;
  this.active = true;
  const self = this;
  this.draw = () => {
    if(self.mouseOver) {
      c.fillStyle = self.hoverColor;
    } else {
      c.fillStyle = self.color;
    }
    c.lineWidth = 1;
    c.fillRect(self.left, self.top, self.width, self.height);
    c.strokeStyle = '#000';
    c.strokeRect(self.left, self.top, self.width, self.height);
    c.font = self.font;
    c.fillStyle = self.fontColor;
    c.fillText(self.text, self.x - 5, self.y + self.height / 1.5);
  };
  this.hover = (px, py) => {
    self.mouseOver = pointInRect(px, py, self.left, self.top, self.width, self.height);
  };
  this.click = (px, py) => {
    if(pointInRect(px, py, self.left, self.top, self.width, self.height) && self.clickListener) {
      self.clickListener();
    }
  };
  this.setClickListener = (listener) => {
    self.clickListener = listener;
  };
  return this;
}

function ImageButton(c, image, clickImage, x, y, w, h) {
  this.image = image;
  this.clickImage = clickImage;
  this.x = x;
  this.y = y;
  this.width = w;
  this.height = h;
  this.off = true;
  this.active = true;
  const self = this;
  this.draw = (ctx) => {
    if(self.off) {
      if(self.image.loaded) {
        self.image.draw(ctx, self.x, self.y, self.width, self.height);
      }
    } else if(self.clickImage.loaded) {
      self.clickImage.draw(ctx, self.x, self.y, self.width, self.height);
    }
  };
  this.hover = (px, py) => {
    self.mouseOver = pointInRect(px, py, self.x, self.y, self.width, self.height);
  };
  this.click = (px, py) => {
    if(pointInRect(px, py, self.x, self.y, self.width, self.height) && self.clickListener) {
      self.off = !self.off;
      self.clickListener();
      c.clearRect(self.x, self.y, self.width, self.height);
      self.draw(c);
    }
  };
  this.setClickListener = (listener) => {
    self.clickListener = listener;
  };
  return this;
}

/* A vertical or horizontal slider with a label and optional callback for when the value changes
   by step. A step of 0 means the slider is continuous */
function Slider(c, label, units, x, y, width, height, min, max, step, horizontal, changeListener) {
  this.label = label;
  this.units = units;
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.xKnob = x;
  this.yKnob = horizontal ? y + 20 : y;
  this.step = step;
  this.min = min;
  this.max = max;
  this.val = min;
  this.displayVal = min;
  this.horizontal = horizontal;
  this.radius = (horizontal ? height : width) / 2;
  this.changeListener = changeListener;
  this.clicked = false;
  this.font = '14px Arial';
  c.font = this.font;
  this.labelSize = c.measureText(label);
  this.unitsSize = c.measureText(`00.000 ${units}`);
  const self = this;
  this.getVal = (pos, minVal, length) => (
    (self.max - self.min) * ((pos - minVal) / length) + self.min
  );
  this.move = (xDiff, yDiff) => {
    self.setPos(self.x + xDiff, self.y + yDiff);
  };
  this.setPos = (xPos, yPos) => {
    self.x = xPos;
    self.y = yPos;
    if(self.horizontal) {
      self.yKnob = yPos + 20;
    } else {
      self.xKnob = xPos;
    }
    self.setToVal(self.val);
  };
  this.valueFn = () => {
    const value = self.val;
    return () => value;
  };
  this.updateDisplayVal = () => {
    if(self.step === 0) {
      self.displayVal = self.val;
    } else {
      const floor = self.step * Math.floor((self.val - self.min) / self.step);
      self.displayVal = (self.val - floor > self.step / 2) ? floor + self.step : floor;
    }
  };
  this.setToVal = (val) => {
    if(val >= self.min && val <= self.max) {
      if(self.horizontal) {
        self.xKnob = self.width * ((val - self.min) / (self.max - self.min)) + self.x;
      } else {
        self.yKnob = self.height * ((val - self.min) / (self.max - self.min)) + self.height;
      }
      self.val = val;
      if(self.changeListener) {
        self.changeListener(val);
      }
      self.updateDisplayVal();
    }
  };
  this.slide = (xDiff, yDiff) => {
    if(horizontal) {
      self.xKnob += xDiff;
      self.xKnob = clamp(self.xKnob, self.x, self.x + self.width);
      self.val = self.getVal(self.xKnob, self.x, self.width);
    } else {
      self.yKnob += yDiff;
      self.yKnob = clamp(self.yKnob, self.y, self.y + self.height);
      self.val = self.getVal(self.yKnob, self.y, self.height);
    }
    self.updateDisplayVal();
    if(self.changeListener) {
      self.changeListener(self.displayVal);
    }
  };
  this.hit = (xPos, yPos) => {
    self.clicked = x > self.xKnob - self.radius && xPos < self.xKnob + self.radius
      && yPos > self.yKnob - self.radius && yPos < self.yKnob + self.radius;
    return self.clicked;
  };
  this.draw = (ctx) => {
    ctx.beginPath();
    ctx.lineWidth = self.height / 4;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#05F';
    ctx.moveTo(self.x, self.y + 20);
    if(self.horizontal) {
      ctx.lineTo(self.x + self.width, self.y + 20);
    } else {
      ctx.lineTo(self.x, self.y + self.height);
    }
    ctx.closePath();
    ctx.stroke();
    ctx.beginPath();
    ctx.fillStyle = '#000';
    ctx.arc(self.xKnob, self.yKnob, self.radius + (self.clicked ? 1.5 : 0), 0, 2 * Math.PI);
    ctx.fillStyle = self.color;
    ctx.fill();
    ctx.closePath();
    ctx.font = self.font;
    const valStr = `${self.displayVal.toFixed(3)} ${self.units}`;
    if(self.horizontal) {
      const xMid = self.x + self.width / 2;
      ctx.fillText(self.label, xMid - self.labelSize.width / 2, self.y);
      ctx.fillText(valStr, xMid - self.unitsSize.width / 2, self.y + 13);
    } else {
      ctx.fillText(self.label, self.x + 10, self.y + 10);
      ctx.fillText(valStr, self.x + 10, self.y + 25);
    }
  };
  return this;
}

powerupObjs = [new MissilePowerup(), new ShieldPowerup(), new LifePowerup()];

export {
  Life, Mine, Laser, Missile, Shot, Enemy, EnemyMode, Explosion,
  clearEntities, playSound,
  entityCollision,
  Button, ImageButton, Slider,
  MissilePowerup, ShieldPowerup, LifePowerup,
};
