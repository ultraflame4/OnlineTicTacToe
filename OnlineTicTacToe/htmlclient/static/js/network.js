

var peer
var conn


var network = {
    stopNetwork:stopNetworking,
    hostServer:hostServer,
    joinServer:joinServer,
    hostControlButton:hostControlButton
}

const NetworkDataTypes = Object.freeze({
    "PlayerInfo":"playerinfo",
    "ConnectionAccepted":"connectionaccepted"

                                       })



function createPeerInstance(open_callback) {
    if (peer!=null){
        console.log("Existing peer instance found, stopping that instance...")
        stopNetworking()
    }

    console.log("Creating new peer instance...")
    peer = new peerjs.Peer()
    peer.on('open', function (id) {
        // Make ending session available
        document.getElementById("stopgameButton").disabled=false
        console.log("Peer id is: ",peer.id)

        open_callback()

        // Disable first (Dont let player create new round), enable when server is ready (connected to another player)
        RoundControlButton.setNone()
    })

    peer.on('error',(err)=>{
        stopNetworking()
        console.log("Error:",err)
        switch (err.type) {
            case "browser-incompaitible":
                alert("Fatal Error: Your browser is not compaitible with peerjs.")
                alert("Multiplayer options are not available")
                break
            case "network":
                alert("Fatal Error: Signalling server unavailable")
                alert("Multiplayer options are not available")
                break

            case "server-error":
                alert("Fatal Error: PeerJs cannot reach peer server")
                alert("Multiplayer options are not available")

            case 'peer-unavailable':
                alert("peer unavailable, peer id entered is not valid or corresponding is unreachable")

        }



    })

}


function stopNetworking(){
    console.log("Stopping Server!")
    if (currentSession!=null){
        console.log("Existing currentSession... Ending it.")
        currentSession.end_protocol(GameEndReasons.quit)
    }
    if (peer!=null)
    {
        peer.destroy()
        peer = null
    }

}


function hostServer() {
    startgame(1)

    createPeerInstance(()=>{
        // Set game info
        if (currentSession != null){
            currentSession.gameInfo.serverPeerId=peer.id
            currentSession.gameInfo.updatemenu()
        }
        var already_connected= false

        peer.on('connection',(conn)=>{
            console.log("New data connection from peer:",conn.peer)
            if (!already_connected && confirm("Incoming connection another player.\n" +
                                                  "Player Name:\n" +conn.metadata.playername+
                                                  "Peer Id: "+conn.peer)){

                conn.on('open',()=>{
                    console.log("Data connection ready")
                    // When connection accepted send player info to remote client
                    conn.send({type:NetworkDataTypes.PlayerInfo,name:currentSession.gameInfo.playername})

                    conn.on("data",(data)=>{
                        console.log("Recieved data from peer: ",conn.peer,"\nData:",data)

                        switch (data.type) {
                            case NetworkDataTypes.PlayerInfo:
                                currentSession.gameInfo.enemyName=data.name
                                currentSession.gameInfo.updatemenu()


                            default:
                                break
                        }


                        conn.send({type:NetworkDataTypes.ConnectionAccepted,value:true})


                    })
                })

            }
        else // If conenction was not accepted
        {
                console.log("Rejecting connection... when channel ready")
                conn.on("open",()=>{
                    conn.send({type:NetworkDataTypes.ConnectionAccepted,value:false})
                    setTimeout(()=>{
                        connsole.log("Timeout: closing connection")
                        conn.close()},1000)
                })

            }


        })

    })
}


function joinServer(){

    startgame(2)

    createPeerInstance(()=>{
        let targetid = document.getElementById("serverpeerid").value
        // connect to target
        let conn = peer.connect(targetid,{
            metadata:{playername:currentSession.gameInfo.playername}
        })
        console.log("connected to target peer of peer id:",targetid)
        conn.on('open',()=>{
            console.log("Data connection ready")
            console.log("Sending player info..")
            conn.send({
                          type:NetworkDataTypes.PlayerInfo,
                          name:currentSession.gameInfo.playername,

                      })


            conn.on("data",(data)=>{
                switch (data.type) {

                    case NetworkDataTypes.ConnectionAccepted:
                        if (!data.value){
                            console.log("Connection rejected")
                            conn.close()
                            stopNetworking()
                            alert("Error, Host did not accept your connection")

                        }
                        else{
                            currentSession.gameInfo.serverPeerId = conn.peer
                            currentSession.gameInfo.updatemenu()
                            console.log("Connection accepted")
                        }
                        break

                    case NetworkDataTypes.PlayerInfo:
                        currentSession.gameInfo.enemyName=data.name
                        currentSession.gameInfo.updatemenu()
                        break

                    default:
                        break

                }
            })
        })

    })




}





function hostControlButton(tag){

    hostServer()
}