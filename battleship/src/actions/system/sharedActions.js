import messageTypes from 'shared/messageTypes';

export const setGameState = (state) => {
   return { type: messageTypes.GET_STATE, payload: state }
}

export const setReady = (ready) => {
   return { type: messageTypes.TEAM_READY, payload: { ready } }
}

export const stateChange = (state, inTurn) => {
   return { type: messageTypes.STATE_CHANGE, payload: { state, inTurn } }
}