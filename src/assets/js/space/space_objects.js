
export {
    player, Sound, Life, Mine, Laser, Missile, Shot, Enemy, Explosion, Stars,
    entityCollision,
    Button, ImageButton, Slider,
    MissilePowerup, ShieldPowerup, LifePowerup
};

import { enemies } from './space_enemies.js';
import { keyhandler } from '../util.js';

var powerupObjs = [new MissilePowerup(), new ShieldPowerup(), new LifePowerup()];

function Sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }
}

function entityCollision(e1, e2) {
    var r1 = e1.x + e1.width;
    var b1 = e1.y + e1.height;
    var r2 = e2.x + e2.width;
    var b2 = e2.y + e2.height;
    return r1 > e2.x && e1.x < r2 && e1.y < b2 && b1 > e2.y;
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
    L.draw = function(c) {
        L.sprite.draw(c, L.x, L.y);
    };
    return L;
}

var PlayerState = {
    NORMAL: 0,
    LEFT: 1,
    RIGHT: 2,
    DAMAGED: 3,
    DESTROYED: 4
}

var player = {
    color: '#00A',
    width: 36,
    height: 36,
    x: c.width / 2,
    y: c.height - 36,
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
        if(this.state !== PlayerState.DAMAGED) {
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
        if(playerLives.length === 0) {
            this.state = PlayerState.DESTROYED;
            isGameOver = true;
            gameOverTimer = 15;
        } else {
            this.x = c.width / 2;
            this.y = c.height - 36;
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
            if (keyhandler.LeftArrow || keyhandler.a) {
                this.xVel = -8;
                this.x -= 8;
                this.switchState(PlayerState.LEFT);
            } else if (keyhandler.RightArrow || keyhandler.d) {
                this.xVel = 8;
                this.x += 8;
                this.switchState(PlayerState.RIGHT);
            } else {
                this.xVel = 0;
                this.switchState(PlayerState.NORMAL);
            }
            if(keyhandler.UpArrow || keyhandler.w) {
                this.yVel = -8;
                this.y -= 8;
            } else if(keyhandler.DownArrow || keyhandler.s) {
                this.yVel = 8;
                this.y += 8;
            } else {
                this.yVel = 0;
            }
            if(shotTimer > 10) {
                if(keyhandler.Space) {
                    playSound(shotSound);
                    shotTimer = 0;
                    playerShots.push(Shot({
                        speed: -10,
                        x: this.x + (this.width / 2),
                        y: this.y,
                        sprites: playerShot
                    }));
                }
                if(keyhandler.Shift && numMissiles > 0) {
                    shotTimer = 0;
                    playerShots.push(new Missile(this.x, this.y));
                    numMissiles -= 1;
                }
            }
        }
        this.x = this.x.clamp(0, c.width - this.width);
        this.y = this.y.clamp(BOUNDARY, c.height - this.height);
        if(this.blinks > 0) {
            this.blinkNum += 1;
            if(this.blinkNum >= this.blinkDur) {
                this.visible = !this.visible;
                if(this.visible) this.blinks -= 1;
                this.blinkNum = 0;
            }
        }
    },
    draw: function(c) {
        if(this.state !== PlayerState.DESTROYED && this.visible && !isGameOver) {
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
    M.draw = function(c) {
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
    L.height = c.height - L.y;
    L.yDiff = L.height / L.timer;
    L.draw = function() {
        c.fillStyle = '#71CA35';
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

var ShotMode = {
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
        return this.x >= 0 && this.x <= c.width &&
            this.y >= 0 && this.y <= c.height;
    };
    this.draw = function(c) {
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
        if(this.y < 0 || this.y > c.height) this.active = false;
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
        return S.x >= 0 && S.x <= c.width &&
            S.y >= 0 && S.y <= c.height;
    };
    S.draw = function(c) {
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
            if(S.y < 0 || S.y > c.height) S.active = false;
            break;
        }
    };
    return S;
}

var EnemyMode = {
    INIT: 0,
    HOVER: 1,
    ATTACK: 2,
    RETURN: 3
}

function Enemy(E) {
    E.active = true;
    E.alwaysAttack = false;
    E.mode = E.mode || EnemyMode.INIT;
    E.speed = E.speed || 1;
    E.notifyEscorts = E.notifyEscorts || function(){};
    E.returnPath = function() {
        E.y = 0;
        return new PointPath([new Point(E.x, E.y), new Point(E.startX, E.startY)], [30], 1);
    };
    E.clone = function(x, y) {
        var e = Enemy({
            sprite: E.sprite, x: x || E.x, y: y || E.y,
            width: E.width, height: E.height,
            score: E.score, health: E.health
        });
        e.speed = E.speed;
        e.shotFreq = E.shotFreq;
        e.initPathFn = E.initPathFn;
        e.attackPathFn = E.attackPathFn;
        e.shootFn = E.shootFn;
        e.wanderFn = E.wanderFn;
        e.hoverActionFn = E.hoverActionFn;
        if(E.initPathFn) e.initPath = new E.initPathFn(e);
        if(E.attackPathFn) e.attackPath = new E.attackPathFn(c, e);
        e.shoot = E.shootFn(e, E.shotFreq);
        if(E.hoverActionFn) e.hoverAction = e.hoverActionFn(e, e.shotFreq);
        if(e.wanderFn) e.wander = e.wanderFn(e);
        return e;
    };
    E.wander = function(xWander) {
        if(E.mode === EnemyMode.ATTACK) {
            E.startX += xWander;
        } else {
            E.x += xWander;
        }
    }
    E.attack = function(path) {
        if(E.mode === EnemyMode.ATTACK || E.mode === EnemyMode.INIT ||
           E.x < 0 || E.x > c.width || E.attackPath === null) return;
        if(E.mode === EnemyMode.HOVER) {
            E.startX = E.x;
            E.startY = E.y;
        }
        E.mode = EnemyMode.ATTACK;
        E.path = path ? path : E.attackPath.instantiate();
        E.notifyEscorts();
    };
    E.update = function() {
        switch(this.mode) {
        case EnemyMode.INIT: {
            let dir = E.initPath.next();
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
        }
        case EnemyMode.HOVER:
            if(E.hoverAction) E.hoverAction();
            break;
        case EnemyMode.ATTACK: {
            let dir = this.path.next();
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
        }
        case EnemyMode.RETURN: {
            var dir = E.path.next();
            E.x += dir.x;
            E.y += dir.y;
            if(E.path.finished) {
                E.mode = EnemyMode.HOVER;
                if(E.alwaysAttack) E.attack();
            }
            break;
        }
        }
    };
    // TODO -- move this functionality to editor
    E.draw = function(c) {
        this.sprite.draw(c, this.x, this.y, this.width, this.height);
        if(gameMode === GameMode.EDIT) {
            if(this.squared) {
                c.strokeStyle = '#DDD';
                c.strokeRect(this.x, this.y, this.width, this.height);
            }
            c.strokeStyle = '#0F0';
            if(this.editorActive || activeEnemies.indexOf(this) !== -1) {
                c.beginPath();
                c.arc(this.x+this.width/2, this.y+this.height/2, 1.2*this.width/2, 0, 2 * Math.PI);
                c.stroke();
                c.closePath();
            }
            var next = this.parent;
            while(next) {
                if(next.active) {
                    c.beginPath();
                    c.moveTo(this.x+this.width/2, this.y+this.height/2);
                    c.lineTo(next.x+next.width/2, next.y+next.height/2);
                    c.closePath();
                    c.stroke();
                    break;
                } else {
                    next = next.parent;
                }
            }
        }
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
    this.draw = function(c) {
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
        if(this.y > c.height) {
            this.active = false;
        } else if(entityCollision(this, player)) {
            this.hitCallback();
            this.active = false;
        }
    };
    this.draw = function(c) {
        this.sprite.draw(c, this.x, this.y, this.width, this.height);
        c.beginPath();
        c.arc(this.x+this.radius/1.5, this.y+this.radius/1.5, this.radius, 0, 2 * Math.PI);
        c.strokeStyle = '#DDD';
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
    this.font = font || '20px Arial Black';
    this.size = size || text.size(this.font);
    this.text = text;
    this.x = x;
    this.y = y;
    this.width = this.size[0]+15;
    this.height = this.size[1] + 12;
    this.left = this.x-10;
    this.top = this.y;
    this.fontColor = fontColor || '#000';
    //this.color = color || '6e898a';
    //this.hoverColor = hoverColor || '88babb';
    this.color = 'rgb(110,137,138)';
    this.hoverColor = 'rgb(136,186,187)';
    this.mouseOver = false;
    this.active = true;
    this.draw = function() {
        if(this.mouseOver) {
            c.fillStyle = this.hoverColor;
        } else {
            c.fillStyle = this.color;
        }
        c.lineWidth=1;
        c.fillRect(this.left, this.top, this.width, this.height);
        c.strokeStyle = '#000';
        c.strokeRect(this.left, this.top, this.width, this.height);
        c.font = this.font;
        c.fillStyle = this.fontColor;
        c.fillText(this.text, this.x-5, this.y+this.height/1.5);
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

function ImageButton(c, image, clickImage, x, y, w, h) {
    this.image = image;
    this.clickImage = clickImage;
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
    this.off = true;
    this.active = true;
    this.draw = function(c) {
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
            this.draw(c);
        }
    };
    this.setClickListener = function(listener) {
        this.clickListener = listener;
    };
    return this;
}

/* A vertical or horizontal slider with a label and optional callback for when the value changes
   by step. A step of 0 means the slider is continuous */
function Slider(c, label, units, x, y, width, height, min, max, step, horizontal, changeListener) {
    this.label = label;
    this.units = units;
    this.x = x; this.y = y;
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
    this.font = c.font = '14px Arial';
    c.font = this.font;
    this.labelSize = c.measureText(label);
    this.unitsSize = c.measureText('00.000' + units);
    this.getVal = function(pos, min, length) {
        return (this.max - this.min) * (pos - min) / length + this.min;
    };
    this.move = function(xDiff, yDiff) {
        this.setPos(this.x + xDiff, this.y + yDiff);
    };
    this.setPos = function(x, y) {
        this.x = x;
        this.y = y;
        if(this.horizontal) {
            this.yKnob = y + 20;
        } else {
            this.xKnob = x;
        }
        this.setToVal(this.val);
    };
    this.valueFn = function() {
        var value = this.val;
        return function() { return value };
    };
    this.updateDisplayVal = function() {
        if(this.step === 0) {
            this.displayVal = this.val;
        } else {
            var floor = this.step * Math.floor((this.val - this.min) / this.step);
            this.displayVal = (this.val - floor > this.step / 2) ? floor + this.step : floor;
        }
    };
    this.setToVal = function(val) {
        if(val >= this.min && val <= this.max) {
            if(this.horizontal) {
                this.xKnob = this.width * (val - this.min) / (this.max - this.min) + this.x;
            } else {
                this.yKnob = this.height * (val - this.min) / (this.max - this.min) + this.height;
            }
            this.val = val;
            if(this.changeListener) this.changeListener(val);
            this.updateDisplayVal();
        }
    };
    this.slide = function(xDiff, yDiff) {
        if(horizontal) {
            this.xKnob += xDiff;
            this.xKnob = this.xKnob.clamp(this.x, this.x + this.width);
            this.val = this.getVal(this.xKnob, this.x, this.width);
        } else {
            this.yKnob += yDiff;
            this.yKnob = this.yKnob.clamp(this.y, this.y + this.height);
            this.val = this.getVal(this.yKnob, this.y, this.height);
        }
        this.updateDisplayVal();
        if(this.changeListener) this.changeListener(this.displayVal);
    };
    this.hit = function(x, y) {
        this.clicked = x > this.xKnob - this.radius && x < this.xKnob + this.radius &&
            y > this.yKnob - this.radius && y < this.yKnob + this.radius;
        return this.clicked;
    };
    this.draw = function(c) {
        c.beginPath();
        c.lineWidth = this.height / 4;
        c.lineCap = 'round';
        c.strokeStyle = '#05F';
        c.moveTo(this.x, this.y + 20);
        if(this.horizontal) c.lineTo(this.x + this.width, this.y + 20);
        else c.lineTo(this.x, this.y + this.height);
        c.closePath();
        c.stroke();
        c.beginPath();
        c.fillStyle = '#000';
        c.arc(this.xKnob, this.yKnob, this.radius + (this.clicked ? 1.5 : 0), 0, 2 * Math.PI);
        c.fillStyle = this.color;
        c.fill();
        c.closePath();
        c.font = this.font;
        var valStr = this.displayVal.toFixed(3) + ' ' + this.units;
        if(this.horizontal) {
            var xMid = this.x + this.width / 2;
            c.fillText(this.label, xMid - this.labelSize.width / 2, this.y);
            c.fillText(valStr, xMid - this.unitsSize.width / 2, this.y + 13);
        } else {
            c.fillText(this.label, this.x + 10, this.y + 10);
            c.fillText(valStr, this.x + 10, this.y + 25);
        }
    };
    return this;
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
    this.add = function(x, y) {
        var star = [];
        star.push(x || Math.random() * c.width);
        star.push(y || 0);
        star.push(Math.random() * (this.maxWidth) + this.minSize);
        star.push(Math.random() * (this.maxSpeedWidth) + this.minSpeed);
        this.stars.push(star);
    };
    this.update = function(c) {
        this.timer -= 1;
        if(this.timer <= 0) {
            this.add();
            this.timer = Math.random() * freq + freq / 2;
        }
        this.stars = this.stars.filter(function(star) {
            star[1] += star[3];
            return star[1] < c.height;
        });
    };
    this.draw = function(c) {
        var sprite = this.sprite;
        this.stars.forEach(function(star) {
            sprite.draw(c, star[0], star[1], star[2], star[2]);
        });
    };
    return this;
}
