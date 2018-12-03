var socket = require("socket.io");
var express = require("express");
var app = express();
var clients = [];
var asteroids = [];
app.use(express.static("public"));
// Server startup
var server = app.listen(3000, function() {
  console.log("Server is Running");
  for (var i = 0; i < 10; i++) {
    asteroids.push(createAsteroid());
  }
  setInterval(function() {
    io.emit("heartbeat", clients);
    for (a of asteroids) {
      a.x += a.xVel;
      a.y += a.yVel;
    }
  }, 1000 / 60);
});

function createAsteroid() {
  var x = Math.random();
  var y = Math.random();
  var xVel = Math.random() * 2 - 1;
  var yVel = Math.random() * 2 - 1;
  var r = 0.05;
  var offset = [];
  var total = Math.random() * 10 + 5;
  for (var i = 0; i < total; i++) {
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
  socket.emit("asteroids", asteroids);
  // Client startup
  socket.on("start", function(data) {
    socket.emit("id", socket.id);
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