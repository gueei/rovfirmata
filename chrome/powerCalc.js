$(function(){
  var canvas = $("#can")[0];
  var point = {x:0, y:0};
  var vectors = [];
  
  var deg60 = Math.PI/3;
  var deg120 = Math.PI*2/3;
  var sin60 = Math.sin(deg60);
  var sin120 = Math.sin(deg120);
  
  var cx = 400/2, cy = 400/2;
  
  function draw(){
    var ctx = canvas.getContext("2d");
    ctx.fillStyle ="orange";
    ctx.fillRect(0,0,400,400);
    ctx.fillStyle="black";
    ctx.fillRect(cx, cy, 5, 5);
    ctx.fillStyle="white";
    ctx.fillRect(point.x, point.y, 5, 5);
    //ctx.lineStyle="blue";
    for(var i=0; i<vectors.length; i++){
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(vectors[i].x, vectors[i].y);
      ctx.stroke();
    }
    window.requestAnimationFrame(draw);
  }
  
  function tThruster(x, y){
    var theta = Math.atan2(y, x);
    var power = Math.sqrt(x*x+y*y);
    
    var apower = Math.sin(deg60+theta) * power / sin60;
    var bpower = Math.sin(theta-deg60) * power / sin60;
    
    vectors[0] = {
      x:cx+apower*100*Math.cos(deg60),
      y:cy-apower*100*Math.sin(deg60)
    };
    
    
    vectors[1] = {
      x:cx+bpower*100*Math.cos(deg120),
      y:cy-bpower*100*Math.sin(deg120)
    };
    
    //console.log([theta * 180/Math.PI, power, apower, bpower]);
  }
  
  function fThruster(x, y){
    var power = Math.sqrt(x*x+y*y);
    //power = 1;
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
      rpower = Math.sin(2*theta-Math.PI/2);
    else
      rpower = power;
      
    console.log([lpower, rpower]);
  }
  
  $(canvas).click(function(e){
    var x = (e.clientX - $(this).offset().left - cx)/100;
    var y = -(e.clientY - $(this).offset().top - cy)/100;
    point = {
      x: e.clientX-$(this).offset().left,
      y: e.clientY-$(this).offset().top,
    };

    tThruster(x, y);
    fThruster(x, y);
  });
  
  draw();
});