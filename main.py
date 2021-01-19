from biomes import get_all_biomes
from logger import logger

print("Welcome to Biome calculator!")

all_biomes = get_all_biomes()
logger.info(f'Got all Biomes! {len(all_biomes)}')
logger.info(all_biomes)

print("Goodbye~!")
