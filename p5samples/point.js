function Point() {
  this.pos = createVector(random(width), random(height));
  this.vel = createVector(0, 0);
  this.acc = createVector(0, 0);
  // *** set maximum particle speed
  this.maxSpeed = 4;
  
  // store the previous position to draw a line instead of a point
  this.prevPos = this.pos.copy();

  this.applyForce = function(force) {
    this.acc.add(force);
  }
  // overflow to the opposide side
  this.edges = function() {
    if (this.pos.x > width) {
      this.pos.x = 0;
      this.updatePrev();
    }
    if (this.pos.x < 0) {
      this.pos.x = width
      this.updatePrev();
    }
    if (this.pos.y > height) {
      this.pos.y = 0
      this.updatePrev();
    }
    if (this.pos.y < 0) {
      this.pos.y = height
      this.updatePrev();
    }
  }
  // get the influence from the force field
  this.follow = function(vectors) {
    var x = floor(this.pos.x / scl);
    var y = floor(this.pos.y / scl);
    var index = x + y * cols;
    var force = vectors[index];
    this.applyForce(force);
  }
  this.show = function() {
    stroke(255, 0, 0, 5);
    line(this.pos.x, this.pos.y, this.prevPos.x, this.prevPos.y);
//    point(this.pos.x, this.pos.y);
    this.updatePrev()
  }
  this.update = function() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }
  this.updatePrev = function() {
    this.prevPos.x = this.pos.x;
    this.prevPos.y = this.pos.y;
  }
}