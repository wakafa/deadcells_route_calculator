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

let calculateRouteTreasure = route => {
    let treasure = {
        scrolls: {
            power: parseInt(route[0].data[bcs].scrolls.power),
            dual: parseInt(route[0].data[bcs].scrolls.dual)
        },
        cursed_chests: route[0].data[bcs].cursed_chests,
        scroll_frags: parseInt(route[0].data[bcs].scroll_frags),
    }
    for (let i = 1; i < route.length; i++) {
        treasure.scrolls.power += parseInt(route[i].data[bcs].scrolls.power)
        treasure.scrolls.dual += parseInt(route[i].data[bcs].scrolls.dual)
        treasure.cursed_chests += route[i].data[bcs].cursed_chests
        treasure.scroll_frags += parseInt(route[i].data[bcs].scroll_frags)
    }
    return treasure
}
let display_route = () => {
    console.log("Display Route")
    let currentBiome
    if (currentRoute === undefined || currentRoute.length == 0) {
        currentBiome = get_entry_biome()
        createExitButtons(currentBiome)
        return
    }
    currentBiome = currentRoute[currentRoute.length - 1]
    let treasure = calculateRouteTreasure(currentRoute)
    document.getElementById("treasure-data").textContent = prettyPrintTreasure(treasure)
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

let prettyPrintTreasure = treasure => {
    cursedChestsData = parseCursedChests(treasure.cursed_chests)
    return `${treasure.scrolls.power} Scrolls of power, ${treasure.scrolls.dual} dual scrolls, ${treasure.scroll_frags} and scroll fragments (${Math.floor(treasure.scroll_frags/4)} extra scrolls)
    \n in addition, you will encounter ${cursedChestsData}`
}

let parseCursedChests = cursedChestString => {
    let givenChests = (cursedChestString.match(/100%/g) || []).length
    givenChests += (cursedChestString.match(/110%/g) || []).length
    cursedChestString = cursedChestString.replaceAll('100%', '')
    cursedChestString = cursedChestString.replaceAll('110%', '10%')
    chancesArr = cursedChestString.split("%")
    chancesArr.splice(-1, 1)
    optionalChests = chancesArr.filter(c => c != 0).length
    return `${givenChests} guaranteed cursed chests, with ${calculateChestsChance(chancesArr)} to get ${optionalChests} more cursed chests`
}

let calculateChestsChance = chancesArray => {
    let chanceMultiplier = (currChance, nextChestChance) => {
        if (nextChestChance == 0) {
            return currChance
        }
        return currChance * (nextChestChance / 100)
    }

    return chancesArray.reduce(chanceMultiplier, 1)
}