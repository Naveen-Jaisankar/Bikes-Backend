import pickle

import requests

class RouteHandler:

    stationData = None
    weatherData = None

    def __init__(self):
        if self.stationData is None:
            self.stationData = self.getData()

    def getRoute(self,source,destination,day,time):
        print("Inside Handler")
        # SMITHFIELD
        return self.predictStation(destination)
        # return self.searchStations(destination)


    def getData(self):
        API_KEY = 'a6a27a0d825d27f290184340b4de29ce3080eecb'
        CONTRACT_NAME = 'dublin'
        data = requests.get(
            'https://api.jcdecaux.com/vls/v1/stations?contract=' + CONTRACT_NAME + '&apiKey=' + API_KEY + '')
        self.stationData = data
        return data.json()
    
    def searchStations(self,stationName):
        matching_stations = [station for station in self.stationData if station['name'] == stationName]
        print(matching_stations)
        return matching_stations

    def predictStation(self,stationId):
        if self.stationData is None:
            API_KEY = 'a6a27a0d825d27f290184340b4de29ce3080eecb'
            CONTRACT_NAME = 'dublin'
            self.stationData = requests.get(
                'https://api.jcdecaux.com/vls/v1/stations?contract=' + CONTRACT_NAME + '&apiKey=' + API_KEY + '').json()
        if self.weatherData is None:
            city_name = 'Dublin'
            country_code = 'IE'
            appid = '71287dae2da257653b6b14989d35491f'
            self.stationData = requests.get(
                f'https://api.openweathermap.org/data/2.5/weather?q={city_name},{country_code}&appid={appid}'
            ).json()
        model = pickle.load('../Models/Station' + stationId + '.pkl')

