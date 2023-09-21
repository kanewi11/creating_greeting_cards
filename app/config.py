import os
from pathlib import Path

from dotenv import load_dotenv


BASE_DIR = Path(__file__).parent

load_dotenv(BASE_DIR.joinpath('.env'))


class Config(object):
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'you-will-never-guess'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL', 'sqlite:///greeting_cards.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    UPLOAD_FOLDER = BASE_DIR.joinpath('static/uploads')
    ALLOWED_EXTENSIONS = ['jpg', 'png']
    UPLOAD_FOLDER = UPLOAD_FOLDER
    ALLOWED_EXTENSIONS = ALLOWED_EXTENSIONS
    MAX_CONTENT_LENGTH = 1000 * 1024 * 1024
