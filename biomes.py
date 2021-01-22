import json
import os
import re
from logger import logger
import soup_utils as utils
from extractor import *
# from bs4 import BeautifulSoup

SAVED_PAGES_DIRNAME = "saved_pages"
BASE_URL = "https://deadcells.gamepedia.com"
BIOMES_URL = "https://deadcells.gamepedia.com/Biomes"
LOCAL_BIOMES_PAGE = os.path.join(SAVED_PAGES_DIRNAME, "Biomes.html")
SPOILER_BIOMES = ['Astrolab', 'Observatory']
UNUSED_BIOMES = ['Repository of the Architects', 'Pier']
MAX_BC = 5




def update_spoiler_biomes(biomes: list):
    for spoiler_biome in filter(lambda biome: biome.get('name') in SPOILER_BIOMES, biomes):
        spoiler_biome['spoiler'] = True


def update_inaccessible_biomes(biomes: list):
    for unused_biome in filter(lambda biome: biome.get('name') in UNUSED_BIOMES, biomes):
        unused_biome['unused'] = True




def extract_stats_of_bc(raw_data):
    return{
        "entrances" : extract_entrances(raw_data),
        "exits" : extract_exits(raw_data),
        "scrolls": extract_scrolls(raw_data),
        "scroll_frags": extract_scroll_frags(raw_data),
        "gear_level": extract_gear_level(raw_data),
        "cursed_chests": extract_cursed_chests(raw_data),
    }

def update_biome_data(biome):
    biome_url = f'{BASE_URL}{biome.get("path")}'
    biome_target_file = os.path.join(
        SAVED_PAGES_DIRNAME, f'{biome.get("name")}.html')
    utils.download(biome_url, biome_target_file)
    soup = utils.make_file_soup(biome_target_file)
    biome["data"] = {}
    for bcs in range(MAX_BC):
        raw_biome_bc_data = soup.find_all("div", {"data-source": re.compile(f'_{bcs}$')})
        biome["data"][bcs] = extract_stats_of_bc(raw_biome_bc_data)


def get_all_biomes():
    try:
        utils.download(BIOMES_URL, LOCAL_BIOMES_PAGE)
    except IOError as exception:
        logger.error(f'Error while downloading {BIOMES_URL} : {exception}')
    soup = utils.make_file_soup(LOCAL_BIOMES_PAGE)
    raw_biomes_titles = soup.find_all("span", {"class": "mw-headline"})
    biomes = extract_biomes_names_and_paths(raw_biomes_titles)
    update_spoiler_biomes(biomes)
    update_inaccessible_biomes(biomes)
    for biome in biomes:
        if not biome.get('unused'):
            update_biome_data(biome)
    return biomes


def save_biomes(biomes: list):
    if not os.path.exists("Biomes") or os.path.isdir("Biomes"):
        os.makedirs("Biomes", exist_ok=True)

    for biome in biomes:
        biome_file_path = os.path.join("Biomes", f'{biome.get("name")}.json')

        if os.path.exists(biome_file_path):
            with open(biome_file_path, "r") as biome_file:
                biome_file.read()

        with open(biome_file_path, "w+") as biome_file:
            json.dump(biome, biome_file)

        logger.info(f'Saved biome info: {biome.get("name")}')
