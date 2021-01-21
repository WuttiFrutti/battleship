
const ws = require("ws")
const { v4: uuidv4 } = require('uuid');
const WebSockets = require("./websockets.js")
const { reduce, initState, state, teams } = require("./reducer")
const serve = require("./staticServe.js");


const wsServer = new ws.Server({
	port: 9090
});

initState(uuidv4().substring(30),uuidv4().substring(30))

wsServer.on("connection", (websocket) => {
	WebSockets.add(uuidv4(),websocket);

	websocket.on("message", (message) => {
		message = JSON.parse(message);
		reduce(message.type, message.payload, websocket)
	});

	websocket.on("close", () => {
		WebSockets.remove(websocket);
		console.log(
			`Connection for ${websocket.id} closed.`
		);
	});
});

serve();