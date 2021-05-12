

var peer
var conn

var ServerReady = false

function stopServer(){
    peer.destroy()
    peer=null

}


function hostServer() {
    console.log("Starting server...")
    peer = new peerjs.Peer()
    peer.on('open', function (id) {
        // Make ending session available
        document.getElementById("stopgameButton").disabled=false

        console.log("Peer id is: ",peer.id)

        // Set game info
        if (currentSession != null){
            currentSession.gameInfo.serverPeerId=peer.id
            currentSession.gameInfo.updatemenu()
        }




        ServerReady = true
        // [todo] Disabled temp | RoundControlButton.setNew() // When server ready then allow opening round
    })

    peer.on("connection",on_connection)
}



function joinServer(){
    
}



function on_connection(conn){
    console.log(conn.id,"Connecting..")
}



function hostControlButton(tag){
    hostServer()
    startgame(1)
}