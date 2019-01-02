var socket = io.connect();
var ship;
var otherShips = [];
var score;
var asteroids = [];
var particles = [];
var myId;

function preload() {
  chakraPetch = loadFont("ChakraPetch-Regular.ttf");
}

function setup() {
  noCursor();
  createCanvas(1200, 700);
  ship = new Ship();
  var data = {
    x: ship.pos.x,
    y: ship.pos.y,
    h: ship.heading,
    r: ship.r
  };
  socket.emit("start", data);
  score = 0;
}

function showOtherShip(ship) {
  push();
  stroke(255, 0, 0);
  fill(0, 0, 0);
  translate(ship.x, ship.y);
  rotate(ship.h);
  beginShape();
  vertex(0, -ship.r);
  vertex(-ship.r * 0.825, ship.r * 1.474);
  vertex(-ship.r * 0.667, ship.r);
  vertex(ship.r * 0.667, ship.r);
  vertex(ship.r * 0.825, ship.r * 1.474);
  endShape(CLOSE);
  pop();
}

function draw() {
  socket.on("id", function(data) {
    myId = data;
  });
  socket.on("asteroids", function(data) {
    asteroids = [];
    for (a of data) {
      asteroids.push(new Asteroid(a));
    }
  })
  socket.on("heartbeat", function(data) {
    otherShips = data;
  });
  background(0, 0, 0);
  for (o of otherShips) {
    if (o.id != myId) {
      showOtherShip(o);
    }
  }
  for (a of asteroids) {
    a.update();
    a.show();
  }
  ship.show();
  if (!ship.exploded) {
    ship.update();
  }
  for (p of particles) {
    p.update();
    p.show();
  }
  fill(255);
  textSize(width / 32);
  textFont(chakraPetch);
  text("Score: " + score.toString(), 0, 0, 100);
  var data = {
    x: ship.pos.x,
    y: ship.pos.y,
    h: ship.heading,
    r: ship.r
  };
  socket.emit("update", data);
}

function explode(pos) {
  for (var i = 0; i < 7; i++) {
    particles.push(new Particle(pos));
  }
}

function checkEdges(x, y, r, w, h) {
  if (x > width + r) {
    x = -r;
  } else if (x < -r) {
    x = width + r;
  }
  if (y > h + r) {
    y = -r;
  } else if (y < -r) {
    y = h + r;
  }
  return [x, y];
}

function keyPressed() {
  if (keyCode == UP_ARROW) {
    ship.boosting = true;
  }
  if (keyCode == LEFT_ARROW) {
    ship.rotation = -0.08;
  }
  if (keyCode == RIGHT_ARROW) {
    ship.rotation = 0.08;
  }
  if (keyCode == 32 && !ship.exploded) {
    ship.shoot();
  }
}

function keyReleased() {
  if (keyCode == UP_ARROW) {
    ship.boosting = false;
  }
  if (keyCode == LEFT_ARROW || keyCode == RIGHT_ARROW) {
    ship.rotation = 0;
  }
}