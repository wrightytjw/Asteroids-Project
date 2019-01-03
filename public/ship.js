// Ship object
function Ship() {
  // Variables
  this.pos = createVector(width / 2, height / 2);
  this.vel = createVector(0, 0);
  this.r = 8;
  this.heading = TWO_PI;
  this.rotation = 0;
  this.boosting = false;
  this.exploded = false;

  // Functions
  // Draws ship to canvas
  this.show = function() {
    push();
    stroke(255, 255, 255);
    fill(0, 0, 0);
    translate(this.pos.x, this.pos.y);
    rotate(this.heading);
    beginShape();
    vertex(0, -this.r);
    vertex(-this.r * 0.825, this.r * 1.474);
    vertex(-this.r * 0.667, this.r);
    vertex(this.r * 0.667, this.r);
    vertex(this.r * 0.825, this.r * 1.474);
    endShape(CLOSE);
    if (this.boosting && random() > 0.5) {
      triangle(0, this.r * 1.75, -this.r * 0.25, this.r, this.r * 0.25, this.r);
    }
    pop();
  }

  // Moves the ship
  this.update = function() {
    this.heading += this.rotation;
    this.pos.add(this.vel);
    this.vel.mult(0.99);
    if (this.boosting) {
      this.boost();
    }
  }

  // Applies force to boost ship
  this.boost = function() {
    var force = p5.Vector.fromAngle(this.heading - PI / 2).div(10);
    if (this.vel.mag() < 5) {
      this.vel.add(force);
    }
  }

  // Shoots a shot
  this.shoot = function() {
    shots.push(new Shot(this.pos, this.heading - PI / 2));
  }

  // Impacting an asteroid
  this.hits = function(asteroid) {
    var d = p5.Vector.dist(this.pos, asteroid.pos);
    if (d < this.r + asteroid.r) {
      return true;
    } else {
      return false;
    }
  }

  // Wrap around
  this.checkEdges = function() {
    if (this.pos.x > width + this.r) {
      this.pos.x = -this.r;
    } else if (this.pos.x < -this.r) {
      this.pos.x = width + this.r;
    }
    if (this.pos.y > height + this.r) {
      this.pos.y = -this.r;
    } else if (this.pos.y < -this.r) {
      this.pos.y = height + this.r;
    }
  }
}