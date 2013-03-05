
function entityCollision(e1, e2) {
    var l1=e1.x, r1=e1.x + e1.width, t1=e1.y, b1=e1.y + e1.height;
    var l2=e2.x, r2=e2.x + e2.width, t2=e2.y, b2=e2.y + e2.height;
    return r1 > l2 && l1 < r2 && t1 < b2 && b1 > t2;
}

function Life(L) {
    L.update = function() {
	if(L.path) {
	    var dir = L.path.next();
	    L.x += dir.x;
	    L.y += dir.y;
	    if(L.path.finished) {
		L.path = null;
	    }
	}
    };
    L.draw = function() {
	L.sprite.draw(c, L.x, L.y);
    };
    return L;
}

PlayerState = {
    NORMAL: 0,
    LEFT: 1,
    RIGHT: 2,
    DAMAGED: 3,
    DESTROYED: 4
}

var player = {
    color: "#00A",
    width: 36,
    height: 36,
    x: C_WIDTH / 2,
    y: C_HEIGHT - 36,
    sprites: [],
    xVel: 0,
    yVel: 0,
    visible: true,
    blinks: 0,
    blinkNum: 0,
    blinkDur: 10,
    immobile: 0,
    state: PlayerState.NORMAL,
    shielded: false,
    switchState: function(state) {
	if(this.state != PlayerState.DAMAGED) {
	    this.state = state;
	}
    },
    entityHit: function(dmg) {
	dmg = dmg || 1;
	if(this.blinks > 0) return;
	if(dmg > 1) this.shielded = false;
	if(this.shielded) {
	    this.shielded = false;
	    return;
	}
	playSound(enemyExpSound);
	explosions.push(new Explosion(this.x, this.y, this.width, this.height));
	playerLives.pop();
	if(playerLives.length == 0) {
	    this.state = PlayerState.DESTROYED;
	    isGameOver = true;
	    gameOverTimer = 15;
	} else {
	    this.x = C_WIDTH / 2;
	    this.y = C_HEIGHT - 36;
	    this.blink(3);
	}
    },
    shield: function() {
	if(this.shielded) score += 500;
	this.shielded = true;
    },
    blink: function(blinks) {
	this.blinks = blinks;
	this.immobile = 30;
    },
    update: function() {
	if(this.immobile > 0) {
	    this.immobile -= 1;
	} else {
	    if (keydown.left || keydown.a) {
		this.xVel = -8;
		this.x -= 8;
		this.switchState(PlayerState.LEFT);
	    } else if (keydown.right || keydown.d) {
		this.xVel = 8;
		this.x += 8;
		this.switchState(PlayerState.RIGHT);
	    } else {
		this.xVel = 0;
		this.switchState(PlayerState.NORMAL);
	    }
	    if(keydown.up || keydown.w) {
		this.yVel = -8;
		this.y -= 8;
	    } else if(keydown.down || keydown.s) {
		this.yVel = 8;
		this.y += 8;
	    } else {
		this.yVel = 0;
	    }
	    if(shotTimer > 10) {
		if(keydown.space) {
		    playSound(shotSound);
		    shotTimer = 0;
		    playerShots.push(Shot({
			speed: -10,
			x: this.x + (this.width / 2),
			y: this.y,
			sprites: playerShot
		    }));
		}
		if(keydown.shift && numMissiles > 0) {
		    shotTimer = 0;
		    playerShots.push(new Missile(this.x, this.y));
		    numMissiles -= 1;
		}
	    }
	}
	this.x = this.x.clamp(0, C_WIDTH - this.width);
	this.y = this.y.clamp(BOUNDARY, C_HEIGHT - this.height);
	if(this.blinks > 0) {
	    this.blinkNum += 1;
	    if(this.blinkNum >= this.blinkDur) {
		this.visible = !this.visible;
		if(this.visible) this.blinks -= 1;
		this.blinkNum = 0;
	    }
	}
    },
    draw: function() {
	if(this.state != PlayerState.DESTROYED && this.visible && !isGameOver) {
	    this.sprites[this.state].draw(c, this.x, this.y);
	    if(this.shielded) {
		shieldSprite.draw(c, this.x-6, this.y-8);
	    }
	}
    }
};

function Mine(M) {
    M.active = true;
    M.blinkTimer = 15;
    M.blink = true;
    M.width = mineSprites[0].width;
    M.height = mineSprites[0].height;
    M.sprite = mineSprites[0];
    M.draw = function() {
	M.sprite.draw(c, M.x, M.y);
    };
    M.hitEntity = function(entity) {
	if(entityCollision(M, entity)) {
	    entity.entityHit(3);
	    M.active = false;
	}
    };
    M.entityHit = function() {
	this.active = false;
	explosions.push(new Explosion(this.x, this.y, this.width, this.height));
    };
    M.update = function() {
	M.blinkTimer -= 1;
	if(M.blinkTimer <= 0) {
	    M.sprite = M.blink ? mineSprites[1] : mineSprites[0];
	    M.blink = !M.blink;
	    M.blinkTimer = 15;
	}
    };
    return M;
}

function Laser(L) {
    L.active = true;
    L.timer = L.timer || 15;
    L.width = L.width || 3;
    L.height = C_HEIGHT - L.y;
    L.yDiff = L.height / L.timer;
    L.draw = function() {
	c.fillStyle = "#71CA35";
	c.fillRect(L.x, L.y, L.width, L.height);
    };
    L.hitEntity = function(entity) {
	if(entityCollision(L, entity)) {
	    entity.entityHit();
	}
    };
    L.update = function() {
	L.timer -= 1;
	if(L.timer < 0) {
	    L.active = false;
	}
	L.y += L.yDiff;
	L.height -= L.yDiff;
	//L.x = L.owner.x + L.owner.width/2;
	//L.y = L.owner.y + L.owner.height;
    };
    return L;
}

ShotMode = {
    NORMAL: 0,
    EXPLODING: 1,
    GONE: 2
}

function Missile(x, y, speed, w, h) {
    this.x = x;
    this.y = y;
    this.speed = speed || -7;
    this.active = true;
    this.width = w || missile.width;
    this.height = h || missile.height;
    this.explosionTimer = 0;
    this.inBounds = function() {
	return this.x >= 0 && this.x <= C_WIDTH &&
	    this.y >= 0 && this.y <= C_HEIGHT;
    };
    this.draw = function() {
	missile.draw(c, this.x, this.y);
    };
    this.hitEntity = function(entity) {
	if(entityCollision(this, entity)) {
	    this.active = false;
	    var exp = new Explosion(this.x - 2*this.width, this.y - this.height, this.width*5, this.height*3)
	    explosions.push(exp);
	    enemies.forEach(function(enemy) {
		if(entityCollision(exp, enemy)) enemy.entityHit(2);
	    });
	}
    };
    this.update = function() {
	this.y += this.speed;
	if(this.y < 0 || this.y > C_HEIGHT) this.active = false;
    };
    return this;
}

function Shot(S) {
    S.width = S.width || shotW;
    S.height = S.height || shotH;
    S.active = true;
    S.mode = ShotMode.NORMAL;
    S.explosionTimer = 0;
    S.sprite = S.sprites[S.mode];
    S.inBounds = function() {
	return S.x >= 0 && S.x <= C_WIDTH &&
	    S.y >= 0 && S.y <= C_HEIGHT;
    };
    S.draw = function() {
	this.sprite.draw(c, this.x, this.y);
    };
    S.hitEntity = function(entity) {
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
	}
    };
    S.update = function() {
	switch(S.mode) {
	case ShotMode.NORMAL:
	    S.y += S.speed;
	    if(S.y < 0 || S.y > C_HEIGHT) S.active = false;
	    break;
	}
    };
    return S;
}

EnemyMode = {
    INIT: 0,
    HOVER: 1,
    ATTACK: 2,
    RETURN: 3
}

function Enemy(E) {
    E.active = true;
    E.alwaysAttack = false;
    E.mode = EnemyMode.INIT;
    E.speed = E.speed || 1;
    E.notifyEscorts = E.notifyEscorts || function(){};
    E.returnPath = function() {
	E.y = 0;
	return new PointPath([new Point(E.x, E.y), new Point(E.startX, E.startY)], [30], 1);
    };
    E.wander = function(xWander) {
	if(E.mode == EnemyMode.ATTACK) {
	    E.startX += xWander;
	} else {
	    E.x += xWander;
	}
    }
    E.attack = function(path) {
	if(E.mode == EnemyMode.ATTACK || E.mode == EnemyMode.INIT ||
	   E.x < 0 || E.x > C_WIDTH) return;
	if(E.mode == EnemyMode.HOVER) {
	    E.startX = E.x;
	    E.startY = E.y;
	}
	E.mode = EnemyMode.ATTACK;
	E.path = path ? path : E.attackPath.instantiate();
	E.notifyEscorts();
    };
    E.update = function() {
	switch(this.mode) {
	case EnemyMode.INIT:
	    var dir = E.initPath.next();
	    E.x += dir.x;
	    E.y += dir.y;
	    if(E.initPath.finished) {
		E.mode = EnemyMode.HOVER;
		var last = E.initPath.lastPoint();
		E.x = last.x;
		E.y = last.y;
		initEnemyCount += 1;
	    }
	    break;
	case EnemyMode.HOVER:
	    if(E.hoverAction) E.hoverAction();
	    break;
	case EnemyMode.ATTACK:
	    var dir = this.path.next();
	    E.x += dir.x;
	    E.y += dir.y;
	    if(entityCollision(E, player)) {
		player.entityHit();
		E.entityHit();
	    }
	    if(E.path.finished) {
		E.mode = EnemyMode.RETURN;
		E.path = E.returnPath();
	    }
	    E.shoot();
	    break;
	case EnemyMode.RETURN:
	    var dir = E.path.next();
	    E.x += dir.x;
	    E.y += dir.y;
	    if(E.path.finished) {
		E.mode = EnemyMode.HOVER;
		if(E.alwaysAttack) E.attack();
	    }
	    break;
	}
    };
    E.draw = function() {
	this.sprite.draw(c, this.x, this.y, this.width, this.height);
    };
    E.entityHit = function(dmg) {
	dmg = dmg || 1;
	this.health -= dmg;
	if(this.health <= 0) {
	    playSound(enemyExpSound);
	    var rand = Math.random();
	    if(rand < 0.02) {
		powerups.push(powerupObjs[0].instantiate(this.x, this.y));
	    } else if(rand < 0.05) {
		powerups.push(powerupObjs[1].instantiate(this.x, this.y));
	    } else if(rand < 0.06) {
		powerups.push(powerupObjs[2].instantiate(this.x, this.y));
	    }
	    score += E.score;
	    E.active = false;
	    explosions.push(new Explosion(this.x, this.y, this.width, this.height));
	    replaceActiveEnemy(E);
	}
    };
    return E;
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
    this.draw = function() {
	if(w && h) {
	    explosionSprites[this.ind].draw(c, this.x, this.y, w, h);
	} else {
	    explosionSprites[this.ind].draw(c, this.x, this.y);
	}
    };
    this.update = function() {
	this.time += 1;
	if(this.time > this.spriteTime) {
	    this.time = 0;
	    this.ind += 1;
	    if(this.ind >= explosionSprites.length) {
		this.active = false;
	    }
	}
    };
}

function Powerup(sprite, x, y, w, h, hitCallback) {
    this.sprite = sprite;
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
    this.radius = Math.sqrt(2) * w / 2;
    this.hitCallback = hitCallback;
    this.active = true;
    this.update = function() {
	this.y += 4;
	if(this.y > C_HEIGHT) {
	    this.active = false;
	} else if(entityCollision(this, player)) {
	    this.hitCallback();
	    this.active = false;
	}
    };
    this.draw = function() {
	this.sprite.draw(c, this.x, this.y, this.width, this.height);
	c.beginPath();
	c.arc(this.x+this.radius/1.5, this.y+this.radius/1.5, this.radius, 0, 2 * Math.PI);
	c.strokeStyle = "#DDD";
	c.stroke();
	c.closePath();
    };
    return this;
}

function MissilePowerup() {
    this.width = 20; this.height = 20;
    this.hitCallback = function() {
	numMissiles += 1;
    };
    this.instantiate = function(x, y) {
	return new Powerup(missile, x, y, this.width, this.height, this.hitCallback);
    };
    return this;
}

function LifePowerup() {
    this.width = 20; this.height = 20;
    this.hitCallback = function() {
	addLife(this.x, this.y);
    };
    this.instantiate = function(x, y) {
	this.powerup = new Powerup(playerLife, x, y, this.width, this.height, this.hitCallback, this.newUpdateFn);
	return this.powerup;
    };
    return this;
}

function ShieldPowerup() {
    this.width = 20; this.height = 20;
    this.hitCallback = function() {
	player.shield();
    };
    this.instantiate = function(x, y) {
	return new Powerup(shieldPowerupSprite, x, y, this.width, this.height, this.hitCallback);
    };
    return this;
}

function pointInRect(px, py, x, y, w, h) {
    return px > x && px < x+w && py > y && py < y+h;
}

function Button(text, x, y, size, font, fontColor, color, hoverColor) {
    this.font = font || "20px Arial Black";
    this.size = size || text.size(this.font);
    this.text = text;
    this.x = x;
    this.y = y;
    this.width = this.size[0]+15;
    this.height = this.size[1];
    this.left = this.x-10;
    this.top = this.y;
    this.fontColor = fontColor || "#000";
    //this.color = color || "6e898a";
    //this.hoverColor = hoverColor || "88babb";
    this.color = "rgb(110,137,138)";
    this.hoverColor = "rgb(136,186,187)";
    this.mouseOver = false;
    this.active = true;
    this.draw = function() {
	if(this.mouseOver) {
	    c.fillStyle = this.hoverColor;
	} else {
	    c.fillStyle = this.color;
	}
	c.fillRect(this.left, this.top, this.width, this.height+12);
	c.strokeStyle = "#000";
	c.strokeRect(this.left, this.top, this.width, this.height+12);
	c.font = this.font;
	c.fillStyle = this.fontColor;
	c.fillText(this.text, this.x-5, this.y+this.height);
    };
    this.hover = function(px, py) {
	this.mouseOver = pointInRect(px, py, this.left, this.top, this.width, this.height);
    };
    this.click = function(px, py) {
	if(pointInRect(px, py, this.left, this.top, this.width, this.height) && this.clickListener) {
	    this.clickListener();
	}
    };
    this.setClickListener = function(listener) {
	this.clickListener = listener;
    };
    return this;
}

function ImageButton(image, clickImage, x, y, w, h) {
    this.image = image;
    this.clickImage = clickImage;
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
    this.off = true;
    this.active = true;
    this.draw = function() {
	if(this.off) {
	    this.image.draw(c, this.x, this.y, this.width, this.height);
	} else {
	    this.clickImage.draw(c, this.x, this.y, this.width, this.height);
	}
    };
    this.hover = function(px, py) {
	this.mouseOver = pointInRect(px, py, this.x, this.y, this.width, this.height);
    };
    this.click = function(px, py) {
	if(pointInRect(px, py, this.x, this.y, this.width, this.height) && this.clickListener) {
	    this.off = !this.off;
	    this.clickListener();
	    c.clearRect(this.x, this.y, this.width, this.height);
	    this.draw();
	}
    };
    this.setClickListener = function(listener) {
	this.clickListener = listener;
    };
    return this;
}