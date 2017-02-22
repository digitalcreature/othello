from . import *

TEAMS = ["white", "black"] # valid teams

def json_response(j, code=200):
	'''json formatted response'''
	return (json.jsonify(j), code)

@app.route("/")
def index():
	'''The game itself'''
	return render_template("othello.html")

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
		return json_response({
			"error": "already on team",
			"team": session["team"]
		}, 400)
