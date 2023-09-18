# beauty_soup.py

from bs4 import BeautifulSoup
from urllib.request import Request, urlopen
import nums_from_string
import json


def amazon():
    req = Request(
        url='https://www.amazon.es/Nuevo-Apple-iPhone-12-128-GB/dp/B08L5SVNZB/ref=sr_1_1_sspa?__mk_es_ES=%C3%85M%C3%85%C5%BD%C3%95%C3%91&crid=2UI1PM4FUXGR0&keywords=iphone+12&qid=1683572916&sprefix=ihpne+12%2Caps%2C95&sr=8-1-spons&sp_csd=d2lkZ2V0TmFtZT1zcF9hdGY&psc=1', 
        headers={'User-Agent': 'Mozilla/5.0 (iPad; CPU OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
                'Accept-Language': 'en-US,en;q=0.9,es;q=0.8',
                'Upgrade-Insecure-Requests': '1',
                'referer' : 'https://www.google.com/',
                'Accept': 'text/html'}
    )
    html = urlopen(req).read().decode("utf-8")
    soup = BeautifulSoup(html, "html.parser")
    results = soup.find(id="twister-plus-price-data-price")
    print(results.get('value'))
    # job_elements = results.find_all("span", class_="a-offscreen")
    # prices = nums_from_string.get_nums(job_elements[0].text.strip())
    # if len(prices) > 0:
    #     print(prices[0])
    # print(nums_from_string.get_nums(job_element.text.strip()))


def mediaM():
    req = Request(
        url='https://www.mediamarkt.es/es/product/_apple-iphone-12-blanco-128-gb-5g-6-1-oled-super-retina-xdr-chip-a14-bionic-ios-1549819.html', 
        headers={'User-Agent': 'Mozilla/5.0 (iPad; CPU OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
                'Accept-Language': 'en-US,en;q=0.9,es;q=0.8',
                'Upgrade-Insecure-Requests': '1',
                'referer' : 'https://www.google.com/',
                'Accept': 'text/html'}
    )
    html = urlopen(req).read().decode("utf-8")
    soup = BeautifulSoup(html, "html.parser")
    results = soup.find(id="StyledPdpWrapper")
    job_elements = results.find_all("span", class_="sc-hLBbgP casGRl")

    # data = json.loads(soup.find('script', type='application/ld+json').text)
    
    # print(data['offers']['price'])

    for job_element in job_elements:
        prices = nums_from_string.get_nums(job_element.text.strip())
        if len(prices) > 0:
            print(prices[0])
        # print(nums_from_string.get_nums(job_element.text.strip()))


def worten():
    req = Request(
        url='https://www.worten.es/productos/iphone-12-apple-6-1-64-gb-negro-7256276', 
        headers={'User-Agent': 'Mozilla/5.0 (iPad; CPU OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
                'Accept-Language': 'en-US,en;q=0.9,es;q=0.8',
                'Upgrade-Insecure-Requests': '1',
                'referer' : 'https://www.google.com/',
                'Accept': 'text/html'}
    )
    html = urlopen(req).read().decode("utf-8")
    soup = BeautifulSoup(html, "html.parser")
    results = soup.find(class_="price__numbers raised-decimal price__numbers--bold")
    print(results.get('value'))

def pHouse():
    req = Request(
        url='https://www.phonehouse.es/movil/apple/iphone-12-128gb.html', 
        headers={'User-Agent': 'Mozilla/5.0 (iPad; CPU OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
                'Accept-Language': 'en-US,en;q=0.9,es;q=0.8',
                'Upgrade-Insecure-Requests': '1',
                'referer' : 'https://www.google.com/',
                'Accept': 'text/html'}
    )
    html = urlopen(req).read().decode("utf-8")
    soup = BeautifulSoup(html, "html.parser")
    results = soup.find(class_="precio mb-10")
    prices = nums_from_string.get_nums(results.text.strip())
    print(prices[0])

def elCorteIngles():
    req = Request(
        url='https://www.vodafone.es/c/tienda-online/particulares/catalogo-moviles/apple-iphone-12-blanco-128gb-313998/', 
        headers={'User-Agent': 'Mozilla/5.0 (iPad; CPU OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
                'Accept-Language': 'es-ES,en;q=0.9,es;q=0.8',
                'Upgrade-Insecure-Requests': '1',
                'referer' : 'https://www.google.com/',
                'Accept': 'text/html'}
    )
    html = urlopen(req).read().decode("utf-8")
    print(html)
    soup = BeautifulSoup(html, "html.parser")
    results = soup.find(class_="product_detail-buy-price-container")
    job_elements = results.find_all("span", class_="integer-price")

    for job_element in job_elements:
        prices = nums_from_string.get_nums(job_element.text.strip())
        if len(prices) > 0:
            print(prices[0])
    

amazon()
mediaM()
worten()
pHouse()

# print(html)

# print(soup.get_text())

# Para evitar ser bloqueados de sitios web necesitamos:
#  - Realizar las peticiones desde IPs diferentes
#  - Realizar peticiones con intervalos aleatorios de tiempo
#  - Añadir headers para parecer un navegador
#       -Cabaceras: Referer(De que página vienes), Accept-Encoding, Accept-Language, User-Agent

# localhost:8000 y localhost:8001