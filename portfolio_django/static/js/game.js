/* Good day to you, sir. C stands for Canvas. */

var C_WIDTH = 400;
var C_HEIGHT = 300;
var body_size = C_WIDTH / 5;
var leg_w = 0.22 * body_size;
var leg_h = 0.35 * body_size;
var arm_w = 0.265 * body_size;
var arm_h = 0.85 * body_size;
var head_w = body_size;
var head_h = 0.485 * body_size;
var head_l = (C_WIDTH / 2) - (body_size / 2);
var leg_sprites, arm_sprites, head_sprites, body_sprites, sprites, super_sprites;

function loadSprites() {
    leg_sprites = [Sprite("631wm7d11mdr3mj/2y6naqsQ_A/portfolio/static/images/sprites/android-leg.png", leg_w, leg_h), Sprite("631wm7d11mdr3mj/hfgPwTTbUK/portfolio/static/images/sprites/android-leg1.png", leg_w, leg_h)];
    arm_sprites = [Sprite("631wm7d11mdr3mj/3Ecggr3y2e/portfolio/static/images/sprites/android-arm.png", arm_w, arm_h), Sprite("631wm7d11mdr3mj/LKk0OecV_F/portfolio/static/images/sprites/android-arm1.png", arm_w, arm_h)];
    head_sprites = [Sprite("631wm7d11mdr3mj/Lsvl6NrHkJ/portfolio/static/images/sprites/android-head.png", head_w, head_h), Sprite("631wm7d11mdr3mj/3xvD7ksCdR/portfolio/static/images/sprites/android-head1.png", head_w, head_h), Sprite("631wm7d11mdr3mj/fgdSeQaKw0/portfolio/static/images/sprites/android-head2.png", head_w, head_h)];
    body_sprites = [Sprite("631wm7d11mdr3mj/A8xVh5j9Qg/portfolio/static/images/sprites/android-body.png", body_size, body_size), Sprite("631wm7d11mdr3mj/bY5UzfrLGV/portfolio/static/images/sprites/android-body1.png", body_size, body_size), Sprite("631wm7d11mdr3mj/t6oAkVg5Tn/portfolio/static/images/sprites/android-body2.png", body_size, body_size), Sprite("631wm7d11mdr3mj/RIzHUK13BY/portfolio/static/images/sprites/android-body3.png", body_size, body_size)];
    block_w = C_WIDTH / 12;
    block_h = C_HEIGHT / 10;
    sprites = [Sprite("631wm7d11mdr3mj/qtyb5bDXTm/portfolio/static/images/sprites/microsoft.png", block_w, block_h, drawStart), Sprite("631wm7d11mdr3mj/-KEipZUGUC/portfolio/static/images/sprites/python.png", block_w, block_h, drawStart), Sprite("631wm7d11mdr3mj/HdVhaQ-VqB/portfolio/static/images/sprites/github.png", block_w, block_h, drawStart),
		   Sprite("631wm7d11mdr3mj/yh1i6bMWQy/portfolio/static/images/sprites/apple.png", block_w, block_h, drawStart), Sprite("631wm7d11mdr3mj/Ac-ptyILP8/portfolio/static/images/sprites/java.png", block_w, block_h, drawStart)];
    super_sprites = [Sprite("631wm7d11mdr3mj/lGQNQ-ave6/portfolio/static/images/sprites/unix.png", 2*block_w, block_h, drawStart), Sprite("631wm7d11mdr3mj/sN41aeKvr3/portfolio/static/images/sprites/unix1.png", 2*block_w, block_h, drawStart), Sprite("631wm7d11mdr3mj/cXcnvd9Edj/portfolio/static/images/sprites/unix2.png", 2*block_w, block_h, drawStart) ];
    player.sprite = Sprite("631wm7d11mdr3mj/ynbKnGoewA/portfolio/static/images/sprites/player.png", 72, 12, drawStart);
}

var FPS = 30;
var c;
var gameEventId;
var drawEnabled = true;
var error = "";

var textX = 50;
var textY = 50;

var frameCount = 0;

var balls = [];
var blocks = [];

GameMode = {
    INIT: 0,
    ON: 1,
    PAUSED: 2,
    BOSS: 3,
    WIN: 4,
    LOSE: 5
}

var mode = GameMode.INIT;

$(document).ready(function(){
    loadIndexStyles();
    loadSprites();
    c = $("#canvas")[0].getContext("2d");
    setupGame();
    showStart();
    //setInterval(countFrames, 1000);
});

function countFrames() {
    error = frameCount.toString();
    frameCount = 0;
}

function restartGame() {
    balls = [];
    blocks = [];
    setupGame();
    startGame();
}

function setupGame() {
    balls.push(Ball({
	speed: -6,
	x: player.x + (player.width / 2),
	y: player.y
    }));
    initBlocks();
}

function startGame() {
    $("#canvas").unbind('click');
    $("#canvas").focusout(pause);
    mode = GameMode.ON;
    drawEnabled = true;
    gameEventId = setInterval(function() {
	update();
	draw();
    }, 1000/FPS);
}

function initBlocks() {
    var x = 0;
    y = 0;
    for(var i=0;i<sprites.length;i+=1) {
	for(var j=0;j<12;j+=1) {
	    if(i % 2 == 1 && (j == 1 || j == 5 || j == 9)) {
		blocks.push(SuperBlock({
		    x: x,
		    y: y,
		    powerup: Powerups.EXTRA_BALL,
		    width: 2*block_w,
		    height: block_h,
		    sprites: super_sprites
		}));
		x += 2*block_w;
		j += 1;
	    } else {
		blocks.push(Block({
		    x: x,
		    y: y,
		    powerup: Powerups.BALL_SIZE,
		    width: block_w,
		    height: block_h,
		    sprite: sprites[i]
		}));
		x += block_w;
	    }
	}
	x = 0;
	y += block_h;
    }
}

function setupBoss() {
    mode = GameMode.BOSS;
    blocks.push(SuperBlock({
	x: head_l,
	y: head_h,
	width: body_size,
	height: body_size,
	sprites: body_sprites
    }));
    blocks.push(SuperBlock({
	x: head_l,
	y: 0,
	width: head_w,
	height: head_h,
	sprites: head_sprites
    }));
    blocks.push(SuperBlock({
	x: head_l - arm_w,
	y: head_h - (arm_h / 12),
	width: arm_w,
	height: arm_h,
	sprites: arm_sprites
    }));
    blocks.push(SuperBlock({
	x: head_l + body_size,
	y: head_h - (arm_h / 12),
	width: arm_w,
	height: arm_h,
	sprites: arm_sprites
    }));
    blocks.push(SuperBlock({
	x: (C_WIDTH / 2) - (body_size / 3),
	y: head_h + body_size,
	width: leg_w,
	height: leg_h,
	sprites: leg_sprites
    }));
    blocks.push(SuperBlock({
	x: (C_WIDTH / 2) + (body_size / 9),
	y: head_h + body_size,
	width: leg_w,
	height: leg_h,
	sprites: leg_sprites
    }));
}

function update() {
    if (keydown.left) {
	player.x -= 8;
    } else if (keydown.right) {
	player.x += 8;
    }
    player.x = player.x.clamp(0, C_WIDTH - player.width);
    balls.forEach(function(ball) {
	ball.update();
    });
    balls.forEach(function(ball) {
	for(var i=0;i<blocks.length;i+=1) {
	    var block = blocks[i];
	    if(ball.hitBlock(block)) {
		block.handleHit(ball);
		break;
	    }
	}
    });
    blocks = blocks.filter(function(block) {
	return block.active;
    });
    balls = balls.filter(function(ball) {
	return ball.active;
    });
    if(blocks.length == 0) {
	if(mode == GameMode.ON) {
	    setupBoss();
	} else {
	    drawEnabled = false;
	    gameWon();
	}
    }
    if(balls.length == 0) {
	drawEnabled = false;
	gameOver();
    }
}

function draw() {
    if(drawEnabled) {
	c.clearRect(0, 0, C_WIDTH, C_HEIGHT);
	player.draw();
	balls.forEach(function(ball) {
	    ball.draw();
	});
	blocks.forEach(function(block) {
	    block.draw();
	});
    }
    frameCount += 1;
    //debug(error);
}

function drawStart() {
    draw();
    c.fillStyle = "#000";
    c.font = "30px RobotoBlack";
    c.fillText("Click To Start!", C_WIDTH / 4, C_HEIGHT / 1.5);
}

function showStart() {
    $("#canvas").click(startGame);
    drawStart();
}

function gameWon() {
    mode = GameMode.WIN;
    clearInterval(gameEventId);
    c.fillStyle = "#000";
    c.font = "30px RobotoBlack";
    c.fillText("You Win!", C_WIDTH / 3, C_HEIGHT / 2);
    c.font = "24px RobotoBlack";
    c.fillText("Click to replay", C_WIDTH / 3.2, (C_HEIGHT / 2) + 40);
    $("#canvas").click(restartGame);
}

function gameOver() {
    clearInterval(gameEventId);
    $("#canvas").click(restartGame);
    mode = GameMode.LOSE;
    c.fillStyle = "#000";
    c.font = "30px RobotoBlack";
    c.fillText("Game Over!", C_WIDTH / 3, C_HEIGHT / 1.5);
    c.font = "24px RobotoBlack";
    c.fillText("Click to replay", C_WIDTH / 3, (C_HEIGHT / 1.5) + 40);
}

function debug(msg) {
    c.font = "16px RobotoBlack";
    c.fillText(msg, 0, C_HEIGHT / 1.5);
}

function pause() {
    drawEnabled = false;
    mode = GameMode.PAUSED;
    clearInterval(gameEventId);
    $("#canvas").unbind('focusout');
    $("#canvas").click(startGame);
    c.fillStyle = "#000";
    c.font = "28px RobotoBlack";
    c.fillText("Paused: Click to Resume", C_WIDTH / 5, C_HEIGHT / 2);
}