// Asteroids Online Project Server File
// Thomas J Wright

// Requiring socket.io package
var socket = require("socket.io");
var express = require("express");
var app = express();
var clients = [];
app.use(express.static("public"));
var server = app.listen(3000, function() {
  console.log("Server is Running");
  setInterval(function() {
    io.emit("heartbeat", clients);
  }, 1000 / 60);
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
    for (var i = 0; i < clients.length; i++) {
      if (clients[i].id == socket.id) {
        data.id = socket.id;
        clients.splice(i, 1, data);
      }
    }
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