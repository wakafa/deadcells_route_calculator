function httpGet(theUrl) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", theUrl, false); // false for synchronous request
    xmlHttp.send(null);
    return xmlHttp.responseText;
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
        spoilersButton.style.backgroundColor = "red"
        spoilersButton.style.color = "black"
        showSpoilers = true
    } else {
        spoilersButton.textContent = "Spoilers free"
        showSpoilers = false
        spoilersButton.style.backgroundColor = "darkgreen"
        spoilersButton.style.color = "white"
    }
}

let setBcs = () => {
    bcsElem = document.getElementById("bcs")
    bcs = bcsElem.value
    allPossibleRoutes = getAllAvailableRoutes()
    bestRoute = calculateABestRoute()
}

let getEntryBiome = () => {
    return biomesList.filter(b => b.data[0].entrances.length === 0)[0]
}

let createExitButtons = exit => {
    let sel = document.getElementById("bcs")
    let spoilersBCS = sel.options[sel.selectedIndex].text
    if (getBiomeByName(exit.name).spoiler && (!showSpoilers || spoilersBCS != 5)) {
        return
    }
    let eButton = document.createElement("BUTTON")
    let exitBiome = getBiomeByName(exit.name)
    eButton.style.backgroundColor = exitBiome.pack.color
    let eText = document.createTextNode(exit.name)
    eButton.appendChild(eText)
    eButton.onclick = continueRoute.bind(this, exit)
    eButton.className = "exit-button"
    document.body.appendChild(eButton)
    return eButton
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
    let currentBiome
    if (currentRoute === undefined || currentRoute.length == 0) {
        currentBiome = getEntryBiome()
        let nextPath = document.createElement("div")
        nextPath.className = "next-path"
        nextPath.appendChild(createExitButtons(currentBiome))
        document.body.appendChild(nextPath)
        return
    }
    currentBiome = currentRoute[currentRoute.length - 1]
    let treasure = calculateRouteTreasure(currentRoute)
    let treasureElement = document.getElementById("treasure-data")
    removeAllElementChildren(treasureElement)
    treasureElement.appendChild(prettyPrintTreasure(treasure))
}

let disableSkippedButtons = () => {
    let paths = document.getElementsByClassName("next-path")
    for (let i = 0; i < paths.length; i++) {
        ebuttons = paths[i].getElementsByClassName("exit-button")
        for (let j = 0; j < ebuttons.length; j++) {
            highlightOrDisable(ebuttons[j])
        }
    }
}
let startOver = () => {
    exitButtons = document.getElementsByClassName("exit-button")
    while (exitButtons[0]) {
        exitButtons[0].parentNode.removeChild(exitButtons[0])
    }
    nextPaths = document.getElementsByClassName("next-path")
    while (nextPaths[0]) {
        nextPaths[0].parentNode.removeChild(nextPaths[0])
    }
    currentRoute = []
    document.getElementById("treasure-data").textContent = null
    startRoute()
}

let startRoute = () => {
    document.getElementById("start-route").textContent = "Start Over"
    document.getElementById("start-route").onclick = startOver
    display_route()
}

let continueRoute = biome => {
    currentBiome = getBiomeByName(biome.name)
    currentRoute.push(currentBiome)
    disableSkippedButtons()
    let nextPath = document.createElement("div")
    nextPath.className = "next-path"
    currentBiome.data[bcs].exits.forEach(exit => {
        let button = createExitButtons(exit)
        if (button) {
            nextPath.appendChild(button)
        }
    })
    document.body.appendChild(nextPath)
    display_route()
}

let prettyPrintTreasure = treasure => {
    treasureP = document.createElement("p")

    scrollImg = document.createElement("img")
    scrollImg.src = "/images/scroll_of_power.png"
    scrollText = document.createTextNode(` X ${treasure.scrolls.power} `)

    assassinScrollImg = document.createElement("img")
    assassinScrollImg.src = "/images/assassins_scroll.png"
    guardianScrollImage = document.createElement("img")
    guardianScrollImage.src = "/images/guardian_scroll.png"
    minotaurScrollImg = document.createElement("img")
    minotaurScrollImg.src = "/images/minotaurs_scroll.png"
    dualText = document.createTextNode(` X ${treasure.scrolls.dual}`)

    scrollFragsImg = document.createElement("img")
    scrollFragsImg.src = "images/scroll_fragments.png"
    scrollFragsText = document.createTextNode(` X ${treasure.scroll_frags} (${Math.floor(treasure.scroll_frags / 4)} extra scrolls) `)

    cursedChestsImg = document.createElement("img")
    cursedChestsImg.src = "/images/cursed_chest.png"
    cursedChestsText = document.createTextNode(parseCursedChests(treasure.cursed_chests))

    treasureP.appendChild(scrollImg)
    treasureP.appendChild(scrollText)
    treasureP.appendChild(getSpaceTextNode())
    treasureP.appendChild(assassinScrollImg)
    treasureP.appendChild(guardianScrollImage)
    treasureP.appendChild(minotaurScrollImg)
    treasureP.appendChild(dualText)
    treasureP.appendChild(getSpaceTextNode())
    treasureP.appendChild(scrollFragsImg)
    treasureP.appendChild(scrollFragsText)
    treasureP.appendChild(getSpaceTextNode())
    treasureP.appendChild(cursedChestsImg)
    treasureP.appendChild(cursedChestsText)

    treasureP.style.fontSize = "x-large"


    return treasureP
}

let parseCursedChests = cursedChestString => {
    let givenChests = (cursedChestString.match(/100%/g) || []).length
    givenChests += (cursedChestString.match(/110%/g) || []).length
    cursedChestString = cursedChestString.replaceAll('100%', '')
    cursedChestString = cursedChestString.replaceAll('110%', '10%')
    chancesArr = cursedChestString.split("%")
    chancesArr.splice(-1, 1)
    optionalChests = chancesArr.filter(c => c != 0).length
    return ` X ${givenChests}, with ${calculateChestsChance(chancesArr)}% chance to get ${optionalChests} more`
}

let calculateChestsChance = chancesArray => {
    let chanceMultiplier = (currChance, nextChestChance) => {
        if (nextChestChance == 0) {
            return currChance
        }
        return currChance * (nextChestChance / 100)
    }

    return (100 * chancesArray.reduce(chanceMultiplier, 1)).toFixed(7)
}

let highlightOrDisable = button => {
    routeNames = currentRoute.map(route => route.name)
    button.disabled = true
    if (routeNames.indexOf(button.textContent) > -1) {
        button.style.borderColor = "black"
    } else {
        button.style.backgroundColor = "#e6e6e6"
        button.style.borderColor = "transparent"
        button.style.color = "rgba(0,0,0,0.5)"
        button.disabled = true
    }
}

let removeAllElementChildren = elm => {
    while (elm.firstChild) {
        elm.removeChild(elm.lastChild)
    }
}

let getSpaceTextNode = _ => {
    let space = document.createTextNode(",")
    space.className = "space"
    return space
}

let getAllAvailableRoutes = _ => {
    let entryBiome = getEntryBiome()
    let routes = [
        [entryBiome]
    ]
    let updatedRoute = true
    while (updatedRoute) {
        updatedRoute = false
        nextIterRoutes = []
        for (let i = 0; i < routes.length; i++) {
            let currentRoute = routes[i]
            let lastStepIndex = currentRoute.length - 1
            let exits = currentRoute[lastStepIndex].data[bcs].exits
            if (exits.length > 0) {
                updatedRoute = true
                for (let j = 0; j < exits.length; j++) {
                    currentRoute = currentRoute.concat(getBiomeByName(exits[j].name))
                    nextIterRoutes.push(currentRoute)
                    currentRoute = currentRoute.slice(0, -1)
                }
            } else {
                nextIterRoutes.push(currentRoute)
            }
        }
        routes = nextIterRoutes
    }
    return routes
}

let calculateABestRoute = _ => {
    let bestRouteList = allPossibleRoutes.reduce((prev, curr) => {
        if (prev.length < 1) {
            return [curr]
        } else if (measureRouteTreasure(prev[0]) < measureRouteTreasure(curr)) {
            return [curr]
        } else if (measureRouteTreasure(prev[0]) === measureRouteTreasure(curr)) {
            prev.push(curr)
            return prev
        } else {
            return prev
        }
    }, [])
    randomBestRoute = bestRouteList[Math.floor(Math.random() * bestRouteList.length)];
    return randomBestRoute
}

let measureRouteTreasure = route => {
    let treasure = calculateRouteTreasure(route)
    let givenChests = (treasure.cursed_chests.match(/100%/g) || []).length
    givenChests += (treasure.cursed_chests.match(/110%/g) || []).length
    return treasure.scrolls.power + treasure.scrolls.dual + (treasure.scroll_frags / 4) + givenChests
}

let displayBestRoute = () => {
    startOver()
    for (let i = 0; i < bestRoute.length; i++) {
        continueRoute(bestRoute[i])
    }
    bestRoute = calculateABestRoute()
}

let allPossibleRoutes = getAllAvailableRoutes()
let bestRoute = calculateABestRoute()