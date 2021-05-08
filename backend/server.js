require("dotenv").config();
const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const socket = require("socket.io");
const io = socket(server);

const users = {}; //Users object stores room objects with objects to store socket information of users in each room

io.on("connection", (socket) => {
  console.log("new connection");

  //User attempts to enter a room
  socket.on("enter room", (roomID, name) => {});

  //Signal sent to other users that new user has joined
  socket.on("forward signal", (payload) => {});

  //Signal back to new user from other peers
  socket.on("back signal", (payload) => {});

  //User disconnects from room
  socket.on("disconnect", () => {});
});

server.listen(process.env.PORT || 8000, () =>
  console.log("server is running on port 8000")
);
