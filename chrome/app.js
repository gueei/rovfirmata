var serialPort = require("browser-serialport");
serialPort.list(function(err, ports){
	console.log(ports);
});