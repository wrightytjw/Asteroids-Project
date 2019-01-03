// Shot object
function Shot(pos, heading) {
  // Variables
  this.pos = pos.copy();
  this.vel = p5.Vector.fromAngle(heading).mult(10);
  this.toRemove = false;

  // Functions
  // Draws shot to the canvas
  this.show = function() {
    push();
    stroke(255, 255, 255);
    strokeWeight(2);
    point(this.pos.x, this.pos.y);
    pop();
  }

  // Moves shot
  this.update = function() {
    this.pos.add(this.vel);
  }

  // Edge detection
  this.checkEdges = function() {
    if (this.pos.x > width || this.pos.x < 0 || this.pos.y > height || this.pos.y < 0) {
      this.toRemove = true;
    }
  }

  // Collision detection
  this.hits = function(target) {
    var d = p5.Vector.dist(this.pos, target.pos);
    if (d < target.r) {
      return true;
    } else {
      return false;
    }
  }
}