// Asteroids Ship Object File
// Thomas J Wright

// Declaring ship object function
function Ship() {
  // Creating position vector in centre of canvas
  this.pos = createVector(width / 2, height / 2);
  // Creating velocity vector of zero speed
  this.vel = createVector(0, 0);
  // Setting radius size
  this.r = width / 80;
  // Setting heading to point straight up on start
  this.heading = TWO_PI;
  // Setting rotation value to zero
  this.rotation = 0;
  // Setting boosting state to false
  this.boosting = false;
  // Creating empty shots array to store shots fired from this ship
  this.shots = [];
  // Setting exploded state to false
  this.exploded = false;

  // Shoot function fires shot from ship
  this.shoot = function() {
    // Pushing a new shot object into the shots array
    this.shots.push(new Shot(this.pos, this.heading - PI / 2));
  }

  // Update function moves the ship
  this.update = function() {
    // Increasing the heading by the rotation value
    this.heading += this.rotation;
    // Adding the velocity vector to the position vector
    this.pos.add(this.vel);
    // Decreasing velocity to create deceleration
    this.vel.mult(0.99);
    // Checking if ship boosting status is true
    if (this.boosting) {
      // Calling boost function
      this.boost();
    }
  }

  // Showshots function separates drawing of ship form drawing of shots
  this.showShots = function() {
    // Iterating through shots array backwards
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
      }
      else {
        this.shots.splice(i, 1);
      }
    }
  }

  // Show function draws ship on the canvas
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
        //if (random() > 0.5) {
        triangle(0, this.r * 1.75, -this.r * 0.25, this.r, this.r * 0.25, this.r);
        //}
      }
      pop();
    }
  }

  // Boost function moves ship forwards
  this.boost = function() {
    var force = p5.Vector.fromAngle(this.heading - PI / 2);
    force.div(10);
    if (this.vel.mag() < 5) {
      this.vel.add(force);
    }
  }

  // Hits function checks for intersection with another object
  this.hits = function(a) {
    var d = p5.Vector.dist(this.pos, a.pos);
    if (d < this.r + a.r) {
      return true;
    }
    else {
      return false;
    }
  }

  // Checkedges function checks position against screen edges
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
