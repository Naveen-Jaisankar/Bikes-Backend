import os

class Config(object):
    DB_USERNAME = 'admin'
    DB_PASSWORD = 'qwerty1234'
    DB_NAME = 'dbikes'
    SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://' + DB_USERNAME + ':' + DB_PASSWORD + '@dbikes.c18uciisw27v.eu-west-1.rds.amazonaws.com:3306/' + DB_NAME + ''

    SQLALCHEMY_TRACK_MODIFICATIONS = False
