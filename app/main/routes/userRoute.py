from flask_cors import cross_origin

from app.main import bp
from flask import render_template, request, jsonify, url_for

import requests
import sys,os

# script_dir = os.path.dirname( __file__ )
# mymodule_dir = os.path.join( script_dir, '..', 'Handlers' )
# sys.path.append( mymodule_dir )
# import RouteHandler

from ..Handlers.RouteHandler import RouteHandler

@bp.route('/')
def hello_From_controller():
    API_KEY = 'a6a27a0d825d27f290184340b4de29ce3080eecb'
    CONTRACT_NAME = 'dublin'
    stations = requests.get(
        f'https://api.jcdecaux.com/vls/v1/stations?contract=' + CONTRACT_NAME + '&apiKey=' + API_KEY).json()
    return render_template("index.html", stations=stations)


@bp.route('/getData')
def getAPIData():
    API_KEY = 'a6a27a0d825d27f290184340b4de29ce3080eecb'
    CONTRACT_NAME = 'dublin'
    data = requests.get(
        'https://api.jcdecaux.com/vls/v1/stations?contract=' + CONTRACT_NAME + '&apiKey=' + API_KEY + '')
    return data.json()


@bp.route('/getRoutee', methods=['GET'])
@cross_origin()
def getRoutee():
    print("I am hit")
    
    source = request.args.get('source', default='', type=str)
    destination = request.args.get('destination', default='', type=str)
    day = request.args.get('day', default='', type=str)
    time = request.args.get('time', default='', type=str)
    routeHandler = RouteHandler()
    response =  routeHandler.getRoute(source,destination,day,time)
    return jsonify(response)

@bp.route('/test_image')
def test_image():
    return url_for('static', filename='app/static/assets/marker.png')