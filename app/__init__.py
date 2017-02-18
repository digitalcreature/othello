from flask import *
from flask_socketio import SocketIO
from redis import Redis

app = Flask("")
socketio = SocketIO(app)
redis = Redis()

redis.set("user_count", 0)

from . import views
from . import events
