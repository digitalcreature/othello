$(document).ready(function() {
	$("table.board td").click(function() {
		var $this = $(this);
		row = $this.attr("row");
		col = $this.attr("col");
		alert(`clicked (${col}, ${row})`);
	});
});
