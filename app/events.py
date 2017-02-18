from . import *
from flask_socketio import send, emit, join_room, leave_room

teams = ["white", "black"]

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
	team = get_user_team()
	if team is not None:
		emit("update board", {"row": square.row, "col": square.col, "votes": votes}, room=team)

def get_user_team():
	return session.get("team")

def set_user_team(team):
	session["team"] = team
	return team

def get_user_vote():
	return session.get("vote")

def remove_vote(row, col):
	team = get_user_team()
	if team is not None:
		vote = Square(row, col)
		votes = redis.hincrby("votes_" + team, str(vote), -1)
		update_board(vote, votes)
		return votes

def set_user_vote(row, col):
	team = get_user_team()
	if team is not None:
		oldvote = get_user_vote()
		newvote = Square(row, col)
		if oldvote is not None:
			remove_vote(oldvote.row, oldvote.col)
		votes = redis.hincrby("votes_" + team, str(newvote), 1)
		update_board(newvote, votes)
		session["vote"] = newvote

@socketio.on("connect")
def on_connect():
	session_id()
	team = get_user_team()
	if team is None:
		emit("prompt team")
	else:
		emit("join team", team)

@socketio.on("join team")
def on_join_team(team):
	if team in teams:
		set_user_team(team)
		emit("join team", team)
		join_room(team)
		data = []
		for col in range(0, 8):
			data.append([])
			for row in range(0, 8):
				data[col].append(redis.hget("votes_" + team, str(Square(row, col))))
				emit("set board", data)

@socketio.on("disconnect")
def on_disconnect():
	vote = session.get("vote")
	if vote is not None:
		remove_vote(vote.row, vote.col)
	team = get_user_team()
	if team is not None:
		leave_room(team)
	session.pop("user_id", None)
	session.pop("team", None)
	session.pop("vote", None)

@socketio.on("vote")
def on_vote(data):
	row = data["row"]
	col = data["col"]
	set_user_vote(row, col)
