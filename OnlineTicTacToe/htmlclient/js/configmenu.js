document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("menuMainButton").click()
    setAllSquareDisabled()

})


function resetMenuButtons() {
    let menuButtons = document.getElementsByClassName("configMenuTab")
    for (let i = 0; i < menuButtons.length; i++) {
        t = menuButtons.item(i)
        t.dataset.state = "inactive"
    }
}

function resetMenuPages() {
    let menuPages = document.getElementsByClassName("menuPage")
    for (let i = 0; i < menuPages.length; i++) {
        t = menuPages.item(i)
        t.style.display="none"

    }
}

function openMenu(menuId, tagId) {
    resetMenuButtons()
    resetMenuPages();
    document.getElementById(tagId).dataset.state = "active"
    if (menuId != "none")
        document.getElementById(menuId).style.display="flex"
}


function openMainMenu() {
    openMenu("MainMenuPage", "menuMainButton")
}

function openJoinMenu() {
    openMenu("joinMenuPage", "menuJoinButton")
}

function openHostMenu() {
    openMenu("HostMenuPage", "menuHostButton")
}

function openGameInfoMenu() {
    openMenu("GameInfoMenuPage", "menuGameButton")
}