var firmataApp = angular.module("firmataApp", ["hm"]);

var serialPort = document.hardware.serialPort;
var Board = document.hardware.Board;

firmataApp.controller("FirmataCtrl", function($scope, $window, hmservice){
	//console.log(hm);
	$scope.Name = "FJDSKLFJ";
	$scope.ports = [];
	$scope.selectedPort = null;
	$scope.refreshPorts = function(){
		serialPort.list(function(err, ports){
			console.log(ports);
			$scope.ports = ports;
			$scope.selectedPort = ports[0].comName;
			$scope.$apply();
		});
	};
	$scope.connect = function(portName){
		var s = $scope;
		$scope.board = new Board(portName, function(){
			console.log($scope.board);
			$scope.pins = $scope.board.pins;
			$scope.$apply();
			$scope.board.on("analog-read", function(){
				s.$apply();
			});
			$scope.board.on("digital-read", function(){
				s.$apply();
			});
			// setupTestPanel(board);
			setTimeout( () => {hmservice.setup($scope.board);$scope.draw();}, 500);
			
		});
	}
	
	$scope.disconnect = function(){
		if($scope.board!=null){
			$scope.board.sp.close();
			$scope.board = null;
		}
	}	
	$scope.pinReport = function(idx, report, analogChannel){
		var rp = 0;
		if(report) rp=1;
		if (analogChannel==127)
			$scope.board.reportDigitalPin(idx, rp);
		else{
			$scope.board.reportAnalogPin(analogChannel, rp);
		}
		console.log(analogChannel + "  " + report);
	}
	$scope.setPinMode = function(idx, mode){
		console.log(mode);
		// $scope.board.reportDigitalPin(idx, 1);
		$scope.board.pinMode(idx, parseInt(mode));
	}
	
	$scope.draw = function(){
		var context = document.getElementById("dashboard").getContext("2d");
		var gp = navigator.getGamepads()[$scope.gamepadId];
		hmservice.draw(context, gp);
		$scope.$apply();
		window.setTimeout($scope.draw, 50);
	}
	
	$scope.board = null;
	
	$scope.gamepadId = {};
	$scope.gamepads = [];
	angular.element($window).on("gamepadconnected", function(e){
		console.log("gamepad found");
		$scope.gamepads = navigator.getGamepads();
		console.log($scope.gamepads);
		$scope.$apply();
	});
});