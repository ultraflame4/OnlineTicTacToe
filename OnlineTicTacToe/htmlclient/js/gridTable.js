/*
Grid Square States:
0 - unselected / neutral
1 - Friendly
2 - Enemy
 */


// New html branch: no need to generate squares html. Only need to retriece the squares from gridTableContainer

function generateSquare(index) {
    let sqr = document.createElement("button")
    sqr.type = "button"
    sqr.className = "gridSquare"
    sqr.textContent = index
    sqr.setAttribute("onclick", "squareClick(this)")
    sqr.setAttribute("data-index", index)

    sqr.setAttribute("data-state", "0")
    return sqr
}


var tableSquares = []

// function generateGridTable() {
//
//     tableSquares = []
//     var gridTable = document.getElementById("gridTable")
//
//     for (i = 0; i < 9; i++) {
//         let s = generateSquare(i.toString())
//
//         tableSquares.push(s)
//         gridTable.appendChild(s)
//
//         var spacer = document.createElement('div')
//         if ((i + 1) % 3 == 0 && i > 0) {
//             gridTable.appendChild(document.createElement('br'))
//             spacer.className = "gridSquareSpacerV"
//         } else {
//             spacer.className = "gridSquareSpacerH"
//         }
//         if (i < 8) {
//             gridTable.appendChild(spacer)
//         }
//     }
// }


function getGridTableSquares(){
    tableSquares=[]
    var squares = document.getElementsByClassName("gridTableSquare")
    for (let item of squares){
        item.setAttribute("onclick","squareClick(this)")
        tableSquares.splice(item.dataset.index,0,item)
        console.log("Added gridsquare ",item.textContent," to tableSquare array as index:",item.dataset.index)
    }

}

document.addEventListener("DOMContentLoaded", getGridTableSquares)

function getSquareByIndex(index) {
    return tableSquares[index]

}

function setSquareState(index, state) {
    getSquareByIndex(index).dataset.state = state
    console.log("updated", index, state)
}

function squareClick(squareTag) {
    if (currentSession != null) {
        var index = squareTag.dataset.index
        currentSession.square_click_callback(index)
    }
}

function setAllSquareDisabled(disabled = true) {
    for (let i = 0; i < 9; i++) {
        getSquareByIndex(i).disabled = disabled
    }
}