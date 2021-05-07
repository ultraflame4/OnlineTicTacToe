// Handles the ui for the game
// eg. collects the info needed for game
//     - player name
//     - joining/hosting
//     - play button handles (Play,join,host)

// eg. Updates ui (eg.updating server ip in game info tab)





const GameSessionTypeEnum = Object.freeze({
    "Singleplayer":0,
    "Hosting":1,
    "Guest":2
    }
)

class GameInfo {
    constructor(gameSessionType) {
        this.playername = ""
        this.serverIp = ""
        this.serverPort = ""
        this.hostPort = ""
        this.verified = false
        this.gameType=gameSessionType
    }

    getInfo() {
        this.playername = document.getElementById("username_in").value
        this.serverIp = document.getElementById("serverip").value
        this.serverPort = document.getElementById("serverport").value
        this.hostPort = document.getElementById("hostserverport").value

    }
}

// Network

class GameNetworking{

}



// note. helper function
function squareIndexIsSelfstate(index,self_state){
    if (getSquareByIndex(index).dataset.state==self_state){
        return true
    }
    return false
}

// Note: This class is just for organisation and putting all functions for the current game session in 1 place
//       there CANNOT be MORE THAN 1 session AT A TIME

class GameSession {
    constructor() {
        this.gameInfo=null
        this.isplayer_turn = true // True if is player turn. false if enemy turn
    }

    set_gameInfo(gameInfo){
        this.gameInfo = gameInfo
    }



    check_win(isenemy=false){
        // Return true if player/enemy wins
        let self_state = (isenemy) ? 2 : 1
        if (squareIndexIsSelfstate(0,self_state)){
            if (squareIndexIsSelfstate(1,self_state)){
                if (squareIndexIsSelfstate(2,self_state)){
                    return true
                }
            }
            else if (squareIndexIsSelfstate(4,self_state)){
                if (squareIndexIsSelfstate(8,self_state)){
                    return true
                }
            }
            else if (squareIndexIsSelfstate(3,self_state)){
                if (squareIndexIsSelfstate(6,self_state)){
                    return true
                }
            }
        }
        else if (squareIndexIsSelfstate(8,self_state)){
            if (squareIndexIsSelfstate(5,self_state)){
                if (squareIndexIsSelfstate(2),self_state){
                    return true
                }
            }
            else if (squareIndexIsSelfstate(7,self_state)){
                if (squareIndexIsSelfstate(6,self_state)){
                    return true
                }
            }
        }
        else if (squareIndexIsSelfstate(4,self_state)){
            if (squareIndexIsSelfstate(2,self_state)){
                if (squareIndexIsSelfstate(6,self_state)){
                    return true
                }
            }
            if (squareIndexIsSelfstate(1,self_state)){
                if (squareIndexIsSelfstate(7,self_state)){
                    return true
                }
            }
            if (squareIndexIsSelfstate(3,self_state)){
                if (squareIndexIsSelfstate(5,self_state)){
                    return true
                }
            }
        }
        return false

    }


    // seperate call back for enemy, -> easier to implement multiplayer ltr
    enemy_click_callback(index){
        if (this.isplayer_turn){return}
        setSquareState(index,2)
        // change turns
        this.isplayer_turn=true
        // reenable buttons after enemy turn
        for (let i = 0; i < 9; i++) {
            getSquareByIndex(i).disabled=false
        }
    }


    square_click_callback(index){
        // Callback for player turn

        // change gui square state
        setSquareState(index,1)

        // After player's turn, disable all other buttons that have not been selected
        for (let i = 0; i < 9; i++) {
            let t =getSquareByIndex(i)
            if (t.dataset.state == 0){
                t.disabled=true
            }
        }

        this.isplayer_turn=false
        // Check if win.
        if (this.check_win()){
            console.log("WIN!")
        }

    }

    end(){
        // Reset state of the grid squares.
        // by deleting all of them and regenerating them
        for (let i = 0; i < tableSquares.length; i++) {
            let t= getSquareByIndex(i)
            t.disabled=false
            t.dataset.state=0
        }
    }
}



var currentSession = null

// Helper function for starting new sessions
function startNewSession(session_type){
    if (currentSession!=null){
        currentSession.end()
        currentSession=null
    }
    currentSession = new GameSession()
    currentSession.set_gameInfo(new GameInfo())
    currentSession.gameInfo.getInfo()
}





function startgame(playType) {
    // playType: 0-singleplayer 1-Host&Play 2-joinGame
    console.log("Starting game")
    // Start new session
    startNewSession(playType)


}