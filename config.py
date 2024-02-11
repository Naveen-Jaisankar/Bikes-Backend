import os

basedir = os.path.abspath(os.path.dirname(__file__))

class Config(object):
    SECERET_KEY = os.environ.get('SECERET_KEY')
    SQLALCHEMY_DATABASE_URI = os.environ.get('mysql://root:root#@localhost/dublin_bikes')
    SQLALCHEMY_TRACK_MODIFICATIONS = False