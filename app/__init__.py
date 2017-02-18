from flask import *
from flask_socketio import SocketIO

app = Flask("")
socketio = SocketIO(app)

from . import views
