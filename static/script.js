$(document).ready(function() {

	var socket = io.connect('http://' + document.domain + ':' + location.port);

	socket.on('event', function(data) {
		alert("socket connection established: " + data);
	});


	$("table.board td").click(function() {
		var $this = $(this);
		row = $this.attr("row");
		col = $this.attr("col");
		alert(`clicked (${col}, ${row})`);
	});
});
