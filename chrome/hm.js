document.hm = {};

var arduino;

var encCommand = function(command, data) {
  var encoded = [command];
  var length = data.length;

  for (var i = 0; i < length; i++) {
    encoded.push(
      data[i] & 0x7F,
      (data[i] >> 7) & 0x7F
    );
  }

  return encoded;
};

document.hm.setup = function(board){
	arduino = board;
	arduino.sysexCommand(encCommand(0x7A, [100]));
	arduino.reportAnalogPin(0, 1);
}

document.hm.draw = function(ctx, gamepad){
	ctx.fillStyle = "orange";
	ctx.fillRect(0, 0, 500, 500);
	ctx.save();
	ctx.fillStyle = "blue";
	ctx.translate(100, 200);
	if(gamepad){
		// axis 0 - Rotate
		// axis 1 - Forward and backward
		
		powerBar(ctx, (gamepad.axes[0] + 1) / 2);
		//donut(ctx, arduino.pins[arduino.analogPins[0]].value/1024, 50);
		ctx.translate(110, 0);
		//donut(ctx, arduino.pins[arduino.analogPins[0]].value/1024, 50);
	}
	ctx.restore();
}

var powerBar = function(ctx, percent, width, height){
	width = width || 30;
	height = height || 100;
	ctx.save();
	ctx.rotate(Math.PI);
	ctx.fillStyle = "#333333";
	ctx.fillRect(0, 0, width, height);
	ctx.fillStyle = "yellow";
	ctx.fillRect(0, 0, width, percent * height);
	ctx.restore();
}

var donut = function(ctx, percent, size){
	ctx.save();
	ctx.rotate(-Math.PI/2);
	ctx.beginPath();
	ctx.moveTo(0, 0);
	ctx.lineTo(size, 0);
	ctx.arc(0, 0, size, 0, percent * 2 * Math.PI);
	ctx.closePath();
	ctx.fill();
	ctx.restore();
}