
import { mines, setMines, enemyShots, setEnemyShots, enemies, setEnemies, enemyData, enemyObjList, xWanderMax } from './space_enemies.js';

import { setupEditor, editMouseMove, editMouseClick, editMouseUp, editMouseDown, stopCustom } from './space_editor.js';
import { player, setExplosions, powerups, setPowerups, playSound, Button, ImageButton,
    clearEntities, explosions } from './space_objects.js';

import { gameState, GameMode } from './game_state.js';
import { levels, worlds, activeEnemies } from './space_levels.js';
import { findPos, textSize } from '../util.js';
// import { initHighScores } from './high_scores.js';
import { sounds, sprites, loadSprites } from './sprites.js';

export { loadGame, startGame, pause, resume };

/* eslint-disable no-unused-vars */
var csrftoken;

var C_WIDTH = 480;
var C_HEIGHT = 560;

var BOUNDARY = C_HEIGHT - 200;

var FPS = 30;
var c;
var saved = false;
/* eslint-disable no-unused-vars */
var cookieExpiry = new Date(2022, 1, 1);
var paused = false;
var error = '';

var worldInd = 0;
var levelInd = 0;
var world;

var loadedEnemies = 0;
var xWander = 0;
var xWanderMin = -10;
var xWanderSpeed = 0.2;

function loadGame() {
    var canvas = document.getElementById('canvas');
    c = canvas.getContext('2d');
    c.width = C_WIDTH;
    c.height = C_HEIGHT;
    gameState.c = c;
    c.boundary = BOUNDARY;
    levels.init(c);
    player.init(c);
    canvas.onmousemove = mouseMove;
    canvas.onmousedown = mouseDown;
    canvas.onmouseup = mouseUp;
    canvas.onclick = mouseClick;
    csrftoken = getCookie('csrftoken');
    // setupAjax();
    // initHighScores(highScorePosted);
    saved = getCookie('saved');
    loadSprites(c, drawEnemyScores, drawButtons);
    canvas.focus();
    showStart();
    var userPause = new ImageButton(c, sprites.pause, sprites.play, C_WIDTH - 28, 4, 24, 24);
    userPause.setClickListener(function() {
        paused ? resume() : pause();
    });
    gameState.buttons.push(userPause);
    var toggleSound = new ImageButton(c, sprites.soundOff, sprites.soundOn, C_WIDTH - 52, 6, 20, 20);
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

/* eslint-disable no-unused-vars */
function highScorePosted(response) {
    var rankText = 'Rank: ' + response.rank;
    var s = textSize(rankText, c.font);
    c.fillText(rankText, C_WIDTH / 2 - s[0] / 2, C_HEIGHT / 2 + 160);
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
    gameState.level.load(c);
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
    setPowerups(powerups.filter(function(p) {
        p.update();
        return p.active;
    }));
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
    sprites.stars.update(c);
    if(gameState.attackTimer <= 0 && activeEnemies.length > 0) {
        var e = activeEnemies[Math.floor(Math.random() * activeEnemies.length)];
        e.attack();
        enemyData.numAttacks += 1;
        var freq = gameState.level.attack_freq(enemyData.numAttacks);
        gameState.attackTimer = Math.random() * freq + freq / 8;
    }
    if(enemies.length === 0) {
        levelWon();
        return;
    }
    error = activeEnemies.length;
    gameState.shotTimer += 1;
    gameState.attackTimer -= 1;
    draw();
}

function draw() {
    c.clearRect(0, 0, C_WIDTH, C_HEIGHT);
    sprites.stars.draw(c);
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
    c.fillText('Score: ' + gameState.score, C_WIDTH / 1.7, 18);
    debug(error);
    if(gameState.isOver) {
        gameState.gameOverTimer -= 1;
        if(gameState.gameOverTimer <= 0) gameOver(false);
    }
}

function drawButtons() {
    gameState.buttons.forEach(function(b) { b.draw(c) });
}

function showStart() {
    c.clearRect(0, 0, C_WIDTH, C_HEIGHT);
    c.fillStyle = '#000';
    c.font = '56px Verdana';
    var s = textSize('Xenophobia', c.font);
    c.fillText('Xenophobia', C_WIDTH / 2 - s[0] / 2, C_HEIGHT / 6);
    c.font = '28px Arial';
    var s1 = textSize('Destroy the aliens, because', c.font);
    c.fillText('Destroy the aliens, because', C_WIDTH / 2 - s1[0] / 2, C_HEIGHT / 4);
    var s2 = textSize('they are different from you.', c.font);
    c.fillText('they are different from you.', C_WIDTH / 2 - s2[0] / 2, C_HEIGHT / 4 + s1[1]);
    c.font = '20px Arial Black';
    s1 = textSize('NEW GAME', c.font);
    var b1, b2;
    if(saved) {
        b1 = new Button(c, 'NEW GAME', C_WIDTH / 2 - (s1[0] + 15), C_HEIGHT / 3, s1, c.font);
        s2 = textSize('CONTINUE', c.font);
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
    s2 = textSize('LEVEL EDITOR', c.font);
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
    if(sprites.stars) {
        sprites.stars.draw(c);
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
        if(e && e.sprite.loaded) {
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
    let node = document.getElementById(id);
    if(node !== null) {
        node.style.display = value;
    }
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
        s1 = textSize('You Win!', c.font);
        c.fillText('You Win!', C_WIDTH / 2 - s1[0] / 2, C_HEIGHT / 2 + 20);
    } else {
        s1 = textSize('Game Over!', c.font);
        c.fillText('Game Over!', C_WIDTH / 2 - s1[0] / 2, C_HEIGHT / 2 + 20);
    }
    c.font = '24px Arial';
    var s2 = textSize('Restart Game', c.font);
    var b1 = new Button(c, 'Restart Game', C_WIDTH / 2 - (s2[0] + 15), C_HEIGHT / 2 + 20 + s2[1], s2);
    s2 = textSize('Restart Level', c.font);
    var b2 = new Button(c, 'Replay Level', C_WIDTH / 2 + 15, C_HEIGHT / 2 + 20 + s2[1], s2);
    s1 = textSize('Submit High Score', c.font);
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
    gameState.buttons = gameState.buttons.filter(function(b) {
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
