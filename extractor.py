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
    relevant_text = extract_by_keyword(raw_data, "entrance")


def extract_exits(raw_data):
    relevant_text = extract_by_keyword(raw_data, "exit")


def extract_scrolls(raw_data):
    relevant_text = extract_by_keyword(raw_data, "scrolls")


def extract_scroll_frags(raw_data):
    relevant_text = extract_by_keyword(raw_data, "frags")


def extract_gear_level(raw_data):
    relevant_text = extract_by_keyword(raw_data, "gear_level")


def extract_cursed_chests(raw_data):
    relevant_text = extract_by_keyword(raw_data, "cursed_chests")
