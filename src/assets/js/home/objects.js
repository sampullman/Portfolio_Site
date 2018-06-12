/*
var formats = [ "wav", "mp3" ];
var bubble = new buzz.sound( "/static/sounds/bubble", {
    formats: formats });
var crack = new buzz.sound( "/static/sounds/crack", {
    formats: formats });
var bounce = new buzz.sound( "/static/sounds/bounce", {
    formats: formats });
*/

let Powerups = {
    NONE: 0,
    EXTRA_BALL: 1,
    BALL_SIZE: 2
};

var player = {
    color: '#00A',
    width: 72,
    height: 12,
    x: 0,
    y: 0,
    init: function(x, y) {
        this.x = x;
        this.y = y;
    },
    draw: function(c) {
        this.sprite.draw(c, this.x, this.y);
    }
};

export { Powerups, player, Ball, Block, SuperBlock };

function Ball(B) {
    B.active = true;

    B.xVel = 0;
    B.yVel = -B.speed;
    B.radius = 8;
    B.color = '#000';
    B.debug = null;
    B.y -= B.radius;

    B.inBounds = function(c) {
        return B.x >= 0 && B.x <= c.width &&
            B.y >= 0 && B.y <= c.height;
    };

    B.draw = function(c) {
        c.beginPath();
        c.arc(B.x, B.y, B.radius, 0, 2 * Math.PI);
        c.fillStyle = this.color;
        c.fill();
        c.closePath();
        /*
        if(debug != null) {
            c.fillText(debug, 0, 100);
        }
        */
    };

    B.randomSize = function() {
        var size = Math.floor(Math.random() * 3);
        if(size === 2) {
            B.radius = 4;
        } else if(size === 1) {
            B.radius = 15;
        } else {
            B.radius = 8;
        }
    };

    B.hitPlayer = function() {
        return B.x + B.radius > player.x && B.x - B.radius < player.x + player.width &&
            B.y + B.radius > player.y;
    };

    B.hitBlock = function(block) {
        if(B.x + B.radius > block.x && B.x - B.radius < block.x + block.width &&
            B.y + B.radius > block.y && B.y - B.radius < block.y + block.height) {
            var velY = Math.abs(B.yVel);
            if((B.y - B.radius) + velY >= block.y + block.height ||
                B.y + B.radius - velY <= block.y) {
                B.yVel *= -1;
            } else {
                B.xVel *= -1;
            }
            return true;
        }
    };

    B.update = function(c) {
        B.x += B.xVel;
        B.y += B.yVel;

        if(B.x - B.radius < 0) {
            // bounce.play();
            B.x = B.radius;
            B.xVel *= -1;
        } else if(B.x + B.radius > c.width) {
            // bounce.play();
            B.x = c.width - B.radius - 1;
            B.xVel *= -1;
        } else if(B.y - B.radius < 0) {
            // bounce.play();
            B.y = B.radius;
            B.yVel *= -1;
        } else if(B.hitPlayer()) {
            // bounce.play();
            B.yVel *= -1;
            var t = (B.x - player.x) / player.width;
            B.xVel = 8 * (t - 0.5);
            B.y = player.y - B.radius;
        } else if(B.y + B.radius > c.height) {
            B.active = false;
        }
    };

    return B;
}

function Block(B) {
    B.active = true;
    B.powerup = B.powerup || Powerups.NONE;

    B.draw = function(c) {
        this.sprite.draw(c, this.x, this.y);
    };

    B.handleHit = function(balls, other) {
        // bubble.play();
        if(B.powerup === Powerups.BALL_SIZE) {
            if(Math.random() < 0.2) {
                other.randomSize();
            }
        }
        this.active = false;
    };
    return B;
}

function SuperBlock(B) {
    B.powerup = B.powerup || Powerups.NONE;
    B.active = true;
    B.state = 0;
    B.num_states = B.sprites.length;

    B.draw = function(c) {
        this.sprites[this.state].draw(c, this.x, this.y);
    };

    B.handleHit = function(balls, other) {
        // crack.play();
        this.state += 1;
        if(this.state >= this.num_states) {
            this.active = false;
            switch(B.powerup) {
            case Powerups.EXTRA_BALL:
                balls.push(Ball({
                    speed: 6,
                    x: this.x,
                    y: this.y
                }));
                break;
            }
            balls.forEach(function(ball) {
                // TODO -- calculate new velocity vector & convert back to x/y vel.
                ball.xVel *= 1.1;
                ball.yVel *= 1.1;
            });
        }
    };

    return B;
}
