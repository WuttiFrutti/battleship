class Websockets {
    constructor() {
        if (!Websockets.instance) {
            Websockets.instance = this;
        }

        this.sockets = [];
    }

    getInstance(){
        return Websockets.instance;
    }

    getById(id) {
        return this.sockets.filter(s => s.id === id);
    }

    getByTeam(team) {
        return this.sockets.filter(s => s.team === team);
    }

    sendToTeam(team, message) {
        this.getByTeam(team).forEach(s => {
            this.send(s,message);
        })
    }

    sendById(id, message) {
        send(this.sockets.find(s => s.id === id), message);
    }

    sendToAll(socket, message, exclude = true){
        this.sockets.forEach(s => {
            if(socket && socket === s && exclude) return;
            this.send(s,message);
        })
    }

    add(id, socket){
	    console.log("WebSocket connection added.");
        socket.id = id;
        this.sockets.push(socket);
    }


    remove(socket){
        this.sockets = this.sockets.filter(s => s.id !== socket.id);
    }


    send(socket, message){
        socket.send(JSON.stringify(message));
    }
}


module.exports = new Websockets().getInstance();