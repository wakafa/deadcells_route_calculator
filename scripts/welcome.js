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

let display_route = () => {
    let currBiomeData = currentRoute[0].data
    console.log("XD")
    console.log(currentBiome.name)
    console.log(currentBiome.data)
    let spoiles = {
        scrolls: {
            power: currentBiome.scrolls.power,
            dual: currentBiome.scrolls.dual
        }
    }
    console.log(currBiomeData)
        // currentRoute.forEach(route => {
        //     console.log(route.data[bcs])
        // })
}

let start_route = () => {
    currentBiome = get_entry_biome()
    document.getElementById("start-route").textContent = currentBiome.name
    currentRoute = [currentBiome]
    display_route()
}