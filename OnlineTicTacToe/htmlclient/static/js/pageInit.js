
var pyodideInitiated = false

function initOnLoad(){
    disablePlayButtons()
    console.log("Setting promise resolve callback")
    languagePluginLoader.then(() => {
        // Pyodide is now ready to use...
        let package_path = new URL("../../../dist/OnlineTicTacToe-2.0.0-py2.py3-none-any.whl",window.location).href
        console.log(package_path)
        pyodide.runPythonAsync(`
        import micropip
        print("${package_path}","f")
        await micropip.install('${package_path}')
        
        from OnlineTicTacToe import core as gameCore
        gameCore.testimport()
        `)
        console.log(package_path)
        pyodideInitiated=true
        gameUiInit()
});

}


document.addEventListener("DOMContentLoaded",initOnLoad)