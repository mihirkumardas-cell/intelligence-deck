from flask import Flask
from app.routes.code_routes import code_bp

def create_app():
    app = Flask(__name__)
    app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0
    app.config['TEMPLATES_AUTO_RELOAD'] = True
    app.register_blueprint(code_bp)
    return app