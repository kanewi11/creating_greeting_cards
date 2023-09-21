from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from . import db


class GreetingCard(db.Model):
    __tablename__ = 'greeting_cards'

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    filename: Mapped[str] = mapped_column(String, unique=True)

    def __init__(self, filename: str | Mapped[str]):
        self.filename = filename

    def __repr__(self):
        return f'GreetingCard {self.filename}'
