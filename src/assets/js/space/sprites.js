
import {
  Enemy1Obj,
  Enemy2Obj,
  Enemy3Obj,
  Enemy4Obj,
  Enemy5Obj,
  Enemy6Obj,
  Enemy7Obj,
  Enemy8Obj,
  Enemy9Obj,
} from './space_enemies';
import { Sprite } from '../game/sprite';
import { shotW, shotH, gameState } from './space_state';

const { sprites, sounds } = gameState;

function Sound(src) {
  this.sound = document.createElement('audio');
  this.sound.src = src;
  this.sound.setAttribute('preload', 'auto');
  this.sound.setAttribute('controls', 'none');
  this.sound.style.display = 'none';
  document.body.appendChild(this.sound);
  this.play = () => {
    this.sound.play();
  };
  this.stop = () => {
    this.sound.pause();
  };
}

function Stars(c, sprite, minSize, maxSize, minSpeed, maxSpeed, freq) {
  this.stars = [];
  this.timer = 0;
  this.sprite = sprite;
  this.minSize = minSize;
  this.maxWidth = maxSize - minSize;
  this.minSpeed = minSpeed;
  this.maxSpeedWidth = maxSpeed - minSpeed;
  this.freq = freq;
  const self = this;
  this.add = (x, y) => {
    const star = [];
    star.push(x || Math.random() * c.width);
    star.push(y || 0);
    star.push(Math.random() * (self.maxWidth) + self.minSize);
    star.push(Math.random() * (self.maxSpeedWidth) + self.minSpeed);
    self.stars.push(star);
  };
  this.update = (ctx) => {
    self.timer -= 1;
    if(self.timer <= 0) {
      self.add();
      self.timer = Math.random() * freq + freq / 2;
    }
    self.stars = self.stars.filter((star) => {
      star[1] += star[3];
      return star[1] < ctx.height;
    });
  };
  this.draw = (ctx) => {
    const drawSprite = self.sprite;
    self.stars.forEach((star) => {
      drawSprite.draw(ctx, star[0], star[1], star[2], star[2]);
    });
  };
  return this;
}

function loadSprites(c, player, enemyLoadFn, buttonLoadFn) {
  function initStars() {
    sprites.stars = new Stars(c, sprites.star, 5, 18, 0.2, 0.7, 50);
    for(let i = 0; i < 30; i += 1) {
      sprites.stars.add(Math.random() * c.width, Math.random() * c.height);
    }
    enemyLoadFn();
  }
  const w = player.width;
  const h = player.height;
  Sprite.imageRoot = '/static/img/space_game/';
  player.sprites = [Sprite('player.png', w, h), Sprite('playerLeft.png', w, h), Sprite('playerRight.png', w, h)];
  Enemy1Obj.sprite = Sprite('enemy1.png', gameState.enemyData.width, gameState.enemyData.height, enemyLoadFn);
  Enemy2Obj.sprite = Sprite('enemy2.png', gameState.enemyData.width, gameState.enemyData.height, enemyLoadFn);
  Enemy3Obj.sprite = Sprite('enemy3.png', gameState.enemyData.width, gameState.enemyData.height, enemyLoadFn);
  Enemy4Obj.sprite = Sprite('enemy4.png', gameState.enemyData.width, gameState.enemyData.height, enemyLoadFn);
  Enemy5Obj.sprite = Sprite('enemy5.png', gameState.enemyData.width * 2, gameState.enemyData.height * 2, enemyLoadFn);
  Enemy6Obj.sprite = Sprite('enemy6.png', gameState.enemyData.width, gameState.enemyData.height, enemyLoadFn);
  Enemy7Obj.sprite = Sprite('enemy7.png', gameState.enemyData.width, gameState.enemyData.height, enemyLoadFn);
  Enemy8Obj.sprite = Sprite('enemy8.png', gameState.enemyData.width * 3, gameState.enemyData.height, enemyLoadFn);
  sprites.playerShot = [Sprite('laserRed.png', shotW, shotH),
    Sprite('laserRedShot.png', 28, 28)];
  sprites.enemyShot = [Sprite('laserGreen.png', shotW, shotH),
    Sprite('laserGreenShot.png', 28, 28)];
  sprites.playerLife = Sprite('life.png', w / 2, h / 2);
  sprites.explosions.push(Sprite('explosion1.png', gameState.enemyData.width, gameState.enemyData.height));
  sprites.explosions.push(Sprite('explosion2.png', gameState.enemyData.width, gameState.enemyData.height));
  sprites.explosions.push(Sprite('explosion3.png', gameState.enemyData.width, gameState.enemyData.height));
  sprites.explosions.push(Sprite('explosion4.png', gameState.enemyData.width, gameState.enemyData.height));
  sprites.pause = Sprite('pause.png', 32, 32, buttonLoadFn);
  sprites.play = Sprite('play.png', 32, 32, buttonLoadFn);
  sprites.soundOn = Sprite('sound_on.png', 32, 32, buttonLoadFn);
  sprites.soundOff = Sprite('sound_off.png', 32, 32, buttonLoadFn);
  sprites.shield = Sprite('shield.png', w + 12, h + 5);
  sprites.shieldPowerup = Sprite('shieldPowerup.png', 16, 16);
  sprites.missile = Sprite('missile.png', w / 1.25, h);
  sprites.mines.push(Sprite('mine1.png', 28, 28));
  sprites.mines.push(Sprite('mine2.png', 28, 28));
  Enemy9Obj.sprite = Sprite('enemy9.png', gameState.enemyData.width * 3, gameState.enemyData.height * 3);
  sprites.star = Sprite('star.png', 16, 16, initStars);
  sounds.shot = new Sound([
    '/static/sounds/shot.mp3',
    '/static/sounds/shot.ogg',
  ]);
  sounds.enemyShot = new Sound([
    '/static/sounds/enemy_shot.mp3',
    '/static/sounds/enemy_shot.ogg',
  ]);
  sounds.enemyExp = new Sound([
    '/static/sounds/enemy_exp.mp3',
    '/static/sounds/enemy_exp.ogg',
  ]);
  sounds.ambient = new Sound(['/static/sounds/ambience.mp3']);
  sounds.laser = new Sound([
    '/static/sounds/laser.mp3',
    '/static/sounds/laser.ogg',
  ]);
}

export { loadSprites }; // eslint-disable-line
