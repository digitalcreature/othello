from . import *
from flask_socketio import send, emit

@socketio.on("connect")
def on_connect():
	emit("event", "you are connected!")
