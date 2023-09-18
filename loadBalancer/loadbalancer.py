import random

import requests
import yaml
from flask import Flask, request, redirect
import time



loadbalancer = Flask(__name__)


def load_configuration(path):
    with open(path) as config_file:
        config = yaml.load(config_file, Loader=yaml.FullLoader)
    return config


config = load_configuration('/app/loadbalancer.yaml')


@loadbalancer.route('/')
def router():
    host_header = request.headers['Host']
    for entry in config['hosts']:
        if host_header == entry['host']:
            response = requests.get(f'http://{random.choice(entry["servers"])}')
            return response.content, response.status_code
    return 'Not Found', 404


@loadbalancer.route('/')
def path_router(path):
    for entry in config['paths']:
        if ('/' + path) == entry['path']:
            while(True):
                return redirect(f'http://{random.choice(entry["servers"])}')
    return 'Not Found', 404


loadbalancer.run(debug=True, host='0.0.0.0', port=5000)