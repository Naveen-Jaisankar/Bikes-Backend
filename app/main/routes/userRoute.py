from app.main import bp

@bp.route('/hi')
def hello_From_controller():
    return"I am controller"