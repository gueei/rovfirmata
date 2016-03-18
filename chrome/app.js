$(function(){
	var serialPort = document.hardware.serialPort;
	var Board = document.hardware.Board;
	
	var board = {};

	$("#btnRefresh").click(function(){
		serialPort.list(function(err, ports){
			console.log(ports);
			$("#selPorts").html("");
			$.each(ports, function(idx, port){
				console.log(port);
				var option = $("<option>"+ port.comName + "</option>")
					.val(port.comName)
					.appendTo("#selPorts");
			});
		});
	});
	
	$("#btnConnect").click(function(){
		var com = $("#selPorts").val();
		if (com==null) return;
		console.log("connect to: " + com);
		board = new Board(com, function(){
			console.log(board);
			console.log("connected");
			document.hm.setup(board);
			draw();
		});
	});
	
	$("#btnDisconnect").click(function(){
		board.sp.close();
		window.cancelAnimationFrame(animationFrameId);
	});
	
	$(window).resize(function(){
		var canvas = $("#dashboard")[0];
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
	}).resize();
	
	var animationFrameId = -1;
	var draw = function(){
		var ctx = $("#dashboard")[0].getContext("2d");
		document.hm.draw(ctx);
		animationFrameId = window.requestAnimationFrame(draw);
	}
});