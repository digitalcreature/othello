from .. import *

@app.route("/")
def index():
	return render_template("othello.html")
