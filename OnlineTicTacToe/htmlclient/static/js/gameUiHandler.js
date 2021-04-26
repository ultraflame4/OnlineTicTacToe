// Handles the ui for the game
// eg. collects the info needed for game
//     - player name
//     - joining/hosting
//     - play button handles (Play,join,host)

// eg. Updates ui (eg.updating server ip in game info tab)


class GameUIInfo {
    constructor() {
        this.playername = ""
        this.serverIp = ""
        this.serverPort = ""
        this.hostPort=""
        this.verified=false
    }

    getInfo(){
        this.playername = document.getElementById("username_in").value
        this.serverIp=document.getElementById("serverip").value
        this.serverPort=document.getElementById("serverport").value
        this.hostPort=document.getElementById("hostserverport").value

    }
}



// Returns info needed for connection
// Dunnit check, just catch error and alert() it
function getInfo(check_type=0){
    gameUIinfo = new GameUIInfo()
    gameUIinfo.getInfo()
    return gameUIinfo
}

function uiPlayGame(playType){
    // playType: 0-singleplayer 1-joinGame 2-Host&Play
    alert("Unavailable")
}