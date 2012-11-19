var csrftoken;

var C_WIDTH = 480;
var C_HEIGHT = 560;

var BOUNDARY = C_HEIGHT - 200;

var FPS = 30;
var c, saved=false, cookieExpiry=new Date(2022, 1, 1);
var gameEventId;
var isGameOver=false, gameOverTimer=0, paused=false, soundOn=false;
var error = "";

var shotSound, enemyShotSound, enemyExpSound, laserSound;

var playerShot, missile, shieldPowerupSprite, enemyShot, shotW=5, shotH=15;
var playerLives = [];
var playerLife;
var playerShots=[], enemyShots=[];
var shotTimer=0, attackTimer, numAttacks=0, numMissiles=2;
var worldInd=0, levelInd=0, score=0;
var level, world;
var explosionSprites=[], mineSprites=[];
var explosions=[], powerupObs=[], powerups=[];

var buttons = [];
var pauseSprite, playSprite, soundOnSprite, soundOffSprite;

var enemies=[], mines=[], activeEnemies, initEnemyCount=0, loadedEnemies=0;;
var xWander=0, xWanderMin=-10, xWanderMax=10, xWanderSpeed=0.2;

function loadSprites() {
    var w=player.width, h=player.height;
    player.sprites = [Sprite("631wm7d11mdr3mj/2uVRXGxf7A/portfolio/static/images/space_sprites/player.png", w, h), Sprite("631wm7d11mdr3mj/CViMOtl02D/portfolio/static/images/space_sprites/playerLeft.png", w, h), Sprite("631wm7d11mdr3mj/MqXFAiIDw6/portfolio/static/images/space_sprites/playerRight.png", w, h)];
    enemy1Obj.sprite = Sprite("631wm7d11mdr3mj/7oPa2yNaIB/portfolio/static/images/space_sprites/enemy1.png", e_w, e_h, drawEnemyScores);
    enemy2Obj.sprite = Sprite("631wm7d11mdr3mj/nTAY8QygYM/portfolio/static/images/space_sprites/enemy2.png", e_w, e_h, drawEnemyScores);
    enemy3Obj.sprite = Sprite("631wm7d11mdr3mj/ok-JoalkfC/portfolio/static/images/space_sprites/enemy3.png", e_w, e_h, drawEnemyScores);
    enemy4Obj.sprite = Sprite("631wm7d11mdr3mj/xK3PxxAch8/portfolio/static/images/space_sprites/enemy4.png", e_w, e_h, drawEnemyScores);
    enemy5Obj.sprite = Sprite("631wm7d11mdr3mj/qQ5Kzklhyy/portfolio/static/images/space_sprites/enemy5.png", e_w*2, e_h*2, drawEnemyScores);
    enemy6Obj.sprite = Sprite("631wm7d11mdr3mj/6roKA0hqDT/portfolio/static/images/space_sprites/enemy6.png", e_w, e_h, drawEnemyScores);
    enemy7Obj.sprite = Sprite("631wm7d11mdr3mj/8-8aF0Hgmf/portfolio/static/images/space_sprites/enemy7.png", e_w, e_h, drawEnemyScores);
    enemy8Obj.sprite = Sprite("631wm7d11mdr3mj/sahm-t_RnK/portfolio/static/images/space_sprites/enemy8.png", e_w*3, e_h, drawEnemyScores);
    playerShot = [Sprite("631wm7d11mdr3mj/ikWk5YzfJd/portfolio/static/images/space_sprites/laserRed.png", shotW, shotH),
		  Sprite("631wm7d11mdr3mj/JU3cMwxn1o/portfolio/static/images/space_sprites/laserRedShot.png", 28, 28)];
    enemyShot = [Sprite("631wm7d11mdr3mj/LX6Dm97mS3/portfolio/static/images/space_sprites/laserGreen.png", shotW, shotH),
		 Sprite("631wm7d11mdr3mj/r2rh_AfaRE/portfolio/static/images/space_sprites/laserGreenShot.png", 28, 28)];
    playerLife = Sprite("631wm7d11mdr3mj/z3QpEUH-QA/portfolio/static/images/space_sprites/life.png", w/2, h/2);
    explosionSprites.push(Sprite("631wm7d11mdr3mj/8HMg2jgeDZ/portfolio/static/images/space_sprites/explosion1.png", e_w, e_h));
    explosionSprites.push(Sprite("631wm7d11mdr3mj/NnRsbw5M8i/portfolio/static/images/space_sprites/explosion2.png", e_w, e_h));
    explosionSprites.push(Sprite("631wm7d11mdr3mj/PXxwqQ73xF/portfolio/static/images/space_sprites/explosion3.png", e_w, e_h));
    explosionSprites.push(Sprite("631wm7d11mdr3mj/_LJddbHSXL/portfolio/static/images/space_sprites/explosion4.png", e_w, e_h));
    pauseSprite = Sprite("631wm7d11mdr3mj/PjnX4rAH7y/portfolio/static/images/space_sprites/pause.png", 32, 32);
    playSprite = Sprite("631wm7d11mdr3mj/cc7mbxDjlT/portfolio/static/images/space_sprites/play.png", 32, 32);
    soundOnSprite = Sprite("631wm7d11mdr3mj/RaJHuLjaHG/portfolio/static/images/space_sprites/sound_on.png", 32, 32, drawButtons);
    soundOffSprite = Sprite("631wm7d11mdr3mj/Ih0P0EL4Id/portfolio/static/images/space_sprites/sound_off.png", 32, 32, drawButtons);
    shieldSprite = Sprite("631wm7d11mdr3mj/UslOP-1wz2/portfolio/static/images/space_sprites/shield.png", w+12, h+5);
    shieldPowerupSprite = Sprite("631wm7d11mdr3mj/E46JLd7fY2/portfolio/static/images/space_sprites/shieldPowerup.png", 16, 16);
    missile = Sprite("631wm7d11mdr3mj/eCvEneLNME/portfolio/static/images/space_sprites/missile.png", w/1.25, h);
    mineSprites.push(Sprite("631wm7d11mdr3mj/6rCVFvacpH/portfolio/static/images/space_sprites/mine1.png", 28, 28));
    mineSprites.push(Sprite("631wm7d11mdr3mj/HYtZLisfJZ/portfolio/static/images/space_sprites/mine2.png", 28, 28));
    enemy9Obj.sprite = Sprite("631wm7d11mdr3mj/Hjk8fwkK-A/portfolio/static/images/space_sprites/enemy9.png", e_w*3, e_h*3);
    shotSound = new buzz.sound([
	"https://dl.dropbox.com/sh/631wm7d11mdr3mj/exIW7e0MTO/portfolio/static/sounds/shot.mp3",
	"https://dl.dropbox.com/sh/631wm7d11mdr3mj/E-xBn5g2zL/portfolio/static/sounds/shot.ogg"
    ]);
    enemyShotSound = new buzz.sound([
	"https://dl.dropbox.com/sh/631wm7d11mdr3mj/kB9IQJutEx/portfolio/static/sounds/enemy_shot.mp3",
	"https://dl.dropbox.com/sh/631wm7d11mdr3mj/_-RTp20zpM/portfolio/static/sounds/enemy_shot.ogg"
    ]);
    enemyExpSound = new buzz.sound([
	"https://dl.dropbox.com/sh/631wm7d11mdr3mj/M2luGqD1KV/portfolio/static/sounds/enemy_exp.mp3",
	"https://dl.dropbox.com/sh/631wm7d11mdr3mj/hnKY7lllql/portfolio/static/sounds/enemy_exp.ogg"
    ]);
    if(chrome) {
	ambientSound = new buzz.sound([
	    "https://dl.dropbox.com/sh/631wm7d11mdr3mj/cJ5oM2HoIl/portfolio/static/sounds/ambience.mp3"]);
    }
    laserSound = new buzz.sound([
	"https://dl.dropbox.com/sh/631wm7d11mdr3mj/H__6HLAZu7/portfolio/static/sounds/laser.mp3",
	"https://dl.dropbox.com/sh/631wm7d11mdr3mj/j0yUd4ncdf/portfolio/static/sounds/laser.ogg"]);
}

function playSound(sound) {
    if(soundOn) {
	sound.stop();
	sound.play();
    }
}

function fillHighScores(response) {
    var data = "";
    var names = response.names;
    var scores = response.scores;
    var rank = hsRank;
    if(response.ind) {
	rank = parseInt(response.ind);
	hsRank = rank;
    }
    for(var i=0;i<names.length;i+=1) {
	data += "<tr><td>"+(rank+i)+".</td><td>"+names[i]+"</td><td>"+scores[i]+"</td></tr>";
    }
    $('#scores').html(data);
    end = names.length < 10;
}

var hsRank;
var end = false;

function getHighScores(rank) {
    if(rank <= -9 || (rank > hsRank && end)) return;
    if(rank < 1) rank = 1;
    end = false;
    hsRank = rank;
    $.post("/portfolio/query/",
	   { "query": "get_highscores", "rank": rank},
	   fillHighScores,
	   "json"
	  );
}

var chrome=false;

$(document).ready(function(){
    chrome = $.browser.chrome;
    var canvas = $("#canvas");
    c = $("#canvas")[0].getContext("2d");
    canvas.mousemove(mouseMove);
    canvas.click(mouseClick);
    csrftoken = $.cookies.get('csrftoken');
    //alert(csrftoken);
    setupAjax();
    getHighScores(1);
    $("#highscore_button").click(submitHighscore);
    $("#hs_left").click(function(e){getHighScores(hsRank-10);});
    $("#hs_right").click(function(e){getHighScores(hsRank+10);});
    $("#hs_goto_button").click(function(e){getHighScores(parseInt($("#hs_goto").val()));});
    $("#feedback_button").click(function(e){submitFeedback()});
    $("#feedback_input").focusin(function(){ keysEnabled = true; });
    $("#feedback_input").focusout(function(){ keysEnabled = false; });
    saved = $.cookies.get("saved");
    loadSprites();
    canvas.focus();
    showStart();
    var userPause = new ImageButton(pauseSprite, playSprite, C_WIDTH-28, 4, 24, 24);
    userPause.setClickListener(function() {
	paused ? resume() : pause();
    });
    buttons.push(userPause);
    var toggleSound = new ImageButton(soundOffSprite, soundOnSprite, C_WIDTH - 52, 6, 20, 20);
    toggleSound.setClickListener(function() {
	soundOn = !soundOn;
	if(!soundOn && chrome) ambientSound.stop();
	else if(chrome) ambientSound.play();
    });
    buttons.push(toggleSound);
    powerupObjs = [new MissilePowerup(), new ShieldPowerup(), new LifePowerup()];
});

function save() {
    saved = true;
    $.cookies.set("saved", true, new Date(2022, 1, 1));
    $.cookies.set("world", worldInd, new Date(2022, 1, 1));
    $.cookies.set("level", levelInd, new Date(2022, 1, 1));
    $.cookies.set("score", score, new Date(2022, 1, 1));
    $.cookies.set("lives", playerLives.length, new Date(2022, 1, 1));
    //alert(worldInd+" "+levelInd+" "+score+" "+lives);
}

function load() {
    if(saved) {
	worldInd = $.cookies.get("world");
	levelInd = $.cookies.get("level");
	score = $.cookies.get("score");
	var lives = $.cookies.get("lives");
	setupLives(lives);
    }
}

function setupLives(lives) {
    player.blink(3);
    for(var i=0;i<lives;i+=1) {
	playerLives.push(Life({sprite: playerLife, x: i*player.width/2+(i+1)*10,
			       y: C_HEIGHT - (player.height/2 + 5)}));
    }
}

function addLife(x, y) {
    life = Life({sprite: playerLife, x: x, y: y});
    playerLives.push(life);
    var xMul = playerLives.length - 1;
    var endP = new Point(xMul*player.width/2+(xMul+1)*10, C_HEIGHT - (player.height/2 + 5));
    life.path = new PointPath([new Point(x, y), endP], [15]);
}

function clearEntities() {
    mines = [];
    enemies = [];
    activeEnemies = [];
    playerShots = [];
    enemyShots = [];
    numAttacks = 0;
    initEnemyCount = 0;
}

function restartGame() {
    isGameOver = false;
    score = 0;
    levelInd = 0;
    worldInd = 0;
    numMissiles = 2;
    clearEntities();
    setupLives(3);
    setupGame();
    startGame();
}

function continueGame() {
    isGameOver = false;
    load();
    clearEntities();
    setupGame();
    startGame();
}

function nextLevel() {
    clearEntities();
    setupGame();
    startGame();
}

function setupGame() {
    world = worlds[worldInd];
    level = world[levelInd]
    attackTimer = level.attack_freq(0);
    level.load();
}

function startGame() {
    //$("#canvas").focusout(pause);
    if(!paused) {
	gameEventId = setInterval(function() {
	    update();
	}, 1000/FPS);
    }
}

// TODO -- combine update/draw for efficiency
function update() {
    player.update();
    // TODO -- combine shot iterations
    playerShots.forEach(function(shot) {
	shot.update();
	for(var i=0;i<enemies.length;i+=1) {
	    shot.hitEntity(enemies[i]);
	}
	mines.forEach(function(mine){shot.hitEntity(mine);});
    });
    playerLives.forEach(function(life) {
	life.update();
    });
    playerShots = playerShots.filter(function(shot) {
	return shot.active;
    });
    powerups = powerups.filter(function(p) {
	p.update();
	return p.active;
    });
    enemyShots = enemyShots.filter(function(shot) {
	shot.update();
	shot.hitEntity(player);
	return shot.active;
    });
    enemies.forEach(function(enemy) {
	enemy.update();
	if(initEnemyCount >= enemies.length) {
	    enemy.wander(xWanderSpeed);
	}
    });
    enemies = enemies.filter(function(enemy) {
	return enemy.active;
    });
    mines = mines.filter(function(mine) {
	mine.update();
	mine.hitEntity(player);
	return mine.active;
    });
    xWander += xWanderSpeed;
    if(xWander > xWanderMax || xWander < xWanderMin) {
	xWanderSpeed *= -1;
    }
    explosions = explosions.filter(function(exp) {
	exp.update();
	return exp.active;
    });
    if(attackTimer <= 0 && activeEnemies.length > 0) {
	var e = activeEnemies[Math.floor(Math.random()*activeEnemies.length)];
	e.attack();
	numAttacks += 1;
	var freq = level.attack_freq(numAttacks);
	attackTimer = Math.random()*freq + freq / 8;
    }
    if(enemies.length == 0) {
	levelWon();
	return;
    }
    //error = playerLives.length.toString();
    //error = enemies.length+" "+activeEnemies.length;
    //if(enemies.length > 0) error = enemies[0].y.toString();
    shotTimer += 1;
    attackTimer -= 1;
    draw();
}

function draw() {
    c.clearRect(0, 0, C_WIDTH, C_HEIGHT);
    drawButtons();
    player.draw();
    c.beginPath();
    c.moveTo(0, BOUNDARY);
    c.lineTo(C_WIDTH, BOUNDARY);
    c.lineWidth = 1;
    c.strokeStyle="#999"
    c.stroke();
    playerShots.forEach(function(shot) {
	shot.draw();
    });
    powerups.forEach(function(p) {
	p.draw();
    });
    enemyShots.forEach(function(shot) {
	shot.draw();
    });
    enemies.forEach(function(enemy) {
	enemy.draw();
    });
    playerLives.forEach(function(life) {
	life.draw();
    });
    explosions.forEach(function(exp) {
	exp.draw();
    });
    mines.forEach(function(mine) {
	mine.draw();
    });
    c.font = "18px Arial";
    c.fillStyle = "#000";
    c.fillText("Level "+worldInd+"-"+levelInd, 10, 18);
    c.fillText("Missiles: "+numMissiles, C_WIDTH/3, 18);
    c.fillText("Score: "+score, C_WIDTH/1.7, 18);
    debug(error);
    if(isGameOver) {
	gameOverTimer -= 1;
	if(gameOverTimer <= 0) gameOver(false);
    }
}

function drawButtons() {
    buttons.forEach(function(b){b.draw();});
}

function showStart() {
    c.clearRect(0, 0, C_WIDTH, C_HEIGHT);
    c.fillStyle = "#000";
    c.font = "56px Verdana";
    var s = "Xenophobia".size(c.font);
    c.fillText("Xenophobia", C_WIDTH/2 - s[0]/2, C_HEIGHT/5);
    c.font = "28px Arial";
    var s1 = "Destroy the aliens, because".size(c.font);
    c.fillText("Destroy the aliens, because", C_WIDTH / 2 - s1[0]/2, C_HEIGHT / 3);
    var s2 = "they are different from you.".size(c.font);
    c.fillText("they are different from you.", C_WIDTH / 2 - s2[0]/2, C_HEIGHT / 3 + s1[1]);
    c.font = "20px Arial Black";
    s1 = "NEW GAME".size(c.font);
    var b1, b2;
    if(saved) {
	b1 = new Button("NEW GAME", C_WIDTH/2 - (s1[0]+15), C_HEIGHT/2, s1, c.font);
	s2 = "CONTINUE".size(c.font);
	b2 = new Button("CONTINUE", C_WIDTH/2 + 15, C_HEIGHT/2, s2, c.font);
	b2.setClickListener(function() {
	    if(chrome) setInterval(function(){playSound(ambientSound);}, 4000);
	    continueGame();
	    this.active = false; b1.active = false;
	});
	buttons.push(b2);
    } else {
	b1 = new Button("NEW GAME", C_WIDTH/2 - s1[0]/2, C_HEIGHT/2, s1, c.font);
    }
    buttons.push(b1);
    b1.setClickListener(function() {
	if(chrome) setInterval(function(){playSound(ambientSound);}, 4000);
	if(b2) b2.active = false;
	this.active = false;
	restartGame();
    });
}

function drawEnemyScores() {
    loadedEnemies += 1;
    var curY = C_HEIGHT/2 + 60, curX = 50;
    c.clearRect(0, curY-20, C_WIDTH, C_HEIGHT-(curY-20));
    c.font = "22px Arial";
    for(var i=0;i<loadedEnemies;i+=1) {
	var e = enemyObjList[i];
	if(i == 4) {
	    curX += C_WIDTH/2;
	    curY = C_HEIGHT/2 + 60;
	}
	e.sprite.draw(c, curX, curY);
	var h = e.sprite.height;
	c.fillText(" = "+enemyObjList[i].score, curX+e.sprite.width+5, curY+(h+20)/2);
	curY += h + 20;
    }
    if(loadedEnemies >= enemyObjList.length) drawButtons();
}

function pause() {
    clearInterval(gameEventId);
    paused = true;
}

function resume() {
    paused = false;
    startGame();
}

function highScorePosted(response) {
    if(response.refresh == "1") {
	fillHighScores(response);
    }
    var rankText = "Rank: "+response.rank
    var s = rankText.size(c.font)
    c.fillText(rankText, C_WIDTH / 2 - s[0]/2, C_HEIGHT / 2 + 160);
    $('#submit_highscore').hide();
}

function submitHighscore() {
    var name = $("#highscore_name").val();
    if(name.length < 2 || name.length > 20) {
	alert("Name must be between 2 and 20 characters (inclusive).");
	return;
    }
    $.post("/portfolio/query/",
	   { "query": "set_highscore",
	     "name": name,
	     "val": score.toString() },
	   highScorePosted,
	   "json"
	  );
}

function feedbackPosted(request) {
    alert("Your feedback has been recorded. Thanks a bunch!");
}

function submitFeedback() {
    var text = $("#feedback_input").val();
    if(text.length > 500) text = text.substring(0, 499);
     $.post("/portfolio/query/",
	   { "query": "submit_feedback",
	     "text": text },
	   feedbackPosted,
	    "json"
	   );
}

function gameOver(won) {
    clearInterval(gameEventId);
    c.fillStyle = "#000";
    c.font = "30px Arial Black";
    var s1;
    if(won) {
	s1 = "You Win!".size(c.font);
	c.fillText("You Win!", C_WIDTH / 2 - s1[0]/2, C_HEIGHT / 2 + 20);
    } else {
	s1 = "Game Over!".size(c.font);
	c.fillText("Game Over!", C_WIDTH / 2 - s1[0]/2, C_HEIGHT / 2 + 20);
    }
    c.font = "24px Arial";
    var s2 = "Restart Game".size(c.font);
    var b1 = new Button("Restart Game", C_WIDTH/2 - (s2[0]+15), C_HEIGHT/2+20+s2[1], s2);
    s2 = "Restart Level".size(c.font);
    var b2 = new Button("Replay Level", C_WIDTH/2 + 15, C_HEIGHT/2+20+s2[1], s2);
    s1 = "Submit High Score".size(c.font);
    c.fillText("Submit High Score", C_WIDTH/2 - s1[0]/2, C_HEIGHT/2+125);
    b1.setClickListener(function() {
	$('#submit_highscore').hide();
	this.active = false; b2.active = false; restartGame();});
    b2.setClickListener(function() {
	$('#submit_highscore').hide();
	this.active = false; b1.active = false; continueGame(); });
    buttons.push(b1);
    if(!won) buttons.push(b2);
    drawButtons();
    $('#submit_highscore').show();
}

function levelWon() {
    clearInterval(gameEventId);
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

function mouseMove(e) {
    var canvasPos = findPos(this);
    var x = e.pageX - canvasPos.x;
    var y = e.pageY - canvasPos.y;
    buttons = buttons.filter(function(b) {
	if(!b.active) return false;
	b.hover(x, y);
	b.draw();
	return true;
    });
}

function mouseClick(e) {
    var canvasPos = findPos(this);
    var x = e.pageX - canvasPos.x;
    var y = e.pageY - canvasPos.y;
    buttons.forEach(function(b) {
	b.click(x, y);
    });
    buttons = buttons.filter(function(b) {
	return b.active;
    });
}

function debug(msg) {
    c.font = "16px Arial";
    c.fillText(msg, 0, C_HEIGHT / 1.5);
}

function replaceActiveEnemy(E) {
    var ind = activeEnemies.indexOf(E);
    if(ind == -1) return;
    while(ind != -1) {
	activeEnemies.splice(ind, 1);
	ind = activeEnemies.indexOf(E);
    }
    while(true) {
	if(E) {
	    if(!E.active || activeEnemies.indexOf(E) != -1) {
		E = E.parent;
	    } else {
		break
	    }
	} else {
	    return;
	}
    }
    activeEnemies.push(E);
}