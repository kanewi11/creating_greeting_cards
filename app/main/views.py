from werkzeug.utils import secure_filename
from flask import render_template, request, jsonify

from . import main
from app import db
from app.config import Config
from app.models import GreetingCard
from .utils import allowed_file, get_unique_filename


@main.route('/upload', methods=['POST'])
def upload_file():
    uploaded_file = request.files['image']
    if not uploaded_file:
        return jsonify({'message': 'Нет файла'})
    elif not uploaded_file.filename:
        return jsonify({'message': 'Нет имени файла'})
    elif not allowed_file(uploaded_file.filename):
        return jsonify({'message': 'Неподдерживаемый тип файла'})

    filename = secure_filename(uploaded_file.filename)
    unique_filename = get_unique_filename(filename)
    uploaded_file.save(Config.UPLOAD_FOLDER.joinpath(unique_filename))

    greeting_card = GreetingCard(unique_filename)
    db.session.add(greeting_card)
    db.session.commit()

    return jsonify({'success': True})


@main.route('/', methods=['GET'])
def greeting_cards_list():
    greeting_cards = GreetingCard.query.all()
    return render_template('greeting_cards.html', greeting_cards=greeting_cards)


@main.route('/create', methods=['GET'])
def create():
    return render_template('create_greeting_card.html')

