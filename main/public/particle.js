// Asteroids Explosion Particle File
// Thomas J Wright

// Declaring particle object function
function Particle(pos) {
  // Copying position vector
  this.pos = pos.copy();
  // Generating random velocity vector
  this.vel = p5.Vector.random2D().mult(random());
  
  // Moves the particle
  this.update = function() {
    this.pos.add(this.vel);
    this.vel.mult(0.99);
  }

  // Draws the particle to the canvas
  this.show = function() {
    if (this.vel.mag() > 0.25) {
      push();
      stroke(255);
      strokeWeight(1);
      point(this.pos.x, this.pos.y);
      pop();
    }
    else {
      particles.splice(particles.indexOf(this), 1);
    }
  }
}
