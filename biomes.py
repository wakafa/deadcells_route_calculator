import os
from logger import logger
import soup_utils as utils
# from bs4 import BeautifulSoup

BIOMES_URL = "https://deadcells.gamepedia.com/Biomes"
LOCAL_BIOMES_PAGE = os.path.join("saved_pages", "Biomes.html")
SPOILER_BIOMES = ['Astrolab', 'Observatory']
UNUSED_BIOMES = ['Repository of the Architects', 'Pier']


def clean_biome_name(raw_name):
    name = raw_name.replace("_", ' ')
    name = name.replace(".27", "'")
    name = name.replace("First Stage: ", '')
    name = name.replace("TBS", "")
    name = name.replace("RotG", "")
    return name



def update_spoiler_biomes(biomes):
    for spoiler_biome in filter(lambda biome: biome.get('name') in SPOILER_BIOMES, biomes):
        spoiler_biome['spoiler'] = True


def update_inaccessible_biomes(biomes):
    for unused_biome in filter(lambda biome: biome.get('name') in UNUSED_BIOMES, biomes):
        unused_biome['unused'] = True


def extract_biomes_names_and_paths(raw_biomes):
    biomes = []
    for biome in raw_biomes:
        biome_link = biome.find('a')
        if biome_link:
            # new_biome = [biome.get('id').replace("_", " "), biome_link['href']]
            new_biome = {
                "name": clean_biome_name(biome.get('id')),
                "path": biome_link['href']
            }
            biomes.append(new_biome)
    return biomes


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
    return biomes
