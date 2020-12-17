var Attractor = function() {
  this.pos = createVector(width / 2, height / 2);
  this.mass = 20;
  this.G = 1;
  this.size = (sqrt(this.mass * 80));

  this.calculateAttraction = function(p) {
    // calculate direction of force
    var force = p5.Vector.sub(this.pos, p.pos);
    // distance between objects
    var distance = force.mag();
    // filter extemely far || close results
    distance = constrain(distance, 5, 25);
    // normalize vector (to get the direction and then multiply t by the strength of gravity)
    force.normalize();
    // calculate gravitational force magnitude
    var strength = (this.G * this.mass * p.mass) / (distance * distance);
    force.mult(strength);
    return force;
  }
  this.display = function() {
    fill(180, 250, 185);
    ellipse(this.pos.x, this.pos.y, this.size, this.size);
  }
}