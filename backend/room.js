import React, {useEffect, useRef} from "react";
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

            socket.current.on("new user", payload => {
                const peer = addPeer(payload.signal, payload.newUserID, stream);
                peers.current.push({
                    peerID: payload.newUserID,
                    peer
                })
            })

            socket.current.on("received returned signal", payload => {
                const est = peers.current.find(peer => peer.peerID === payload.id);
                est.peer.signal(payload.signal);
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

        //wait for peer signal and then inform server of creating a peer for the existing user
        peer.on("signal", signal => {
            socket.current.emit("sending signal", {existingUserID, newUserID, signal})
        })

        return peer;
    }

    //Adds a new peer to existing peers in the room.
    function addPeer(inSignal, newUserID, stream) {
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream,
        })

        //wait for peer signal and then inform server of creating a peer for the new user
        peer.on("signal", signal => {
            socket.current.emit("returning signal", {signal, newUserID})
        })

        //Establishes the connection
        peer.signal(inSignal);

        return peer;
    }
}