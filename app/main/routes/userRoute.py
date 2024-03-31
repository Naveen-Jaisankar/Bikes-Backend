from flask_cors import cross_origin

from app.main import bp
from flask import render_template, request, jsonify
from app.Model import Station, Availability

import requests

@bp.route('/')
def hello_From_controller():
    stations = Station.query.all()
    return render_template("index.html", stations=stations)
@bp.route('/get-station-and-availability-data')
def get_station_and_availability_data():
    stations = Station.query.all()
    result = []
    for station in stations:
        availability = Availability.query.filter_by(number_id=station.number).order_by(
            Availability.last_update.desc()).first()
        if availability:
            station_data = station.to_dict()
            station_data.update(availability.to_dict())
            result.append(station_data)
    return jsonify(result)


@bp.route('/getRoute', methods=['POST'])
@cross_origin()
def getRoute():
    print("I am hit")
    print(request.json)
    return jsonify(request.json)
