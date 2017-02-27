$(document).ready(function() {

	// build the q string for a square
	function square_query(row, col) {
		return "r=" + row + "&c=" + col;
	}

	// find the elements for the squares, put in 2d array
	var squares = [];
	for ( i = 0; i < 8; i ++) {
		squares[i] = [];
	}
	$("table.board td").each(function() {
		var square = $(this);
		row = square.attr("row");
		col = square.attr("col");
		squares[col][row] = square;
		var piece = square.children("div.piece").first();
		if (row % 2 == 0) { piece.addClass("placed"); }
		else { piece.addClass("potential"); }
		if (col % 2 == 0) { piece.addClass("black"); }
		else { piece.addClass("white"); }
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

	// retrieve game state from server
	function get_state(action) {
		$.get("/state", action);
	}

	// update display to match current gamestate
	function update_fromstate(state) {
		var team = state.team;
		if (team) {
			$("div.teamprompt").hide();
		}
		else {
			$("div.teamprompt").show();
		}
	}

	// make sure state is up to date
	get_state(update_fromstate);

});
