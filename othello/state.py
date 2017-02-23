from . import *

def increment_vote(team, row, col):
	'''increment vote count for team at row, col'''
	return int(redis.hincrby("votes_{}".format(team), "{}:{}".format(row, col), 1))

def get_votes(team, row, col):
	'''retrieve vote count for team at row, col'''
	votes = redis.hget("votes_{}".format(team), "{}:{}".format(row, col))
	if votes:
		return int(votes)
	else:
		return 0
