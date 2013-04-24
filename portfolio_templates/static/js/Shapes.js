var Shapes = {
    // Segments passed in clockwise order
    Poly: function(points, center, color) {
        Entity.call(this, points);
        this.center = center;
        this.color = color || "#000";
        this.draw = function(c) {
            c.fillStyle = this.color;
            c.beginPath();
            c.moveTo(points[0].x, points[0].y);
            this.points.forEach(function(p) {
                c.lineTo(p.x, p.y);
            });
            c.closePath();
            c.fill();
        };
        this.move = function(dist) {
            this.points.forEach(function(p) {
                p.add(dist);
            });
            this.center.add(dist);
        }
    },
    polygonArea: function(points) {
        var area=0, j=0;
        for(var i=points.length-1;i>=0;i-=1) {
            var p1=points[i], p2=points[j];
            area += (p2.x + p1.x) * (p2.y - p1.y);
            j = i;
        }
        return area / 2;
    },
    /* Points passed as such:
     *
     *  0---1
     *  |   |
     *  3---2
     */
    Rectangle: function(points, color) {
        this.first = points[0];
        var center = new Vec2((this.first.x + points[1].x)/2,
                              (this.first.y + points[2].y)/2);
        Shapes.Poly.call(this, points, center, color);
        this.mass = (this.points[1].x-this.first.x) * (this.points[2].y-this.first.y);
        this.draw = function(c) {
            c.fillStyle = this.color;
            c.fillRect(this.first.x, this.first.y,
                       this.points[1].x-this.first.x, this.points[2].y-this.first.y);
        };
        this.move = function(dist) {
            this.points.forEach(function(p) {
                p.add(dist);
            });
            this.center.add(dist);
        }
        this.moveXY = function(x, y) {
            this.move(new Vec2(x, y));
        };
        this.collisionClamp = function() {
            
        };
    },
    Circle: function(x, y, radius, color) {
        this.radius = radius;
        this.center = new Vec2(x, y);
        Entity.call(this, this.center, Math.PI * radius * radius);
        this.color = color || "#000";
        this.draw = function(c) {
            c.fillStyle = this.color;
            c.beginPath();
            c.arc(this.center.x, this.center.y, this.radius, 0, 2 * Math.PI);
            c.fill();
        }
    }
}
EXTEND(Shapes.Poly, Entity);
EXTEND(Shapes.Rectangle, Shapes.Poly);