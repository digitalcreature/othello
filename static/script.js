$(document).ready(function() {

	var socket = io.connect('http://' + document.domain + ':' + location.port);

	socket.on('update user count', function(count) {
		$("div.user_count").text("User count: " + count);
	});


	$("table.board td").click(function() {
		var $this = $(this);
		row = $this.attr("row");
		col = $this.attr("col");
		alert(`clicked (${col}, ${row})`);
	});
});
