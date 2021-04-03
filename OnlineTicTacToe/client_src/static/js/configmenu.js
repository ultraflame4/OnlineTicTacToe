
document.addEventListener("DOMContentLoaded",function () {
    document.getElementById("menuPlayButton").click()
})


function resetMenuButtons(){
    let menuButtons = document.getElementsByClassName("menuButton")
    for (let i = 0; i < menuButtons.length; i++) {
        t = menuButtons.item(i)
        t.dataset.state="inactive"
    }
}

function resetMenuPages(){
    let menuPages = document.getElementsByClassName("menuPage")
    for (let i = 0; i<menuPages.length; i++){
        t = menuPages.item(i)
        t.setAttribute("hidden","hidden")

    }
}

function playMenuButton(tag){
    resetMenuButtons()
    resetMenuPages()
    tag.dataset.state="active"
    document.getElementById("joinMenuPage").removeAttribute("hidden")


}
function hostMenuButton(tag){
    resetMenuButtons()
    resetMenuPages()
    tag.dataset.state="active"



}
function gameMenuButton(tag){
    resetMenuButtons()
    resetMenuPages()
    tag.dataset.state="active"



}