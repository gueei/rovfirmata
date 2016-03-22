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
			// setupTestPanel(board);
			document.hm.setup(board);
			// draw();
		});
	});
	
	$("#btnDisconnect").click(function(){
		board.sp.close();
		//window.cancelAnimationFrame(animationFrameId);
	});
	
	var setupTestPanel = function(board){
		$("#testPanel").html();
		$.each(board.pins, function(idx, pin){
			var item = $("<li>" + idx + "</li>");
			var value = $("<span></span>").html(pin.value);
			var report = $("<input type='checkbox'></input>").change(function(){
				if($(this).attr("checked")){
					if(pin.analogChannel==127)
						board.digitalRead(idx, function(val){
							value.html(val);
						});
					else
						board.analogRead(idx, function(val){
							value.html(val);
						});
				}else{
					if(pin.analogChannel==127)
						board.reportDigitalPin(idx, 0);
					else
						board.reportAnalogPin(idx, 0);
				}
			});
			
			item.append(report).append(value);
			$("#testPanel").append(item);
		});
	};
	
	$(window).resize(function(){
		var canvas = $("#dashboard")[0];
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
	}).resize();
	
	$(window).on("gamepadconnected", function(e){
		console.log("gamepad found");
		$("#selGamepad").html("");
		var gps = navigator.getGamepads();
		$.each(gps, function(idx, gp){
			var option = $("<option>" + gp.id + "</option>")
				.val(idx)
				.appendTo("#selGamepad");
		});
	});
	
	var animationFrameId = -1;
	var draw = function(){
		var ctx = $("#dashboard")[0].getContext("2d");
		var gp = navigator.getGamepads()[$("#selGamepad").val()];
		try{
			document.hm.draw(ctx, gp);
		}catch(e){}
		animationFrameId = window.requestAnimationFrame(draw);
	}
	draw();
});