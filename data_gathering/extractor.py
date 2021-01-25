import soup_utils as utils
import re


def clean_biome_name(raw_name):
    name = raw_name.replace("_", ' ')
    name = name.replace(".27", "'")
    name = name.replace("First Stage: ", '')
    name = name.replace("Final Boss: ", '')
    name = name.replace("TBS", "")
    name = name.replace("RotG", "")
    return name


def extract_biomes_names_and_paths(raw_biomes: list):
    biomes = []
    for biome in raw_biomes:
        biome_link = biome.find('a')
        if biome_link:
            new_biome = {
                "name": clean_biome_name(biome.get('id')),
                "path": biome_link['href']
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
    return{
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
