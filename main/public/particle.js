function Particle(pos) {
  this.pos = pos.copy();
  this.vel = p5.Vector.random2D().mult(random());
  this.update = function() {
    this.pos.add(this.vel);
    this.vel.mult(0.99);
  }
  this.show = function() {
    if (this.vel.mag() > 0.25) {
      push();
      stroke(255);
      strokeWeight(1);
      point(this.pos.x, this.pos.y);
      pop();
    } else {
      particles.splice(particles.indexOf(this), 1);
    }
  }
}