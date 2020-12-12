function Particle(position, mass, vel) {
  this.G = 4;
  this.pos = position;
  this.vel = vel;
  this.acc = createVector(0, 0);
  this.mass = mass;
  this.size = (sqrt(this.mass * 100));

  this.calculateAttraction = function(p) {
    // calculate direction of force
    var force = p5.Vector.sub(this.pos, p.pos);
    // distance between objects
    var distance = force.mag();
    // filter extemely far || close results
    distance = constrain(distance, 2, 10);
    // normalize vector (to get the direction and then multiply t by the strength of gravity)
    force.normalize();
    // calculate gravitational force magnitude
    var strength = (this.G * this.mass * p.mass) / (distance * distance);
    force.mult(strength);
    return force;
  }
  this.update = function() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }
  this.applyForce = function(force) {
    this.vel.add(force.div(this.mass));
  }
  this.display = function() {
    fill(180, 250, 185);
    ellipse(this.pos.x, this.pos.y, this.size, this.size);
  }
}