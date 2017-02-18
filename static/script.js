$(document).ready(function() {

	var socket = io.connect('http://' + document.domain + ':' + location.port);

	var squares = [];
	for ( i = 0; i < 8; i ++) {
		squares[i] = [];
	}

	function update_square(row, col, votes) {
		var text = "";
		if (votes != 0) {
			text = votes;
		}
		squares[col][row].text(text);
	}

	$("table.board td").each(function() {
		var $this = $(this);
		row = $this.attr("row");
		col = $this.attr("col");
		squares[col][row] = $this;
	});

	socket.on("set board", function(data) {
		for (row = 0; row < 8; row ++) {
			for (col = 0; col < 8; col ++) {
				update_square(row, col, data[col][row]);
			}
		}
	});

	socket.on("update board", function(data) {
		update_square(data.row, data.col, data.votes);
	});

	$("table.board td").click(function() {
		var $this = $(this);
		row = $this.attr("row");
		col = $this.attr("col");
		socket.emit("vote", {"row": row, "col": col});
	});
});
