// Asteroid object
function Asteroid(asteroid) {
  // Variables
  this.pos = createVector(asteroid.x, asteroid.y);
  this.r = asteroid.r;
  this.vel = createVector(asteroid.xVel, asteroid.yVel);
  this.total = asteroid.total;
  this.offset = asteroid.offset;
  this.asteroidData = {
    x: this.pos.x,
    y: this.pos.y,
    r: this.r / 2
  };

  // Functions
  // Draws the asteroid to the canvas
  this.show = function() {
    push();
    strokeWeight(1);
    stroke(255, 255, 255);
    noFill();
    translate(this.pos.x, this.pos.y);
    beginShape();
    for (var i = 0; i < this.total; i++) {
      var angle = map(i, 0, this.total, 0, TWO_PI);
      var r = this.r + this.offset[i];
      var x = r * cos(angle);
      var y = r * sin(angle);
      vertex(x, y);
    }
    endShape(CLOSE);
    pop();
  }

  // Moves the asteroid
  this.update = function() {
    this.pos.add(this.vel);
    this.asteroidData = {
      x: this.pos.x,
      y: this.pos.y,
      r: this.r / 2
    };
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