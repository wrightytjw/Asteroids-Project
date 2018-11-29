var socket = require("socket.io");
var express = require("express");
var app = express();
var clients = [];
var asteroids = [];
app.use(express.static("public"));
var server = app.listen(3000, function() {
  console.log("Server is Running");
  for (var i = 0; i < 10; i++) {
    asteroids.push(new createAsteroid());
  }
});
var io = socket(server);
io.on("connection", function(socket) {
  console.log(socket.id + " has connected");
  socket.on("start", function(data) {
    socket.emit("id", socket.id);
    data.id = socket.id;
    clients.push(data);
  });
  socket.on("update", function(data) {
    for (c of clients) {
      if (c.id == socket.id) {
        data.id = socket.id;
        clients.splice(clients.indexOf(c), 1, data);
      }
    }
    data = {
      ships: clients,
      asteroids: asteroids
    };
    io.emit("heartbeat", data);
    for (a of asteroids) {
      a.xFactor += a.xVel;
      a.yFactor += a.yVel;
    };
  });
  socket.on("disconnect", function() {
    for (c of clients) {
      if (c.id == socket.id) {
        clients.splice(clients.indexOf(c), 1);
      }
    }
    console.log(socket.id + " has disconnected");
  });
});

function createAsteroid() {
  var x = Math.random();
  var y = Math.random();
  var r = 0.05;
  var tempXVel = Math.random();
  var tempYVel = Math.random();
  var xVel = tempXVel / (Math.sqrt(tempXVel ** 2 + tempYVel ** 2));
  var yVel = tempYVel / (Math.sqrt(tempXVel ** 2 + tempYVel ** 2));
  var total = Math.random() * 10 + 5;
  var offset = [];
  for (var i = 0; i < total; i++) {
    var diff = 0.5 * (Math.random() * 2 - 1);
    offset.push(diff);
  }
  var asteroid = {
    xFactor: x,
    yFactor: y,
    rFactor: r,
    offset: offset,
    xVel: xVel,
    yVel: yVel
  };
  return asteroid;
}