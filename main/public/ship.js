function Ship() {
  this.pos = createVector(width / 2, height / 2);
  this.vel = createVector(0, 0);
  this.r = width / 160;
  this.heading = TWO_PI;
  this.rotation = 0;
  this.boosting = false;
  this.shots = [];
  this.exploded = false;
  this.shoot = function() {
    this.shots.push(new Shot(this.pos, this.heading - PI / 2));
  }
  this.update = function() {
    this.heading += this.rotation;
    this.pos.add(this.vel);
    this.vel.mult(0.99);
    if (this.boosting) {
      this.boost();
    }
  }
  this.showShots = function() {
    for (var i = this.shots.length - 1; i >= 0; i--) {
      if (!this.shots[i].toRemove) {
        this.shots[i].update();
        this.shots[i].show();
        for (var j = asteroids.length - 1; j >= 0; j--) {
          if (this.shots[i].hits(asteroids[j])) {
            explode(this.shots[i].pos);
            if (asteroids[j].r > 8) {
              var newAsteroids = asteroids[j].breakup();
              asteroids = asteroids.concat(newAsteroids);
            }
            var points = floor(map(asteroids[j].r, 8, 64, 10, 1));
            asteroids.splice(j, 1);
            this.shots.splice(i, 1);
            score += points;
            break;
          }
        }
      } else {
        this.shots.splice(i, 1);
      }
    }
  }
  this.show = function() {
    ship.showShots();
    if (!this.exploded) {
      push();
      stroke(255);
      fill(0);
      translate(this.pos.x, this.pos.y);
      rotate(this.heading);
      beginShape();
      vertex(0, -this.r);
      vertex(-this.r * 0.825, this.r * 1.474);
      vertex(-this.r * 0.667, this.r);
      vertex(this.r * 0.667, this.r);
      vertex(this.r * 0.825, this.r * 1.474);
      endShape(CLOSE);
      if (this.boosting) {
        if (random() > 0.5) {
          triangle(0, this.r * 1.75, -this.r * 0.25, this.r, this.r * 0.25, this.r);
        }
      }
      pop();
    }
  }
  this.boost = function() {
    var force = p5.Vector.fromAngle(this.heading - PI / 2);
    force.div(10);
    if (this.vel.mag() < 5) {
      this.vel.add(force);
    }
  }
  this.hits = function(a) {
    var d = p5.Vector.dist(this.pos, a.pos);
    if (d < this.r + a.r) {
      return true;
    } else {
      return false;
    }
  }
  this.checkEdges = function() {
    if (this.pos.x > width + this.r) {
      this.pos.x = -this.r;
    }
    if (this.pos.x < -this.r) {
      this.pos.x = width + this.r;
    }
    if (this.pos.y > height + this.r) {
      this.pos.y = -this.r;
    }
    if (this.pos.y < -this.r) {
      this.pos.y = height + this.r;
    }
  }
}