function Asteroid(asteroid) {
  this.pos = createVector(asteroid.x, asteroid.y);
  this.r = asteroid.r;
  this.vel = createVector(asteroid.xVel, asteroid.yVel);
  this.offset = asteroid.offset;
  this.asteroidData = {
    x: this.pos.x,
    y: this.pos.y,
    r: this.r / 2
  };

  this.update = function() {
    this.pos.x = checkEdges(this.pos.x, this.pos.y, this.r, width, height)[0];
    this.pos.y = checkEdges(this.pos.x, this.pos.y, this.r, width, height)[1];
    this.pos.add(this.vel);
    this.asteroidData = {
      x: this.pos.x,
      y: this.pos.y,
      r: this.r / 2
    };
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
}