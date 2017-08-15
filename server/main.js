process.on('uncaughtException', function(err) {
  console.log('Caught exception: ' + err);
});

var express = require('express');
var app = express();
var serverIP = "192.168.1.18";
var server = require('http').Server(app);
var currentTime;

var fs = require('fs');
var obj = JSON.parse(fs.readFileSync('server/objects.json', 'utf8'));

var server = require('http').createServer();
var io = require('socket.io')(server);



var serverPort = 8080;

var  dataPlayer = new Array();

var gameStatus = "WAITING";

dataPlayer = [];



app.use(express.static('public'));
var connectionId = 0;

/*app.get('/hello', function(req, res) {
  res.status(200).send("Dogu server correcto");
});*/

var connectionId = 0;
var countDownTime = 5;
var initX = 0;
var initY = 0;


io.on('connection', function(socket) {
  console.log("El socket " + socket.id + " se ha conetado.");
  
  fncConnectionResult(socket);
  fncKeepAlive(socket);
  fncGameEnded(socket);

});

io.on('',function(socket){
  // body...
})

function fncConnectionResult(socket){
  var payload;
  var message;

  connectionId = dataPlayer.length;
  
  newPlayer = {
    playerId: connectionId,
    x: initX,
    y: initY,
    speed: 1,
    speedTime: 0, 
    playerStatus: 'Conectado'
  };
    initX += 50;


  if(gameStatus == "WAITING" || gameStatus == "COUNTDOWN"){
    
    if(connectionId == 0){

      message = "Eres el primero en la sala. Esperando a los siguientes jugadores.";

    }else{
      if(gameStatus == "WAITING"){
        
        gameStatus = "COUNTDOWN";
        currentTime = countDownTime;

        var timer = setInterval(function(){
          currentTime--;
          io.sockets.emit('countDownStep', {"time": currentTime});

          if(currentTime <= 0){
            io.sockets.emit('gameStarted',dataPlayer);
            gameStatus = "LOCKED";
            clearInterval(timer);
          }

        }, 1000);
        
      }

    }

    payload = {
      gameStatus: gameStatus,
      message: message,
      playerId: connectionId,
      seconds: currentTime,
      x: newPlayer.x,
      y: newPlayer.y,
      speed: newPlayer.speed,
      speedTime: newPlayer.speedTime,
      playerStatus: newPlayer.status,
      objects: obj
    };

    dataPlayer.push(newPlayer);
    
    socket.emit('connectionResult',payload);

  }else{
  
    payload = {
      status: "LOCKED", 
      message: "La sala está ocupada. Intenta de nuevo más tarde."
    };

  }
}

function fncKeepAlive(socket){

  socket.on('keepAlive', function(data){
    var index = data.playerId;

    dataPlayer[index].x = data.x;
    dataPlayer[index].y = data.y;
    dataPlayer[index].s = data.s;  

    socket.broadcast.emit('keepAlive', data);

  });
}


function fncEvent(socket) {
  
  socket.on('event', function(data){
  var payload;

    if(data.eventType != "JUMP" && data.eventType != "FINISH"){
      
      dataPlayer[data.playerId].sped = obj[data.eventId].newSpeed;
      dataPlayer[data.playerId].speedTime = obj[data.eventId].time;

    }

    payload = {
      
      playerId: data.playerId,
      speed: dataPlayer[data.playerId].speed,
      time: dataPlayer[data.playerId].time,
      eventId: data.eventId,
      eventType: data.eventType

    }

    socket.broadcast.emit('event', payload);

  });
}


function fncGameEnded(socket){
  socket.on('gameEnded',function(){
    gameStatus = "WAITING";
    dataPlayer = [];
    initX = 0;
    console.log("El juego ha finalizado");
  });
}

function fncGoalReached(sockets){
  socket.on('goalReached', function(){

  });
}
  



/*socket.on('updateCoordinates', function(data){
    
    var index = dataPlayer.indexOf(data.playerId);

    if(index >= 0){
      dataPlayer[index].x = data.x;
      dataPlayer[index].y = data.y;
    }

    console.log(index);
    console.log(dataPlayer[0].playerId);
    //dataPlayer.push(data);

    io.sockets.emit('sendDataPlayer', dataPlayer)

});*/


server.listen(serverPort, serverIP, function() {
  console.log("Servidor corriendo en http://" + serverIP + ":" + serverPort);
});