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


function MainMenuButton() {
    openMenu("MainMenuPage", "menuMainButton")
}

function JoinMenuButton() {
    openMenu("joinMenuPage", "menuJoinButton")
}

function hostMenuButton() {
    openMenu("HostMenuPage", "menuHostButton")
}

function gameMenuButton() {
    openMenu("GameMenuPage", "menuGameButton")
}