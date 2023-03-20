import os
from urllib import request
import requests
from bs4 import BeautifulSoup
from logger import logger


def download(url, file_name):
    try:
        if not os.path.exists(os.path.dirname(file_name)):
            os.makedirs(os.path.dirname(file_name), exist_ok=True)
        if os.path.exists(file_name):
            logger.info(f'File exists : {file_name}')
            return
        res = requests.get(url)
        with open(file_name, 'wb') as f:
            f.write(res.content)
        # request.urlretrieve(url, file_name)
    except IOError as exception:
        logger.error(f'Could not download html : {exception}')
        raise


def make_url_soup(url):
    page = request.urlopen(url).read()
    return BeautifulSoup(page, "lxml")


def make_file_soup(file_name):
    with open(file_name, 'rb') as file:
        return BeautifulSoup(file, "lxml")


def get_soup_body(soup):
    return soup.find('body')


def get_body_contents_without_tags(body):
    contents_of_body_without_tags = body.findChildren(recursive=False)
    return contents_of_body_without_tags
