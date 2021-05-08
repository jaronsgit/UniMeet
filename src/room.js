import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";

const Room = (props) => {
  const [peers, setPeers] = useState([]);
  const socketRef = useRef(); //Store ref to underlying socket io socket for server
  const userVideo = useRef(); //Store ref to user video/audio stream
  const peersRef = useRef([]);
  const { roomID } = useParams(); //Get room id from url path
  const { name } = props;

  //Use effect to run once when we enter room for first time
  useEffect(() => {
    socketRef.current = io.connect("/"); //connect to server endpoint and get socket to server
    //Get access to device media stream - need to ask for permission - remember https for later
    navigator.mediaDevices
      .getUserMedia({ video: false, audio: true })
      .then((stream) => {
        userVideo.current.srcObject = stream;
        socketRef.current.emit("enter room", roomID, name);
        socketRef.current.on("other users", (users) => {
          console.log("users received: ", users);
        });

        socketRef.current.on("user entered", (payload) => {
          console.log("user entered: ", payload);
        });

        socketRef.current.on("returned signal", (payload) => {
          console.log("returned signal: ", payload);
        });
      });
  }, []);

  //Create peer for other users received already in room
  function createOtherUserPeer(userToSignal, socketID, stream, name) {
    console.log("createOtherUserPeer: ", userToSignal, socketID, stream, name);

    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      socketRef.current.emit("forward signal", {
        userToSignal,
        socketID,
        signal,
        name,
      });
    });

    return peer;
  }

  //Add new peer that entered the room we are already in
  function addNewPeer(incomingSignal, socketID, stream, name) {
    console.log("addNewPeer: ", incomingSignal, socketID, stream, name);

    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      socketRef.current.emit("back signal", { signal, socketID, name });
    });

    peer.signal(incomingSignal); //signal the new peer back

    return peer;
  }

  return <div></div>;
};

export default Room;
