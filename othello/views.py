from . import *
from . import state

TEAMS = ["white", "black"] # valid teams
BOARD_ROW_COUNT = 8
BOARD_COL_COUNT = 8

def json_response(j, code=200):
	'''json formatted response'''
	return (json.jsonify(j), code)

def get_user_team():
	if "team" in session:
		return session["team"]
	else:
		return None

@app.route("/")
def index():
	'''The game itself'''
	return render_template("othello.html")

@app.route("/state")
def get_gamestate():
	'''retrieve current gamestate'''
	state = {}
	team = get_user_team()
	state["team"] = team
	return json_response(state)

@app.route("/team/<team>", methods=["POST"])
def choose_team(team):
	'''Choose a team'''
	if "team" not in session:
		if team in TEAMS:
			session["team"] = team
			return json_response({"team": team})
		else:
			return json_response({"error": "invalid team"}, 400)
	else:
		if team == "leave":
			session.pop("team", None)
			return json_response({"team": None}, 200)
		else:
			return json_response({
				"error": "already on team",
				"team": session["team"]
			}, 403)

@app.route("/vote", methods=["POST"])
def vote():
	'''vote for a square'''
	row = int(request.args["r"])
	col = int(request.args["c"])
	team = get_user_team()
	if team:
		if row >= 0 and row < BOARD_ROW_COUNT and col >= 0 and col < BOARD_COL_COUNT:
			votes = state.increment_vote(team, row, col)
			return json_response({"votes": votes, "row": row, "col": col})
		else:
			return json_response({"error": "vote square out of bounds"}, 400)
	else:
		return json_response({"error": "user is not on a team or it is not user's team's turn'"}, 403)
