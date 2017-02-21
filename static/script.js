$(document).ready(function() {

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

	jointeam = function(team) {
		// join team
	}

	$("table.board td").click(function() {
		var $this = $(this);
		row = $this.attr("row");
		col = $this.attr("col");
		// vote for move
	});
});
