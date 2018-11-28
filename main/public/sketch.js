// Asteroids Main Sketch File
// Thomas J Wright
// Defining socket.io connection
var socket = io.connect();
// Declaring variable to store player ship object
var ship;
// Creating array to store other clients' ships
var otherShips = [];
// Declaring variable to store player score
var score;
// Creating array to store asteroid objects
var asteroids = [];
// Creating array to store explosion particles
var particles = [];
var myId;
// Preload function runs before setup to load any external resources
function preload() {
  // Loading font to display any text
  chakraPetch = loadFont("ChakraPetch-Regular.ttf");
}
// Setup function runs once at start of program
function setup() {
  // Hiding mouse cursor
  noCursor();
  // Creating canvas width and height of the window
  createCanvas(windowWidth, windowHeight);
  // Creating ship object and storing it in ship variable
  ship = new Ship();
  // Creating data object to store position data of ship as well as id
  var data = {
    x: ship.pos.x,
    y: ship.pos.y,
    h: ship.heading,
    r: ship.r
  };
  // Sending start message to server with the ship information
  socket.emit("start", data);
  // Defaulting score to start at zero
  score = 0;
  // Defaulting level to start at one
  level = 1;
  // Clearing asteroids array
  asteroids = [];
  // Generating asteroids
  createAsteroids();
}
// Creates asteroids at beginning of new level
function createAsteroids() {
  // Constraining number of asteroids to maximum 16, depending on level
  var numAsteroids = constrain(2 ** level, 0, 16);
  // Iterating to create ten asteroids
  for (var i = 0; i < numAsteroids; i++) {
    // Pushing a new asteroid object into the array
    asteroids.push(new Asteroid());
  }
}

function showOtherShip(ship) {
  push();
  stroke(255);
  fill(0);
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
// Draw function called each frame
function draw() {
  socket.on("id", function(data) {
    myId = data;
  });
  // Receiving heartbeat message
  socket.on("heartbeat", function(data) {
    // Setting otherShips array equal to received data
    otherShips = data;
  });
  // Setting background colour
  background(0);
  // Iterating through otherShips array
  for (o of otherShips) {
    if (o.id != myId) {
      showOtherShip(o);
    }
  }
  // Drawing the ship object
  ship.show();
  // Checking if the ship has exploded
  if (!ship.exploded) {
    // Moving the ship
    ship.update();
    // Checking ship against screen boundaries
    ship.checkEdges();
  }
  // Iterating through asteroids array
  for (a of asteroids) {
    // Moving the asteroid
    a.update();
    // Drawing the asteroid
    a.show();
    // Checking asteroid against screen boundaries
    a.checkEdges();
    // Checking if the ship has exploded
    if (!ship.exploded) {
      // Checking if ship collides with an asteroid
      if (ship.hits(a)) {
        // Setting the ship to exploded
        ship.exploded = true;
        // Exploding the ship
        explode(ship.pos);
      }
    }
  }
  // Iterating through particles array
  for (p of particles) {
    // Moving the particle
    p.update();
    // Drawing the particle
    p.show();
  }
  // Setting fill colour to white
  fill(255);
  // Setting text size to factor of cavas width
  textSize(width / 32);
  // Setting font
  textFont(chakraPetch);
  // Showing score
  text("Score: " + score.toString(), 0, width / 16);
  // Checking if asteroids array is empty
  if (asteroids.length == 0) {
    // Increasing the level
    level++;
    // Generating asteroids
    createAsteroids();
  }
  // Defining ship data
  var data = {
    x: ship.pos.x,
    y: ship.pos.y,
    h: ship.heading,
    r: ship.r
  };
  // Sending update message to server with ship's position data
  socket.emit("update", data);
}
// Explode function creates an explosion at position vector
function explode(pos) {
  // Generating 7 particles
  for (var i = 0; i < 7; i++) {
    // Adding new particle to particle array
    particles.push(new Particle(pos));
  }
}
// Keypressed function runs every time a key is pressed
function keyPressed() {
  // If the up arrow is pressed
  if (keyCode == UP_ARROW) {
    // Setting the ship's state to boosting
    ship.boosting = true;
  }
  // If the left arrow is pressed
  if (keyCode == LEFT_ARROW) {
    // Rotating the ship anti-clockwise
    ship.rotation = -0.08;
  }
  // If right arrow is pressed
  if (keyCode == RIGHT_ARROW) {
    // Rotating the ship clockwise
    ship.rotation = 0.08;
  }
  // If spacebar is pressed
  if (keyCode == 32 && !ship.exploded) {
    // Firing a shot
    ship.shoot();
  }
  // If a key is pressed when the ship has been exploded
}
// Keyreleased function runs whenever a key is released
function keyReleased() {
  // If up arrow is pressed
  if (keyCode == UP_ARROW) {
    // Stopping the ship boosting
    ship.boosting = false;
  }
  // If left or right arrow is pressed
  if (keyCode == LEFT_ARROW || keyCode == RIGHT_ARROW) {
    // Stopping ship's rotation
    ship.rotation = 0;
  }
}