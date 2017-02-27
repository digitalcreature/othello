$(document).ready(function() {

	var team = null;


	// build the q string for a square
	void square_query(row, col) {
		return "r=" + row + "&c=" + col;
	}

	// find the elements for the squares, put in 2d array
	var squares = [];
	for ( i = 0; i < 8; i ++) {
		squares[i] = [];
	}
	$("table.board td").each(function() {
		var $this = $(this);
		row = $this.attr("row");
		col = $this.attr("col");
		squares[col][row] = $this;
	});

	// join a team when pressing the team's button
	$("button.teamjoin").click(function() {
		var team = $(this).attr("team");
		$.post("/team/" + team, function(data, status) {
			team = data.team;
			if (team) {
				$("div.teamprompt").hide();
			}
			else {
				$("div.teamprompt").show();
			}
		});
	});

	// vote for a move
	$("table.board td").click(function() {
		var $this = $(this);
		row = $this.attr("row");
		col = $this.attr("col");
		$.post("/vote?" + square_query(row, col), function(data, status) {
			$this.text(data.votes);
		});
	});

	// make sure the prompt for team joining is visible
	$("div.teamprompt").show();
});
