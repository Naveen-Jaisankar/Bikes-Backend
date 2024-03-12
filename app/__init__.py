from flask import Flask
from config import Config
from flask_cors import CORS, cross_origin

def create_app(config_class=Config):
    app = Flask(__name__)
    cors = CORS(app, resources={r"/*": {"origins": "*"}})
    app.config.from_object(config_class)

    #initialize the extensions here

    #Register blue prints here
    from app.main import bp as main_bp
    app.register_blueprint(main_bp)

    return app