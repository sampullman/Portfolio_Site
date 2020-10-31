/* Good day to you, sir. C stands for Canvas. */

import { player, Powerups, Ball, Block, SuperBlock } from './objects.js';
import { Sprite } from '../game/sprite.js';
import { clamp, keyhandler } from '../util.js';

const C_WIDTH = 400;
const C_HEIGHT = 300;
const bodySize = C_WIDTH / 5;
const legWidth = 0.22 * bodySize;
const legHeight = 0.35 * bodySize;
const armWidth = 0.265 * bodySize;
const armHeight = 0.85 * bodySize;
const headWidth = bodySize;
const headHeight = 0.485 * bodySize;
const headLength = (C_WIDTH / 2) - (bodySize / 2);
let blockWidth;
let blockHeight;
let legSprites;
let armSprites;
let headSprites;
let bodySprites;
let sprites;
let superSprites;

const FPS = 30;
let domCanvas;
let c;
let gameEventId;
let drawEnabled = true;
let startGame;

/* eslint-disable no-unused-vars */
let error = '';

let frameCount = 0;

let balls = [];
let blocks = [];

const GameMode = {
  INIT: 0,
  ON: 1,
  PAUSED: 2,
  BOSS: 3,
  WIN: 4,
  LOSE: 5,
};

let mode = GameMode.INIT;

/* eslint-disable no-unused-vars */
function countFrames() {
  error = frameCount.toString();
  frameCount = 0;
}

function initBlocks() {
  let x = 0;
  let y = 0;
  for(let i = 0; i < sprites.length; i += 1) {
    for(let j = 0; j < 12; j += 1) {
      if(i % 2 === 1 && (j === 1 || j === 5 || j === 9)) {
        blocks.push(SuperBlock({
          x,
          y,
          powerup: Powerups.EXTRA_BALL,
          width: 2 * blockWidth,
          height: blockHeight,
          sprites: superSprites,
        }));
        x += 2 * blockWidth;
        j += 1;
      } else {
        blocks.push(Block({
          x,
          y,
          powerup: Powerups.BALL_SIZE,
          width: blockWidth,
          height: blockHeight,
          sprite: sprites[i],
        }));
        x += blockWidth;
      }
    }
    x = 0;
    y += blockHeight;
  }
}

function setupBoss() {
  mode = GameMode.BOSS;
  blocks.push(SuperBlock({
    x: headLength,
    y: headHeight,
    width: bodySize,
    height: bodySize,
    sprites: bodySprites,
  }));
  blocks.push(SuperBlock({
    x: headLength,
    y: 0,
    width: headWidth,
    height: headHeight,
    sprites: headSprites,
  }));
  blocks.push(SuperBlock({
    x: headLength - armWidth,
    y: headHeight - (armHeight / 12),
    width: armWidth,
    height: armHeight,
    sprites: armSprites,
  }));
  blocks.push(SuperBlock({
    x: headLength + bodySize,
    y: headHeight - (armHeight / 12),
    width: armWidth,
    height: armHeight,
    sprites: armSprites,
  }));
  blocks.push(SuperBlock({
    x: (C_WIDTH / 2) - (bodySize / 3),
    y: headHeight + bodySize,
    width: legWidth,
    height: legHeight,
    sprites: legSprites,
  }));
  blocks.push(SuperBlock({
    x: (C_WIDTH / 2) + (bodySize / 9),
    y: headHeight + bodySize,
    width: legWidth,
    height: legHeight,
    sprites: legSprites,
  }));
}

function draw() {
  if(drawEnabled) {
    c.clearRect(0, 0, C_WIDTH, C_HEIGHT);
    player.draw(c);
    balls.forEach((ball) => {
      ball.draw(c);
    });
    blocks.forEach((block) => {
      block.draw(c);
    });
  }
  frameCount += 1;
  // debug(error);
}

function setupGame() {
  balls.push(Ball({
    speed: -6,
    x: player.x + (player.width / 2),
    y: player.y,
  }));
  initBlocks();
}

function drawStart(sprite) {
  if(!sprite) {
    console.log('Sprite load fail');
  } else {
    setupGame();
    domCanvas.onclick = startGame;
    draw();
    c.fillStyle = '#000';
    c.font = '30px RobotoBlack';
    c.fillText('Click To Start!', C_WIDTH / 4, C_HEIGHT / 1.5);
  }
}

function restartGame() {
  balls = [];
  blocks = [];
  setupGame();
  startGame();
}

function gameWon() {
  mode = GameMode.WIN;
  clearInterval(gameEventId);
  c.fillStyle = '#000';
  c.font = '30px RobotoBlack';
  c.fillText('You Win!', C_WIDTH / 3, C_HEIGHT / 2);
  c.font = '24px RobotoBlack';
  c.fillText('Click to replay', C_WIDTH / 3.2, (C_HEIGHT / 2) + 40);
  domCanvas.onclick = restartGame;
}

function gameOver() {
  clearInterval(gameEventId);
  domCanvas.onclick = restartGame;
  mode = GameMode.LOSE;
  c.fillStyle = '#000';
  c.font = '30px RobotoBlack';
  c.fillText('Game Over!', C_WIDTH / 3, C_HEIGHT / 1.5);
  c.font = '24px RobotoBlack';
  c.fillText('Click to replay', C_WIDTH / 3, (C_HEIGHT / 1.5) + 40);
}

/* eslint-disable no-unused-vars */
function debug(msg) {
  c.font = '16px RobotoBlack';
  c.fillText(msg, 0, C_HEIGHT / 1.5);
}

function pauseGame() {
  if(mode === GameMode.ON || mode === GameMode.BOSS) {
    drawEnabled = false;
    mode = GameMode.PAUSED;
    clearInterval(gameEventId);
    domCanvas.onfocusout = null;
    domCanvas.onclick = startGame;
    keyhandler.stop();
    c.fillStyle = '#000';
    c.font = '28px RobotoBlack';
    c.fillText('Paused: Click to Resume', C_WIDTH / 7, C_HEIGHT / 2 - 20);
  }
}

function loadSprites() {
  Sprite.imageRoot = 'home_game/';
  legSprites = [Sprite('android-leg.png', legWidth, legHeight), Sprite('android-leg1.png', legWidth, legHeight)];
  armSprites = [Sprite('android-arm.png', armWidth, armHeight), Sprite('android-arm1.png', armWidth, armHeight)];
  headSprites = [Sprite('android-head.png', headWidth, headHeight), Sprite('android-head1.png', headWidth, headHeight), Sprite('android-head2.png', headWidth, headHeight)];
  bodySprites = [
    Sprite('android-body.png', bodySize, bodySize), Sprite('android-body1.png', bodySize, bodySize),
    Sprite('android-body2.png', bodySize, bodySize), Sprite('android-body3.png', bodySize, bodySize)];
  blockWidth = C_WIDTH / 12;
  blockHeight = C_HEIGHT / 10;
  sprites = [Sprite('microsoft.png', blockWidth, blockHeight), Sprite('python.png', blockWidth, blockHeight), Sprite('github.png', blockWidth, blockHeight),
    Sprite('apple.png', blockWidth, blockHeight), Sprite('java.png', blockWidth, blockHeight)];
  superSprites = [Sprite('unix.png', 2 * blockWidth, blockHeight), Sprite('unix1.png', 2 * blockWidth, blockHeight), Sprite('unix2.png', 2 * blockWidth, blockHeight)];
  player.sprite = Sprite('player.png', 72, 12, drawStart);
  window.player = player;
  window.keyhandler = keyhandler;
}

function loadGame() {
  domCanvas = document.getElementById('canvas');
  c = domCanvas.getContext('2d');
  c.width = C_WIDTH;
  c.height = C_HEIGHT;
  player.init(C_WIDTH / 2, C_HEIGHT - 16);

  if(mode === GameMode.INIT) {
    loadSprites();
  } else if(mode === GameMode.PAUSED) {
    mode = GameMode.ON;
    pauseGame();
  } else if(mode === GameMode.WIN) {
    gameWon();
  } else if(mode === GameMode.LOSE) {
    gameOver();
  }
}

function update() {
  if(keyhandler.ArrowLeft) {
    player.x -= 8;
  } else if(keyhandler.ArrowRight) {
    player.x += 8;
  }
  player.x = clamp(player.x, 0, C_WIDTH - player.width);
  balls.forEach((ball) => {
    ball.update(c);
  });
  balls.forEach((ball) => {
    for(let i = 0; i < blocks.length; i += 1) {
      const block = blocks[i];
      if(ball.hitBlock(block)) {
        block.handleHit(balls, ball);
        break;
      }
    }
  });
  blocks = blocks.filter(block => block.active);
  balls = balls.filter(ball => ball.active);
  if(blocks.length === 0) {
    if(mode === GameMode.ON) {
      setupBoss();
    } else {
      drawEnabled = false;
      gameWon();
    }
  }
  if(balls.length === 0) {
    drawEnabled = false;
    gameOver();
  }
}

startGame = () => {
  keyhandler.start();
  domCanvas.onclick = null;
  domCanvas.onfocusout = pauseGame;
  mode = GameMode.ON;
  drawEnabled = true;
  gameEventId = setInterval(() => {
    update();
    draw();
  }, 1000 / FPS);
};

export { loadGame, pauseGame };
