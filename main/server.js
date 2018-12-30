// Importing required libraries
var socket = require("socket.io");
var express = require("express");

var app = express();

// Empty arrays for clients and asteroids
var clients = [];
var asteroids = [];

// Hosting public folder
app.use(express.static("public"));

// Server startup
var server = app.listen(3000, function() {
  console.log("Server is Running");
  for (var i = 0; i < 10; i++) {
    newAsteroid = createAsteroid();
    asteroids.push(newAsteroid);
  }
  setInterval(function() {
    io.emit("heartbeat", clients);
    for (var i = 0; i < asteroids.length; i++) {
      asteroids[i].x += asteroids[i].xVel;
      asteroids[i].y += asteroids[i].yVel;
    }
  }, 1000 / 60);
});

// Asteroid generation
function createAsteroid() {
  var x = Math.random() * 1200;
  var y = Math.random() * 700;
  var r = 64;
  var xVel = (Math.random() * 2 - 1) / (r / 8);
  var yVel = (Math.random() * 2 - 1) / (r / 8);
  var offset = [];
  for (var i = 0; i < 8; i++) {
    offset[i] = Math.random() * (r / 2) - (r / 4);
  }
  var asteroid = {
    x: x,
    y: y,
    xVel: xVel,
    yVel: yVel,
    r: r,
    offset: offset
  };
  return asteroid;
}

var io = socket(server);

// Clients connection
io.on("connection", function(socket) {
  console.log(socket.id + " has connected");

  // Client startup
  socket.on("start", function(data) {
    socket.emit("id", socket.id);
    socket.emit("asteroids", asteroids);
    data.id = socket.id;
    clients.push(data);
  });

  // Client update
  socket.on("update", function(data) {
    for (c of clients) {
      if (c.id == socket.id) {
        data.id = socket.id;
        clients.splice(clients.indexOf(c), 1, data);
      }
    }
  });

  // Client disconnection
  socket.on("disconnect", function() {
    for (c of clients) {
      if (c.id == socket.id) {
        clients.splice(clients.indexOf(c), 1);
      }
    }
    console.log(socket.id + " has disconnected");
  });
});