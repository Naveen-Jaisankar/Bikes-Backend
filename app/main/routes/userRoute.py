from app.main import bp
from flask import render_template

import requests


@bp.route('/')
def hello_From_controller():
    API_KEY = 'a6a27a0d825d27f290184340b4de29ce3080eecb'
    CONTRACT_NAME = 'dublin'
    stations = requests.get(f'https://api.jcdecaux.com/vls/v1/stations?contract=' + CONTRACT_NAME + '&apiKey=' + API_KEY ).json()
    return render_template("index.html",stations = stations)


@bp.route('/getData')
def getAPIData():
    API_KEY = 'a6a27a0d825d27f290184340b4de29ce3080eecb'
    CONTRACT_NAME = 'dublin'
    data = requests.get(
        'https://api.jcdecaux.com/vls/v1/stations?contract=' + CONTRACT_NAME + '&apiKey=' + API_KEY + '')
    return data.json()
