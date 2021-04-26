
function initOnLoad(){
    console.log("Setting promise resolve callback")
    languagePluginLoader.then(() => {
        // Pyodide is now ready to use...
        let package_path = new URL("../../../",window.location).href
        pyodide.runPythonAsync(`
        import micropip
        print("${package_path}","f")
        await micropip.install('${package_path}')`)
        console.log(package_path)
});

}


document.addEventListener("DOMContentLoaded",initOnLoad)