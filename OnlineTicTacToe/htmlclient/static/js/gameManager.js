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
        "is_lose":2,
        "is_tied":3
    }
)




class GameInfo {
    constructor(gameSessionType) {
        this.playername = ""
        this.enemyName = ""
        this.serverIp = ""
        this.serverPort = ""
        this.hostPort = ""
        this.verified = false
        this.gameType=gameSessionType
        this.no_rounds = 0 // Number of rounds
        this.scores = [0,0]
    }

    getInfo() {

        this.playername = document.getElementById("username_in").value
        this.serverIp = document.getElementById("serverip").value
        this.serverPort = document.getElementById("serverport").value
        this.hostPort = document.getElementById("hostserverport").value

    }

    updatemenu(){
        // updates the game info menu

        document.getElementById("gmmserverip").textContent=this.serverIp
        document.getElementById("gmmserverport").textContent=this.serverPort
        document.getElementById("gameinforound").textContent=this.no_rounds
        document.getElementById("gameInfoPlayerName").textContent=this.playername
        document.getElementById("gameInfoPlayerScore").textContent=this.scores[0]
        document.getElementById("gameInfoEnemyName").textContent=this.enemyName
        document.getElementById("gameInfoEnemyScore").textContent=this.scores[1]
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



    let chosen=null;
    // Helper function for ai
    function gameAidecider(index1,index2,index3){
        if (getSquareByIndex(index1).dataset.state==1 && getSquareByIndex(index2).dataset.state==1){
            chosen = index3
        }
        else if (getSquareByIndex(index3).dataset.state==1 && getSquareByIndex(index2).dataset.state==1){
            chosen = index1
        }
        else if (getSquareByIndex(index1).dataset.state==1 && getSquareByIndex(index3).dataset.state==1){
            chosen = index2
        }


        if (chosen!=null && getSquareByIndex(chosen).dataset.state==0){
            return true
        }


        return false
    }

    // vertical
    if (gameAidecider(0,1,2)){}
    else if (gameAidecider(3,4,5)){}
    else if (gameAidecider(6,7,8)){}
    //horizontal
    else if (gameAidecider(0,3,6)){}
    else if (gameAidecider(1,4,7)){}
    else if (gameAidecider(2,5,8)){}
    // diagonal
    else if (gameAidecider(0,4,8)){}
    else if (gameAidecider(2,4,6)){}

    // Randomly chose 1 square from valid
    else{

        chosen = getRandomInt(valid_index.length - 1)
        currentSession.enemy_click_callback(valid_index[chosen])
        return
    }
    // since ai is enemy, just use enemy callback
    currentSession.enemy_click_callback(chosen)
}

function disableAllSquare(){
    for (let i = 0; i < 9; i++) {
        getSquareByIndex(i).disabled=true
    }
}

function setAllSquaresState(state){
    for (let i = 0; i < 9; i++) {
        getSquareByIndex(i).dataset.state=state
    }
}


// Note: This class is just for organisation and putting all functions for the current game session in 1 place
//       there CANNOT be MORE THAN 1 session AT A TIME

class GameSession {
    constructor() {
        this.gameInfo=null
        this.isplayer_turn = true // True if is player turn. false if enemy turn
        this.isInRound=false
    }

    set_gameInfo(gameInfo){
        this.gameInfo = gameInfo
        this.gameInfo.getInfo()
        if (gameInfo.gameType==GameSessionTypeEnum.Singleplayer){
            gameInfo.enemyName="Computer"
        }

        this.gameInfo.updatemenu()
        this.isInRound=true

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


    check_tie(){
        let all_used = true
        for (let i = 0; i < 9; i++) {
            if (getSquareByIndex(i).dataset.state==0){all_used=false}
        }
        return all_used
    }

    // seperate call back for enemy, -> easier to implement multiplayer ltr
    enemy_click_callback(index){
        if (this.isplayer_turn){return}
        if (getSquareByIndex(index).dataset.state!=0){return;}

        console.log("ENEMY: ",index)
        setSquareState(index,2)
        // change turns
        this.isplayer_turn=true
        // reenable buttons after enemy turn
        for (let i = 0; i < 9; i++) {
            getSquareByIndex(i).disabled=false
        }

        if (this.check_win(true)){
            // add 1 score to enemy
            this.gameInfo.scores[1]+=1
            this.end_protocol(GameEndReasons.is_lose)
            return;
        }
        else if(this.check_tie()){
            this.end_protocol(GameEndReasons.is_tied)
            return;
        }



    }


    square_click_callback(index){ // NOTE: ONLY CALLED WHEN BUTTON IS CLICKED
        // check if is player's turn
        if (!this.isplayer_turn){return}

        // Check if index is alr used
        if (getSquareByIndex(index).dataset.state!=0){return;}

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
            // Add 1 score to player
            this.gameInfo.scores[0]+=1
            this.end_protocol(GameEndReasons.is_won)
            return;
        }
        else if(this.check_tie()){
            this.end_protocol(GameEndReasons.is_tied)
            return;
        }


        // if singleplayer, call "AI"
        console.log(this.gameInfo.gameType,GameSessionTypeEnum.Singleplayer)
        if (this.gameInfo.gameType==GameSessionTypeEnum.Singleplayer){gameAiChoose()}



    }

    end_protocol(reason){
        this.gameInfo.updatemenu()
        disableAllSquare()
        this.isInRound=false
        document.getElementById("roundControlbutton").textContent="New Round"
        if (reason==GameEndReasons.quit){
            this.reset()
            this.end()
            return
        }


        setTimeout(() => {
            if (reason == GameEndReasons.is_won) {
                alert("You Won!")
            } else if (reason == GameEndReasons.is_lose) {
                alert("You lost to the enemy")
            } else if (reason == GameEndReasons.is_tied) {
                alert("Tied!")
            }

        }, 500)

    }

    reset(){
        // Reset state of the grid squares.
        for (let i = 0; i < tableSquares.length; i++) {
            let t= getSquareByIndex(i)
            t.disabled=false
            t.dataset.state=0
        }
    }

    end(){
        // disable round control
        document.getElementById("roundControlbutton").textContent="N/A"
        document.getElementById("roundControlbutton").disabled=true
        currentSession=null
    }

    newRound(){
        this.reset()
        this.isplayer_turn=true
        this.isInRound=true
        // Change text on roundControlButton
        document.getElementById("roundControlbutton").textContent="Quit"

        this.gameInfo.no_rounds+=1

        this.gameInfo.updatemenu()

    }
}





var currentSession = null

// Helper function for starting new sessions
function startNewSession(session_type){
    if (currentSession!=null){
        currentSession.end()

    }
    currentSession = new GameSession()
    currentSession.set_gameInfo(new GameInfo(session_type))
    currentSession.gameInfo.getInfo()
    // Enable round control button
    document.getElementById("roundControlbutton").textContent="Quit"
    document.getElementById("roundControlbutton").disabled=false
    openGameInfoMenu()
}





function startgame(playType) {
    // playType: 0-singleplayer 1-Host&Play 2-joinGame
    console.log("Starting game")
    // Start new session
    startNewSession(playType)


}




function roundControlButtonCallback(){
    if (currentSession == null){return}
    console.log(currentSession.isInRound)
    if (currentSession.isInRound){
        if (!confirm("Are you sure you want to quit?")){
            return
        }
        currentSession.end_protocol(GameEndReasons.quit)
    }else{
        currentSession.newRound()
    }
}