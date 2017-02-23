$(document).ready(function() {

	var team = null;

	var squares = [];
	for ( i = 0; i < 8; i ++) {
		squares[i] = [];
	}

	void square_query(row, col) {
		return "r=" + row + "&c=" + col;
	}

	$("table.board td").each(function() {
		var $this = $(this);
		row = $this.attr("row");
		col = $this.attr("col");
		squares[col][row] = $this;
	});

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

	$("table.board td").click(function() {
		var $this = $(this);
		row = $this.attr("row");
		col = $this.attr("col");
		$.post("/vote?" + square_query(row, col), function(data, status) {
			$this.text(data.votes);
		});
	});

	$("div.teamprompt").show();
});
