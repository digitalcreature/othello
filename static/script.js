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

	$("button.teamjoin").click(function() {
		var team = $(this).attr("team");
		$.post("/team/" + team, function(data, status) {
			alert(JSON.stringify(data));
		});
	});

	$("table.board td").click(function() {
		var $this = $(this);
		row = $this.attr("row");
		col = $this.attr("col");
		// vote for move
	});

	$("div.teamprompt").show();
});
