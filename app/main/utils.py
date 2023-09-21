from uuid import uuid4

from app.config import Config


def allowed_file(filename: str) -> bool:
    return '.' in filename and filename.rsplit('.', 1)[1] in Config.ALLOWED_EXTENSIONS


def get_unique_filename(filename: str) -> str:
    ident = uuid4().__str__()
    return f'{ident}-{filename}'
