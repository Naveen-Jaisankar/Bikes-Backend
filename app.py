from flask import render_template

from app import app
from config import Config
# app = create_app(Config)

def main():
    return render_template("index.html")

if __name__ == '__main__':
    app.run(debug=True)