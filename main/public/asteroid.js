function Asteroid(serverAsteroid) {
  this.pos = createVector(serverAsteroid.x, serverAsteroid.y);
  this.vel = createVector(serverAsteroid.xVel, serverAsteroid.yVel);
  this.r = serverAsteroid.r;
  this.offset = serverAsteroid.offset;

  this.update = function() {
    this.pos.add(this.vel);
  }

  this.show = function() {
    push();
    stroke(255, 255, 255);
    noFill();
    translate(this.pos.x, this.pos.y);
    beginShape();
    for (var i = 0; i < this.offset.length; i++) {
      var angle = map(i, 0, this.offset.length, 0, TWO_PI);
      var r = this.r + this.offset[i];
      var x = r * cos(angle);
      var y = r * sin(angle);
      vertex(x, y);
    }
    endShape(CLOSE);
    pop();
  }

  this.checkEdges = function() {
    if (this.pos.x < -this.r) {
      this.pos.x = width + this.r;
    }
    if (this.pos.x > width + this.r) {
      this.pos.x = -this.r;
    }
    if (this.pos.y < -this.r) {
      this.pos.y = height + this.r;
    }
    if (this.pos.y > height + this.r) {
      this.pos.y = -this.r;
    }
  }
}