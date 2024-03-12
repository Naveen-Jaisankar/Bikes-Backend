from flask import Blueprint

bp = Blueprint('main', __name__)

@bp.after_request
def after_request(response):
    header = response.headers
    header['Access-Control-Allow-Origin'] = '*'
    # Other headers can be added here if needed
    return response

from app.main.routes import userRoute