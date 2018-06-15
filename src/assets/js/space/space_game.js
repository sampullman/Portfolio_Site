
import { mines, setMines, enemyShots, setEnemyShots, enemies, setEnemies, enemyData,
    enemyObjList, enemy1Obj, enemy2Obj, enemy3Obj, enemy4Obj,enemy5Obj, enemy6Obj, enemy7Obj, enemy8Obj } from './space_enemies.js';

import { setupEditor, editMouseMove, editMouseClick, editMouseUp, editMouseDown, stopCustom } from './space_editor.js';
import { player, setExplosions, Sound, playSound, Life, Button, Stars, ImageButton,
    clearEntities, explosions } from './space_objects.js';
import { Point, PointPath } from './space_paths.js';

import { gameState, GameMode } from './game_state.js';
import { worlds, activeEnemies } from './space_levels.js';
import { findPos } from '../util.js';
import { initHighScores } from './high_scores.js';
import { Sprite } from '../game/sprite.js';

export { loadGame, startGame, pause, resume };

/* eslint-disable no-unused-vars */
var csrftoken;

var C_WIDTH = 480;
var C_HEIGHT = 560;

var BOUNDARY = C_HEIGHT - 200;

var FPS = 30;
var c;
var saved=false;
/* eslint-disable no-unused-vars */
var cookieExpiry = new Date(2022, 1, 1);
var gameOverTimer = 0;
var paused = false;
var error = '';

var shotW = 5;
var shotH = 15;
var life, playerLife;
/* eslint-disable no-unused-vars */
var shotTimer = 0;
var worldInd = 0;
var levelInd = 0;
var world;
var explosionSprites = [];
var mineSprites = [];
var starSprite, starCollection;

/* eslint-disable no-unused-vars */
var playerShot, missile, shieldPowerupSprite, enemyShot;

var powerups = [];

var pauseSprite, playSprite, soundOnSprite, soundOffSprite;

var loadedEnemies = 0;
var xWander = 0;
var xWanderMin = -10;
var xWanderMax = 10;
var xWanderSpeed = 0.2;

function loadSprites() {
    var w = player.width;
    var h = player.height;
    player.sprites = [Sprite('631wm7d11mdr3mj/2uVRXGxf7A/portfolio/static/images/space_sprites/player.png', w, h), Sprite('631wm7d11mdr3mj/CViMOtl02D/portfolio/static/images/space_sprites/playerLeft.png', w, h), Sprite('631wm7d11mdr3mj/MqXFAiIDw6/portfolio/static/images/space_sprites/playerRight.png', w, h)];
    enemy1Obj.sprite = Sprite('631wm7d11mdr3mj/7oPa2yNaIB/portfolio/static/images/space_sprites/enemy1.png', enemyData.width, enemyData.height, drawEnemyScores);
    enemy2Obj.sprite = Sprite('631wm7d11mdr3mj/nTAY8QygYM/portfolio/static/images/space_sprites/enemy2.png', enemyData.width, enemyData.height, drawEnemyScores);
    enemy3Obj.sprite = Sprite('631wm7d11mdr3mj/ok-JoalkfC/portfolio/static/images/space_sprites/enemy3.png', enemyData.width, enemyData.height, drawEnemyScores);
    enemy4Obj.sprite = Sprite('631wm7d11mdr3mj/xK3PxxAch8/portfolio/static/images/space_sprites/enemy4.png', enemyData.width, enemyData.height, drawEnemyScores);
    enemy5Obj.sprite = Sprite('631wm7d11mdr3mj/qQ5Kzklhyy/portfolio/static/images/space_sprites/enemy5.png', enemyData.width * 2, enemyData.height * 2, drawEnemyScores);
    enemy6Obj.sprite = Sprite('631wm7d11mdr3mj/6roKA0hqDT/portfolio/static/images/space_sprites/enemy6.png', enemyData.width, enemyData.height, drawEnemyScores);
    enemy7Obj.sprite = Sprite('631wm7d11mdr3mj/8-8aF0Hgmf/portfolio/static/images/space_sprites/enemy7.png', enemyData.width, enemyData.height, drawEnemyScores);
    enemy8Obj.sprite = Sprite('631wm7d11mdr3mj/sahm-t_RnK/portfolio/static/images/space_sprites/enemy8.png', enemyData.width * 3, enemyData.height, drawEnemyScores);
    playerShot = [Sprite('631wm7d11mdr3mj/ikWk5YzfJd/portfolio/static/images/space_sprites/laserRed.png', shotW, shotH),
        Sprite('631wm7d11mdr3mj/JU3cMwxn1o/portfolio/static/images/space_sprites/laserRedShot.png', 28, 28)];
    enemyShot = [Sprite('631wm7d11mdr3mj/LX6Dm97mS3/portfolio/static/images/space_sprites/laserGreen.png', shotW, shotH),
        Sprite('631wm7d11mdr3mj/r2rh_AfaRE/portfolio/static/images/space_sprites/laserGreenShot.png', 28, 28)];
    playerLife = Sprite('631wm7d11mdr3mj/z3QpEUH-QA/portfolio/static/images/space_sprites/life.png', w / 2, h / 2);
    explosionSprites.push(Sprite('631wm7d11mdr3mj/8HMg2jgeDZ/portfolio/static/images/space_sprites/explosion1.png', enemyData.width, enemyData.height));
    explosionSprites.push(Sprite('631wm7d11mdr3mj/NnRsbw5M8i/portfolio/static/images/space_sprites/explosion2.png', enemyData.width, enemyData.height));
    explosionSprites.push(Sprite('631wm7d11mdr3mj/PXxwqQ73xF/portfolio/static/images/space_sprites/explosion3.png', enemyData.width, enemyData.height));
    explosionSprites.push(Sprite('631wm7d11mdr3mj/_LJddbHSXL/portfolio/static/images/space_sprites/explosion4.png', enemyData.width, enemyData.height));
    pauseSprite = Sprite('631wm7d11mdr3mj/PjnX4rAH7y/portfolio/static/images/space_sprites/pause.png', 32, 32, drawButtons);
    playSprite = Sprite('631wm7d11mdr3mj/cc7mbxDjlT/portfolio/static/images/space_sprites/play.png', 32, 32, drawButtons);
    soundOnSprite = Sprite('631wm7d11mdr3mj/RaJHuLjaHG/portfolio/static/images/space_sprites/sound_on.png', 32, 32, drawButtons);
    soundOffSprite = Sprite('631wm7d11mdr3mj/Ih0P0EL4Id/portfolio/static/images/space_sprites/sound_off.png', 32, 32, drawButtons);
    shieldSprite = Sprite('631wm7d11mdr3mj/UslOP-1wz2/portfolio/static/images/space_sprites/shield.png', w + 12, h + 5);
    shieldPowerupSprite = Sprite('631wm7d11mdr3mj/E46JLd7fY2/portfolio/static/images/space_sprites/shieldPowerup.png', 16, 16);
    missile = Sprite('631wm7d11mdr3mj/eCvEneLNME/portfolio/static/images/space_sprites/missile.png', w / 1.25, h);
    mineSprites.push(Sprite('631wm7d11mdr3mj/6rCVFvacpH/portfolio/static/images/space_sprites/mine1.png', 28, 28));
    mineSprites.push(Sprite('631wm7d11mdr3mj/HYtZLisfJZ/portfolio/static/images/space_sprites/mine2.png', 28, 28));
    enemy9Obj.sprite = Sprite('631wm7d11mdr3mj/Hjk8fwkK-A/portfolio/static/images/space_sprites/enemy9.png', enemyData.width * 3, enemyData.height * 3);
    starSprite = Sprite('631wm7d11mdr3mj/4uGpI1uGwu/portfolio/static/images/space_sprites/star.png', 16, 16, initStars);
    sounds.shot = Sound([
        'https://dl.dropbox.com/sh/631wm7d11mdr3mj/exIW7e0MTO/portfolio/static/sounds/shot.mp3',
        'https://dl.dropbox.com/sh/631wm7d11mdr3mj/E-xBn5g2zL/portfolio/static/sounds/shot.ogg'
    ]);
    sounds.enemyShot = Sound([
        'https://dl.dropbox.com/sh/631wm7d11mdr3mj/kB9IQJutEx/portfolio/static/sounds/enemy_shot.mp3',
        'https://dl.dropbox.com/sh/631wm7d11mdr3mj/_-RTp20zpM/portfolio/static/sounds/enemy_shot.ogg'
    ]);
    sounds.enemyExp = Sound([
        'https://dl.dropbox.com/sh/631wm7d11mdr3mj/M2luGqD1KV/portfolio/static/sounds/enemy_exp.mp3',
        'https://dl.dropbox.com/sh/631wm7d11mdr3mj/hnKY7lllql/portfolio/static/sounds/enemy_exp.ogg'
    ]);
    sounds.ambient = Sound([
        'https://dl.dropbox.com/sh/631wm7d11mdr3mj/cJ5oM2HoIl/portfolio/static/sounds/ambience.mp3']);
    sounds.laser = Sound([
        'https://dl.dropbox.com/sh/631wm7d11mdr3mj/H__6HLAZu7/portfolio/static/sounds/laser.mp3',
        'https://dl.dropbox.com/sh/631wm7d11mdr3mj/j0yUd4ncdf/portfolio/static/sounds/laser.ogg']);
}

function initStars() {
    starCollection = new Stars(c, starSprite, 5, 18, 0.2, 0.7, 50);
    for(var i = 0; i < 30; i++) {
        starCollection.add(Math.random() * C_WIDTH, Math.random() * C_HEIGHT);
    }
    drawEnemyScores();
}

function loadGame() {
    levels.init();
    var canvas = document.getElementById('canvas');
    c = canvas.getContext('2d');
    c.width = C_WIDTH;
    c.height = C_HEIGHT;
    c.boundary = BOUNDARY;
    canvas.mousemove(mouseMove);
    canvas.mousedown(mouseDown);
    canvas.mouseup(mouseUp);
    canvas.click(mouseClick);
    csrftoken = getCookie('csrftoken');
    setupAjax();
    initHighScores(highScorePosted);
    saved = getCookie('saved');
    loadSprites();
    canvas.focus();
    showStart();
    var userPause = new ImageButton(c, pauseSprite, playSprite, C_WIDTH - 28, 4, 24, 24);
    userPause.setClickListener(function() {
        paused ? resume() : pause();
    });
    gameState.buttons.push(userPause);
    var toggleSound = new ImageButton(c, soundOffSprite, soundOnSprite, C_WIDTH - 52, 6, 20, 20);
    toggleSound.setClickListener(function() {
        gameState.soundOn = !gameState.soundOn;
        if(!gameState.soundOn) {
            sounds.ambient.stop();
        } else {
            sounds.ambient.play();
        }
    });
    gameState.buttons.push(toggleSound);
}

function highScorePosted() {
    var rankText = 'Rank: ' + response.rank
    var s = rankText.size(c.font)
    c.fillText(rankText, C_WIDTH / 2 - s[0]/2, C_HEIGHT / 2 + 160);
}

function setCookie(key, value, expire) {
    expire = expire || new Date(2022, 1, 1);
}

function getCookie(key) {
    return key;
}

function save() {
    saved = true;
    setCookie('saved', true);
    setCookie('world', worldInd);
    setCookie('level', levelInd);
    setCookie('score', gameState.score);
    setCookie('lives', player.lives.length);
    // alert(worldInd+' '+levelInd+' '+score+' '+lives);
}

function load() {
    if(saved) {
        worldInd = getCookie('world');
        levelInd = getCookie('level');
        gameState.score = getCookie('score');
        var lives = getCookie('lives');
        player.setupLives(lives);
    }
}

/* eslint-disable no-unused-vars */
function addLife(x, y) {
    life = Life({sprite: playerLife, x: x, y: y});
    player.lives.push(life);
    var xMul = player.lives.length - 1;
    let lifeX = xMul * player.width / 2 + (xMul + 1) * 10;
    var endP = new Point(lifeX, C_HEIGHT - (player.height / 2 + 5));
    life.path = new PointPath([new Point(x, y), endP], [15]);
}

function restartGame() {
    gameState.isOver = false;
    gameState.score = 0;
    levelInd = 0;
    worldInd = 0;
    player.numMissiles = 2;
    clearEntities();
    player.setupLives(3);
    setupGame();
    startGame();
}

function continueGame() {
    gameState.isOver = false;
    load();
    clearEntities();
    setupGame();
    startGame();
}

function levelEditor() {
    gameState.isOver = false;
    clearEntities();
    player.visible = false;
    gameState.buttons = gameState.buttons.filter(function(b) { return b.active });
    setupEditor(c, draw, FPS, startGame, showStart);
}

function nextLevel() {
    clearEntities();
    setupGame();
    startGame();
}

function setupGame() {
    world = worlds[worldInd];
    gameState.level = world[levelInd];
    gameState.attackTimer = gameState.level.attack_freq(0);
    gameState.level.load();
}

function startGame() {
    // document.getElementById('canvas').focusout(pause);
    if(!paused) {
        gameState.eventId = setInterval(function() {
            update();
        }, 1000 / FPS);
    }
}

// TODO -- combine update/draw for efficiency?
function update() {
    player.update();
    // TODO -- combine shot iterations
    player.shots.forEach(function(shot) {
        shot.update();
        for(var i = 0; i < enemies.length; i++) {
            shot.hitEntity(enemies[i]);
        }
        mines.forEach(function(mine) { shot.hitEntity(mine) });
    });
    player.lives.forEach(function(life) {
        life.update();
    });
    player.shots = player.shots.filter(function(shot) {
        return shot.active;
    });
    powerups = powerups.filter(function(p) {
        p.update();
        return p.active;
    });
    setEnemyShots(enemyShots.filter(function(shot) {
        shot.update();
        shot.hitEntity(player);
        return shot.active;
    }));
    enemies.forEach(function(enemy) {
        enemy.update();
        if(enemyData.initEnemyCount >= enemies.length) {
            enemy.wander(xWanderSpeed);
        }
    });
    setEnemies(enemies.filter(function(enemy) {
        return enemy.active;
    }));
    setMines(mines.filter(function(mine) {
        mine.update();
        mine.hitEntity(player);
        return mine.active;
    }));
    xWander += xWanderSpeed;
    if(xWander > xWanderMax || xWander < xWanderMin) {
        xWanderSpeed *= -1;
    }
    setExplosions(explosions.filter(function(exp) {
        exp.update();
        return exp.active;
    }));
    starCollection.update(c);
    if(gameState.ttackTimer <= 0 && activeEnemies.length > 0) {
        var e = activeEnemies[Math.floor(Math.random() * activeEnemies.length)];
        e.attack();
        enemyData.numAttacks += 1;
        var freq = level.attack_freq(enemyData.numAttacks);
        gameState.attackTimer = Math.random() * freq + freq / 8;
    }
    if(enemies.length === 0) {
        levelWon();
        return;
    }
    error = activeEnemies.length;
    shotTimer += 1;
    gameState.attackTimer -= 1;
    draw();
}

function draw() {
    c.clearRect(0, 0, C_WIDTH, C_HEIGHT);
    starCollection.draw(c);
    drawButtons();
    player.draw(c);
    c.beginPath();
    c.moveTo(0, BOUNDARY);
    c.lineTo(C_WIDTH, BOUNDARY);
    c.lineWidth = 1;
    c.strokeStyle = '#999';
    c.stroke();
    player.shots.forEach(function(shot) {
        shot.draw(c);
    });
    powerups.forEach(function(p) {
        p.draw(c);
    });
    enemyShots.forEach(function(shot) {
        shot.draw(c);
    });
    enemies.forEach(function(enemy) {
        enemy.draw(c);
    });
    player.lives.forEach(function(life) {
        life.draw(c);
    });
    explosions.forEach(function(exp) {
        exp.draw(c);
    });
    mines.forEach(function(mine) {
        mine.draw(c);
    });
    c.font = '18px Arial';
    c.fillStyle = '#000';
    c.fillText('Level ' + worldInd + '-' + levelInd, 10, 18);
    c.fillText('Missiles: ' + player.numMissiles, C_WIDTH / 3, 18);
    c.fillText('Score: ' + score, C_WIDTH / 1.7, 18);
    debug(error);
    if(gameState.isOver) {
        gameOverTimer -= 1;
        if(gameOverTimer <= 0) gameOver(false);
    }
}

function drawButtons() {
    gameState.buttons.forEach(function(b) { b.draw(c) });
}

function showStart() {
    c.clearRect(0, 0, C_WIDTH, C_HEIGHT);
    c.fillStyle = '#000';
    c.font = '56px Verdana';
    var s = 'Xenophobia'.size(c.font);
    c.fillText('Xenophobia', C_WIDTH / 2 - s[0] / 2, C_HEIGHT / 6);
    c.font = '28px Arial';
    var s1 = 'Destroy the aliens, because'.size(c.font);
    c.fillText('Destroy the aliens, because', C_WIDTH / 2 - s1[0] / 2, C_HEIGHT / 4);
    var s2 = 'they are different from you.'.size(c.font);
    c.fillText('they are different from you.', C_WIDTH / 2 - s2[0] / 2, C_HEIGHT / 4 + s1[1]);
    c.font = '20px Arial Black';
    s1 = 'NEW GAME'.size(c.font);
    var b1, b2;
    if(saved) {
        b1 = new Button(c, 'NEW GAME', C_WIDTH / 2 - (s1[0] + 15), C_HEIGHT / 3, s1, c.font);
        s2 = 'CONTINUE'.size(c.font);
        b2 = new Button(c, 'CONTINUE', C_WIDTH / 2 + 15, C_HEIGHT / 3, s2, c.font);
        b2.setClickListener(function() {
            setInterval(function() { playSound(sounds.ambient) }, 4000);
            gameState.mode = GameMode.SINGLE;
            continueGame();
            this.active = false;
            b1.active = false;
            b3.active = false;
        });
        gameState.buttons.push(b2);
    } else {
        b1 = new Button(c, 'NEW GAME', C_WIDTH / 2 - s1[0] / 2, C_HEIGHT / 3, s1, c.font);
    }
    gameState.buttons.push(b1);
    b1.setClickListener(function() {
        setInterval(function() { playSound(sounds.ambient) }, 4000);
        if(b2) b2.active = false;
        b3.active = false;
        this.active = false;
        gameState.mode = GameMode.SINGLE;
        restartGame();
    });
    s2 = 'LEVEL EDITOR'.size(c.font);
    var b3 = new Button(c, 'LEVEL EDITOR', C_WIDTH / 2 - s2[0] / 2, C_HEIGHT / 3 + s1[1] + 25, s2, c.font);
    gameState.buttons.push(b3);
    b3.setClickListener(function() {
        setInterval(function() { playSound(sounds.ambient) }, 4000);
        b1.active = false;
        if(b2) b2.active = false;
        this.active = false;
        gameState.mode = GameMode.EDIT;
        levelEditor();
    });
    drawEnemyScores();
}

function drawEnemyScores() {
    if(starCollection) {
        starCollection.draw(c);
    }
    loadedEnemies += 1;
    var curY = C_HEIGHT / 2 + 60;
    var curX = 50;
    c.clearRect(0, curY - 20, C_WIDTH, C_HEIGHT - (curY - 20));
    c.font = '22px Arial';
    for(var i = 0; i < loadedEnemies; i++) {
        var e = enemyObjList[i];
        if(i === 4) {
            curX += C_WIDTH / 2;
            curY = C_HEIGHT / 2 + 60;
        }
        if(e) {
            e.sprite.draw(c, curX, curY);
            var h = e.sprite.height;
            c.fillText(' = ' + enemyObjList[i].score, curX + e.sprite.width + 5, curY + (h + 20) / 2);
        }
        curY += h + 20;
    }
    if(loadedEnemies >= enemyObjList.length) drawButtons();
}

function pause() {
    clearInterval(gameState.eventId);
    paused = true;
}

function resume() {
    paused = false;
    startGame();
}

function display(id, value) {
    document.getElementById(id).style.display = value;
}

function gameOver(won) {
    clearInterval(gameState.eventId);
    if(gameState.mode === GameMode.EDIT) {
        stopCustom(c);
        return;
    }
    c.fillStyle = '#000';
    c.font = '30px Arial Black';
    var s1;
    if(won) {
        s1 = 'You Win!'.size(c.font);
        c.fillText('You Win!', C_WIDTH / 2 - s1[0] / 2, C_HEIGHT / 2 + 20);
    } else {
        s1 = 'Game Over!'.size(c.font);
        c.fillText('Game Over!', C_WIDTH / 2 - s1[0] / 2, C_HEIGHT / 2 + 20);
    }
    c.font = '24px Arial';
    var s2 = 'Restart Game'.size(c.font);
    var b1 = new Button(c, 'Restart Game', C_WIDTH / 2 - (s2[0] + 15), C_HEIGHT / 2 + 20 + s2[1], s2);
    s2 = 'Restart Level'.size(c.font);
    var b2 = new Button(c, 'Replay Level', C_WIDTH / 2 + 15, C_HEIGHT / 2 + 20 + s2[1], s2);
    s1 = 'Submit High Score'.size(c.font);
    c.fillText('Submit High Score', C_WIDTH / 2 - s1[0] / 2, C_HEIGHT / 2 + 125);
    b1.setClickListener(function() {
        display('#submit_highscore', 'none');
        this.active = false; b2.active = false; restartGame();
    });
    b2.setClickListener(function() {
        display('#submit_highscore', 'none');
        this.active = false; b1.active = false; continueGame();
    });
    gameState.buttons.push(b1);
    if(!won) gameState.buttons.push(b2);
    drawButtons();
    display('#submit_highscore', 'block');
}

function levelWon() {
    clearInterval(gameState.eventId);
    if(gameState.mode === GameMode.EDIT) {
        stopCustom(c);
        return;
    }
    levelInd += 1;
    if(levelInd >= world.length) {
        worldInd += 1;
        if(worldInd >= worlds.length) {
            gameOver(true);
            return;
        }
        levelInd = 0;
    }
    nextLevel();
    save();
}

function mouseDown(e) {
    var canvasPos = findPos(this);
    var x = e.pageX - canvasPos.x;
    var y = e.pageY - canvasPos.y;
    if(gameState.mode === GameMode.EDIT) {
        editMouseDown(c, x, y);
    }
}

function mouseUp(e) {
    var canvasPos = findPos(this);
    var x = e.pageX - canvasPos.x;
    var y = e.pageY - canvasPos.y;
    if(gameState.mode === GameMode.EDIT) {
        editMouseUp(c, x, y);
    }
}

function mouseMove(e) {
    var canvasPos = findPos(this);
    var x = e.pageX - canvasPos.x;
    var y = e.pageY - canvasPos.y;
    gameState.buttons = buttons.filter(function(b) {
        if(!b.active) return false;
        b.hover(x, y);
        b.draw(c);
        return true;
    });
    if(gameState.mode === GameMode.EDIT) {
        editMouseMove(c, x, y);
    }
}

function mouseClick(e) {
    var canvasPos = findPos(this);
    var x = e.pageX - canvasPos.x;
    var y = e.pageY - canvasPos.y;
    gameState.buttons.forEach(function(b) {
        b.click(x, y);
    });
    gameState.buttons = gameState.buttons.filter(function(b) {
        return b.active;
    });
    if(gameState.mode === GameMode.EDIT) editMouseClick(x, y);
}

function debug(msg) {
    c.font = '16px Arial';
    c.fillText(msg, 0, C_HEIGHT / 1.5);
}

/* eslint-disable no-unused-vars */
function replaceActiveEnemy(E) {
    var ind = activeEnemies.indexOf(E);
    if(ind === -1) return;
    while(ind !== -1) {
        activeEnemies.splice(ind, 1);
        ind = activeEnemies.indexOf(E);
    }
    var seen = [];
    while(true) {
        if(E) {
            if(seen.indexOf(E) !== -1) {
                return;
            } else if(!E.active || activeEnemies.indexOf(E) !== -1) {
                seen.push(E);
                E = E.parent;
            } else {
                break;
            }
        } else {
            return;
        }
    }
    activeEnemies.push(E);
}
