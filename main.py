from biomes import get_all_biomes, save_biomes
from logger import logger


all_biomes = get_all_biomes()
logger.info(f'Got all Biomes! {len(all_biomes)}')

save_biomes(all_biomes)
print(all_biomes)
