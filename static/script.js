$(document).ready(function() {

	var socket = io.connect('http://' + document.domain + ':' + location.port);

	socket.on("update user count", function(count) {
		$("div.user_count").text("User count: " + count);
	});

	socket.on("update board", function(data) {
		alert(`update square (${data.col}, ${data.row})`);
	});

	$("table.board td").click(function() {
		var $this = $(this);
		row = $this.attr("row");
		col = $this.attr("col");
		socket.emit("update board", {"row": row, "col": col});
	});
});
