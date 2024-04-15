from app import create_app
from config import Config
app = create_app(Config)

def main():
    app.run(host='0.0.0.0', port=5000)

if __name__ == '__main__':
    main()