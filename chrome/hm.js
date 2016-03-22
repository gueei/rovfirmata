var hm = angular.module("hm", []);

hm.service("hmservice", function(){
	var arduino;
	this.setup = function(board){
		arduino = board;
		arduino.servoConfig(4, 1100, 1900);
		arduino.servoConfig(5, 1100, 1900);
		arduino.servoConfig(6, 1100, 1900);
		arduino.servoConfig(7, 1100, 1900);
		console.log(arduino);
	};
	this.draw = function(ctx, gamepad){
		ctx.fillStyle = "orange";
		ctx.fillRect(0, 0, 500, 500);
		ctx.save();
		ctx.fillStyle = "blue";
		ctx.translate(100, 200);
		if(gamepad){
			// axis 0 - Rotate
			// axis 1 - Forward and backward
			var lrThrust = lrThruster( gamepad.axes[0], -gamepad.axes[1]);
			powerBar(ctx, (lrThrust.lpower + 1 )/ 2);
			ctx.translate(50, 0);
			powerBar(ctx, (lrThrust.rpower + 1 )/ 2);
			ctx.translate(50, 0);
			var abThrust = abThruster( gamepad.axes[2], -gamepad.axes[3]);
			powerBar(ctx, (abThrust.apower + 1 )/ 2);
			ctx.translate(50, 0);
			powerBar(ctx, (abThrust.bpower + 1 )/ 2);
			//donut(ctx, arduino.pins[arduino.analogPins[0]].value/1024, 50);
			//ctx.translate(110, 0);
			//donut(ctx, arduino.pins[arduino.analogPins[0]].value/1024, 50);
			ctx.translate(0, 150);
			stickState(ctx, gamepad);
			arduino.servoWrite(4, 1500 + lrThrust.lpower * 400);
			arduino.servoWrite(5, 1500 + lrThrust.rpower * 400);
			arduino.servoWrite(6, 1500 + abThrust.apower * 400);
			arduino.servoWrite(7, 1500 + abThrust.bpower * 400);
		}
		ctx.restore();
	}
}); 

var stickState = function(ctx, gamepad){
	var size = 50;
	var nodeSize = 10;
	for(var i=0;i<2; i++){
		ctx.fillStyle = "#333333";
		ctx.beginPath();
		ctx.arc(0, 0, size+nodeSize, 0, 2*Math.PI);
		ctx.closePath();
		ctx.fill();
		ctx.fillStyle = "pink";
		ctx.beginPath();
		//ctx.moveTo();
		ctx.arc(gamepad.axes[i*2]*size, gamepad.axes[i*2+1]*size, nodeSize, 0, 2*Math.PI);
		ctx.closePath();
		ctx.fill();
		ctx.moveTo(0, size + 10);
		ctx.fillText(gamepad.axes[i*2].toFixed(3) + ", " + gamepad.axes[i*2+1].toFixed(3), -size, size + 10);
		ctx.translate(size*2+50, 0);
	}
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
};
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
};


var deg60 = Math.PI/3;
var deg120 = 2*deg60;
var sin60 = Math.sin(deg60);

/**
	X, Y: position of XY axis of the right stick, between -1 and 1
**/
function abThruster(x, y){
	y = y*2;
	var theta = Math.atan2(y, x);
	var power = Math.sqrt(x*x+y*y);

	var apower = Math.sin(deg60+theta) * power / sin60;
	var bpower = Math.sin(theta-deg60) * power / sin60;

	apower = apower > 1? 1: (apower < -1 ? -1 : apower);
	bpower = bpower > 1? 1: (bpower < -1 ? -1 : bpower);
	
	return { apower : apower, bpower: bpower};
}

/**
	X, Y: position of XY axis of the left stick, between -1 and 1
**/
function lrThruster(x, y){
    var power = Math.sqrt(x*x+y*y);
	power = power > 1 ? 1 : power;
    var theta = Math.atan2(y, x);
    
    var lpower = power;
    if (theta>Math.PI/2){
      lpower = power * Math.sin(2*theta-Math.PI/2);
    }else if (theta<-Math.PI/2)
      lpower = -power;
    else if (theta<0)
      lpower = power * Math.sin(Math.PI/2-2*theta);
    
    var rpower = 0;
    if(theta<-Math.PI/2) rpower = Math.sin(Math.PI/2-2*theta) * power;
    else if (theta<0)
      rpower = -power;
    else if (theta<Math.PI/2)
      rpower = power * Math.sin(2*theta-Math.PI/2);
    else
      rpower = power;
      
    return {lpower: lpower, rpower: rpower};
}