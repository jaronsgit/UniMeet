require("dotenv").config();
const express = require("express");
const http = require("http");
const app = express()
const server = http.createServer(app);
const socket = require("socket.io");
const io = require('socket.io')(server, { origins: '*:*'});
const path = require("path")

const users = {}; //Users object stores room objects with objects to store socket information of users in each room
const userSocketRoomMap = {}; //Store object of user socket ids with room ids for disconnection

io.on("connection", (socket) => {
  console.log("new connection");

  //User attempts to enter a room
  socket.on("enter room", (roomID, name) => {
    console.log("enter room: " + roomID);

    if (users[roomID]) {
      const length = users[roomID].length; //Get how many users are already in room

      //Limit to 6 users for performance reasons for now - (mesh network = complete graph on n vertices = many connections)
      if (length === 6) {
        socket.emit("room full");
        return;
      }
      users[roomID].push({ id: socket.id, name: name }); //Add id of socket and name user entered into frontend
    } else {
      users[roomID] = [{ id: socket.id, name: name }]; //Initialise the room array
    }

    userSocketRoomMap[socket.id] = roomID;

    const otherUsersInThisRoom = users[roomID].filter(
      ({ id, name }) => id !== socket.id
    ); //users other than one asking to join

    socket.emit("other users", otherUsersInThisRoom);
    console.log("users in (" + roomID + "): ", otherUsersInThisRoom);
  });

  //Signal sent to other users that new user has joined
  socket.on("forward signal", (payload) => {
    io.to(payload.userToSignal).emit("user entered", {
      signal: payload.signal,
      socketID: payload.socketID,
      name: payload.name,
    });
  });

  //Signal back to new user from other peers
  socket.on("back signal", (payload) => {
    io.to(payload.socketID).emit("returned signal", {
      signal: payload.signal,
      socketID: socket.id,
      name: payload.name,
    });
  });

  //User disconnects from room
  socket.on("disconnect", () => {
    const roomID = userSocketRoomMap[socket.id]; //Get room user was currently in

    console.log("user leaving", socket.id);
    let room = users[roomID]; //Get all users in the room
    if (room) { //Room does exist - unnecessary
      room = room.filter(peer => peer.id !== socket.id); //Remove current person from room
      users[roomID] = room //Update users in room with new members in the room
    }
    socket.broadcast.emit('user left', socket.id); //Wouldn't this broadcast to all rooms?

  });
});

if (process.env.PROD){
  app.use(express.static(path.join(__dirname,'./frontend/build')));
  app.get('*',(req,res) =>{res.sendFile(path.join(__dirname,'./frontend/build/index.html'))})
}

const port = process.env.PORT || 8000;
server.listen(port, () =>
  console.log("server is running on port",port)
);
