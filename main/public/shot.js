// Asteroids Shot Object File
// Thomas J Wright

// Declaring shot object function
function Shot(pos, h) {

  // Copying position vector
  this.pos = pos.copy();

  // Generating velocity from ship's heading
  this.vel = p5.Vector.fromAngle(h).mult(10);

  // Setting removal state to false
  this.toRemove = false;

  // Moving the shot
  this.update = function() {
    this.pos.add(this.vel);
  }

  // Drawing the shot
  this.show = function() {
    push();
    stroke(255);
    strokeWeight(2);
    point(this.pos.x, this.pos.y);
    pop();
  }

  // Checking position against screen edges
  this.checkEdges = function() {
    if (this.pos.x > width || this.pos.x < 0 || this.pos.y > height || this.pos.y < 0) {
      this.toRemove = true;
    }
  }

  // Checking if this collides with another object
  this.hits = function(a) {
    var d = p5.Vector.dist(this.pos, a.pos);
    if (d < a.r) {
      return true;
    }
    else {
      return false;
    }
  }
}
