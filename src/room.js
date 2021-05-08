import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

import { useHistory, useParams } from "react-router-dom";

const Video = (props) => {
  const ref = useRef();

  useEffect(() => {
    props.peer.on("stream", (stream) => {
      ref.current.srcObject = stream;
    });
  }, []);

  return (
    <div style={{ border: "1px solid red", display: "none" }}>
      <video playsInline autoPlay ref={ref} />
    </div>
  );
};

const Room = (props) => {
  const [peers, setPeers] = useState([]);
  const socketRef = useRef(); //Store ref to underlying socket io socket for server
  const userVideo = useRef(); //Store ref to user video/audio stream
  const peersRef = useRef([]);
  const { roomID } = useParams(); //Get room id from url path
  const { name } = props;

  const [peerNames, setPeerNames] = useState([]);

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
          const peers = [];
          const peerNames = [];
          users.forEach((user) => {
            const peer = createOtherUserPeer(
              user.id,
              socketRef.current.id,
              stream,
              name
            );
            peersRef.current.push({
              peerID: user.id,
              peer,
            });
            peers.push(peer);
            peerNames.push(user.name);
          });
          setPeers(peers);
          setPeerNames(peerNames);
        });

        socketRef.current.on("user entered", (payload) => {
          console.log("user entered: ", payload);
          const peer = addNewPeer(
            payload.signal,
            payload.socketID,
            stream,
            payload.name
          );
          peersRef.current.push({
            peerID: payload.socketID,
            peer,
          });
          setPeerNames((peerNames) => [...peerNames, payload.name]);
          setPeers((users) => [...users, peer]);
        });

        socketRef.current.on("returned signal", (payload) => {
          console.log("returned signal: ", payload);
          const peerToSignalBack = peersRef.current.find(
            (p) => p.peerID === payload.socketID
          );
          peerToSignalBack.peer.signal(payload.signal);
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

  return (
    <div>
      <video muted ref={userVideo} autoPlay playsInline />
      {peers.map((peer, index) => {
        return <Video key={index} peer={peer} />;
      })}
      <List component="nav" aria-label="secondary mailbox folders">
        {peerNames.map((name, index) => {
          return (
            <ListItem button key={index}>
              <ListItemText primary={name} />
            </ListItem>
          );
        })}
      </List>
    </div>
  );
};

export default Room;
