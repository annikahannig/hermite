
/**
 * Curves with hermite interpolation and
 * Catmull-Rom splines.
 *
 * (c) 2015 Matthias Hannig
 */


var canvas = document.getElementById('canvas');
var ctx    = canvas.getContext('2d');


var Point = function(x, y) {
  this.x = x;
  this.y = y;
}


/**
 * Scalar multiplication
 */
Point.prototype.mul = function(s) {
  var self = this;
  return new Point(self.x * s, self.y * s);
}

/**
 * Point Subtraction
 */
Point.prototype.sub = function(p) {
  var self = this;
  return new Point(self.x - p.x, self.y - p.y);
}

/**
 * Point Addition
 */
Point.prototype.add = function(p) {
  var self = this;
  return new Point(self.x + p.x, self.y + p.y);
}


/**
 * Hitbox
 */
Point.prototype.intersects = function(x, y) {
  var self = this;
  var r    = 6.0;

  if ( Math.abs(x - self.x) < r &&
       Math.abs(y - self.y) < r ) {
         return true;
  }
  return false;
}


/**
 * Render a point on the canvas
 */
Point.prototype.render = function(ctx) {
  var self = this;
  
  ctx.save();

  ctx.fillStyle = '#0084b4';

  ctx.beginPath();
  ctx.arc(self.x, self.y, 6, 0, 2.0*Math.PI);
  ctx.fill();

  ctx.restore();
}


// Initialize something like 5 points
var points = [];
for ( var i = 0; i < 6; i++ ) {
  var x = 80 + i*120 + Math.random() * 30.0;
  var y = 150 + Math.random() * 150.0;

  var p = new Point(x,y);
  points.push(p);
}


// Render points
for ( var i in points ) {
  var p = points[i];
  p.render(ctx);
}

// Interpolate

// Hermite basis function
var H1 = function(s) {
  return 2*s*s*s - 3*s*s + 1;
}

var H2 = function(s) {
  return -2*s*s*s + 3*s*s;
}

var H3 = function(s) {
  return s*s*s - 2*s*s + s;
}

var H4 = function(s) {
  return s*s*s - s*s;
}

// Use the Catmull-Rom spline to get the first derivate for
// a given point
var CRS = function(points, i) {
  if ( i == 0 ) {
    return new Point(0,0);
  }

  if ( i >= points.length - 1 ) {
    return new Point(0,0);
  }
  return points[i + 1].sub(points[i - 1]).mul(0.5);
}

var Curve = function(i, j, t) {
  var p = points[i].mul(H1(t)).add(
          points[j].mul(H2(t))).add(
          CRS(points, i).mul(H3(t))).add(
          CRS(points, j).mul(H4(t)))

  return p;
}

// Draw interpolation
var steps = 25;

ctx.strokeStyle = '#333333';
ctx.beginPath();
ctx.moveTo(points[0].x, points[0].y);
for ( var i = 0; i < points.length - 1; i++ ) {
  for( var j = 0; j < steps; j++ ) {
    var s = j / steps;
    var p = Curve(i, i + 1, s);
    ctx.lineTo(p.x, p.y);
  }
}
ctx.stroke();

