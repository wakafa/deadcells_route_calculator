import soup_utils as utils
import re

TBS_BIOMES = ["Dilapidated Arboretum", "Morass of the Banished", "Nest"]
ROTG_BIOMES = ["Cavern", "Guardian's Haven"]
FF_BIOMES = ["Undying Shores", "Fractured Shrines", "Mausoleum"]
QATS_BIOMES = ["The Crown", "Infested Shipwreck", "Lighthouse"]
RTC_BIOMES = ["Castle Outskirts","Dracula's Castle","Defiled Necropolis", "Master's Keep"]


def clean_biome_name(raw_name):
    name = raw_name.replace("_", ' ')
    name = name.replace(".27", "'")
    name = name.replace("First Stage: ", '')
    name = name.replace("Final Boss: ", '')
    name = name.replace("TBS", "")
    name = name.replace("RotG", "")
    name = name.replace("FF", "")
    return name


def get_biome_pack(raw_name):
    if raw_name in TBS_BIOMES:
        return {
            "name": "TBS",
            "color": "rgb(153, 230, 153)"
        }
    elif raw_name in ROTG_BIOMES:
        return {
            "name": "RoTG",
            "color": "rgb(102, 230, 255)"
        }
    elif raw_name in FF_BIOMES:
        return {
            "name": "FF",
            "color": "yellow"
        }
    elif raw_name in QATS_BIOMES:
        return {
            "name": "QATS",
            "color": "purple"
        }
    elif raw_name in RTC_BIOMES:
        return {
            "name": "RTC",
            "color": "red"
        }
    else:
        return {
            "name": "classic",
            "color": "rgb(102, 179, 255)"
        }


def extract_biomes_names_and_paths(raw_biomes: list):
    biomes = []
    for biome in raw_biomes:
        biome_link = biome.find('a')
        if biome_link:
            biome_name = biome_link['title']
            biome_path = biome_link['href']
            biome_pack = get_biome_pack(biome_name)
            new_biome = {
                "name": biome_name,
                "path": biome_path,
                "pack": biome_pack
            }
            biomes.append(new_biome)
    return biomes


def extract_by_keyword(res_set, keyword):
    for result in res_set:
        if keyword in result.get("data-source"):
            return result
    return None


def extract_entrances(raw_data):
    relevant_element = extract_by_keyword(raw_data, "entrance")
    entrances = []
    if not relevant_element:
        return entrances

    for entrance in relevant_element.find_all("a"):
        entrances.append({
            "name": entrance.text,
            "path": entrance.get('href')
        })
    return entrances


def extract_exits(raw_data):
    relevant_element = extract_by_keyword(raw_data, "exit")
    exits = []
    if not relevant_element:
        return exits

    for exit_data in relevant_element.find_all("a"):
        if not (exit_data.text == "Giant"):
            exits.append({
                "name": exit_data.text,
                "path": exit_data.get('href')
            })
    return exits


def parse_scroll_data(data):
    match = re.match(r'(\d)\D+(\d)?', data)
    return match.group(1) or "0", match.group(2) or "0"


def extract_scrolls(raw_data):
    relevant_element = extract_by_keyword(raw_data, "scrolls")
    scrolls = {
        "power": "0",
        "dual": "0"
    }
    if not relevant_element:
        return scrolls

    power, dual = parse_scroll_data(relevant_element.div.text)
    return {
        "power": power,
        "dual": dual
    }


def extract_scroll_frags(raw_data):
    relevant_element = extract_by_keyword(raw_data, "frags")
    scroll_frags = "0"
    if not relevant_element:
        return scroll_frags

    return relevant_element.div.text


def extract_gear_level(raw_data):
    relevant_element = extract_by_keyword(raw_data, "gear_level")
    gear_level = None
    if not relevant_element:
        return gear_level

    return relevant_element.div.text


def extract_cursed_chests(raw_data):
    relevant_element = extract_by_keyword(raw_data, "cursed_chests")
    cursed_chests = "0%"
    if not relevant_element:
        return cursed_chests

    return relevant_element.div.text
