// Variables
var socket = io.connect();
var ship;
var asteroids = [];
var shots = [];
var shotsData = [];
var score;
var myId;
var otherShips = [];
var otherShots = [];

// Functions
// Setup function when page loads
function setup() {
  frameRate(60);
  noCursor();
  createCanvas(1200, 700);
  ship = new Ship();
  score = 0;
  var data = {
    ship: {
      x: ship.pos.x,
      y: ship.pos.y,
      r: ship.r,
      heading: ship.heading,
      exploded: ship.exploded,
      boosting: ship.boosting
    },
    shots: shotsData
  };
  socket.emit("start", data);
}

// Draw function every frame
function draw() {
  // Receiving server messages
  socket.on("id", function(data) {
    myId = data;
  })
  socket.on("ships", function(data) {
    otherShips = data;
    for (var i = 0; i < otherShips.length; i++) {
      otherShips[i].pos = createVector(otherShips[i].x, otherShips[i].y);
    }
  })
  socket.on("shots", function(data) {
    otherShots = [];
    for (var i = 0; i < data.length; i++) {
      otherShots.push(data[i]);
    }
  })
  socket.on("asteroids", function(data) {
    asteroids = [];
    for (var i = 0; i < data.length; i++) {
      asteroids.push(new Asteroid(data[i]));
    }
  })
  socket.on("playerHit", function(data) {
    if (data == myId) {
      ship.exploded = true;
    }
  })
  // Client functions
  background(0, 0, 0);
  for (var i = 0; i < asteroids.length; i++) {
    asteroids[i].show();
    asteroids[i].update();
    asteroids[i].checkEdges();
    if (ship.hits(asteroids[i])) {
      ship.exploded = true;
    }
  }
  shotsData = [];
  for (var i = shots.length - 1; i >= 0; i--) {
    if (!shots[i].toRemove) {
      shotsData.push({
        id: myId,
        x: shots[i].pos.x,
        y: shots[i].pos.y
      });
      shots[i].show();
      shots[i].update();
      shots[i].checkEdges();
      for (var j = asteroids.length - 1; j >= 0; j--) {
        if (shots[i].hits(asteroids[j])) {
          shots[i].toRemove = true;
          var points = floor(map(asteroids[j].r, 64, 8, 1, 10));
          score += points;
          socket.emit("asteroids", j);
          break;
        }
      }
      for (var k = otherShips.length - 1; k >= 0; k--) {
        if (shots[i].hits(otherShips[k]) && otherShips[k].id != myId) {
          shots[i].toRemove = true;
          score += 25;
          socket.emit("playerHit", otherShips[k].id);
          break;
        }
      }
    } else {
      shots.splice(i, 1);
    }
  }
  for (var i = 0; i < otherShots.length; i++) {
    if (otherShots[i].id != myId) {
      showOtherShot(otherShots[i]);
    }
  }
  for (var i = 0; i < otherShips.length; i++) {
    if (!otherShips[i].exploded && otherShips[i].id != myId) {
      showOtherShip(otherShips[i]);
    }
  }
  for (var i = 0; i < asteroids.length; i++) {
    asteroids[i].show();
    asteroids[i].update();
    asteroids[i].checkEdges();
  }
  if (!ship.exploded) {
    ship.show();
    ship.update();
    ship.checkEdges();
  }
  fill(255);
  textSize(width / 32);
  text("Score: " + score.toString(), 0, 0, 100);
  var data = {
    ship: {
      x: ship.pos.x,
      y: ship.pos.y,
      r: ship.r,
      heading: ship.heading,
      exploded: ship.exploded,
      boosting: ship.boosting
    },
    shots: shotsData
  };
  socket.emit("update", data);
}

// Showing other players' ships
function showOtherShip(ship) {
  push();
  stroke(255, 0, 0);
  fill(0, 0, 0);
  translate(ship.x, ship.y);
  rotate(ship.heading);
  beginShape();
  vertex(0, -ship.r);
  vertex(-ship.r * 0.825, ship.r * 1.474);
  vertex(-ship.r * 0.667, ship.r);
  vertex(ship.r * 0.667, ship.r);
  vertex(ship.r * 0.825, ship.r * 1.474);
  endShape(CLOSE);
  if (ship.boosting && random() > 0.5) {
    triangle(0, ship.r * 1.75, -ship.r * 0.25, ship.r, ship.r * 0.25, ship.r);
  }
  pop();
}

function showOtherShot(shot) {
  push();
  stroke(255, 0, 0);
  strokeWeight(2);
  point(shot.x, shot.y);
  pop();
}

// Start of input
function keyPressed() {
  if (!ship.exploded) {
    if (keyCode == LEFT_ARROW) {
      ship.rotation = -0.1;
    }
    if (keyCode == RIGHT_ARROW) {
      ship.rotation = 0.1;
    }
    if (keyCode == UP_ARROW) {
      ship.boosting = true;
    }
    if (keyCode == 32) {
      ship.shoot();
    }
  }
}

// End of input
function keyReleased() {
  if (keyCode == LEFT_ARROW || keyCode == RIGHT_ARROW) {
    ship.rotation = 0;
  }
  if (keyCode == UP_ARROW) {
    ship.boosting = false;
  }
}