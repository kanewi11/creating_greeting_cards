from pathlib import Path

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

from .config import Config


db = SQLAlchemy()
migrate = Migrate()


def create_app(config_class=Config):
    app = Flask(__name__, static_folder="static")
    app.config.from_object(config_class)

    upload_dir = Path(app.config.get('UPLOAD_FOLDER'))
    upload_dir.mkdir(exist_ok=True)

    from . import models

    db.init_app(app)
    migrate.init_app(app, db)

    from .main import main as main_blueprint
    app.register_blueprint(main_blueprint)

    return app
