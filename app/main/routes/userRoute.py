from flask_cors import cross_origin

from app.main import bp
from flask import render_template, request, jsonify, url_for

import requests
import random

# script_dir = os.path.dirname( __file__ )
# mymodule_dir = os.path.join( script_dir, '..', 'Handlers' )
# sys.path.append( mymodule_dir )
# import RouteHandler

from ..Handlers.RouteHandler import RouteHandler

@bp.route('/')
def hello_From_controller():
    try:
        API_KEY = 'a6a27a0d825d27f290184340b4de29ce3080eecb'
        CONTRACT_NAME = 'dublin'
        stations = requests.get(
            f'https://api.jcdecaux.com/vls/v1/stations?contract=' + CONTRACT_NAME + '&apiKey=' + API_KEY).json()
        return render_template("index.html", stations=stations)
    except:
        stations = open('../../static/stations.json').read()
        return render_template("index.html", stations=stations)


@bp.route('/getData')
def getAPIData():
    try:
        API_KEY = 'a6a27a0d825d27f290184340b4de29ce3080eecb'
        CONTRACT_NAME = 'dublin'
        data = requests.get(
            'https://api.jcdecaux.com/vls/v1/stations?contract=' + CONTRACT_NAME + '&apiKey=' + API_KEY + '')
        return jsonify(data.json())
    except:
        stations = open('stations.json').read()
        return render_template("index.html", stations=stations)


@bp.route('/getRoutee', methods=['GET'])
@cross_origin()
def getRoutee():
    source = request.args.get('source', default='', type=str)
    destination = request.args.get('destination', default='', type=str)
    destinationid = request.args.get('id', default='', type=str)
    print(destinationid)
    day = request.args.get('day', default='', type=str)
    time = request.args.get('time', default='', type=str)
    routeHandler = RouteHandler()
    response = routeHandler.predictStation(destination)
    statement = """SELECT * FROM dbikes.availability where number_id="""+str(destinationid)+""" order by last_update desc limit 10;"""
    # statement = """"SELECT * FROM dbikes.availability where number_id="""+destinationid+"""
    #     and timestampdiff(MINUTE,availability.last_update, availability.last_update) < 5 && timestampdiff(MINUTE,availability.time_queried, weather_current.time_queried) > 0"""""
    # df = routeHandler.sql_query(statement)
    # # print(list(df))
    temp = []
    # for i in list(df):
    #     temp.append(i.index(3))
    for i in range(10):
        temp.append(random.randint(0, 10))
    response['time'] = temp
    # json.dumps(temp)
    # response =  routeHandler.getRoute(source,destination,day,time)
    return jsonify(response)

@bp.route('/test_image')
def test_image():
    return url_for('static', filename='app/static/assets/marker.png')