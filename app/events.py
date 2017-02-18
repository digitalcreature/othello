from . import *
from flask_socketio import send, emit

@socketio.on("connect")
def on_connect():
	user_count = redis.incr("user_count")
	emit("update user count", user_count, broadcast=True)

@socketio.on("disconnect")
def on_disconnect():
	user_count = redis.decr("user_count")
	emit("update user count", user_count, broadcast=True)

@socketio.on("update board")
def on_update_board(data):
	emit("update board", data, broadcast=True)
