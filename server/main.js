process.on('uncaughtException', function(err) {
  console.log('Caught exception: ' + err);
});

var express = require('express');
var app = express();
var serverIP = "192.168.1.101";
var server = require('http').Server(app);
var currentTime;

var fs = require('fs');
var obj = JSON.parse(fs.readFileSync('server/objects.json', 'utf8'));

var server = require('http').createServer();
var io = require('socket.io')(server);



var serverPort = 8080;

var  dataPlayer = new Array();

var gameStatus = "WAITING";



app.use(express.static('public'));
var connectionId = 0;

/*app.get('/hello', function(req, res) {
  res.status(200).send("Dogu server correcto");
});*/

var connectionId = 0;
var countDownTime = 5;
var initX = 0;
var initY = 0;
var startTimeGame;
var allClients


io.on('connection', function(socket) {
  
  
  fncConnectionResult(socket);
  fncUpdateNickName(socket);
  console.log("El socket " + socket.playerId + " se ha conetado.");
  fncKeepAlive(socket);
  fncEvent(socket);
  fncGoalReached(socket);
  

  socket.on('disconnect', function(){
    
    /*console.log("Jugador: " + socket.playerId + " desconectado.");
    dataPlayer[socket.playerId].playerStatus = 'OFFLINE';
    console.log(dataPlayer[socket.playerId]);*/

  })

});

function fncConnectionResult(socket){
  var payload;
  var message;

  connectionId = dataPlayer.length;
  socket.playerId = connectionId;
  
  newPlayer = {
    playerId: connectionId,
    nickName: "",
    x: initX,
    y: initY,
    speed: 1,
    speedTime: 0, 
    playerStatus: 'ONLINE'
  };

    initX += 20;


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
            startTimeGame = new Date();
            console.log(startTimeGame);
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
      speedResponse: newPlayer.speed,
      speedTime: newPlayer.speedTime,
      playerStatusResponse: newPlayer.playerStatus,
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

function fncUpdateNickName(socket){
  socket.on('registerUser', function(data){
  socket.nickName = data.nickName;

  var index = data.playerId;
   dataPlayer[index].nickName = data.nickName;

  });
}

function fncKeepAlive(socket){

  socket.on('keepAlive', function(data){
    var index = data.playerId;

    dataPlayer[index].x = data.x;
    dataPlayer[index].y = data.y;
    dataPlayer[index].speed = data.speed;  

    socket.broadcast.emit('keepAlive', data);

  });
}


function fncEvent(socket) {
  
  socket.on('event', function(data){
  //console.log(data);
  var payload;

    if(data.eventType != "JUMP" && data.eventType != "FINISH"){
      
      dataPlayer[data.playerId].speed = obj[data.eventId].newSpeed;
      dataPlayer[data.playerId].speedTime = obj[data.eventId].time;

    }

    payload = {
      
      playerId: data.playerId,
      speed: dataPlayer[data.playerId].speed,
      time: dataPlayer[data.playerId].speedTime,
      eventId: data.eventId,
      eventType: data.eventType

    }

    /*console.log(payload);
    console.log('\n');*/
    socket.broadcast.emit('event', payload);

  });
}

var endGame = new Array();

function fncGameEnded(){
    io.sockets.emit('gameEnded',endGame);
    
    gameStatus = "WAITING";
    dataPlayer = [];
    endGame = [];
    initX = 0;
    console.log("El juego ha finalizado");
}


function fncGoalReached(socket){

  socket.on('goalReached', function(data){
    
    newPlayerEnd = {
      nickName: dataPlayer[data.playerId].nickName,
      time: (new Date() - startTimeGame)
    };

    console.log("Goal reached ID: " + newPlayerEnd.nickName + " time: " + newPlayerEnd.time);

    endGame.push(newPlayerEnd);

    //console.log("EG: " + endGame.length + " y DP: " + dataPlayer.length);

    if(endGame.length == dataPlayer.length){
      
      fncGameEnded();

      //console.log("Si entró acá");

    }

  });
}

server.listen(serverPort, serverIP, function() {
  console.log("Servidor corriendo en http://" + serverIP + ":" + serverPort);
});