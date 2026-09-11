import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env from the project root (parent of this file) before anything else
_env_path = Path(__file__).resolve().parent.parent / '.env'
load_dotenv(dotenv_path=_env_path, override=True)

from flask import Flask
from app.routes.code_routes import code_bp

def create_app():
    app = Flask(__name__)
    app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0
    app.config['TEMPLATES_AUTO_RELOAD'] = True
    app.register_blueprint(code_bp)
    return app