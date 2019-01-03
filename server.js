// Server file
var socket = require("socket.io");
var express = require("express");

var app = express();

// Empty arrays for clients and asteroids
var clients = [];
var shots = [];
var asteroids = [];

// Hosting public folder
app.use(express.static("public"));

// Server startup
var server = app.listen(3000, function() {
  console.log("Server is running");
  for (var i = 0; i < 10; i++) {
    asteroids.push(createAsteroid());
  }
  setInterval(function() {
    io.emit("ships", clients);
    io.emit("shots", shots);
    io.emit("asteroids", asteroids);
    shots = [];
    for (var i = 0; i < asteroids.length; i++) {
      if (asteroids[i].x > 1200 + asteroids[i].r) {
        asteroids[i].x = -asteroids[i].r;
      } else if (asteroids[i].x < -asteroids[i].r) {
        asteroids[i].x = 1200 + asteroids[i].r;
      }
      if (asteroids[i].y > 700 + asteroids[i].r) {
        asteroids[i].y = -asteroids[i].r;
      } else if (asteroids[i].y < -asteroids[i].r) {
        asteroids[i].y = 700 + asteroids[i].r;
      }
      asteroids[i].x += asteroids[i].xVel;
      asteroids[i].y += asteroids[i].yVel;
    }
  }, 1000 / 50);
})

function createAsteroid(x, y, r) {
  if (x && y && r) {
    var x = x;
    var y = y;
    var r = r / 2;
  } else {
    var x = Math.random() * 1200;
    var y = Math.random() * 700;
    var r = 64;
  }
  var xVel = (Math.random() * 2 - 1) / (r / 8);
  var yVel = (Math.random() * 2 - 1) / (r / 8);
  var total = Math.random() * 10 + 5;
  var offset = [];
  for (var i = 0; i < total; i++) {
    offset.push(Math.random() * (r / 2) - (r / 4));
  }
  var asteroid = {
    x: x,
    y: y,
    r: r,
    xVel: xVel,
    yVel: yVel,
    total: total,
    offset: offset
  };
  return asteroid;
}

var io = socket(server);

// Client connection
io.on("connection", function(socket) {
  console.log(socket.id + " has connected");

  // Client start
  socket.on("start", function(data) {
    socket.emit("id", socket.id);
    data.ship.id = socket.id;
    clients.push(data.ship);
    shots = shots.concat(data.shots);
  })

  // Client update
  socket.on("update", function(data) {
    for (var i = 0; i < clients.length; i++) {
      if (clients[i].id == socket.id) {
        if (!data.ship.exploded) {
          data.ship.id = socket.id;
          clients.splice(i, 1, data.ship);
        } else {
          clients.splice(i, 1);
        }
      }
    }
    shots = shots.concat(data.shots);
  })

  // An asteroid is shot on a client
  socket.on("asteroids", function(data) {
    if (asteroids[data].r > 8) {
      for (var i = 0; i < 2; i++) {
        asteroids.push(createAsteroid(asteroids[data].x, asteroids[data].y, asteroids[data].r));
      }
    }
    asteroids.splice(data, 1);
  });

  // A player is shot by another
  socket.on("playerHit", function(data) {
    io.emit("playerHit", data);
  });

  // Client disconnection
  socket.on("disconnect", function() {
    for (var i = 0; i < clients.length; i++) {
      if (clients[i].id == socket.id) {
        clients.splice(i, 1);
      }
    }
    console.log(socket.id + " has disconnected");
  })
})