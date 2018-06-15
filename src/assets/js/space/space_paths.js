
import { gameState } from './game_state.js';
import { player } from './space_objects.js';

export { Point, PointPath };
export { followPlayerPath, avoidPlayerPath, standardAttackPath, sweepAttackPath, randomInit,
    randomVerticalInit, randomHorizontalInit };

function Point(x, y) {
    this.x = x; this.y = y;
    return this;
}

function PointPath(points, durations, speed, pathStartCallback) {
    speed = speed || 1;
    for(var i = 0; i < durations.length; i++) {
        durations[i] = durations[i] / speed;
    }
    this.pathStartCallback = pathStartCallback;
    this.finished = false;
    this.durations = durations;
    this.points = points;
    this.time = 0;
    this.index = 1;
    this.xStep = (points[1].x - points[0].x) / durations[0];
    this.yStep = (points[1].y - points[0].y) / durations[0];
    this.init = function() {
        if(pathStartCallback) this.pathStartCallback();
    };
    this.next = function() {
        this.time += 1;
        if(this.time >= this.durations[this.index - 1]) {
            this.index += 1;
            if(this.index >= this.points.length) {
                this.finished = true;
            } else {
                this.time = 0;
                this.xStep = (this.points[this.index].x - this.points[this.index - 1].x) / this.durations[this.index - 1];
                this.yStep = (this.points[this.index].y - this.points[this.index - 1].y) / this.durations[this.index - 1];
            }
        }
        return new Point(this.xStep, this.yStep);
    };
    this.lastPoint = function() {
        return this.points[this.points.length - 1];
    };
    return this;
};

function FollowPlayer(c, E, duration) {
    this.E = E;
    this.finished = false;
    this.duration = duration;
    this.next = function() {
        this.duration -= 1;
        if(E.y > gameState.c.height) {
            this.finished = true;
            return new Point(0, 0);
        } else if(this.duration <= 0 || this.E.y > gameState.c.width - 1.5 * this.E.height) {
            return new Point(0, 8);
        }
        var projX = ((player.x + 5 * player.xVel) - this.E.x) + (player.x - this.E.x) / 1.5;
        var projY = player.y - this.E.y;
        var dist = Math.sqrt(projX * projX + projY * projY);
        var xVel = 9 * projX / dist;
        var yVel = 6 * projY / dist;
        return new Point(xVel, yVel);
    };
    return this;
}

function AvoidPlayer(E, duration) {
    this.E = E;
    this.finished = false;
    this.done = false;
    this.duration = duration;
    this.next = function() {
        if(this.E.y > gameState.c.height) {
            this.finished = true;
            return new Point(0, 0);
        }
        if(this.E.x < 0) return new Point(12, 0);
        if(this.E.x > gameState.c.width) return new Point(-12, 0);
        var projX = ((player.x + 10 * player.xVel) - this.E.x) + (player.x - this.E.x) / 1.5;
        var projY = (player.y + 3 * player.yVel) - this.E.y;
        var dist = Math.sqrt(projX * projX + projY * projY);
        var xVel = -10 * projX / dist;
        if((this.E.x < this.E.width && xVel < 0) ||
            (this.E.x > gameState.c.width - 2 * this.E.width && xVel > 0) ||
            Math.abs(projX) > gameState.c.width / 2) {
            xVel = 0;
        }
        var yVel = 7;
        return new Point(xVel, yVel);
    };
    return this;
}

function clonePointPath(pathObj, entity) {
    var xDiff = 0;
    var yDiff = 0;
    var newPoints = [];
    pathObj.points.forEach(function(point) {
        newPoints.push(new Point(point.x + xDiff, point.y + yDiff));
    });
    return new PointPath(newPoints, pathObj.durs.slice(0, pathObj.durs.length), pathObj.E.speed);
}

function standardAttackPath(E) {
    this.E = E;
    this.instantiate = function() {
        var dir = (Math.random() < 0.5) ? -1 : 1;
        this.points = [new Point(E.x, E.y), new Point(E.x + dir * gameState.c.width / 4, E.y + gameState.c.height / 6),
            new Point(E.x - dir * gameState.c.width / 3, gameState.c.height)];
        this.durs = [30, 80];
        return new PointPath(this.points, this.durs, E.speed);
    };
    this.clone = function(entity) {
        return clonePointPath(this, entity);
    };
    return this;
}

function sweepAttackPath(E) {
    this.E = E;
    this.instantiate = function() {
        var x1, x2;
        if(E.x < gameState.c.width / 2) {
            x1 = 0; x2 = gameState.c.width;
        } else {
            x1 = gameState.c.width; x2 = 0;
        }
        this.durs = [40, 150];
        this.points = [new Point(E.x, E.y), new Point(x1, E.y + gameState.c.height / 8), new Point(x2, gameState.c.height - E.y)];
        return new PointPath(this.points, this.durs, 1);
    };
    this.clone = function(entity) {
        return clonePointPath(this, entity);
    };
    return this;
}

function followPlayerPath(c, E, duration) {
    this.E = E;
    this.duration = duration || 90;
    this.instantiate = function() {
        return new FollowPlayer(c, E, this.duration);
    };
    this.clone = function(entity) {
        return new FollowPlayer(c, entity, this.duration);
    };
    return this;
}

function avoidPlayerPath(c, E, duration) {
    this.E = E;
    this.duration = duration || 100;
    this.instantiate = function() {
        return new AvoidPlayer(E, this.duration);
    };
    this.clone = function(entity) {
        return new AvoidPlayer(entity, this.duration);
    };
    return this;
}

function randomVerticalInit(c, E, minDur) {
    this.minDur = minDur || 0;
    this.instantiate = function() {
        this.points = [new Point(E.x, E.y - c.height), new Point(E.x, E.y)];
        this.durs = [this.minDur + 20 + Math.random() * 40];
        var pathStartCallback = function() {
            E.y -= c.height;
        };
        var path = new PointPath(this.points, this.durs, 1, pathStartCallback);
        return path;
    };
    this.clone = function(entity) {
        return clonePointPath(this, entity);
    };
    return this;
}

function randomHorizontalInit(c, E, minDur) {
    this.minDur = minDur || 0;
    this.instantiate = function() {
        var dir = (E.x < c.width / 2) ? -1 * c.width : c.width;
        this.points = [new Point(E.x + dir, E.y), new Point(E.x, E.y)];
        this.durs = [this.minDur + 20 + Math.random() * 40];
        var pathStartCallback = function() {
            E.x += dir;
        };
        var path = new PointPath(this.points, this.durs, 1, pathStartCallback);
        return path;
    };
    this.clone = function(entity) {
        return clonePointPath(this, entity);
    };
    return this;
}

function randomInit(c, E, minDur) {
    this.E = E;
    this.minDur = minDur || 0;
    this.instantiate = function() {
        var newX = Math.random() * c.width;
        this.points = [new Point(newX, E.y - c.height), new Point(E.x, E.y)];
        this.durs = [this.minDur + 20 + Math.random() * 40];
        var pathStartCallback = function() {
            E.x = newX;
            E.y -= c.height;
        };
        var path = new PointPath(this.points, this.durs, 1, pathStartCallback);
        return path;
    };
    this.clone = function(entity) {
        return clonePointPath(this, entity);
    };
    return this;
}
