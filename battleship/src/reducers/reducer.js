import { produce } from "immer";
import messageTypes from 'shared/messageTypes';
import gameStates from 'shared/gameStates';
import canvasTypes from './../actions/canvas/canvasTypes';

const initialState = {
    ships: {
    },
    guesses: [

    ],
    enemyGuesses: [

    ],
    ready: false,
    state: gameStates.PLACING_SHIPS,
    showing: canvasTypes.OWN,
    gridSize: 79,
    inTurn: false,
    selectedBlock: false,
    enemyShipsSunk: []
}

const reducer = produce((draft = initialState, action) => {
    const { type, payload } = action;
    switch (type) {
        case canvasTypes.CHANGE_GRIDSIZE:
            draft.gridSize = payload.gridSize;
            return draft;
        case canvasTypes.SWITCH_VISION:
            draft.showing = draft.showing === canvasTypes.OWN ? canvasTypes.OTHER : canvasTypes.OWN
            return draft;
        case messageTypes.MOVE_SHIP:
            draft.ships[payload.ship].x = payload.x
            draft.ships[payload.ship].y = payload.y
            return draft;
        case messageTypes.ROTATE_SHIP:
            draft.ships[payload.ship].rotation = payload.rotation
            return draft;
        case messageTypes.GET_STATE:
            draft.ships = payload.ships;
            draft.guesses = payload.guesses;
            draft.ready = payload.ready;
            draft.state = payload.state;
            draft.inTurn = payload.inTurn;
            draft.enemyGuesses = payload.enemyGuesses;
            draft.selectedBlock = payload.selectedBlock;
            draft.enemyShipsSunk = payload.enemyShipsSunk;
            return draft
        case messageTypes.TEAM_READY:
            draft.ready = payload.ready;
            return draft;
        case messageTypes.STATE_CHANGE:
            if (payload.inTurn !== null) draft.inTurn = payload.inTurn;
            draft.state = payload.state;
            return draft;
        case messageTypes.SELECT_BLOCK:
            draft.selectedBlock = payload.block;
            return draft
        case messageTypes.GUESS:
            draft.guesses.push(payload.guess);
            draft.inTurn = payload.inTurn;
            if(payload.sunk) draft.enemyShipsSunk.push(payload.sunk);
            return draft;
        case messageTypes.ENEMY_GUESS:
            draft.enemyGuesses.push(payload.guess);
            draft.inTurn = payload.inTurn;
            if(payload.sunk) Object.values(draft.ships).find(ship => ship.name === payload.sunk).sunk = true;
            return draft;
        default:
            return draft;
    }

});



export default reducer;
