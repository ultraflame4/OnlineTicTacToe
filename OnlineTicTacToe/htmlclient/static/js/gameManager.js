// Handles the ui for the game
// eg. collects the info needed for game
//     - player name
//     - joining/hosting
//     - play button handles (Play,join,host)

// eg. Updates ui (eg.updating server ip in game info tab)


// helper random function
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}



const GameSessionTypeEnum = Object.freeze({
    "Singleplayer":0,
    "Hosting":1,
    "Guest":2
    }
)

const GameEndReasons = Object.freeze({
        "quit":0,
        "is_won":1,
        "is_lose":2
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
function squareIndexIsSelfstate(index1,index2,index3,self_state){

    if (getSquareByIndex(index1).dataset.state==self_state&&getSquareByIndex(index2).dataset.state==self_state&&getSquareByIndex(index3).dataset.state==self_state){

        return true
    }
    return false
}





// helper "ai" function for singleplayer
function gameAiChoose(){
    let valid_index = []

    for (let i = 0; i < 9; i++) {
        let t = getSquareByIndex(i)
        if (t.dataset.state==0){
            valid_index.push(i)

        }
    }

    // Randomly chose 1 square from valid
    let chosen = getRandomInt(valid_index.length-1)

    // since ai is enemy, just use enemy callback
    currentSession.enemy_click_callback(valid_index[chosen])
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

        // horizontal
        if (squareIndexIsSelfstate(0,1,2,self_state)){return true}
        if (squareIndexIsSelfstate(3,4,5,self_state)){return true}
        if (squareIndexIsSelfstate(6,7,8,self_state)){return true}
        //verticle
        if (squareIndexIsSelfstate(0,3,6,self_state)){return true}
        if (squareIndexIsSelfstate(1,4,7,self_state)){return true}
        if (squareIndexIsSelfstate(2,5,8,self_state)){return true}
        // diagonal
        if (squareIndexIsSelfstate(0,4,8,self_state)){return true}
        if (squareIndexIsSelfstate(2,4,6,self_state)){return true}
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

        if (this.check_win(true)){
            this.end_protocol(GameEndReasons.is_lose)
            return;
        }


    }


    square_click_callback(index){ // NOTE: ONLY CALLED WHEN BUTTON IS CLICKED
        // check if is player's turn
        if (!this.isplayer_turn){return}


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
            this.end_protocol(GameEndReasons.is_won)
            return;
        }

        // if singleplayer, call "AI"
        gameAiChoose()


    }

    end_protocol(reason){
        if (reason==GameEndReasons.is_won){
            alert("You Won!")
        }
        else if (reason==GameEndReasons.is_lose){
            alert("You lost to the enemy")
        }
        // placeholder code below, doesnt rly matter what to do when game ends. Destroy current game session
        this.end()

    }

    end(){
        // Reset state of the grid squares.
        // by deleting all of them and regenerating them
        for (let i = 0; i < tableSquares.length; i++) {
            let t= getSquareByIndex(i)
            t.disabled=false
            t.dataset.state=0
        }

        currentSession=null
    }
}



var currentSession = null

// Helper function for starting new sessions
function startNewSession(session_type){
    if (currentSession!=null){
        currentSession.end()

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