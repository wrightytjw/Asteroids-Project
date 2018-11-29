var socket = require("socket.io");
var express = require("express");
var p5 = require("p5");
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
  var pos = p5.Vector.random2D();
  var r = 0.3;
  var vel = p5.Vector.random2D();
  var total = p5.random(5, 15);
  var offset = [];
  var vertices = [];
  for (var i = 0; i < total; i++) {
    var diff = p5.random(-r / 2, r / 2)
  }
  for (var i = 0; i < total; i++) {
    var angle = p5.map(i, 1, total, 0, TWO_PI);
    var r = r + offset[i];
    var x = r * cos(angle);
    var y = r * sin(angle);
    var xy = p5.createVector(x, y);
    vertices.push(xy);
  }
  var asteroid = {
    posFactor: pos,
    rFactor: r,
    velFactor: vel,
    vertices: vertices
  };
  return asteroid;
}