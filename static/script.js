$(document).ready(function() {

	var BOARD_ROW_COUNT = 8;
	var BOARD_COL_COUNT = 8;

	// build the q string for a square
	function square_query(row, col) {
		return "r=" + row + "&c=" + col;
	}

	// find the elements for the squares, put in 2d array
	var squares = [];
	for (i = 0; i < BOARD_ROW_COUNT; i ++) {
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
			get_state(update_fromstate);
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

	// check if a square is on the board
	function square_isvalid(row, col) {
		return row >=0 && row < BOARD_ROW_COUNT && col >= 0 && col < BOARD_COL_COUNT;
	}

	// get the piece element for square row, col
	function get_piece(row, col) {
		return squares[row][col].children("div.piece").first();
	}

	// count how many pieces will be captured in a certain direction if a square is played
	function get_capture_count_dir(team, row, col, dr, dc) {
		var piece = get_piece(row, col)
		var r = row + dr;
		var c = col + dc;
		var oteam = null;
		var caps = 0;
		if (team === "white") {
			oteam = "black";
		}
		if (team === "black") {
			oteam = "white";
		}
		while (square_isvalid(r, c) && get_piece(r, c).hasClass(oteam)) {
			caps ++;
			r += dr;
			c += dc;
		}
		if (square_isvalid(r, c) && get_piece(r, c).hasClass(team)) {
			return caps;
		}
		else {
			return 0;
		}
	}

	// return total captures for a given move
	function get_capture_count(team, row, col) {
		var caps = 0;
		caps += get_capture_count_dir(team, row, col, -1, -1);
		caps += get_capture_count_dir(team, row, col, -1,  0);
		caps += get_capture_count_dir(team, row, col, -1,  1);
		caps += get_capture_count_dir(team, row, col,  0, -1);
		caps += get_capture_count_dir(team, row, col,  0,  1);
		caps += get_capture_count_dir(team, row, col,  1, -1);
		caps += get_capture_count_dir(team, row, col,  1,  0);
		caps += get_capture_count_dir(team, row, col,  1,  1);
		return caps;
	}

	// clear all pieces from the board
	function clear_board() {
		for (row = 0; row < BOARD_ROW_COUNT; row ++) {
			for (col = 0; col < BOARD_COL_COUNT; col ++) {
				get_piece(row, col).attr("class", "piece"); // remove all classes but the base piece class
			}
		}
	}

	// update display to match current gamestate
	function update_fromstate(state) {
		var team = state.team;
		if (team) {
			$("div.teamprompt").hide();
			for (row = 0; row < BOARD_ROW_COUNT; row ++) {
				for (col = 0; col < BOARD_COL_COUNT; col ++) {
					var p = state.board[row][col];
					if (p) {
						get_piece(row, col).addClass(p + " placed");
					}
					else {
						get_piece(row, col).attr("class", "piece");
					}
				}
			}
			for (row = 0; row < BOARD_ROW_COUNT; row ++) {
				for (col = 0; col < BOARD_COL_COUNT; col ++) {
					var piece = get_piece(row, col);
					if (piece.attr("class") === "piece") {
						var caps = get_capture_count(team, row, col)
						if (caps > 0) {
							piece.addClass(team + " potential");
						}
					}
				}
			}
		}
		else {
			$("div.teamprompt").show();
			clear_board();
		}
	}

	// make sure state is up to date
	get_state(update_fromstate);

});
