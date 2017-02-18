from . import *
from flask_socketio import send, emit

class Square:
	def __init__(self, row, col):
		self.row = row
		self.col = col
	def __str__(self):
		return "{},{}".format(self.col, self.row)


def session_id():
	if session.get("user_id") is not None:
		return session["user_id"]
	else:
		user_id = redis.incr("total_visits")
		session["user_id"] = user_id
		return user_id

def update_board(square, votes):
	emit("update board", {"row": square.row, "col": square.col, "votes": votes}, broadcast=True)

def get_user_vote():
	return session.get("vote")

def remove_vote(row, col):
	vote = Square(row, col)
	votes = redis.hincrby("votes", str(vote), -1)
	update_board(vote, votes)
	return votes

def set_user_vote(row, col):
	oldvote = get_user_vote()
	newvote = Square(row, col)
	if oldvote is not None:
		remove_vote(oldvote.row, oldvote.col)
	votes = redis.hincrby("votes", str(newvote), 1)
	update_board(newvote, votes)
	session["vote"] = newvote

@socketio.on("connect")
def on_connect():
	session_id()
	data = []
	for col in range(0, 8):
		data.append([])
		for row in range(0, 8):
			data[col].append(redis.hget("votes", str(Square(row, col))))
	emit("set board", data)

@socketio.on("disconnect")
def on_disconnect():
	vote = session.get("vote")
	if vote is not None:
		remove_vote(vote.row, vote.col)
	session.pop("user_id", None)

@socketio.on("vote")
def on_vote(data):
	row = data["row"]
	col = data["col"]
	set_user_vote(row, col)
