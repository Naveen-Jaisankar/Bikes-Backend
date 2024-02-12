from flask import Flask
from config import Config

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    #initialize the extensions here

    #Register blue prints here
    from app.main import bp as main_bp
    app.register_blueprint(main_bp)

    @app.route('/')
    def welome():
        return "Hello World!!!!!!"

    return app