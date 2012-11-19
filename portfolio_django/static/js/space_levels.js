var e_w = 36, e_h = 24, e_cols;

function initEnemy(sprite, x, y, w, h, score, health, initPathFn, attackPath,
		   shootFn, shotFreq, speed, parent) {
    var enemy = Enemy({
	sprite: sprite,
	x: x, y: y, width: w, height: h,
	parent: parent,
	score: score,
	speed: speed,
	health: health
    });
    enemy.attackPath = new attackPath(enemy);
    enemy.shoot = shootFn(enemy, shotFreq);
    if(initPathFn) enemy.initPath = new initPathFn(enemy).instantiate();
    return enemy;
}

enemy1Obj = {
    score: 10,
    health: 1,
    shootFn: function() {
	return function() {
	};
    },
    instantiate: function(x, y, w, h, shotFreq, initPathFn, speed, parent) {
	return initEnemy(enemy1Obj.sprite, x, y, w, h, enemy1Obj.score, enemy1Obj.health, initPathFn,
			 enemy1Obj.attackPath, enemy1Obj.shootFn, shotFreq, speed, parent);
    },
    attackPath: standardAttackPath
}

enemy2Obj = {
    score: 20,
    health: 1,
    shootFn: function(E, freq) {
	var shotTimer = Math.random()*freq;
	return function() {
	    shotTimer -= 1;
	    if(shotTimer <= 0) {
		enemyShots.push(Shot({
		    sprites: enemyShot,
		    x: E.x + E.width / 2,
		    y: E.y + E.height,
		    speed: 10
		}));
		shotTimer = freq / 2 + Math.random()*freq/2;
		playSound(enemyShotSound);
	    }
	};
    },
    instantiate: function(x, y, w, h, shotFreq, initPathFn, speed, parent) {
	return initEnemy(enemy2Obj.sprite, x, y, w, h, enemy2Obj.score, enemy2Obj.health, initPathFn,
			 enemy2Obj.attackPath, enemy2Obj.shootFn, shotFreq, speed, parent);
    },
    attackPath: standardAttackPath
}

enemy3Obj = {
    score: 50,
    health: 1,
    shootFn: function(E, freq) {
	var shotTimer = freq;
	var left = true;
	return function() {
	    shotTimer -= 1;
	    if(shotTimer <= 0) {
		enemyShots.push(Shot({
		    sprites: enemyShot,
		    x: E.x + E.width / (left ? 4 : 1.75),
		    y: E.y + E.height,
		    speed: 10
		}));
		left = !left;
		shotTimer = freq / 2 + Math.random()*freq/2;
		playSound(enemyShotSound);
	    }
	}
    },
    instantiate: function(x, y, w, h, shotFreq, initPathFn, speed, parent) {
	return initEnemy(enemy3Obj.sprite, x, y, w, h, enemy3Obj.score, enemy3Obj.health, initPathFn,
			 enemy3Obj.attackPath, enemy3Obj.shootFn, shotFreq, speed, parent);
    },
    attackPath: standardAttackPath
}

enemy4Obj = {
    score: 100,
    health: 1,
    shootFn: function(E, freq) {
	var shotTimer = Math.random()*freq;
	return function() {
	    shotTimer -= 1;
	    if(shotTimer <= 0) {
		enemyShots.push(Shot({
		    sprites: enemyShot,
		    x: E.x + E.width / 4,
		    y: E.y + E.height,
		    speed: 10
		}));
		enemyShots.push(Shot({
		    sprites: enemyShot,
		    x: E.x + E.width / 1.75,
		    y: E.y + E.height,
		    speed: 10
		}));
		shotTimer = Math.random()*freq;
		playSound(enemyShotSound);
	    }
	}
    },
    instantiate: function(x, y, w, h, shotFreq, initPathFn, parent, child) {
	var enemy = initEnemy(enemy4Obj.sprite, x, y, w, h, enemy4Obj.score, enemy4Obj.health, initPathFn,
			 enemy4Obj.attackPath, enemy4Obj.shootFn, shotFreq, 1, parent);

	if(child) child.parent = enemy;
	return enemy;
    },
    attackPath: followPlayerPath
}

enemy5Obj = {
    score: 250,
    health: 3,
    shootFn: function(E, freq) {
	var cannonFn = enemy3Obj.shootFn(E, freq);
	var laserTimer = freq;
	return function() {
	    cannonFn();
	    laserTimer -= 1;
	    if(laserTimer < 0) {
		enemyShots.push(Laser({owner: E, x: E.x+(E.width/2), y: E.y+E.height-5}));
		laserTimer = Math.random()*freq*3 + freq;
		playSound(laserSound);
	    }
	}
    },
    notifyEscortsFn: function(E, escorts) {
	escorts.forEach(function(escort) {
	    escort.relativeEscortX = escort.x - E.x;
	    escort.relativeEscortY = escort.y - E.y;
	});
	return function() {
	    escorts = escorts.filter(function(escort) {
		if(escort.active) {
		    escort.attack(E.attackPath.clone(escort));
		    escort.x = E.x + escort.relativeEscortX;
		    escort.y = E.y + escort.relativeEscortY;
		    return true;
		}
		return false;
	    });
	}
    },
    instantiate: function(x, y, w, h, shotFreq, initPathFn, escorts) {
	var enemy = Enemy({
	    sprite: enemy5Obj.sprite,
	    x: x, y: y, width: w, height: h,
	    score: enemy5Obj.score,
	    health: enemy5Obj.health
	});
	enemy.attackPath = new enemy5Obj.attackPath(enemy);
	enemy.shoot = this.shootFn(enemy, shotFreq);
	enemy.initPath = new initPathFn(enemy).instantiate(true);
	if(escorts) enemy.notifyEscorts = this.notifyEscortsFn(enemy, escorts);
	return enemy;
    },
    attackPath: sweepAttackPath
}

enemy6Obj = {
    score: 300,
    health: 1,
    shootFn: function(E, freq) {
	var laserTimer = freq;
	return function() {
	    laserTimer -= 1;
	    if(laserTimer < 0) {
		enemyShots.push(Laser({owner: E, x: E.x+(E.width/2), y: E.y+E.height-5}));
		laserTimer = Math.random()*freq + freq;
		playSound(laserSound);
	    }
	}
    },
    instantiate: function(x, y, w, h, shotFreq, initPathFn) {
	var enemy = Enemy({
	    sprite: enemy6Obj.sprite,
	    x: x, y: y, width: w, height: h,
	    score: enemy6Obj.score,
	    health: enemy6Obj.health
	});
	enemy.shoot = this.shootFn(enemy, shotFreq);
	enemy.initPath = new initPathFn(enemy).instantiate();
	var newXWanderSpeed = 0.5*xWanderSpeed*(C_WIDTH/2 - 20) / xWanderMax;
	enemy.wander = function(xWanderSpeed) {
	    if(enemy.x > C_WIDTH-enemy.width || enemy.x < 0) {
		newXWanderSpeed *= -1;
	    }
	    enemy.x += newXWanderSpeed;
	}
	enemy.hoverAction = this.shootFn(enemy, shotFreq);
	return enemy;
    }
}

enemy7Obj = {
    score: 200,
    health: 2,
    shootFn: function(E, freq) {
	var timer = Math.random() * freq;
	return function() {
	    if(E.y > BOUNDARY && E.x > 0 && E.x < C_WIDTH && !E.path.done) {
		timer -= 1;
		if(timer <= 0) {
		    mines.push(Mine({x: E.x, y: E.y}));
		    E.path.done = true;
		    timer = Math.random() * freq;
		}
	    }
	}
    },
    instantiate: function(x, y, w, h, shotFreq, initPathFn, speed, parent) {
	return initEnemy(enemy7Obj.sprite, x, y, w, h, enemy7Obj.score, enemy7Obj.health, initPathFn,
			 enemy7Obj.attackPath, enemy7Obj.shootFn, shotFreq, speed, parent);
    },
    attackPath: avoidPlayerPath
}

enemy8Obj = {
    score: 400,
    health: 5,
    shootFn: function(E, freq) {
	var timer = freq / 5;
	return function() {
	    timer -= 1;
	    if(timer <= 0) {
		var rand = Math.random();
		var gun = Math.floor(rand * 6);
		if(rand < 0.2) {
		    for(var i=1;i<6;i+=1) {
			enemyShots.push(Shot({
			    sprites: enemyShot,
			    x: E.x + i*E.width / 6,
			    y: E.y + E.height-5,
			    speed: 10
			}));
		    }
		} else {
		    enemyShots.push(Shot({
			sprites: enemyShot,
			x: E.x + gun*E.width / 6,
			y: E.y + E.height-5,
			speed: 10
		    }));
		}
		playSound(enemyShotSound);
		timer = freq / 5 + rand;
	    }
	}
    },
    instantiate: function(x, y, w, h, shotFreq, initPathFn) {
	var enemy = Enemy({
	    sprite: enemy8Obj.sprite,
	    x: x, y: y, width: w, height: h,
	    score: enemy8Obj.score,
	    health: enemy8Obj.health
	});
	enemy.attackPath = new enemy8Obj.attackPath(enemy);
	enemy.shoot = this.shootFn(enemy, shotFreq);
	enemy.initPath = new initPathFn(enemy).instantiate();
	return enemy;
    },
    attackPath: standardAttackPath
}

enemy9Obj = {
    score: 2000,
    health: 20,
    shootFn: function(E, freq) {
	var bottomEnemies = [enemy1Obj, enemy2Obj, enemy3Obj];
	var timer = freq;
	return function() {
	    timer -= 1;
	    if(timer <= 0) {
		timer = freq/2 +Math.random()*freq/2;
		var e1, e2, rand = Math.random();
		if(rand < 0.3) {
		    e1 = enemy4Obj.instantiate(E.x-e_w, E.y+10, e_w, e_h, 50, null, 1);
		    e2 = enemy4Obj.instantiate(E.x+E.width, E.y+10, e_w, e_h, 50, null, 1);
		} else if(rand < 0.8) {
		    e1 = arrayRand(bottomEnemies).instantiate(E.x+10, E.y+E.height, e_w, e_h, 30, null, 1);
		    e2 = arrayRand(bottomEnemies).instantiate(E.x+E.width-(10+e_w), E.y+E.height, e_w, e_h, 30, null, 1);
		} else {
		    enemyShots.push(Laser({owner: E, x: E.x+(E.width/2)-3, y: E.y+E.height-40, width: 5}));
		    playSound(laserSound);
		    return;
		}
		e1.mode = EnemyMode.HOVER;
		e2.mode = EnemyMode.HOVER;
		initEnemyCount += 2;
		e1.alwaysAttack = true;
		e2.alwaysAttack = true;
		e1.attack();
		e2.attack();
		enemies.push(e1);
		enemies.push(e2);
	    }
	}
    },
    instantiate: function(x, y, w, h, shotFreq, initPathFn) {
	var enemy = Enemy({
	    sprite: enemy9Obj.sprite,
	    x: x, y: y, width: w, height: h,
	    score: enemy9Obj.score,
	    health: enemy9Obj.health
	});
	enemy.shoot = this.shootFn(enemy, shotFreq);
	enemy.initPath = new initPathFn(enemy, 30).instantiate();
	enemy.hoverAction = this.shootFn(enemy, shotFreq);
	return enemy;
    },
}

function loadEnemies(enemyObjs, shotFreqs, initX, initY, xDiff, yDiff, initPathFn, speeds) {
    for(var i=0;i<enemyObjs.length;i+=1) {
	var x = initX;
	for(var j=0;j<e_cols;j+=1) {
	    var parent=null;
	    if(i != 0) {
		parent = enemies[(i-1)*e_cols + j];
	    }
	    enemies.push(enemyObjs[i].instantiate(x, initY, e_w, e_h, shotFreqs[i], initPathFn, speeds[i], parent));
	    x += xDiff;
	}
	initY += yDiff;
    }
}

level1 = {
    attack_freq: function(){return 60+enemies.length;},
    load: function() {
	e_cols = 8;
	var yDiff = e_h * 1.6;
	var xDiff = (C_WIDTH - e_w) / e_cols;
	enemyObjs = [enemy3Obj, enemy2Obj, enemy2Obj, enemy1Obj, enemy1Obj];
	speeds = [1, 1, 1, 1, 1];
	shotFreqs = [20, 50, 50, 0, 0];
	var initX = e_w / 1.5, initY = 40 + yDiff;
	var enemy4;
	loadEnemies(enemyObjs, shotFreqs, initX, initY, xDiff, yDiff, randomVerticalInit, speeds);
	var h = enemy4Obj.instantiate(initX+(xDiff*3), initY-yDiff, e_w, e_h, 30, randomVerticalInit, null, enemies[3]);
	enemies = [h].concat(enemies);
	enemies.forEach(function(e) { e.initPath.init(); });
	activeEnemies = enemies.slice(enemies.length-e_cols, enemies.length);
    }
};

level2 = {
    attack_freq: function(){return 40+enemies.length;},
    load: function() {
	e_cols = 8;
	var yDiff = e_h * 1.6;
	var xDiff = (C_WIDTH - e_w) / e_cols;
	enemyObjs = [enemy3Obj, enemy3Obj, enemy2Obj, enemy2Obj, enemy1Obj];
	speeds = [1, 1, 1, 1, 1];
	shotFreqs = [20, 20, 40, 50, 0];
	var initX = e_w / 1.5, initY = 40 + yDiff;
	loadEnemies(enemyObjs, shotFreqs, initX, initY, xDiff, yDiff, randomVerticalInit, speeds);
	var h1 = enemy4Obj.instantiate(initX+xDiff, initY-yDiff, e_w, e_h, 30, randomVerticalInit, null, enemies[1]);
	var h2 = enemy4Obj.instantiate(initX+(xDiff*6), initY-yDiff, e_w, e_h, 30, randomVerticalInit, null, enemies[6]);
	enemies = [h1, h2].concat(enemies);
	enemies.forEach(function(e) { e.initPath.init(); });
	activeEnemies = enemies.slice(enemies.length-e_cols, enemies.length);
    }
};

level3 = {
    attack_freq: function() {
	return enemies.length*2;
    },
    load: function() {
	e_cols = 8;
	var yDiff = e_h * 1.6;
	var xDiff = (C_WIDTH - e_w) / e_cols;
	enemyObjs = [enemy3Obj, enemy3Obj, enemy3Obj, enemy2Obj, enemy1Obj];
	shotFreqs = [15, 20, 20, 40, 0];
	speeds = [1, 1, 1, 1, 1];
	var initX = e_w / 1.5, initY = 40 + yDiff;
	loadEnemies(enemyObjs, shotFreqs, initX, initY, xDiff, yDiff, randomVerticalInit, speeds);
	var h1 = enemy4Obj.instantiate(initX+xDiff, initY-yDiff, e_w, e_h, 30, randomVerticalInit, null, enemies[1]);
	var h2 = enemy4Obj.instantiate(initX+(xDiff*6), initY-yDiff, e_w, e_h, 30, randomVerticalInit, null, enemies[6]);
	enemies = [h1, h2].concat(enemies);
	enemies.forEach(function(e) { e.initPath.init(); });
	activeEnemies = [h1, h1, h2, h2].concat(enemies.slice(enemies.length-2*e_cols, enemies.length));
    }
};

level4 = {
    attack_freq: function(){return 35;},
    load: function() {
	e_cols = 8;
	var yDiff = e_h * 1.6;
	var xDiff = (C_WIDTH - e_w) / e_cols;
	enemyObjs = [enemy4Obj, enemy3Obj, enemy3Obj, enemy2Obj, enemy2Obj, enemy1Obj];
	speeds = [1, 1, 1, 1, 1, 1];
	shotFreqs = [30, 15, 20, 30, 40, 0];
	var initX = e_w / 1.5, initY = 40;
	loadEnemies(enemyObjs, shotFreqs, initX, initY, xDiff, yDiff, randomVerticalInit, speeds);
	enemies.forEach(function(e) { e.initPath.init(); });
	activeEnemies = activeEnemies.concat(enemies.slice(e_cols, 2*e_cols));
    }
}

level5 = {
    attack_freq: function(){return enemies.length;},
    load: function() {
	e_cols = 8;
	var yDiff = e_h * 1.6;
	var xDiff = (C_WIDTH - e_w) / e_cols;
	enemyObjs = [enemy4Obj, enemy3Obj, enemy2Obj, enemy1Obj, enemy1Obj, enemy1Obj];
	shotFreqs = [30, 15, 30, 0, 0, 0];
	speeds = [1, 1, 1, 2, 2, 2];
	var initX = e_w / 1.5, initY = 40;
	loadEnemies(enemyObjs, shotFreqs, initX, initY, xDiff, yDiff, randomVerticalInit, speeds);
	enemies.forEach(function(e) { e.initPath.init(); });
	activeEnemies = enemies.slice(enemies.length-3*e_cols, enemies.length);
    }
}

level6 = {
    attack_freq: function(){return 40;},
    load: function() {
	e_cols = 8;
	var yDiff = e_h * 1.6;
	var xDiff = (C_WIDTH - e_w) / e_cols;
	var initX = e_w / 1.5, initY = 40;
	enemyObjs = [enemy3Obj, enemy3Obj, enemy2Obj,  enemy1Obj, enemy1Obj];
	shotFreqs = [30, 15, 30, 0, 0, 0];
	speeds = [1, 1, 1, 2, 2];
	loadEnemies(enemyObjs, shotFreqs, initX, initY, xDiff, yDiff, randomInit, speeds);
	var b1 = enemy5Obj.instantiate(initX+xDiff, initY, e_w+xDiff, e_h+yDiff, 20, randomVerticalInit,
				       enemies.slice(e_cols*2, e_cols*2+4));
	var b2 = enemy5Obj.instantiate(initX+xDiff*5, initY, e_w+xDiff, e_h+yDiff,
				       20, randomVerticalInit, enemies.slice(e_cols*2+4, e_cols*2+8));
	removeSquare(enemies, e_cols, 1, 0, 2, 2);
	removeSquare(enemies, e_cols, 5, 0, 2, 2);
	enemies = [b1, b2].concat(enemies);
	enemies.forEach(function(e) { e.initPath.init(); });
	activeEnemies = [b1, b1, b2, b2].concat(enemies.slice(enemies.length-2*e_cols, enemies.length));
    }
}

level7 = {
    attack_freq: function(){return 30;},
    load: function() {
	e_cols = 8;
	var yDiff = e_h * 1.6;
	var xDiff = (C_WIDTH - e_w) / e_cols;
	var initX = e_w / 1.5, initY = 40;
	enemyObjs = [enemy3Obj, enemy3Obj, enemy2Obj,  enemy1Obj, enemy1Obj];
	shotFreqs = [30, 15, 30, 0, 0, 0];
	speeds = [1, 1, 1, 2, 2];
	loadEnemies(enemyObjs, shotFreqs, initX, initY, xDiff, yDiff, randomInit, speeds);
	var escorts = [enemies[2], enemies[5], enemies[e_cols+2], enemies[e_cols+5]]
	    .concat(enemies.slice(e_cols*2+2, e_cols*2+6))
	    .concat(enemies.slice(e_cols*3+2, e_cols*3+6));
	var b = enemy5Obj.instantiate(initX+xDiff*3, initY, e_w+xDiff, e_h+yDiff, 20, randomVerticalInit, escorts);
	removeSquare(enemies, e_cols, 3, 0, 2, 2);
	enemies = [b].concat(enemies);
	enemies.forEach(function(e) { e.initPath.init(); });
	activeEnemies = [b, b, b, b].concat(enemies.slice(enemies.length-e_cols, enemies.length));
    }
}

level8 = {
    attack_freq: function(){return 50;},
    load: function() {
	e_cols = 8;
	var yDiff = e_h * 1.6;
	var xDiff = (C_WIDTH - e_w) / e_cols;
	var initX = e_w / 1.5, initY = 40 + 2*yDiff;
	var enemyObjs = [enemy3Obj, enemy3Obj, enemy2Obj,  enemy1Obj];
	var shotFreqs = [30, 15, 30, 0];
	var speeds = [1, 1, 2, 2];
	loadEnemies(enemyObjs, shotFreqs, initX, initY, xDiff, yDiff, randomInit, speeds);
	initY = 40;
	var b1 = enemy5Obj.instantiate(initX, initY, e_w+xDiff, e_h+yDiff, 20,
				       randomVerticalInit, [enemies[0], enemies[1]]);
	var b2 = enemy5Obj.instantiate(initX+2*xDiff, initY, e_w+xDiff, e_h+yDiff, 20,
				       randomVerticalInit, [enemies[2], enemies[3]]);
	var b3 = enemy5Obj.instantiate(initX+4*xDiff, initY, e_w+xDiff, e_h+yDiff, 20,
				       randomVerticalInit, [enemies[4], enemies[5]]);
	var b4 = enemy5Obj.instantiate(initX+6*xDiff, initY, e_w+xDiff, e_h+yDiff, 20,
				       randomVerticalInit, [enemies[6], enemies[7]]);
	enemies = [b1, b2, b3, b4].concat(enemies);
	enemies.forEach(function(e) { e.initPath.init(); });
	activeEnemies = [b1, b1, b1, b2, b2, b2, b3, b3, b3, b4, b4, b4].concat(enemies.slice(enemies.length-e_cols, enemies.length));
    }
}

level9 = {
    attack_freq: function(){return 50;},
    load: function() {
	e_cols = 8;
	var yDiff = e_h * 1.6;
	var xDiff = (C_WIDTH - e_w) / e_cols;
	var initX = e_w / 1.5, initY = 40 + yDiff;
	var b = enemy6Obj.instantiate(C_WIDTH/2, initY-yDiff, e_w, e_h, 60, randomInit);
	var enemyObjs = [enemy4Obj, enemy3Obj, enemy2Obj,  enemy1Obj,  enemy1Obj,  enemy1Obj];
	var shotFreqs = [30, 15, 30, 0, 0, 0];
	var speeds = [1, 1, 1, 2, 2, 2];
	loadEnemies(enemyObjs, shotFreqs, initX, initY, xDiff, yDiff, randomInit, speeds);
	enemies = [b].concat(enemies);
	enemies.forEach(function(e) { e.initPath.init(); });
	activeEnemies = enemies.slice(enemies.length-3*e_cols, enemies.length);
    }
}

level10 = {
    attack_freq: function(){return 30;},
    load: function() {
	e_cols = 8;
	var yDiff = e_h * 1.6;
	var xDiff = (C_WIDTH - e_w) / e_cols;
	var initX = e_w / 1.5, initY = 40;
	var enemyObjs = [enemy4Obj, enemy3Obj, enemy2Obj,  enemy1Obj,  enemy1Obj,  enemy1Obj];
	var shotFreqs = [30, 15, 30, 0, 0, 0];
	var speeds = [1, 1, 1, 2, 2, 2];
	loadEnemies(enemyObjs, shotFreqs, initX, initY+yDiff, xDiff, yDiff, randomInit, speeds);
	var b = enemy6Obj.instantiate(C_WIDTH/2, initY, e_w, e_h, 60, randomInit);
	var m1 = enemy7Obj.instantiate(C_WIDTH/2-xDiff, initY, e_w, e_h, 25, randomInit);
	var m2 = enemy7Obj.instantiate(C_WIDTH/2+xDiff, initY, e_w, e_h, 25, randomInit);
	enemies = [b, m1, m2].concat(enemies);
	enemies.forEach(function(e) { e.initPath.init(); });
	bosses = [m1, m1, m1, m2, m2, m2];
	bosses = bosses.concat(bosses);
	activeEnemies = bosses.concat(enemies.slice(enemies.length-2*e_cols, enemies.length));
    }
}

level11 = {
    attack_freq: function(){return 25;},
    load: function() {
	e_cols = 8;
	var yDiff = e_h * 1.6;
	var xDiff = (C_WIDTH - e_w) / e_cols;
	var initX = e_w / 1.5, initY = 40;
	var enemyObjs = [enemy4Obj, enemy3Obj, enemy2Obj,  enemy2Obj,  enemy1Obj,  enemy1Obj];
	var shotFreqs = [30, 15, 20, 30, 0, 0];
	var speeds = [1, 1, 1, 2, 2, 2];
	loadEnemies(enemyObjs, shotFreqs, initX, initY+yDiff, xDiff, yDiff, randomInit, speeds);
	var b1 = enemy6Obj.instantiate(C_WIDTH/2-xDiff, initY, e_w, e_h, 60, randomInit);
	var b2 = enemy6Obj.instantiate(C_WIDTH/2+xDiff, initY, e_w, e_h, 60, randomInit);
	var m1 = enemy7Obj.instantiate(C_WIDTH/2, initY, e_w, e_h, 25, randomInit);
	var m2 = enemy7Obj.instantiate(C_WIDTH/2-2*xDiff, initY, e_w, e_h, 25, randomInit);
	var m3 = enemy7Obj.instantiate(C_WIDTH/2+2*xDiff, initY, e_w, e_h, 25, randomInit);
	enemies = [b1, b2, m1, m2, m3].concat(enemies);
	enemies.forEach(function(e) { e.initPath.init(); });
	var bosses = [m1, m1, m1, m2, m2, m2, m3, m3, m3];
	bosses = bosses.concat(bosses);
	activeEnemies = bosses.concat(enemies.slice(enemies.length-3*e_cols, enemies.length));
    }
}

level12 = {
    attack_freq: function(){return 25;},
    load: function() {
	e_cols = 8;
	var yDiff = e_h * 1.6;
	var xDiff = (C_WIDTH - e_w) / e_cols;
	var initX = e_w / 1.5, initY = 40;
	var enemyObjs = [enemy4Obj, enemy3Obj, enemy2Obj,  enemy2Obj,  enemy1Obj,  enemy1Obj];
	var shotFreqs = [30, 15, 20, 30, 0, 0];
	var speeds = [1, 1, 1, 2, 2, 2];
	loadEnemies(enemyObjs, shotFreqs, initX, initY+yDiff, xDiff, yDiff, randomInit, speeds);
	var b1 = enemy8Obj.instantiate(initX+xDiff, initY, e_w+2*xDiff, e_h, 40, randomInit);
	var b2 = enemy8Obj.instantiate(initX+4*xDiff, initY, e_w+2*xDiff, e_h, 40, randomInit);
	var m1 = enemy7Obj.instantiate(initX, initY, e_w, e_h, 25, randomInit);
	var m2 = enemy7Obj.instantiate(initX+7*xDiff, initY, e_w, e_h, 25, randomInit);
	enemies = [m1, m2, b1, b2].concat(enemies);
	enemies.forEach(function(e) { e.initPath.init(); });
	var bosses = [b1, b1, b2, b2, m1, m1, m1, m2, m2, m2];
	activeEnemies = bosses.concat(enemies.slice(enemies.length-2*e_cols, enemies.length));
    }
}

level13 = {
    attack_freq: function(){return 20;},
    load: function() {
	e_cols = 8;
	var yDiff = e_h * 1.6;
	var xDiff = (C_WIDTH - e_w) / e_cols;
	var initX = e_w / 1.5, initY = 40;
	var enemyObjs = [enemy7Obj, enemy7Obj, enemy1Obj,  enemy1Obj,  enemy1Obj,  enemy1Obj];
	var shotFreqs = [20, 20, 0, 0, 0, 0];
	var speeds = [1, 1, 2.5, 2, 2, 2];
	loadEnemies(enemyObjs, shotFreqs, initX, initY+yDiff, xDiff, yDiff, randomHorizontalInit, speeds);
	enemies.forEach(function(e) { e.initPath.init(); });
	activeEnemies = enemies.slice(enemies.length-e_cols, enemies.length);
	activeEnemies = activeEnemies.concat(enemies.slice(enemies.length-5*e_cols, enemies.length-4*e_cols));
    }
}

level14 = {
    attack_freq: function(){return 30;},
    load: function() {
	e_cols = 8;
	var yDiff = e_h * 1.6;
	var xDiff = (C_WIDTH - e_w) / e_cols;
	var initX = e_w / 1.5, initY = 40;
	var enemyObjs = [enemy4Obj, enemy3Obj, enemy3Obj,  enemy2Obj,  enemy2Obj,  enemy1Obj];
	var shotFreqs = [20, 15, 20, 10, 30, 0];
	var speeds = [1, 1.5, 1, 1.5, 1, 2];
	loadEnemies(enemyObjs, shotFreqs, initX, initY+yDiff, xDiff, yDiff, randomHorizontalInit, speeds);
	var b1 = enemy8Obj.instantiate(initX+xDiff, initY, e_w+2*xDiff, e_h, 40, randomInit);
	var b2 = enemy8Obj.instantiate(initX+4*xDiff, initY, e_w+2*xDiff, e_h, 40, randomInit);
	var m1 = enemy7Obj.instantiate(initX, initY, e_w, e_h, 25, randomInit);
	var m2 = enemy7Obj.instantiate(initX+7*xDiff, initY, e_w, e_h, 25, randomInit);
	enemies = [b1, b2, m1, m2].concat(enemies);
	enemies.forEach(function(e) { e.initPath.init(); });
	activeEnemies = enemies.slice(0, enemies.length);
    }
}

level15 = {
    attack_freq: function(){return 40;},
    load: function() {
	e_cols = 8;
	var yDiff = e_h * 1.6;
	var xDiff = (C_WIDTH - e_w) / e_cols;
	var initX = e_w / 1.5, initY = 40;
	var enemyObjs = [enemy4Obj, enemy3Obj, enemy2Obj,  enemy2Obj,  enemy1Obj];
	var shotFreqs = [25, 15, 10, 15, 0];
	var speeds = [1, 1.5, 1.7, 1.3, 2];
	loadEnemies(enemyObjs, shotFreqs, initX, initY+yDiff, xDiff, yDiff, randomHorizontalInit, speeds);
	var b1 = enemy6Obj.instantiate(initX, initY, e_w, e_h, 50, randomInit);
	var b2 = enemy6Obj.instantiate(C_WIDTH/2, initY, e_w, e_h, 50, randomInit);
	var b3 = enemy6Obj.instantiate(initX+7*xDiff, initY, e_w, e_h, 50, randomInit);
	enemies = [b1, b2, b3].concat(enemies);
	enemies.forEach(function(e) { e.initPath.init(); });
	activeEnemies = enemies.slice(enemies.length-2*e_cols, enemies.length);
    }
}

level16 = {
    attack_freq: function(){return 13;},
    load: function() {
	e_cols = 8;
	var yDiff = e_h * 1.6;
	var xDiff = (C_WIDTH - e_w) / e_cols;
	var initX = e_w / 1.5, initY = 40;
	var enemyObjs = [enemy4Obj, enemy3Obj,  enemy3Obj,  enemy2Obj,  enemy2Obj,  enemy1Obj,  enemy1Obj];
	var shotFreqs = [60, 30, 25, 25, 20, 0, 0];
	var speeds = [1, 1.5, 1.2, 1.5, 1.4, 1.8, 1.6];
	loadEnemies(enemyObjs, shotFreqs, initX, initY+yDiff, xDiff, yDiff, randomInit, speeds);
	enemies.forEach(function(e) { e.initPath.init(); });
	activeEnemies = enemies.slice(0, enemies.length);
    }
}

level17 = {
    attack_freq: function(){return 45;},
    load: function() {
	e_cols = 8;
	var yDiff = e_h * 1.6;
	var xDiff = (C_WIDTH - e_w) / e_cols;
	var initX = e_w / 1.5, initY = 40;
	var enemyObjs = [enemy3Obj, enemy2Obj, enemy1Obj];
	var shotFreqs = [35, 20, 0];
	var speeds = [1.2, 1.2, 1.2];
	loadEnemies(enemyObjs, shotFreqs, initX, initY+3*yDiff, xDiff, yDiff, randomInit, speeds);
	var boss = enemy9Obj.instantiate(initX+2*xDiff, initY, e_w+3*xDiff, e_h+2*yDiff, 50, randomVerticalInit);
	var m1 = enemy7Obj.instantiate(initX, initY+2*yDiff, e_w, e_h, 25, randomInit);
	var m2 = enemy7Obj.instantiate(initX+xDiff, initY+2*yDiff, e_w, e_h, 25, randomInit);
	var m3 = enemy7Obj.instantiate(initX+6*xDiff, initY+2*yDiff, e_w, e_h, 25, randomInit);
	var m4 = enemy7Obj.instantiate(initX+7*xDiff, initY+2*yDiff, e_w, e_h, 25, randomInit);
	var b1 = enemy5Obj.instantiate(initX, initY, e_w+xDiff, e_h+yDiff, 20, randomInit);
	var b2 = enemy5Obj.instantiate(initX+6*xDiff, initY, e_w+xDiff, e_h+yDiff, 20, randomInit);
	enemies = [boss, m1, m2, m3, m4, b1, b2].concat(enemies);
	enemies.forEach(function(e) { e.initPath.init(); });
	activeEnemies = enemies.slice(1, enemies.length);
    }
}

var enemyObjList = [enemy1Obj, enemy2Obj, enemy3Obj, enemy4Obj, enemy5Obj, enemy6Obj, enemy7Obj, enemy8Obj];

var worlds = [[level1, level2, level3, level4],
	      [level5, level6, level7, level8],
	      [level9, level10, level11, level12],
	      [level13, level14, level15, level16],
	      [level17]];
//worlds = [[level17]];
//[level8], [level1, level2, level3, level4]