var serverIP = "192.168.1.101";
var serverPort = 8080;

var socket = io.connect('http://' + serverIP + ":" + serverPort);

socket.on('connectionResult', function(data) {

  console.log(data);
  //render(data);
})

/*function render(data){
	var html = data.map(function(elem, index){
		return(`<div id = "dataPlayer">
					<strong>${elem.playerId}</strong>
					<em>${elem.x}</em>
					<em>${elem.y}</em>
					<em>${elem.s}</em>
				</div>`);
	}).join(" ");

	document.getElementById('dataPlayer').innerHTML = html;
}*/

function goalReachPublic(e) {
	var payload = {
		playerId: document.getElementById('playerId').value,
	};

	console.log(payload);
	socket.emit('goalReached', payload);

	return false;
}