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






function startgame(playType) {
    // playType: 0-singleplayer 1-joinGame 2-Host&Play
    console.log("Starting game")

}