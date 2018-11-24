var socket = require('socket.io');
var express = require('express');

var app = express();

app.use(express.static('public'));
var server = app.listen(process.env.PORT, function() {
  console.log("Server is Running");
});

setInterval(heartbeat, 1000 / 60);

function heartbeat() {
  io.sockets.emit("heartbeat", clients);
}

var io = socket(server);

var clients = [];

io.on("connection", function(socket) {
  console.log(socket.id + " has connected");
  socket.on("start", function(data) {
    clients.push(data);
  });
  socket.on("update", function(data) {
    for (c of clients) {
      if (c.id = socket.id) {
        c = data;
      }
    }
  });
  socket.on("disconnect", function() {
    for (c of clients) {
      if (c.id == socket.id) {
        clients.splice(c, 1);
      }
    }
    console.log(socket.id + " has disconnected");
  });
});
