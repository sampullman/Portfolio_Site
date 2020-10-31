
import { gameState } from './space_state';

const { player } = gameState;

function Point(x, y) {
  this.x = x; this.y = y;
  return this;
}

function PointPath(points, durations, speed, pathStartCallback) {
  const pathSpeed = speed || 1;
  for(let i = 0; i < durations.length; i += 1) {
    durations[i] /= pathSpeed;
  }
  this.pathStartCallback = pathStartCallback;
  this.finished = false;
  this.durations = durations;
  this.points = points;
  this.time = 0;
  this.index = 1;
  this.xStep = (points[1].x - points[0].x) / durations[0];
  this.yStep = (points[1].y - points[0].y) / durations[0];
  const self = this;
  this.init = () => {
    if(pathStartCallback) {
      self.pathStartCallback();
    }
  };
  this.next = () => {
    self.time += 1;
    if(self.time >= self.durations[self.index - 1]) {
      self.index += 1;
      if(self.index >= self.points.length) {
        self.finished = true;
      } else {
        self.time = 0;
        self.xStep = (self.points[self.index].x - self.points[self.index - 1].x) / self.durations[self.index - 1];
        self.yStep = (self.points[self.index].y - self.points[self.index - 1].y) / self.durations[self.index - 1];
      }
    }
    return new Point(self.xStep, self.yStep);
  };
  this.lastPoint = () => self.points[self.points.length - 1];
  return this;
}

function FollowPlayer(c, E, duration) {
  this.E = E;
  this.finished = false;
  this.duration = duration;
  const self = this;
  this.next = () => {
    self.duration -= 1;
    if(E.y > gameState.c.height) {
      self.finished = true;
      return new Point(0, 0);
    }
    if(self.duration <= 0 || self.E.y > gameState.c.width - 1.5 * self.E.height) {
      return new Point(0, 8);
    }
    const projX = ((player.x + 5 * player.xVel) - self.E.x) + (player.x - self.E.x) / 1.5;
    const projY = player.y - self.E.y;
    const dist = Math.sqrt(projX * projX + projY * projY);
    const xVel = 9 * (projX / dist);
    const yVel = 6 * (projY / dist);
    return new Point(xVel, yVel);
  };
  return this;
}

function AvoidPlayer(c, E, duration) {
  this.E = E;
  this.finished = false;
  this.done = false;
  this.duration = duration;
  const self = this;
  this.next = () => {
    if(self.E.y > gameState.c.height) {
      self.finished = true;
      return new Point(0, 0);
    }
    if(self.E.x < 0) {
      return new Point(12, 0);
    }
    if(self.E.x > gameState.c.width) {
      return new Point(-12, 0);
    }
    const projX = ((player.x + 10 * player.xVel) - self.E.x) + (player.x - self.E.x) / 1.5;
    const projY = (player.y + 3 * player.yVel) - self.E.y;
    const dist = Math.sqrt(projX * projX + projY * projY);
    let xVel = -10 * (projX / dist);
    if((self.E.x < self.E.width && xVel < 0)
        || (self.E.x > gameState.c.width - 2 * self.E.width && xVel > 0)
        || Math.abs(projX) > gameState.c.width / 2
    ) {
      xVel = 0;
    }
    return new Point(xVel, 7);
  };
  return this;
}

function clonePointPath(pathObj, _entity) {
  const xDiff = 0;
  const yDiff = 0;
  const newPoints = [];
  pathObj.points.forEach((point) => {
    newPoints.push(new Point(point.x + xDiff, point.y + yDiff));
  });
  return new PointPath(newPoints, pathObj.durs.slice(0, pathObj.durs.length), pathObj.E.speed);
}

function StandardAttackPath(c, E) {
  this.E = E;
  const self = this;
  this.instantiate = () => {
    const dir = (Math.random() < 0.5) ? -1 : 1;
    self.points = [new Point(E.x, E.y), new Point(E.x + dir * (c.width / 4), E.y + c.height / 6),
      new Point(E.x - dir * (c.width / 3), c.height)];
    self.durs = [30, 80];
    return new PointPath(self.points, self.durs, E.speed);
  };
  this.clone = entity => clonePointPath(self, entity);
  return this;
}

function SweepAttackPath(c, E) {
  this.E = E;
  const self = this;
  this.instantiate = () => {
    let x1;
    let x2;
    if(E.x < c.width / 2) {
      x1 = 0; x2 = c.width;
    } else {
      x1 = c.width; x2 = 0;
    }
    self.durs = [40, 150];
    self.points = [new Point(E.x, E.y), new Point(x1, E.y + c.height / 8), new Point(x2, c.height - E.y)];
    return new PointPath(self.points, self.durs, 1);
  };
  this.clone = entity => clonePointPath(self, entity);
  return this;
}

function FollowPlayerPath(c, E, duration) {
  this.E = E;
  this.duration = duration || 90;
  const self = this;
  this.instantiate = () => new FollowPlayer(c, E, self.duration);
  this.clone = entity => new FollowPlayer(c, entity, self.duration);
  return this;
}

function AvoidPlayerPath(c, E, duration) {
  this.E = E;
  this.duration = duration || 100;
  const self = this;
  this.instantiate = () => new AvoidPlayer(E, self.duration);
  this.clone = entity => new AvoidPlayer(entity, self.duration);
  return this;
}

function RandomVerticalInit(c, E, minDur) {
  this.minDur = minDur || 0;
  const self = this;
  this.instantiate = () => {
    self.points = [new Point(E.x, E.y - c.height), new Point(E.x, E.y)];
    self.durs = [self.minDur + 20 + Math.random() * 40];
    const pathStartCallback = () => {
      E.y -= c.height;
    };
    return new PointPath(self.points, self.durs, 1, pathStartCallback);
  };
  this.clone = entity => clonePointPath(self, entity);
  return this;
}

function RandomHorizontalInit(c, E, minDur) {
  this.minDur = minDur || 0;
  const self = this;
  this.instantiate = () => {
    const dir = (E.x < c.width / 2) ? -1 * c.width : c.width;
    self.points = [new Point(E.x + dir, E.y), new Point(E.x, E.y)];
    self.durs = [self.minDur + 20 + Math.random() * 40];
    const pathStartCallback = () => {
      E.x += dir;
    };
    return new PointPath(self.points, self.durs, 1, pathStartCallback);
  };
  this.clone = entity => clonePointPath(self, entity);
  return this;
}

function RandomInit(c, E, minDur) {
  this.E = E;
  this.minDur = minDur || 0;
  const self = this;
  this.instantiate = () => {
    const newX = Math.random() * c.width;
    self.points = [new Point(newX, E.y - c.height), new Point(E.x, E.y)];
    self.durs = [self.minDur + 20 + Math.random() * 40];
    const pathStartCallback = () => {
      E.x = newX;
      E.y -= c.height;
    };
    return new PointPath(self.points, self.durs, 1, pathStartCallback);
  };
  this.clone = entity => (
    clonePointPath(self, entity)
  );
  return this;
}

export {
  FollowPlayerPath, AvoidPlayerPath, StandardAttackPath, SweepAttackPath, RandomInit,
  RandomVerticalInit, RandomHorizontalInit,
  Point, PointPath,
};
