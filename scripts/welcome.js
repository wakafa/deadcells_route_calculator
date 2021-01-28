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
}

let get_entry_biome = () => {
    return biomesList.filter(b => b.data[0].entrances.length === 0)[0]
}

let createExitButtons = exit => {
    let sel = document.getElementById("bcs")
    let spoilersBCS = sel.options[sel.selectedIndex].text
    if (getBiomeByName(exit.name).spoiler && (!showSpoilers || spoilersBCS != 5)) {
        console.log("Skipping : " + exit.name)
        return
    }
    let eButton = document.createElement("BUTTON")
    let exitBiome = getBiomeByName(exit.name)
    eButton.style.backgroundColor = exitBiome.pack.color
    let eText = document.createTextNode(exit.name)
    eButton.appendChild(eText)
    eButton.onclick = continue_route.bind(this, exit)
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
    console.log("Display Route")
    let currentBiome
    if (currentRoute === undefined || currentRoute.length == 0) {
        currentBiome = get_entry_biome()
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
        // document.getElementById("treasure-data").textContent = prettyPrintTreasure(treasure)
}

let disableSkippedButtons = () => {
    let paths = document.getElementsByClassName("next-path")
    console.log(paths)
        // let x = document.querySelectorAll('.next-path .exit-button')
        // console.log(x)
    for (let i = 0; i < paths.length; i++) {
        ebuttons = paths[i].getElementsByClassName("exit-button")
        for (let j = 0; j < ebuttons.length; j++) {
            highlightOrDisable(ebuttons[j])
        }
    }
    // exitButtons = document.getElementsByClassName("exit-button")
    // for (let i = 0; i < exitButtons.length; i++) {
    //     highlightOrDisable(exitButtons[i])
    //         // exitButtons[i].disabled = true
    //         // exitButtons[i].style.backgroundColor = "gray"
    // }
}
let startOver = () => {
    console.log("Start Over")
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

let continue_route = biome => {
    currentBiome = getBiomeByName(biome.name)
    currentRoute.push(currentBiome)
    console.log(`Continuing ${biome.name}`)
    disableSkippedButtons()
    let nextPath = document.createElement("div")
    nextPath.className = "next-path"
    currentBiome.data[bcs].exits.forEach(exit => {
        nextPath.appendChild(createExitButtons(exit))
    })
    document.body.appendChild(nextPath)
        // currentRoute.push(currentBiome)
    display_route()
}

let prettyPrintTreasure = treasure => {
    treasureP = document.createElement("p")
    scrollImg = document.createElement("img")
    scrollImg.src = "/images/scroll_of_power.png"
    scrollText = document.createTextNode(` X ${treasure.scrolls.power} `)
    space = document.createTextNode(",")
    space.className = "space"
    assassinScrollImg = document.createElement("img")
    assassinScrollImg.src = "/images/assassins_scroll.png"
    guardianScrollImage = document.createElement("img")
    guardianScrollImage.src = "/images/guardian_scroll.png"
    minotaurScrollImg = document.createElement("img")
    minotaurScrollImg.src = "/images/minotaurs_scroll.png"
    dualText = document.createTextNode(` X ${treasure.scrolls.dual}`)


    treasureP.appendChild(scrollImg)
    treasureP.appendChild(scrollText)
    treasureP.appendChild(space)
    treasureP.appendChild(assassinScrollImg)
    treasureP.appendChild(guardianScrollImage)
    treasureP.appendChild(minotaurScrollImg)
    treasureP.appendChild(dualText)

    return treasureP
        // cursedChestsData = parseCursedChests(treasure.cursed_chests)
        // return `${treasure.scrolls.power} Scrolls of power, ${treasure.scrolls.dual} dual scrolls, ${treasure.scroll_frags} and scroll fragments (${Math.floor(treasure.scroll_frags / 4)} extra scrolls)
        // \n in addition, you will encounter ${cursedChestsData}`
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

let highlightOrDisable = button => {
    routeNames = currentRoute.map(route => route.name)
    button.disabled = true
    if (routeNames.indexOf(button.textContent) > -1) {
        button.style.borderColor = "yellow"
    } else {
        button.style.backgroundColor = "gray"
        button.disabled = true
    }
}

let removeAllElementChildren = elm => {
    while (elm.firstChild) {
        elm.removeChild(elm.lastChild)
    }
}