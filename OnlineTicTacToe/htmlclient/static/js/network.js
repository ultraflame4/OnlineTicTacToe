var peer
var conn


var network = {
    stopNetwork: stopNetworking,
    hostServer: hostServer,
    joinServer: joinServer,
    hostControlButton: hostControlButton
}

const NetworkDataTypes = Object.freeze({
                                           "PlayerInfo": "playerinfo",
                                           "ConnectionAccepted": "connectionaccepted",
                                           "GameNewRound": "game_newround",
                                           "GameSquareSet": "setsquare",
                                           "TurnChanged": "turnchanged"

                                       })


function createPeerInstance(open_callback) {
    if (peer != null) {
        console.log("Existing peer instance found, stopping that instance...")
        stopNetworking()
    }

    console.log("Creating new peer instance...")
    peer = new peerjs.Peer()
    peer.on('open', function (id) {
        // Make ending session available
        document.getElementById("stopgameButton").disabled = false
        console.log("Peer id is: ", peer.id)

        open_callback()

        // Disable first (Dont let player create new round), enable when server is ready (connected to another player)
        RoundControlButton.setNone()
    })

    peer.on('error', (err) => {
        stopNetworking()
        console.log("Error:", err)
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


function stopNetworking() {
    console.log("Stopping Server!")
    if (peer != null) {
        peer.destroy()
        peer = null
    }

}


function hostServer() {
    let cs = startgame(1)

    createPeerInstance(() => {
        // Set game info
        cs.gameInfo.serverPeerId = peer.id
        cs.gameInfo.updatemenu()

        var already_connected = false

        peer.on('connection', (conn) => {
            console.log("New data connection from peer:", conn.peer)
            if (!already_connected && confirm("Incoming connection another player.\n" +
                                                  "Player Name: " + conn.metadata.playername +
                                                  "\nPeer Id:  " + conn.peer)) {

                conn.on('open', () => {
                    console.log("Data connection ready")
                    // When connection accepted send player info to remote client
                    conn.send({type: NetworkDataTypes.PlayerInfo, name: cs.gameInfo.playername})

                    conn.on("data", (data) => {
                        console.log("Recieved data from peer: ", conn.peer, "\nData:", data)

                        switch (data.type) {
                            case NetworkDataTypes.PlayerInfo:
                                cs.gameInfo.enemyName = data.name
                                cs.gameInfo.updatemenu()
                                // allow player to create new round
                                RoundControlButton.setNew()

                            case NetworkDataTypes.GameSquareSet:
                                console.log("enemy set square", data.index)
                                cs.enemy_click_callback(data.index)

                            default:
                                break
                        }


                        conn.send({type: NetworkDataTypes.ConnectionAccepted, value: true})


                    })

                    GameEvents.on("newRound", (cs) => {
                        console.log("new round! sending to remote...")
                        conn.send({
                                      type: NetworkDataTypes.GameNewRound,
                                      hostScore: cs.gameInfo.scores[0],
                                      guestScore: cs.gameInfo.scores[1],
                                      noRounds: cs.gameInfo.no_rounds
                                  });
                    })

                    GameEvents.on("setSquare", (index_, state_) => {
                        conn.send({
                                      type: NetworkDataTypes.GameSquareSet,
                                      index: index_,
                                      state: state_
                                  })
                    })

                    GameEvents.on("changeTurn", (ishostturn) => {
                        conn.send({type: NetworkDataTypes.TurnChanged, isHostTurn: ishostturn})
                    })

                })

            } else // If conenction was not accepted
            {
                console.log("Rejecting connection... when channel ready")
                conn.on("open", () => {
                    conn.send({type: NetworkDataTypes.ConnectionAccepted, value: false})
                    setTimeout(() => {
                        connsole.log("Timeout: closing connection")
                        conn.close()
                    }, 1000)
                })

            }


        })

    })
}


function joinServer() {

    let cs = startgame(2)

    createPeerInstance(() => {
        let targetid = document.getElementById("serverpeerid").value
        // connect to target
        let conn = peer.connect(targetid, {
            metadata: {playername: cs.gameInfo.playername}
        })
        console.log("connected to target peer of peer id:", targetid)
        conn.on('open', () => {
            console.log("Data connection ready")
            console.log("Sending player info..")
            conn.send({
                          type: NetworkDataTypes.PlayerInfo,
                          name: cs.gameInfo.playername,

                      })


            conn.on("data", (data) => {
                switch (data.type) {

                    case NetworkDataTypes.ConnectionAccepted:
                        if (!data.value) {
                            console.log("Connection rejected")
                            conn.close()
                            stopNetworking()
                            alert("Error, Host did not accept your connection")

                        } else {
                            cs.gameInfo.serverPeerId = conn.peer
                            cs.gameInfo.updatemenu()
                            console.log("Connection accepted")

                        }
                        break

                    case NetworkDataTypes.PlayerInfo:
                        cs.gameInfo.enemyName = data.name
                        cs.gameInfo.updatemenu()
                        break

                    case NetworkDataTypes.GameNewRound:
                        console.log("new round! from host")
                        cs.isInRound = true
                        cs.gameInfo.no_rounds = data.noRounds
                        cs.gameInfo.scores[0] = data.guestScore
                        cs.gameInfo.scores[1] = data.hostScore
                        cs.gameInfo.updatemenu()
                        cs.newRound(false)

                    case NetworkDataTypes.GameSquareSet:
                        console.log("Recieved Set Square data", data.index)
                        setSquareState(data.index, data.state)

                    case NetworkDataTypes.TurnChanged:
                        setAllSquareDisabled(data.isHostTurn)


                    default:
                        break

                }
            })

            GameEvents.on("rSetSquare", (index_) => {
                console.log("sefning setSquare", index_)
                conn.send({type: NetworkDataTypes.GameSquareSet, index: index_})
            })
        })

    })


}


function hostControlButton(tag) {

    hostServer()
}