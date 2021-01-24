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
    console.log(`Ceating exit button for ${exit.name}`)
    let eButton = document.createElement("BUTTON")
    let eText = document.createTextNode(exit.name)
    eButton.appendChild(eText)
    eButton.onclick = continue_route.bind(this, exit)
    eButton.className = "exit-button"
        // eButton.disabled = true
    document.body.appendChild(eButton)
}

let display_route = () => {
    let currentBiomeData = currentRoute[0].data
    console.log(currentBiomeData)
    let spoiles = {
        scrolls: {
            power: currentBiomeData[bcs].scrolls.power,
            dual: currentBiomeData[bcs].scrolls.dual
        },
        cursed_chests: currentBiomeData[bcs].cursed_chests,
        scroll_frags: currentBiomeData[bcs].scroll_frags,
    }
    currentBiomeData[bcs].exits.forEach(exit => {
        createExitButtons(exit)
    })
    console.log(spoiles)
}

let disableAllExitButtons = () => {

}
let startOver = () => {

}

let startRoute = () => {
    currentBiome = get_entry_biome()
    document.getElementById("start-route").textContent = currentBiome.name
    currentRoute = [currentBiome]
    display_route()
}

let continue_route = biome => {
    currentBiome = getBiomeByName(biome.name)
    console.log(`Continuing ${biome.name}`)
    console.log(`Continuing ${JSON.stringify(currentBiome)}`)
    currentBiome.data[bcs].exits.forEach(exit => {
        createExitButtons(exit)
    })
}