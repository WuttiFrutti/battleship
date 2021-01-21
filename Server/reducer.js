const messageTypes = require("shared/messageTypes");
const shipTypes = require("shared/shipTypes");
const gameStates = require("shared/gameStates");
const checkGuess = require("shared/checkGuess");
const { v4: uuidv4 } = require('uuid');
const hasConflict = require("shared/gridConflicts");
const WebSockets = require("./websockets.js")



let gameState = {
    state: gameStates.PLACING_SHIPS,
    currentTeam: null,
};

let teams = {

};

const reduce = (type, payload, socket) => {
    if (gameState.state === gameStates.GAME_ENDED) return gameState;
    switch (type) {
        case messageTypes.CHANGE_NAMES:
            Object.entries(teams[socket.team].ships).forEach(ship => {
                if(payload.names[ship[0]]) ship[1].name = payload.names[ship[0]];
            })
            WebSockets.sendToTeam(socket.team, { type: messageTypes.GET_STATE, payload: getSocketState(socket.team) })
            WebSockets.sendToTeam(getOtherTeam(socket.team), { type: messageTypes.GET_STATE, payload: getSocketState(getOtherTeam(socket.team)) })
            return gameState;
        case messageTypes.GET_STATE:
            WebSockets.send(socket, getSocketState(socket.team))
            return gameState;
        case messageTypes.GUESS:
            const { x, y } = payload
            if (gameState.currentTeam === socket.team && checkGuess({ x, y }, teams[socket.team].guesses)) {
                const enemy = getOtherTeam(socket.team);
                let enemyShip = hasEnemyShip(x, y, socket.team);
                enemyShip = enemyShip ? enemyShip[1] : false;

                const hit = !!enemyShip;
                teams[socket.team].guesses.push({
                    x: x, y: y, hit: hit
                });
                if (enemyShip && enemyShip && seeIfSunk(enemyShip, teams[socket.team].guesses)) {
                    enemyShip.sunk = true;
                    if (allShipsSunk(enemy)) {
                        endGame(socket.team)
                    }
                }
                gameState.currentTeam = enemy;
                WebSockets.sendToTeam(socket.team, { type: messageTypes.GUESS, payload: { guess: { x: x, y: y, hit: hit }, inTurn: false, sunk: hit && enemyShip.sunk ? enemyShip.name : false } })
                WebSockets.sendToTeam(enemy, { type: messageTypes.ENEMY_GUESS, payload: { guess: { x: x, y: y, hit: hit }, inTurn: true, sunk: hit && enemyShip.sunk ? enemyShip.name : false } })
            } else {
                console.log("illigal team guess");
            }
            return gameState;
        case messageTypes.SELECT_BLOCK:
            teams[socket.team].selectedBlock = payload.block
            WebSockets.sendToTeam(socket.team, { type: messageTypes.SELECT_BLOCK, payload: payload.block })
            return gameState;
        case messageTypes.MOVE_SHIP:
            if (gameState.state !== gameStates.PLACING_SHIPS) return gameState;
            let ship = teams[socket.team].ships[payload.ship];
            if (!hasConflict(payload.x, payload.y, ship.rotation, Object.entries(teams[socket.team].ships), payload.ship, ship.length)) {
                teams[socket.team].ships[payload.ship].x = payload.x
                teams[socket.team].ships[payload.ship].y = payload.y
            } else {
                console.log("Conflict detected Front end possibly out of sync")
            }
            WebSockets.sendToTeam(socket.team, { type: messageTypes.GET_STATE, payload: getSocketState(socket.team) })
            return gameState;
        case messageTypes.ROTATE_SHIP:
            if (gameState.state !== gameStates.PLACING_SHIPS) return gameState;
            teams[socket.team].ships[payload.ship].rotation = payload.rotation
            WebSockets.sendToTeam(socket.team, { type: messageTypes.GET_STATE, payload: getSocketState(socket.team) })
            return gameState;
        case messageTypes.REGISTER_FOR_TEAM:
            if (teams[payload.teamCode]) {
                socket.team = payload.teamCode;
                WebSockets.send(socket, { type: messageTypes.REGISTERED, payload: getSocketState(socket.team) })
            } else {
                WebSockets.send(socket, { type: messageTypes.REGISTER_FAILED, payload: { teamCode: socket.teamCode } })
            }
            return gameState;
        case messageTypes.TEAM_READY:
            if (gameStates.PLACING_SHIPS !== gameState.state) return gameState;
            if (teams[socket.team].ready) {
                teams[socket.team].ready = false;
            } else {
                if (Object.entries(teams[socket.team].ships).every(entry => {
                    let ship = entry[1];
                    let index = entry[0];

                    return !hasConflict(ship.x, ship.y, ship.rotation, Object.entries(teams[socket.team].ships), index, ship.length)
                })) teams[socket.team].ready = true;
            }
            WebSockets.sendToTeam(socket.team, { type: messageTypes.TEAM_READY, payload: { ready: teams[socket.team].ready } })
            if (Object.values(teams).every(state => state.ready)) {
                gameState.state = gameStates.IN_TURN;
                gameState.currentTeam = socket.team;
                WebSockets.sendToTeam(socket.team, { type: messageTypes.STATE_CHANGE, payload: { state: gameState.state, inTurn: true } }, false)
                WebSockets.sendToTeam(getOtherTeam(socket.team), { type: messageTypes.STATE_CHANGE, payload: { state: gameState.state, inTurn: false } }, false)
            }
            return gameState
    }
    return gameState;
}


const getSocketState = (team) =>
    ({ ...teams[team], state: gameState.state, enemyGuesses: teams[getOtherTeam(team)].guesses, inTurn: gameState.currentTeam === team, enemyShipsSunk: teamShipsSunk(getOtherTeam(team)) });

const getOtherTeam = (team) =>
    (Object.entries(teams).find(entry => entry[0] !== team)[0]);

const hasEnemyShip = (x, y, team) =>
    (hasConflict(x, y, 0, Object.entries(teams[getOtherTeam(team)].ships)));

const teamShipsSunk = (team) => {
    return Object.entries(teams[team].ships).filter(ship => ship[1].sunk).map(ship => ship[1].name);
}

const allShipsSunk = (team) =>
    (Object.values(teams[team].ships).every(ship => ship.sunk));

const seeIfSunk = (ship, guesses) => {
    for (let i = 0; i < ship.length; i++) {
        const x = ship.rotation ? ship.x + i : ship.x;
        const y = ship.rotation ? ship.y : ship.y + i;
        if (!guesses.find(guess => guess.x === x && guess.y === y)) {
            return false
        }
    }
    return true;
}

const initState = (team1, team2) => {
    console.log(team1, team2)
    gameState.state = gameStates.PLACING_SHIPS;
    gameState.currentTeam = null;
    teams = {};
    teams[team1] = {
        guesses: [],
        ships: JSON.parse(JSON.stringify(shipTypes)),
        ready: false,
        selectedBlock: null,
    };
    teams[team2] = {
        guesses: [],
        ships: JSON.parse(JSON.stringify(shipTypes)),
        ready: false,
        selectedBlock: null,
    };
}

const endGame = (winner) => {
    console.log(`game won by ${winner}`);
    gameState.state = gameStates.GAME_ENDED;
    WebSockets.sendToAll(winner, { type: messageTypes.GAME_ENDED, payload: { winner: winner } }, false);
    initState(uuidv4().substring(30), uuidv4().substring(30))
}

module.exports.reduce = (type, payload, socket) => {
    gameState = reduce(type, payload, socket)
};

module.exports.state = gameState;
module.exports.teams = teams;

module.exports.initState = initState;