var count = 0;
function CollisionSystem() {
    this.dynamics = [];
    this.statics = [];
    this.responses = [];
    this.resolutions = [];
    this.v1 = new Vec2();
    this.update = function(timeDelta, parent) {
        var c1, c2;
        var x=0;
        for(var i=0;i<this.dynamics.length;i+=1) {
            c1 = this.dynamics[i];
            for(var j=0;j<this.statics.length;j+=1) {
                c2 = this.statics[j];
                this.test(c1, c2);
            }
            for(var j=i+1;j<this.dynamics.length;j+=1) {
                c2 = this.dynamics[j];
                this.test(c1, c2);
            }
        }
        this.resolutions.forEach(function(resolution) {
            resolution.resolve();
        });
        this.responses.forEach(function(response) {
            response.respond();
        });
        this.responses.length = 0;
        this.resolutions.length = 0;
        this.dynamics.length = 0;
        this.statics.length = 0;
    };
    this.test = function(c1, c2) {
        switch(c1.type) {
        case Collision.POLY:
            if(c2.type == Collision.CIRCLE) {
                Collision.boxCircle(c1, c2, true);
            } else {
                Collision.boxBox(c1, c2);
            };
            break;
        case Collision.LINE:
            if(c2.type == Collision.CIRCLE) {
                Collision.lineCircle(c1, c2);
            } else {
                Collision.boxBox(c1, c2);
            };
            break;
        case Collision.CIRCLE:
            switch(c2.type) {
            case Collision.POLY:
                Collision.boxCircle(c2, c1, false);
                break;
            case Collision.LINE:
                Collision.lineCircle(c2, c1);
                break;
            case Collision.CIRCLE:
                Collision.circleCircle(c1, c2);
                break;
            }
            break;
        }
    };
    this.register = function(component) {
        if(component.static) {
            this.statics.push(component);
        } else {
            this.dynamics.push(component);
        }
    };
    this.registerResponse = function(component) {
        this.responses.push(component);
    };
    this.registerResolution = function(component) {
        this.resolutions.push(component);
    };
}
var Collision = {
    POLY: 0,
    CIRCLE: 1,
    LINE: 2,
    CollisionResolution: function(system, parent) {
        this.v1 = new Vec2();
        this.v2 = new Vec2();
        this.v3 = new Vec2();
        this.v4 = new Vec2();
        this.m1 = new Vec2();
        this.m2 = new Vec2();
        this.system = system;
        this.parent = parent;
        this.tag = "resolution";
        this.update = function(timeDelta, parent) {
            this.system.registerResolution(this);
        };
        this.resolve = function() {
            var parent = this.parent;
            var records = parent.collisionRecords;
            if(records.length > 0) {
                var v1=this.v1, v2=this.v2, v3=this.v3, v4=this.v4;
                var proj, oneOverMass, massSub, otherMass2, record;
                for(var i=0;i<records.length;i+=1) {
                    var record = records[i];
                    if(record[3][0]) {
                        continue;
                    }
                    var other = record[0];
                    proj = record[2];
                    v1.set(proj).scale(1.05);
                    if(other.move) {
                        v1.scale(0.5);
                        v2.set(v1).scale(-1);
                        this.m2.set(v2);
                    }
                    this.m1.set(v1);
                    var t = new Vec2(v1);
                    v1 = proj.nor();
                    v2.setXY(-v1.y, v1.x).nor();
                    var Ma = parent.mass, Mb = other.mass;
                    var Ua = parent.vel.dot(v1), Ub = other.vel.dot(v1);
                    var MaUa = Ma*Ua, MbUb = Mb*Ub, MabRecip = 1 / (Ma + Mb);
                    var Va = (0.99*Mb*(Ub - Ua) +  MaUa + MbUb) * MabRecip;
                    var Vb = (0.99*Ma*(Ua - Ub) + MaUa + MbUb) * MabRecip;
                    v3.set(v1);
                    v4.set(v2);
                    parent.reportCollisionResponse(
                        v1.scale(other.bounce.y*Va).add(v2.scale(other.bounce.x*parent.vel.dot(v2))),
                        this.m1);
                    other.reportCollisionResponse(
                        v3.scale(parent.bounce.y*Vb).add(v4.scale(parent.bounce.x*other.vel.dot(v4))),
                        this.m2);
                    record[3][0] = true;
                }
                count += 1;
            }
        }
    },
    CollisionResponse: function(system, parent) {
        this.system = system;
        this.parent = parent;
        this.tag = "response";
        this.update = function(timeDelta, parent) {
            this.system.registerResponse(this);
        };
        this.respond = function() {
            if(this.parent.numCollisions > 0) {
                this.parent.move(this.parent.adjustPos);
                this.parent.vel.set(this.parent.nextVel.scale(1/this.parent.numCollisions));
                this.parent.nextVel.setXY(0, 0);
                this.parent.adjustPos.setXY(0, 0);
                this.parent.numCollisions = 0;
            };
        };
    },
    getIntersection: function(seg1, seg2, result) {
        var p1=seg1.p1, p2=seg1.p2, q1=seg2.p1, q2=seg2.p2;
        var rx=p2.x - p1.x, ry=p2.y-p1.y;
        var sx=q2.x - q1.x, sy=q2.y-q1.y;
        var rcs = rx*sy - ry*sx;
        var qmpX=q1.x - p1.x, qmpY=q1.y - p1.y;
        var qmpcr = (qmpX*ry - qmpY*rx);
        if(rcs == 0) {
            if(qmpcr == 0) {
                result.set(p1.x + 0.5*rx, p1.y + 0.5*ry);
            } else {
                result.set(0, 0);
                return false;
            }
        } else {
            var t = (qmpX*sy - qmpY*sx) / rcs;
            var u = qmpcr / rcs;
            if(t >= 0 && t <= 1 && u >= 0 && u <= 1) {
                result.setXY(q1.x + u*sx, q1.y + u*sy);
            } else {
                result.set(0, 0);
                return false;
            }
        }
        return true;
    },
    Circle: function(system, parent, options) {
        options = options || {};
        this.tag = "collision";
        this.static = options.static;
        this.type = Collision.CIRCLE;
        this.system = system;
        this.parent = parent;
        this.center = parent.center;
        this.v1 = new Vec2();
        this.v2 = new Vec2();
        this.update = function(timeDelta, parent) {
            this.vel = parent.vel;
            this.system.register(this);
        };        
    },
    Geom: function(system, parent, points, options) {
        options = options || {};
        this.tag = "collision";
        this.static = options.static;
        this.system = system;
        this.points = points;
        this.parent = parent;
        this.v1 = new Vec2();
        this.v2 = new Vec2();
        this.distance = function(v1, v2) {
            if (v1.x < v2.x) return v2.x - v1.y;
            else return v1.x - v2.y;
        };
        this.getMinMax = function(axis, res) {
            var points = this.points;
            var min = points[0].dot(axis);
            var max = min;
            var temp;
            for(var i=1;i<points.length;i+=1) {
                temp = points[i].dot(axis);
                if(temp > max) max = temp;
                if(temp < min) min = temp;
            }
            res.setXY(min, max);
        };
        this.update = function(timeDelta, parent) {
            this.vel = parent.vel;
            this.system.register(this);
        };
    },
    boxCircle: function(b, c, box) {
        var min = Number.MAX_VALUE, dist;
        var dir = c.v1, nor;
        for(var i=0;i<b.points.length;i+=1) {
            dist = Collision.lineCircleHelp(b.points[i], b.points[(i+1)%b.points.length], c);
            if(dist > 0) dist = Collision.circlePoint(c, b.points[i]);
            if(dist < 0) {
                min = dist;
                dir.set(c.v1);
                //nor = b.normals[i];
                break;
            }
            /*
              if(dist > max) {
              max = dist;
              dir = b.v1;
              }
            */
        }
        if(min < 0) {
            var nor = new Vec2(dir.nor());
            dir.scale(min);
            var consumed = [false];
            b.parent.reportCollision(c.parent, nor, new Vec2(dir).scale(-1), consumed);
            c.parent.reportCollision(b.parent, new Vec2(nor).scale(-1), new Vec2(dir), consumed);
        }
    },
    circlePoint: function(c, p) {
        c.v1.set(p).sub(c.center);
        var dist =  c.v1.mag() - c.parent.radius;
        return dist;
    },
    lineCircleHelp: function(p1, p2, c) {
        c.v2.set(p2).sub(p1);
        var lineLen = c.v2.mag();
        c.v2.nor();
        c.v1.set(c.center).sub(p1);
        var proj = c.v1.dot(c.v2);
        if(proj < 0 || proj > lineLen) {
            return Number.MAX_VALUE;
        }
        c.v1.set(p1).add(c.v2.scale(proj));
        return c.v1.sub(c.center).mag() - c.parent.radius;
    },
    lineCircle: function(l, c) {
        var dist = Collision.lineCircleHelp(l.points[0], l.points[1], c);
        if(dist < 0) {
            c.v1.nor().scale(dist);
            var consumed = [false];
            c.parent.reportCollision(l.parent, new Vec2(l.normals[0]), new Vec2(c.v1), consumed);
            l.parent.reportCollision(c.parent, new Vec2(l.normals[0]).scale(-1), new Vec2(c.v1).scale(-1), consumed);
        } else {
        }
    },
    circleCircle: function(c1, c2) {
        c1.v1.set(c1.parent.center).sub(c2.parent.center);
        var dist = c1.v1.mag() - (c1.parent.radius + c2.parent.radius);
        if(dist < 0) {
            c1.v1.nor();
            c1.v2.set(c1.v1).scale(-dist);
            var consumed = [false];
            c1.parent.reportCollision(c2.parent, new Vec2(c1.v1), new Vec2(c1.v2), consumed);
            c2.parent.reportCollision(c1.parent, new Vec2(c1.v1).scale(-1), new Vec2(c1.v2).scale(-1), consumed);
        } else {

        }
    },
    boxBox: function(b1, b2) {
        var minDist = Number.MAX_VALUE, dist, moveAxis;
        var mm1=b1.v1, mm2=b1.v2;
        var separated = false, b1Col = false;
        var test="";
        for(var i=0;i<b1.normals.length;i+=1) {
            b1.getMinMax(b1.normals[i], mm1);
            b2.getMinMax(b1.normals[i], mm2);
            dist = b1.distance(mm1, mm2);
            if(dist > 0) {
                separated = true;
                break;
            }
            dist = Math.abs(dist);
            if(dist < minDist) {
                minDist = dist;
                moveAxis = b1.normals[i];
                b1Col = true;
            }
        }
        if(!separated) {
            for(var i=0;i<b2.normals.length;i+=1) {
                b1.getMinMax(b2.normals[i], mm1);
                b2.getMinMax(b2.normals[i], mm2);
                dist = b1.distance(mm1, mm2);
                if(dist > 0) {
                    separated = true;
                    break;
                }
                dist = Math.abs(dist);
                if(dist < minDist) {
                    minDist = dist;
                    moveAxis = b2.normals[i];
                    b1Col = false;
                }
            }
        }
        
        if(separated) {
        } else if(moveAxis) {
            var c = b1.v1.set(b1.center).sub(b2.center);
            b1Col = c.dot(moveAxis) > 0;
            b1.v2.set(moveAxis).scale(b1Col ? 1 : -1);
            b1.v2.scale(minDist);
            var consumed = [false];
            b1.parent.reportCollision(b2.parent, new Vec2(moveAxis),
                                      new Vec2(b1.v2), consumed);
            b2.parent.reportCollision(b1.parent, new Vec2(moveAxis).scale(-1),
                                      new Vec2(b1.v2).scale(-1), consumed);
        }
    },
    Line: function(system, parent, points, options) {
        options = options || {};
        Collision.Geom.call(this, system, parent, points, options);
        this.type = Collision.LINE;
        this.v1.set(points[1]).sub(points[0]);
        this.normals = [Collision.calculateNormal(this.v1, options.normalDir || 1)];
        this.center = new Vec2(points[0]).add(points[1]).scale(0.5);
    },
    Poly: function(system, parent, points, options) {
        Collision.Geom.call(this, system, parent, points, options);
        this.type = Collision.POLY;
        this.center = parent.center;
        this.normals = Collision.calculateNormals(points, 1);
    },
    calculateNormals: function(points, normalDir) {
        var normals = [], n;
        for(var i=0;i<points.length;i+=1) {
            n = new Vec2(points[(i+1) % points.length]).sub(points[i]);
            normals.push(Collision.calculateNormal(n, normalDir));
        }
        return normals;
    },
    calculateNormal: function(vec, dir) {
        return new Vec2(vec.y, -vec.x).nor().scale(dir);
    },
    // A line segment 
    Segment: function(p1, p2, nor) {
        this.v1 = new Vec2();
        this.p1 = p1; this.p2 = p2;
        this.nor = nor;
        this.dst = function(p, dir, res) {
            var dx1 = (this.p1.x - p.x) * dir.x;
            if(dx1 < 0) {
                res.x = -dx1;
            } else {
                var dx2 = (this.p2.x - p.x) * dir.x;
                if(dx2 < 0) {
                    res.x = dx2
                }
            }
            var dy1 = (this.p1.y - p.y) * dir.y;
            if(dy1 < 0) {
                res.y = -dy1;
            } else {
                var dy2 = (p.y - this.p2.y) * dir.y;
                if(dy2 > 0) {
                    res.y = -dy2;
                } else {
                    
                }
            }
        };
    }
}
EXTEND(Collision.Line, Collision.Geom);
EXTEND(Collision.Poly, Collision.Geom);