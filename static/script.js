$(document).ready(function() {

	// build the q string for a square
	function square_query(row, col) {
		return "r=" + row + "&c=" + col;
	}

	// find the elements for the squares, put in 2d array
	var squares = [];
	for (i = 0; i < 8; i ++) {
		squares[i] = [];
	}
	$("table.board td").each(function() {
		var square = $(this);
		row = square.attr("row");
		col = square.attr("col");
		squares[row][col] = square;
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
		});
	});

	// retrieve game state from server
	function get_state(action) {
		$.get("/state", action);
	}

	// clear all pieces from the board
	function clear_board() {
		for (row = 0; row < 8; row ++) {
			for (col = 0; col < 8; col ++) {
				var piece = squares[row][col].children("div.piece").first();
				piece.attr("class", "piece"); // remove all classes but the base piece class
			}
		}
	}

	// update board
	function update_board(board) {
		for (row = 0; row < 8; row ++) {
			for (col = 0; col < 8; col ++) {
				var piece = squares[row][col].children("div.piece").first();
				var team = board[row][col];
				if (team) {
					piece.addClass(team + " placed");
				}
				else {
					piece.attr("class", "piece");
				}
			}
		}
	}

	// update display to match current gamestate
	function update_fromstate(state) {
		var team = state.team;
		if (team) {
			$("div.teamprompt").hide();
			update_board(state.board);
		}
		else {
			$("div.teamprompt").show();
			clear_board();
		}
	}

	// make sure state is up to date
	get_state(update_fromstate);

});
