from flask import *
from flask_socketio import SocketIO
from redis import Redis

app = Flask("")
socketio = SocketIO(app)
redis = Redis()

app.secret_key = "super secret secret key"

redis.flushall()

from . import views
from . import events
