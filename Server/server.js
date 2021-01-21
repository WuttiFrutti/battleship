
const { v4: uuidv4 } = require('uuid');
const WebSockets = require("./websockets.js")
const ws = require('ws');
const { reduce, initState, state, teams } = require("./reducer")
const PORT = process.env.PORT || 3000;

const app = require('./staticServe');
app.set("port", PORT);

const httpServer = require('http').createServer(app);
const wsServer = new ws.Server({
  server: httpServer,
  path: "/ws",
})


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

// httpServer.on('request', app);
httpServer.listen(PORT, () => {
	console.log(`HTTP server started on ${PORT}`);
});

