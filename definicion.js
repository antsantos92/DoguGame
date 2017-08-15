
// SERVIDOR
socket.on('connection', function (data) { //Listo
	
});

// CLIENTE
socket.on('connectionResult', function (data) { //Listo

});

// CLIENTE
socket.on("countDownStep", function (data) { //Listo
	// body...
});

// CLIENTE
socket.on("gameStarted", function (data) { //Listo
	// body...
});

// SERVIDOR
socket.on("goalReached", function (data) {
	// body...
});

// CLIENTE
socket.on("gameEnded", function(data) {
	// body...
});

// SERVIDOR
socket.on("updateCoordinates", function (data) {
	// body...
});

// UPDATE COORDINATES


// CONNECTION RESULT (De Servidor a Cliente)
{
	status: "WAIT",
	message: "Eres el primero en la sala. Esperando a los siguientes jugadores.",
	playerId: 1,
	x: 0,
	y: 0,
	speed: 1,
	objects: [
		{
			id: 1,
			type: "THREAT",
			src: "img/bomb.png",
			x: 100,
			y: 0,
			newSpeed: 0.8,
			time: 3
		},
		{
			id: 2,
			type: "SPEEDUP",
			src: "img/meat.png",
			x: 200,
			y: 0,
			newSpeed: 1.5,
			time: 3
		},
		{
			id: 3,
			type: "FINISH",
			src: "img/goal.png",
			x: 500,
			y: 0,
		},
	]
}

// COUNTDOWN STARTED (time in seconds - de servidor a cliente)
{
	time: 10
}

// GAME STARTED (De Servidor a Cliente)
{
	[
		playerId: 1,
		x: 0,
		y: 0
	],
	[
		playerId: 2,
		x: 0,
		y: 0
	]
}

// GOAL REACHED (De cliente a servidor)
{
	playerId: 1
}

// GAME ENDED (De servidor a clientessssss)
[
	{
		playerId: 1,
		position: 1,
		time: 50 // seconds
	},
	{
		playerId: 2,
		position: 2,
		time: 53 // seconds
	},
]


	{status: "ERROR", message: "Error Genérico"}
	{status: "WAIT", message: "Eres el primero en la sala. Esperando a los siguientes jugadores."}
	{status: "COUNTDOWN", seconds: 10}
	{status: "LOCKED", message: "La sala está ocupada. Intenta de nuevo más tarde."}