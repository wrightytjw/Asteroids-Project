// Asteroids Asteroid Object File
// Thomas J Wright

// Declaring the aasteroid object function
function Asteroid(pos, r) {

  // Checking if an r value is passed
  if (r) {
    this.r = r / 2;
  }

  // If no r value has been passed
  else {
    this.r = width / 30;
  }

  // Checking if position value has be passed
  if (pos) {
    this.pos = pos.copy();
    this.vel = p5.Vector.random2D().div(this.r / 16);
  }

  // If no position value is passed
  else {
    var sector = floor(random(1, 9));
    if (sector == 1) {
      var x = width;
      var y = random(0, height / 2);
      var xVel = random(-1, 0);
      var yVel = random(0, 1);
    }
    else if (sector == 2) {
      var x = width;
      var y = random(height / 2, height);
      var xVel = random(-1, 0);
      var yVel = random(-1, 0);
    }
    else if (sector == 3) {
      var x = random(width / 2, width);
      var y = height;
      var xVel = random(-1, 0);
      var yVel = random(-1, 0);
    }
    else if (sector == 4) {
      var x = random(0, width / 2);
      var y = height;
      var xVel = random(0, 1);
      var yVel = random(-1, 0);
    }
    else if (sector == 5) {
      var x = 0;
      var y = random(height / 2, height);
      var xVel = random(0, 1);
      var yVel = random(0, 1);
    }
    else if (sector == 6) {
      var x = 0;
      var y = random(0, height / 2);
      var xVel = random(0, 1);
      var yVel = random(-1, 0);
    }
    else if (sector == 7) {
      var x = random(0, width / 2);
      var y = 0;
      var xVel = random(0, 1);
      var yVel = random(0, 1);
    }
    else if (sector == 8) {
      var x = random(width / 2, width);
      var y = 0;
      var xVel = random(-1, 0);
      var yVel = random(0, 1);
    }
    this.pos = createVector(x, y);
    this.vel = createVector(xVel, yVel).normalize().div(this.r / 16);
  }

  // Setting total number of vertices
  this.total = random(5, 15);

  // Creating empty offset array
  this.offset = [];

  // Iterating total number of times
  for (var i = 0; i < this.total; i++) {
    this.offset.push(random(-this.r / 4, this.r / 4));
  }

  // Moves the asteroid
  this.update = function() {
    this.pos.add(this.vel);
  }

  // Draws the asteroid to the canvas
  this.show = function() {
    push();
    stroke(255);
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

  // Breaks into two asteroids
  this.breakup = function() {
    let newA = [];
    newA.push(new Asteroid(this.pos, this.r));
    newA.push(new Asteroid(this.pos, this.r));
    return newA;
  }

  // Checks position against screen edges
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
