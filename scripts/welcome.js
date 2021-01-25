function httpGet(theUrl) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", theUrl, false); // false for synchronous request
    xmlHttp.send(null);
    return xmlHttp.responseText;
}

window.onload = () => {
    console.log("Welcome!")
}

let showSpoilers = false
let bcs = 0
let biomesList = JSON.parse(httpGet('/biomes_list')).biomes
let currentBiome
let currentRoute = []

let getBiomeByName = biomeName => biomesList.filter(biome => biome.name === biomeName)[0]
let toggleSpoilers = () => {
    var spoilersButton = document.getElementById("spoilers-button")
    if (!showSpoilers) {
        spoilersButton.textContent = "Spoilers warning!"
        showSpoilers = true
    } else {
        spoilersButton.textContent = "Spoilers free"
        showSpoilers = false
    }
}

let setBcs = () => {
    bcsElem = document.getElementById("bcs")
    bcs = bcsElem.value
}

let get_entry_biome = () => {
    return biomesList.filter(b => b.data[0].entrances.length === 0)[0]
}

let createExitButtons = exit => {
    if (getBiomeByName(exit.name).spoiler && !showSpoilers) return
    let eButton = document.createElement("BUTTON")
    let eText = document.createTextNode(exit.name)
    eButton.appendChild(eText)
    eButton.onclick = continue_route.bind(this, exit)
    eButton.className = "exit-button"
        // eButton.disabled = true
    document.body.appendChild(eButton)
}

let calculateRouteSpoiles = route => {
    let spoiles = {
        scrolls: {
            power: parseInt(route[0].data[bcs].scrolls.power),
            dual: parseInt(route[0].data[bcs].scrolls.dual)
        },
        cursed_chests: route[0].data[bcs].cursed_chests,
        scroll_frags: parseInt(route[0].data[bcs].scroll_frags),
    }
    for (let i = 1; i < route.length; i++) {
        spoiles.scrolls.power += parseInt(route[i].data[bcs].scrolls.power)
        spoiles.scrolls.dual += parseInt(route[i].data[bcs].scrolls.dual)
        spoiles.cursed_chests += route[i].data[bcs].cursed_chests
        spoiles.scroll_frags += parseInt(route[i].data[bcs].scroll_frags)
    }
    return spoiles
}
let display_route = () => {
    console.log("Display Route")
    let currentBiome
    if (currentRoute === undefined || currentRoute.length == 0) {
        currentBiome = get_entry_biome()
        currentRoute = [currentBiome]
        createExitButtons(currentBiome)
        return
    }
    console.log(`curr : ${currentRoute[currentRoute.length - 1].name}`)
    currentBiome = currentRoute[currentRoute.length - 1]
    let spoiles = calculateRouteSpoiles(currentRoute)
    console.log(`Spoils : ${JSON.stringify(spoiles)}`)
}

let disableAllExitButtons = () => {
    exitButtons = document.getElementsByClassName("exit-button")
    for (let i = 0; i < exitButtons.length; i++) {
        exitButtons[i].disabled = true
    }
}
let startOver = () => {
    console.log("Start Over")
    exitButtons = document.getElementsByClassName("exit-button")
    while (exitButtons[0]) {
        exitButtons[0].parentNode.removeChild(exitButtons[0])
    }
    currentRoute = []
    startRoute()
}

let startRoute = () => {
    document.getElementById("start-route").textContent = "Start Over"
    document.getElementById("start-route").onclick = startOver
    display_route()
}

let continue_route = biome => {
    currentBiome = getBiomeByName(biome.name)
    console.log(`Continuing ${biome.name}`)
    disableAllExitButtons()
    currentBiome.data[bcs].exits.forEach(exit => {
        createExitButtons(exit)
    })
    currentRoute.push(currentBiome)
    display_route()
}