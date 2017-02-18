from flask import *
from flask_socketio import SocketIO
from redis import Redis
import eventlet

eventlet.monkey_patch()

app = Flask("")
socketio = SocketIO(app, message_queue="redis://redis")
redis = Redis(host="redis")

app.secret_key = "super secret secret key"

redis.flushall()

from . import views
from . import events
