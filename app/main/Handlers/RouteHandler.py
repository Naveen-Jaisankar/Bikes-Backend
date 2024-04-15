import json
import pickle
import pandas as pd
import numpy as np
import requests
import time
import datetime
from pathlib import Path
from sqlalchemy import create_engine
import warnings
from sqlalchemy import text
warnings.filterwarnings('ignore')

import xgboost


class RouteHandler:
    stationData = None
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
        city_name = 'Dublin'
        country_code = 'IE'
        appid = '71287dae2da257653b6b14989d35491f'
        weather = requests.get(
            f'https://api.openweathermap.org/data/2.5/weather?q={city_name},{country_code}&appid={appid}'
        ).json()
        API_KEY = 'a6a27a0d825d27f290184340b4de29ce3080eecb'
        CONTRACT_NAME = 'dublin'
        stations = (requests.get(
            'https://api.jcdecaux.com/vls/v1/stations?contract=' + CONTRACT_NAME + '&apiKey=' + API_KEY + '')
        .json())
        station = {}
        for i in stations:
            if i['number'] == stationId:
                station = i

        def flatten_dict(dd, separator='_', prefix=''):
            return {prefix + separator + k if prefix else k: v
                    for kk, vv in dd.items()
                    for k, v in flatten_dict(vv, separator, kk).items()
                    } if isinstance(dd, dict) else {prefix: dd}
        flat_weather = flatten_dict(weather)
        t1 = flat_weather.get('weather')
        print(t1[0].get('main'))
        flat_weather['weather_main'] = t1[0].get('main')
        flat_weather['rain_last_hour'] = 0
        flat_weather['STATION ID'] = 42
        flat_weather['main_temp'] = flat_weather['main_temp'] - 273
        flat_weather['main_feels_like'] = flat_weather['main_feels_like'] - 273

        def convertTimestampToSQLDateTime(value):
            return time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(value))

        date = convertTimestampToSQLDateTime(flat_weather['dt'])
        flat_weather['hour'] = datetime.datetime.now().hour
        flat_weather['Day'] = datetime.datetime.now().day % 7

        del flat_weather['coord_lon']
        del flat_weather['coord_lat']
        del flat_weather['main_temp_min']
        del flat_weather['main_temp_max']
        del flat_weather['weather']
        del flat_weather['visibility']
        del flat_weather['dt']
        del flat_weather['sys_type']
        del flat_weather['sys_id']
        del flat_weather['sys_country']
        del flat_weather['sys_sunrise']
        del flat_weather['sys_sunset']
        del flat_weather['timezone']
        del flat_weather['id']
        del flat_weather['name']
        del flat_weather['cod']

        df = pd.DataFrame(np.array([0] * 50))
        df = df.transpose()
        l = [int(0)] * 51

        # df.drop(columns=df.columns[0], axis=1, inplace=True)
        df[df.columns[0]][0] = np.float64(flat_weather['main_temp'])
        df[df.columns[1]][0] = np.float64(flat_weather['main_feels_like'])
        df[df.columns[2]][0] = np.int64(flat_weather['main_pressure'])
        df[df.columns[3]][0] = np.int64(flat_weather['main_humidity'])
        df[df.columns[4]][0] = np.float64(flat_weather['wind_speed'])
        df[df.columns[5]][0] = np.int64(flat_weather['wind_deg'])
        # df[df.columns[6]][0] = np.float64(flat_weather['rain_1h'])
        df[df.columns[6]][0] = np.float64(flat_weather['rain_last_hour'])
        df[df.columns[7]][0] = np.int64(flat_weather['clouds_all'])
        df[df.columns[8]][0] = np.int64(flat_weather['STATION ID'])

        # Fill hour
        col_ct = 9
        df[df.columns[col_ct + flat_weather['hour']]][0] = 1

        # Fill Day
        weather_ct = 33
        temp = flat_weather['weather_main']
        if temp == 'Clouds':
            df[df.columns[weather_ct + 0]][0] = np.int64(1)
        elif temp == 'Rain':
            df[df.columns[weather_ct + 1]][0] = np.int64(1)
        elif temp == 'Drizzle':
            df[df.columns[weather_ct + 2]][0] = np.int64(1)
        elif temp == 'Mist':
            df[df.columns[weather_ct + 3]][0] = np.int64(1)
        elif temp == 'Clear':
            df[df.columns[weather_ct + 4]][0] = np.int64(1)
        elif temp == 'Fog':
            df[df.columns[weather_ct + 5]][0] = np.int64(1)
        elif temp == 'Snow':
            df[df.columns[weather_ct + 6]][0] = np.int64(1)
        elif temp == 'Haze':
            df[df.columns[weather_ct + 7]][0] = np.int64(1)
        elif temp == 'Smoke':
            df[df.columns[weather_ct + 8]][0] = np.int64(1)
        else:
            df[df.columns[weather_ct + 8]][0] = np.int64(1)

        day_ct = 43
        day_map = {
            0: 46,
            1: 44,
            2: 48,
            3: 49,
            4: 47,
            5: 43,
            6: 45
        }
        df[df.columns[day_map[flat_weather['Day']]]][0] = np.int64(1)
        for i in range(10, len(df.columns)):
            if df[df.columns[i]][0] == 0:
                df[df.columns[i]][0] = np.bool_(1 == 2)
            else:
                df[df.columns[i]][0] = np.bool_(1 == 1)
        df.iloc[-1]
        for i in range(10):
            if type(df.columns[i]) is np.int32():
                df[df.columns[i]] = df[df.columns[i]].astype(np.int64)
        for i in range(10, 50):
            df[df.columns[i]] = df[df.columns[i]].astype(bool)
        path = "../../../models/Station"+str(stationId)+".pkl"
        root_dir = Path(__file__).resolve().parent.parent.parent.parent
        model_name = "Station"+stationId+".pkl"
        filename = root_dir / "models" / model_name
        try:
            model = pickle.load(open(filename, 'rb'))
        except:
            filename = root_dir / "models" / "Station1.pkl"
            model = pickle.load(open(filename, 'rb'))
        # !{sys.executable} - m pip install xgboost
        res={}
        # res['availableStations']=json.dumps(str(list(model.predict([df.iloc[-1]]))[0]))
        res['availableStations']=round(list(model.predict([df.iloc[-1]]))[0])
        return res

    def sql_query(self, query):
        DB_USERNAME = 'admin'
        DB_PASSWORD = 'qwerty1234'
        DB_NAME = 'dbikes'
        CONNECTION_STRING = 'mysql+pymysql://' + DB_USERNAME + ':' + DB_PASSWORD + '@dbikes.c18uciisw27v.eu-west-1.rds.amazonaws.com:3306/' + DB_NAME + ''
        engine = create_engine(CONNECTION_STRING, echo=True)
        connection = engine.connect()
        rows = connection.execute(text(query))
        connection.close()
        engine.dispose()
        # return json.dumps([dict(row._mapping) for row in rows])
        return rows
