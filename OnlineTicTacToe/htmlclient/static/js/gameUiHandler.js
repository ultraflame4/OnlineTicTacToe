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
        this.hostPort = ""
        this.verified = false
    }

    getInfo() {
        this.playername = document.getElementById("username_in").value
        this.serverIp = document.getElementById("serverip").value
        this.serverPort = document.getElementById("serverport").value
        this.hostPort = document.getElementById("hostserverport").value

    }
}


function gameUiInit() {
    // CAlled when pyodide fully initialised

}


// Returns info needed for connection
// Dunnit check, just catch error and alert() it
function getInfo(check_type = 0) {
    gameUIinfo = new GameUIInfo()
    gameUIinfo.getInfo()
    return gameUIinfo
}

// ------------ playGame buttons ----------------
function disablePlayButtons() {
    // Disable all buttons
    let playbuttons = document.getElementsByClassName("playbutton")
    for (let i = 0; i < playbuttons.length; i++) {
        playbuttons[i].disabled = true
    }
}

function enablePlayButtons() {
    // Enables some buttons
    document.getElementById("MMPlay").disabled = false
}


function uiPlayGame(playType) {

    // check pyodide initiated.
    if (!pyodideInitiated) {
        console.warn("Pyodide not intiated")
        alert("Error: Pyodide not initiated yet")

        return
    }


    // playType: 0-singleplayer 1-joinGame 2-Host&Play


    console.log(playType)
    if (playType != 0) {
        alert("Unavailable")
    } else {
        alert("Warning, this is being worked on. It may not be fully functional")
        // Pass signal to core python package
        pyodide.runPython(`
        gameCore.startSinglePlayerGame
        `)
    }
}