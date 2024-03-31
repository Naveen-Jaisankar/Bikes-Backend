from flask import Flask
from flask_sqlalchemy import SQLAlchemy

from config import Config
from flask_cors import CORS, cross_origin

db = SQLAlchemy()

def create_app(config_class=Config):
    app = Flask(__name__)
    #cors = CORS(app, resources={r"/*": {"origins": "*"}})
    app.config.from_object(Config)
    db.init_app(app)

    from app.main import bp as main_bp
    app.register_blueprint(main_bp)

    return app