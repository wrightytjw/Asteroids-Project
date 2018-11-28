var socket = require("socket.io");
var express = require("express");
var app = express();
var clients = [];
var asteroids = [];
app.use(express.static("public"));
var server = app.listen(3000, function() {
  console.log("Server is Running");
  generateAsteroids();
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

function createAsteroids() {
  var x = Math.random(width);
  var y = Math.random(height);
}