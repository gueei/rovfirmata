$(function(){
	var serialPort = document.hardware.serialPort;
	var Board = document.hardware.Board;

	serialPort.list(function(err, ports){
		console.log(ports);
		
		var board = new Board(ports[0].comName, function(){
			console.log(board);
		});
	});
});