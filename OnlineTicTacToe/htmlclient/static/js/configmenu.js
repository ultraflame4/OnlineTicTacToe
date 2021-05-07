document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("menuMainButton").click()
})


function resetMenuButtons() {
    let menuButtons = document.getElementsByClassName("menuButton")
    for (let i = 0; i < menuButtons.length; i++) {
        t = menuButtons.item(i)
        t.dataset.state = "inactive"
    }
}

function resetMenuPages() {
    let menuPages = document.getElementsByClassName("menuPage")
    for (let i = 0; i < menuPages.length; i++) {
        t = menuPages.item(i)
        t.setAttribute("hidden", "hidden")

    }
}

function openMenu(menuId, tagId) {
    resetMenuButtons()
    resetMenuPages();
    document.getElementById(tagId).dataset.state = "active"
    if (menuId != "none")
        document.getElementById(menuId).removeAttribute("hidden")
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