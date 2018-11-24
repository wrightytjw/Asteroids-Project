// Asteroids Main Sketch File
// Thomas J Wright

// Declaring variable to store player ship object
var ship;
// Declaring variable to store player score
var score;
// Declaring variable to store the level count
var level;
// Creating array to store asteroid objects
var asteroids = [];
// Creating array to store explosion particles
var particles = [];

// Preload function runs before setup to load any external resources
function preload() {
  chakraPetch = loadFont("ChakraPetch-Regular.ttf");
}

// Setup function runs once at start of program
function setup() {
  noCursor();
  // Creating canvas width and height of the window
  createCanvas(windowWidth, windowHeight);
  // Creating ship object and storing it in ship variable
  ship = new Ship();
  // Defaulting score to start at zero
  score = 0;
  level = 1;
  // Clearing asteroids array
  asteroids = [];
  createAsteroids();
}

// Creates asteroids at beginning of new level
function createAsteroids() {
  var numAsteroids = constrain(2 ** level, 0, 16);
  // Iterating to create ten asteroids
  for (var i = 0; i < numAsteroids; i++) {
    // Pushing a new asteroid object into the array
    asteroids.push(new Asteroid());
  }
}

// Draw function called each frame
function draw() {
  // Setting background colour
  background(0);
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
  for (p of particles) {
    p.update();
    p.show();
  }
  fill(255);
  textSize(50);
  textFont(chakraPetch);
  text("Level: " + level.toString(), 0, 50);
  text("Score: " + score.toString(), 0, 100);
  if (asteroids.length == 0) {
    level++;
    createAsteroids();
  }
}

// Explode function creates an explosion at position vector
function explode(pos) {
  var total = random(5, 10);
  for (var i = 0; i < total; i++) {
    particles.push(new Particle(pos));
  }
}

// Keypressed function runs every time a key is pressed
function keyPressed() {
  // Checking if the ship has exploded
  if (!ship.exploded) {
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
    if (keyCode == 32) {
      // Firing a shot
      ship.shoot();
    }
    // If a key is pressed when the ship has been exploded
  }
  else {
    // Running setup function to revert ship and asteroids
    setup();
  }
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
