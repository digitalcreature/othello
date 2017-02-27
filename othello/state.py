from . import *

TEAMS = ["white", "black"]
BOARD_ROW_COUNT = 8
BOARD_COL_COUNT = 8

def start_game():
	'''start the game'''
	redis.flushall()
	set_piece("white", 3, 3)
	set_piece("white", 4, 4)
	set_piece("black", 3, 4)
	set_piece("black", 4, 3)

def square_field(row, col):
	'''return redis field name for square at row, col'''
	return "{}:{}".format(row, col)

def square_isvalid(row, col):
	'''return true if square at row, col is on the board, false otherwise'''
	return row >= 0 and row < BOARD_ROW_COUNT and col >= 0 and col < BOARD_COL_COUNT

def set_piece(team, row, col):
	'''add or remove a piece from the board'''
	if square_isvalid(row, col):
		if team is None:
			redis.hdel("pieces", square_field(row, col))
		elif team in TEAMS:
			redis.hset("pieces", square_field(row, col), team)

def get_piece(row, col):
	'''get the piece at row, col'''
	if square_isvalid(row, col):
		piece = redis.hget("pieces", square_field(row, col))
		if piece:
			piece = piece.decode("ascii")
		return piece

def get_board_json():
	'''return entire board's pieces as json object'''
	board = [[get_piece(row, col) for col in range(0, 8)] for row in range(0, 8)]
	return board

def increment_vote(team, row, col):
	'''increment vote count for team at row, col'''
	if square_isvalid(row, col):
		return int(redis.hincrby("votes_{}".format(team), square_field(row, col), 1))

def get_votes(team, row, col):
	'''retrieve vote count for team at row, col'''
	if square_isvalid(row, col):
		votes = redis.hget("votes_{}".format(team), square_field(row, col))
		if votes:
			return int(votes)
		else:
			return 0
