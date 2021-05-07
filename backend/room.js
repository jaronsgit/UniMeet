import React, { useEffect, useRef } from "react";
import Peer from "simple-peer";
import io from "socket.io-client";



var roomPeers = []

const room = (params) => {
    const userVoice = useRef();
    const socket = useRef();
    const peers = useRef();
    const roomID = params.roomID;

    useEffect(() => {
        socket.current = io.connect("/");
        navigator.mediaDevices.getUserMedia({audio: true, video: false}).then(stream => {
            userVoice.current.srcObject = stream;
            socket.current.emit("join", roomID);
            socket.current.on("user list", users => {
                //Iterate through each user present in the room and create a local peer for each of the users in the room.
                for (ID of users) {
                    const peer = initPeer(ID, socket.current.id, stream);
                    peers.current.push({
                        peerID: ID,
                        peer
                    })
                }
            })
        })
    })

    //Initialise a new peer
    function initPeer(existingUserID, newUserID, stream) {

        //Create peer object
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream,
        })

        //sent a signal to the existing user to start establishing a connection.
        peer.on("signal", signal => {
            socket.current.emit("sending signal", {existingUserID, newUserID, signal})
        })

        return peer;
    }
}
//Adds a peers to the room
function addPeer (signal, newPeerID, stream) {

}
