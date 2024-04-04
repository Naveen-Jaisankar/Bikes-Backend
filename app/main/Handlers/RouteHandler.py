import requests

class RouteHandler:

    stationData = None;

    def __init__(self):
        if self.stationData is None:
            self.stationData = self.getData()

    def getRoute(self,source,destination,day,time):
        print("Inside Handler")
        # SMITHFIELD
        
        return self.searchStations(destination)


    def getData(self):
        API_KEY = 'a6a27a0d825d27f290184340b4de29ce3080eecb'
        CONTRACT_NAME = 'dublin'
        data = requests.get(
            'https://api.jcdecaux.com/vls/v1/stations?contract=' + CONTRACT_NAME + '&apiKey=' + API_KEY + '')
        return data.json()
    
    def searchStations(self,stationName):
        matching_stations = [station for station in self.stationData if station['name'] == stationName]
        print(matching_stations)
        return matching_stations