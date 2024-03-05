from app.main import bp
from flask import render_template

import requests


@bp.route('/hi')
def hello_From_controller():
    return render_template("index.html")


@bp.route('/getData')
def getAPIData():
    API_KEY = 'a6a27a0d825d27f290184340b4de29ce3080eecb'
    CONTRACT_NAME = 'dublin'
    data = requests.get(
        'https://api.jcdecaux.com/vls/v1/stations?contract=' + CONTRACT_NAME + '&apiKey=' + API_KEY + '')
    print(data.json())
    return data.json()
