var Peer = require('simple-peer')

var roomPeers = []


navigator.mediaDevices.getUserMedia({

}).then(gotMedia).catch(() => {})
//Adds a peers to the room
function addPeer (signal, newPeerID, stream) {

    const newPeer = new Peer({
        initiator: true,
        trickle: false,
        stream
    })

    if (roomPeers.length === 0){
        roomPeers.push(newPeer);
    }
    else{
        for (peer in roomPeers){

            peer.on('signal', data => {
                newPeer.signal(data)
            })

            newPeer.on('signal', data => {
                peer.signal(data)
            })

            newPeer.on('stream', stream => {
                var audio = document.querySelector('audio')

                if ('srcObject' in video){
                    audio.srcObject = stream
                }
                else{
                    audio.src = window.URL.createObjectURL(stream) //This is needed for older browser support
                }
                audio.play()
            })

            peer.on('stream', stream => {
                var audio = document.querySelector('audio')

                if ('srcObject' in video){
                    audio.srcObject = stream
                }
                else{
                    audio.src = window.URL.createObjectURL(stream) //This is needed for older browser support
                }
                audio.play()
            })

        }
    }

}
